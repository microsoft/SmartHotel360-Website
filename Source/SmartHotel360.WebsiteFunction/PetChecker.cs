using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.Documents;
using System.Collections.Generic;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.ProjectOxford.Vision;
using Microsoft.Azure.Documents.Client;

namespace PetCheckerFunction
{
    public static class PetChecker
    {
        [FunctionName("PetChecker")]
        public static async Task RunPetChecker([CosmosDBTrigger("pets", "checks", ConnectionStringSetting = "constr", CreateLeaseCollectionIfNotExists = true)] IReadOnlyList<Document> document, TraceWriter log)
        {
            var httpClient = new HttpClient();
            try
            {
                foreach (dynamic doc in document)
                {
                    var isProcessed = doc.IsApproved != null;
                    if (isProcessed)
                    {
                        continue;
                    }
                    var url = doc.MediaUrl;
                    var uploaded = (DateTime)doc.Created;
                    log.Info($">>> Processing image in {url} upladed at {uploaded.ToString()}");
                    var res = await httpClient.GetAsync(url);
                    using (var stream = await res.Content.ReadAsStreamAsync() as Stream)
                    {
                        log.Info($"--- Image succesfully downloaded from storage");
                        (bool allowed, string message) = await PassesImageModerationAsync(stream, log);
                        log.Info($"--- Image analyzed. It was {(allowed ? string.Empty : "NOT")} approved");
                        doc.IsApproved = allowed;
                        doc.Message = message;
                        log.Info($"--- Updating CosmosDb document to have historical data");
                        await UpsertDocument(doc, log);
                        log.Info($"<<< Image in {url} processed!");
                    }
                }
            }
            finally
            {
                httpClient?.Dispose();
            }
        }
        private static async Task UpsertDocument(dynamic doc, TraceWriter log)
        {
            var endpoint = Environment.GetEnvironmentVariable("cosmos_uri");
            var auth = Environment.GetEnvironmentVariable("cosmos_key");
            using (var client = new DocumentClient(new Uri(endpoint), auth))
            {
                var dbName = "pets";
                var colName = "checks";
                doc.Analyzed = DateTime.UtcNow;
                await client.UpsertDocumentAsync(
                    UriFactory.CreateDocumentCollectionUri(dbName, colName), doc);
                log.Info($"--- CosmosDb document updated.");
            }
        }
        public static async Task<(bool, string)> PassesImageModerationAsync(Stream image, TraceWriter log)
        {
            log.Info("--- Creating VisionApi client and analyzing image");
            var key = Environment.GetEnvironmentVariable("MicrosoftVisionApiKey");
            var endpoint = Environment.GetEnvironmentVariable("MicrosoftVisionApiEndpoint");
            var client = new VisionServiceClient(key, endpoint);
            var features = new VisualFeature[] { VisualFeature.Description };
            var result = await client.AnalyzeImageAsync(image, features);
            log.Info($"--- Image analyzed with tags: {String.Join(",", result.Description.Tags)}");
            if (!int.TryParse(Environment.GetEnvironmentVariable("MicrosoftVisionNumTags"), out var tagsToFetch))
            {
                tagsToFetch = 5;
            }
            bool isAllowed = result.Description.Tags.Take(tagsToFetch).Contains("dog");
            string message = result?.Description?.Captions.FirstOrDefault()?.Text;
            return (isAllowed, message);
        }
    }
}