using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.ProjectOxford.Vision;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;


namespace PetCheckerFunction
{
    public static class PetChecker
    {
        [FunctionName("PetChecker")]
        public static async Task RunPetChecker(
            [CosmosDBTrigger("pets", "checks", ConnectionStringSetting = "constr",
            CreateLeaseCollectionIfNotExists=true)] IReadOnlyList<Document> document,
            [SignalR(HubName = "petcheckin", ConnectionStringSetting = "AzureSignalRConnectionString")] IAsyncCollector<SignalRMessage> sender,
            TraceWriter log)
        {
            var sendingResponse = false;
            try
            {
                foreach (dynamic doc in document)
                {
                    sendingResponse = false;
                    var isProcessed = doc.IsApproved != null;
                    if (isProcessed)
                    {
                        continue;
                    }

                    var url = doc.MediaUrl.ToString();
                    var uploaded = (DateTime)doc.Created;
                    log.Info($">>> Processing image in {url} upladed at {uploaded.ToString()}");

                    using (var httpClient = new HttpClient())
                    {
                        
                        var res = await httpClient.GetAsync(url);
                        var stream = await res.Content.ReadAsStreamAsync() as Stream;
                        log.Info($"--- Image succesfully downloaded from storage");
                        var (allowed, message, tags) = await PassesImageModerationAsync(stream, log);
                        log.Info($"--- Image analyzed. It was {(allowed ? string.Empty : "NOT")} approved");
                        doc.IsApproved = allowed;
                        doc.Message = message;
                        log.Info($"--- Updating CosmosDb document to have historical data");
                        await UpsertDocument(doc, log);
                        log.Info("--- Sending SignalR response.");
                        sendingResponse = true;
                        await SendSignalRResponse(sender, allowed, message);
                        log.Info($"<<< Done! Image in {url} processed!");
                    }
                }
            }
            catch (Exception ex)
            {
                var msg = $"Error {ex.Message} ({ex.GetType().Name})";
                log.Info("!!! " + msg);

                if (ex is AggregateException aggex)
                {
                    foreach (var innex in aggex.InnerExceptions)
                    {
                        log.Info($"!!! (inner) Error {innex.Message} ({innex.GetType().Name})");
                    }
                }

                if (!sendingResponse)
                {
                    await SendSignalRResponse(sender, false, msg);
                }
                throw ex;
            }
        }

        private static Task SendSignalRResponse(IAsyncCollector<SignalRMessage> sender, bool isOk, string message)
        {
            return sender.AddAsync(new SignalRMessage()
            {
                Target = "ProcessDone",
                Arguments = new[] { new {
                    processedAt = DateTime.UtcNow,
                    accepted = isOk,
                    message
                }}
            });

        }

        private static async Task UpsertDocument(dynamic doc, TraceWriter log)
        {
            var endpoint = await GetSecret("cosmos_uri");
            var auth = await GetSecret("cosmos_key");

            var client = new DocumentClient(new Uri(endpoint), auth);
            var dbName = "pets";
            var colName = "checks";
            doc.Analyzed = DateTime.UtcNow;
            await client.UpsertDocumentAsync(
                UriFactory.CreateDocumentCollectionUri(dbName, colName), doc);
            log.Info($"--- CosmosDb document updated.");
        }

        private static async Task<string> GetSecret(string secretName)
        {
            
            return Environment.GetEnvironmentVariable(secretName);
        }

        public static async Task<(bool allowd, string message, string[] tags)> PassesImageModerationAsync(Stream image, TraceWriter log)
        {
            try
            {
                log.Info("--- Creating VisionApi client and analyzing image");

                var key = await GetSecret("MicrosoftVisionApiKey");
                var endpoint = await GetSecret("MicrosoftVisionApiEndpoint");
                var numTags = await GetSecret("MicrosoftVisionNumTags");
                var client = new VisionServiceClient(key, endpoint);
                var features = new VisualFeature[] { VisualFeature.Description };
                var result = await client.AnalyzeImageAsync(image, features);

                log.Info($"--- Image analyzed with tags: {String.Join(",", result.Description.Tags)}");
                if (!int.TryParse(numTags, out var tagsToFetch))
                {
                    tagsToFetch = 5;
                }
                var fetchedTags = result?.Description?.Tags.Take(tagsToFetch).ToArray() ?? new string[0];
                bool isAllowed = fetchedTags.Contains("dog");
                string message = result?.Description?.Captions.FirstOrDefault()?.Text;
                return (isAllowed, message, fetchedTags);
            }
            catch (Exception ex)
            {
                log.Info("Vision API error! " + ex.Message);
                return (false, "error " + ex.Message, new string[0]);
            }
        }

        [FunctionName(nameof(SignalRInfo))]
        public static IActionResult SignalRInfo(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")]HttpRequestMessage req,
        [SignalRConnectionInfo(HubName = "petcheckin")] SignalRConnectionInfo info)
        {
            return info != null
                ? (ActionResult)new OkObjectResult(info)
                : new NotFoundObjectResult("Failed to load SignalR Info.");
        }

    }
}