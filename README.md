# SmartHotel360

We are happy to announce the release of SmartHotel360. This release intends to share a simplified version of SmartHotel360 reference sample apps used at Connect(); 2017 Keynotes. If you missed it, you can watch <a href="https://channel9.msdn.com/Events/Connect/2017/K100">Scott Guthrie’s Keynote: Journey to the Intelligent Cloud in Channel 9</a>.

We updated the code for this repository to support Scott Hanselman's General Session from Ignite 2018, [An end-to-end tour of the Microsoft developer platform](https://myignite.techcommunity.microsoft.com/sessions/66696#ignite-html-anchor). 

# SmartHotel360 Repos
For this reference app scenario, we built several consumer and line-of-business apps and an Azure backend. You can find all SmartHotel360 repos in the following locations:

* [SmartHotel360 ](https://github.com/Microsoft/SmartHotel360)
* [Backend Services (optimized for Kubernetes)](https://github.com/Microsoft/SmartHotel360-AKS-DevSpaces-Demo)
* [Public Website](https://github.com/Microsoft/SmartHotel360-public-web)
* [Pet Checker Serverless Function](https://github.com/Microsoft/SmartHotel360-PetCheckerFunction)
* [Mobile Apps](https://github.com/Microsoft/SmartHotel360-mobile-desktop-apps)
* [Sentiment Analysis](https://github.com/Microsoft/SmartHotel360-Sentiment-Analysis-App)
* [Migrating Internal apps to Azure](https://github.com/Microsoft/SmartHotel360-internal-booking-apps)
* [Original Backend Services](https://github.com/Microsoft/SmartHotel360-Azure-backend)
* [How Containers Enable Local Development](https://github.com/microsoft/SmartHotel360-ContainersForLocalDev)

# SmartHotel360 - Public Web 
Welcome to the repository containing the public web site of the SmartHotel360. SmartHotel360 has multiple apps that share a common Azure backend, including a public website where hotel guests can book a room, smart conference rooms, and even include their accompanying family travelers and their pets! The site was built using ASP.NET Core 2.0. 

# Getting Started

Once downloaded you can open the `SmartHotel360.PublicWebSite.sln` file to open the solution in Visual Studio 2017 15.5 or higher. This solution contains two projects:

* The SmartHotel360.PublicWeb project: An [ASP.NET Core 2.0](www.dot.net) website which is a SPA web app developed using React+Redux and server-side rendering.
* The PetCheckerFunction project: An Azure Function used to analyze photos of pets using the Congnitive Services Vision API and Azure Cosmos DB.

## Screens
<img src="./doc/screen2.png" Height="350" />
<img src="./doc/screen4.png" Height="350" />
<img src="./doc/screen3.png" Height="350" />
<img src="./doc/screen1.png" Height="350" />
<img src="./doc/screen5.png" Height="350" />

## Running the web

Set `SmartHotel360.PublicWeb` as startup project, then hit F5 to start debugging. The web is configured to use the public endpoints for the backend, so you don't need to run the backend locally. 

## Configuring the web

The file `appsettings.Development.json` contains the settings of the web site. By default following options are used:

* `SettingsUrl`: Url of the configuration endpoint. By default it uses the public endpoint service. Only change if you are running your own backend services.
* `FakeAuth`: Contains data to "simulate" the login process. Data is `Name` (name of the user), `UserId` (id of the user), `PicUrl` (url of the user avatar).

> If `FakeAuth` is **not set** the PublicWeb site uses an Azure Active Directory B2C to enable the logins. Please read "[Enabling B2C logins](./doc/b2c.md)" if you want to use B2C logins.

If you want to deploy this application to your own Azure subscription, see [this setup guide](./doc/demo-setup.md) for instructions. 

# Demo Scripts
There is a detailed step-by-step demo script in the [demoscripts](./demoscripts/) folder of this repo that you can use in your own presentations. In order to perform the demos, you will need to deploy the application resources to Azure first. See [this setup guide](./doc/demo-setup.md) on how to do that. 

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
