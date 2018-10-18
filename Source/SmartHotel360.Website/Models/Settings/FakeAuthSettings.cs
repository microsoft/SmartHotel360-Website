using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHotel360.PublicWeb.Models.Settings
{
    public class FakeAuthSettings
    {
        public FakeAuthSettings()
        {
            Name = "";
            PicUrl = "";
            UserId = "";
        }

        public string Name { get; set; }
        public string PicUrl { get; set; }
        public string UserId { get; set; }
    }
}
