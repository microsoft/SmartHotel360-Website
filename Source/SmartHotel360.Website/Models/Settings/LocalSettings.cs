namespace SmartHotel360.PublicWeb.Models.Settings
{
    public class LocalSettings
    {
        public LocalSettings()
        {
            FakeAuth = new FakeAuthSettings();
            PetsConfig = new PetsConfig();
        }

        public bool Production { get; set; }
        public FakeAuthSettings FakeAuth { get; set; }
        public PetsConfig PetsConfig { get; set; }
        public Urls Urls { get; set; }
        public Tokens Tokens { get; set; }
        public B2c B2c { get; set; }
    }
}
