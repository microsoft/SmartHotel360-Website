using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SmartHotel360.PublicWeb.Services;
using SmartHotel360.PublicWeb.Models.Settings;
using System;

namespace SmartHotel360.PublicWeb.Controllers
{
    public class HomeController : Controller
    {
        private readonly ServerSettings _globalSettings;

        public HomeController(SettingsService settingsService)
        {
            _globalSettings = settingsService.GlobalSettings;
        }
        public IActionResult Index()
        {
            return View(_globalSettings);
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
