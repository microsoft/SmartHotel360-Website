using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHotel360.PublicWeb.Controllers
{
    public class PetDocument
    {
        [JsonProperty(PropertyName = "id")]
        public Guid Id { get; set; }

        public string PetName { get; set; }

        public string MediaUrl { get; set; }

        public bool? IsApproved { get; set; }


        public DateTime Created { get; set; }

        public string Message { get; set; }
    }
}
