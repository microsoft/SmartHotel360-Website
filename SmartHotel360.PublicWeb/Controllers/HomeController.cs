using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SmartHotel360.PublicWeb.Services;
using SmartHotel360.PublicWeb.Models.Settings;
using System;

namespace SmartHotel360.PublicWeb.Controllers
{
    public class HomeController : Controller
    {
        private readonly LocalSettings _LocalSettings;

        public HomeController(SettingsService settingsService)
        {
            _LocalSettings = settingsService.LocalSettings;
        }
        public IActionResult Index()
        {
            return View(_LocalSettings);
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
