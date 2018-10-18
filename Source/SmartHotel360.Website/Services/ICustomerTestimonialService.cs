using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHotel360.PublicWeb.Services
{
    public interface ICustomerTestimonialService
    {
        CustomerTestimonial GetTestimonial();
    }

    public class CustomerTestimonial
    {
        public string CustomerName { get; set; }
        public string Text { get; set; }
    }
}
