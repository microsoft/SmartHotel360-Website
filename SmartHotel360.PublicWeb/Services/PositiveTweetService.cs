using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using SmartHotel360.PublicWeb.Models.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SmartHotel360.PublicWeb.Services
{
    public class PositiveTweetService : ICustomerTestimonialService
    {
        private IOptions<LocalSettings> localSettings;

        public PositiveTweetService(IOptions<LocalSettings> localSettings)
        {
            this.localSettings = localSettings;
        }
        public CustomerTestimonial GetTestimonial()
        {
            using (var client = new HttpClient())
            {
                using (var response = client.GetAsync(new Uri(localSettings.Value.AzureFunction)).Result)
                {
                    response.EnsureSuccessStatusCode();
                    string responseBody = response.Content.ReadAsStringAsync().Result;
                    var model = JsonConvert.DeserializeObject<CustomerTestimonial>(responseBody);

                    return model;
                }
            }
        }
    }
}
