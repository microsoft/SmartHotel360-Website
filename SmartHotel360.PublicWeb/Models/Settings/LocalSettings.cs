namespace SmartHotel360.PublicWeb.Models.Settings
{
    public class LocalSettings
    {
        public LocalSettings()
        {
            FakeAuth = new FakeAuthSettings();
        }

        public bool Production { get; set; }
        public string SettingsUrl { get; set; }
        public string AzureFunction { get; set; }
        public FakeAuthSettings FakeAuth { get; set; }
    }
}
