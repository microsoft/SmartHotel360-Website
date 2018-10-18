using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using SmartHotel360.PublicWeb.Models.Settings;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace SmartHotel360.PublicWeb.Services
{
    public class SettingsService
    {
        public LocalSettings LocalSettings { get; set; }

        private SettingsService(LocalSettings localSettings)
        {
            LocalSettings = localSettings;
        }

        public static SettingsService Load(LocalSettings localSettings)
        {
            return new SettingsService(localSettings);
        }
    }
}
