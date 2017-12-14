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
            var model = new CustomerTestimonial
            {
                CustomerName = "BethMassi",
                Text = "This hotel is super high tech! I'd recommend it to anyone."
            }; 

            return model;            
        }
    }
}
