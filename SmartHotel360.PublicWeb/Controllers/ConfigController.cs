using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SmartHotel360.PublicWeb.Services;
using SmartHotel360.PublicWeb.Models.Settings;
using System;
using Microsoft.ApplicationInsights;

namespace SmartHotel360.PublicWeb.Controllers
{
    [Route("api/config")]
    public class ConfigController : Controller
    {
        private readonly LocalSettings _LocalSettings;

        public ConfigController(SettingsService settingsService)
        {
            _LocalSettings = settingsService.LocalSettings;
        }

        [HttpGet]
        public dynamic Get()
        {
            return _LocalSettings;
        }

        public IActionResult Exception([FromQuery] bool throwException = false)
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