using SmartHotel360.PublicWeb.Services;

namespace SmartHotel360.PublicWeb.Models.Settings
{
    public class ServerSettings
    {
        public bool Production { get; set; }
        public Urls Urls { get; set; }
        public Tokens Tokens { get; set; }
        public B2c B2c { get; set; }
        public FakeAuthSettings FakeAuth { get; set; }
    }
}
