using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHotel360.PublicWeb.Services
{
    public class NullCustomerTestimonialService : ICustomerTestimonialService
    {
        public CustomerTestimonial GetTestimonial()
        {
            throw new CustomerTestimonialServiceNotConfiguredException();
        }
    }

    public class CustomerTestimonialServiceNotConfiguredException: ApplicationException
    {
        public CustomerTestimonialServiceNotConfiguredException() 
            : base("No customer testimonial service configured")
        {
        }
    }
}
