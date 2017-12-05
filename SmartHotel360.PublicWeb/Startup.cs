using Microsoft.ApplicationInsights.AspNetCore;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.SnapshotCollector;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using SmartHotel360.PublicWeb.Models.Settings;
using SmartHotel360.PublicWeb.Services;

namespace SmartHotel360.PublicWeb
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();

            services.Configure<LocalSettings>(Configuration);
            services.AddSingleton<SettingsService>( (sp) => SettingsService.Load(sp.GetService<IOptions<LocalSettings>>().Value));
            services.AddSingleton<ITelemetryProcessorFactory>(new SnapshotCollectorTelemetryProcessorFactory());

            // Our custom services
            if (!string.IsNullOrEmpty(Configuration["USE_NULL_TESTIMONIALS_SERVICE"]))
            {
                services.AddSingleton<ICustomerTestimonialService>(new NullCustomerTestimonialService());
            } else
            {
                services.AddSingleton<ICustomerTestimonialService, PositiveTweetService>();
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }

        private class SnapshotCollectorTelemetryProcessorFactory : ITelemetryProcessorFactory
        {
            public ITelemetryProcessor Create(ITelemetryProcessor next) =>
                new SnapshotCollectorTelemetryProcessor(next);
        }

    }
}
