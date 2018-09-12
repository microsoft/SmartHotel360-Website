using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Extensions.Options;
using SmartHotel360.PublicWeb.Models.Settings;
using SmartHotel360.PublicWeb.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHotel360.PublicWeb.Controllers
{

    public class PetUploadRequest
    {
        public string Base64 { get; set; }
        public string Name { get; set; }
    }

    [Route("api/pets")]
    public class PetsApiController : Controller
    {
        private readonly LocalSettings _settings;
        private readonly string dbName = "pets";
        private readonly string colName = "checks";

        public PetsApiController(IOptions<LocalSettings> settings)
        {
            _settings = settings.Value;
        }

        [HttpPost]
        public async Task<IActionResult> UploadPetImageAsync([FromBody] PetUploadRequest petRequest)
        {

            if (string.IsNullOrEmpty(petRequest?.Base64))
            {
                return BadRequest();
            }

            var tokens = petRequest.Base64.Split(',');
            var ctype = tokens[0].Replace("data:", "");
            var base64 = tokens[1];
            var content = Convert.FromBase64String(base64);

            // Upload photo to storage...
            var blobUri = await UploadPetToStorage(content);

            // Then create a Document in CosmosDb to notify our Function
            var identifier = await UploadDocument(blobUri, petRequest.Name ?? "Bob");

            return Ok(identifier);
        }

        private async Task<Guid> UploadDocument(Uri uri, string petName)
        {

            var endpoint = new Uri(_settings.PetsConfig.CosmosUri);
            var auth = _settings.PetsConfig.CosmosKey;
            var client = new DocumentClient(endpoint, auth);
            var identifier = Guid.NewGuid();

            await client.CreateDatabaseIfNotExistsAsync(new Database() { Id = dbName });
            await client.CreateDocumentCollectionIfNotExistsAsync(UriFactory.CreateDatabaseUri(dbName),
                new DocumentCollection { Id = colName });

            await client.CreateDocumentAsync(
                UriFactory.CreateDocumentCollectionUri(dbName, colName),
                new PetDocument
                {
                    Id = identifier,
                    IsApproved = null,
                    PetName = petName,
                    MediaUrl = uri.ToString(),
                    Created = DateTime.UtcNow
                });

            return identifier;
        }

        private async Task<Uri> UploadPetToStorage(byte[] content)
        {
            var storageName = _settings.PetsConfig.BlobName;
            var auth = _settings.PetsConfig.BlobKey;
            var uploader = new PhotoUploader(storageName, auth);
            var blob = await uploader.UploadPetPhoto(content);
            return blob.Uri;
        }

        [HttpGet]
        public IActionResult GetUploadState(Guid identifier)
        {

            var endpoint = new Uri(_settings.PetsConfig.CosmosUri);
            var auth = _settings.PetsConfig.CosmosKey;
            var client = new DocumentClient(endpoint, auth);

            var collectionUri = UriFactory.CreateDocumentCollectionUri(dbName, colName);
            var query = client.CreateDocumentQuery<PetDocument>(collectionUri, new FeedOptions() { MaxItemCount = 1 });

            var docs = query.Where(x => x.Id == identifier).Where(x => x.IsApproved.HasValue).ToList();

            var doc = docs.FirstOrDefault();

            return Ok(new
            {
                Approved = doc?.IsApproved ?? false,
                Message = doc?.Message ?? ""
            });
        }
    }
}
