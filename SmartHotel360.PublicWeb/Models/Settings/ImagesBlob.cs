using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHotel360.PublicWeb.Models.Settings
{
    public class PetsConfig
    {
        public string BlobName { get; set; }
        public string BlobKey { get; set; }

        public string CosmosUri { get; set; }
        public string CosmosKey { get; set; }
    }
}
