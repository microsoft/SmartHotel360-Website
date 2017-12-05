using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SmartHotel360.PublicWeb.Services;
using SmartHotel360.PublicWeb.Models.Settings;

namespace SmartHotel360.PublicWeb.Controllers
{
    [Route("api/testimonials")]
    public class TestimonialsController : Controller
    {
        private readonly ICustomerTestimonialService _testimonialService;

        public TestimonialsController(ICustomerTestimonialService testimonialService)
        {
            _testimonialService = testimonialService;
        }

        [HttpGet]
        public IActionResult Index()
        {
            var testimonial = _testimonialService.GetTestimonial();

            return Json(testimonial);
        }
    }
}
