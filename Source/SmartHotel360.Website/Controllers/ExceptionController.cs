using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SmartHotel360.PublicWeb.Controllers
{
    [Route("api/exception")]
    public class ExceptionController : Controller
    {
        public IActionResult Index([FromQuery] bool throwException = false)
        {
            try
            {
                if (throwException) ExceptionGenerator.GenerateException();
                return Ok();
            }
            catch (Exception ex)
            {
                var wrappingException = new ApplicationException("This is a test exception", ex);

                throw wrappingException;
            }
        }
    }
}
