# SmartHotel360

We are happy to announce the release of SmartHotel360. This release intends to share a simplified version of SmartHotel360 reference sample apps used at Connect(); 2017 Keynotes. If you missed it, you can watch <a href="https://channel9.msdn.com/Events/Connect/2017/K100">Scott Guthrie’s Keynote: Journey to the Intelligent Cloud in Channel 9</a>.

We updated the code for this repository to support Scott Hanselman's General Session from Ignite 2018, [An end-to-end tour of the Microsoft developer platform](https://myignite.techcommunity.microsoft.com/sessions/66696#ignite-html-anchor). 

# SmartHotel360 Repos
For this reference app scenario, we built several consumer and line-of-business apps and an Azure backend. You can find all SmartHotel360 repos in the following locations:

* [SmartHotel360 ](https://github.com/Microsoft/SmartHotel360)
* [IoT](https://github.com/Microsoft/SmartHotel360-IoT)
* [Backend](https://github.com/Microsoft/SmartHotel360-Backend)
* [Website](https://github.com/Microsoft/SmartHotel360-Website)
* [Mobile](https://github.com/Microsoft/SmartHotel360-Mobile)
* [Sentiment Analysis](https://github.com/Microsoft/SmartHotel360-SentimentAnalysis)
* [Registration](https://github.com/Microsoft/SmartHotel360-Registration)

# SmartHotel360 - Website
Welcome to the repository containing the website of SmartHotel360. SmartHotel360 has multiple apps that share a common backend, including a public website where hotel guests can book a room, smart conference rooms, and even include their accompanying family travelers and their pets! The site was built using ASP.NET Core. 

# Getting Started

Once downloaded you can open the `SmartHotel360.WebSite.sln` file, located in the Source folder to open the solution in Visual Studio 2017 15.5 or higher. This solution contains three projects:

* The SmartHotel360.Website project: An [ASP.NET Core](www.dot.net) website which is a web app developed using React+Redux and server-side rendering.
* The SmartHotel360.WebsiteFunction project: An Azure Function used to analyze photos of pets using the Cognitive Services Vision API and Azure Cosmos DB.
* The SmartHotel360.WebsiteARM project: An Azure Resource Manager template to facilitate the deployment of the different resources you may need in order to deploy the app in your Azure subscription.

# Deploy to Azure

We have added an ARM template so you can automate the creation of the resources

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FMicrosoft%2FSmartHotel360-Website%2Fmaster%2FSource%2FSmartHotel360.WebsiteARM%2Fsmarthote360.website.deployment.json?target=_blank" target='_blank'><img src="/Documents/Images/deploy-to-azure.png" alt="Deploy to Azure"/></a>

## Running The Website

Set `SmartHotel360.Website` as startup project, then hit F5 to start debugging. The web is configured to use the public endpoints for the backend, so you don't need to run the backend locally. 

## Configuring The Website

The file `appsettings.Development.json` contains the settings of the website. By default, the following options are used:

* `SettingsUrl`: Url of the configuration endpoint. By default, it uses the public endpoint service. Only change if you are running your own backend services.
* `FakeAuth`: Contains data to "simulate" the login process. Data is `Name` (name of the user), `UserId` (id of the user), `PicUrl` (url of the user avatar).

> If `FakeAuth` is **not set** the Website site uses an Azure Active Directory B2C to enable the logins. Please read "[Enabling B2C logins](Documents/B2C.md)" if you want to use B2C logins.

If you want to deploy this application to your own Azure subscription, see [this setup guide](Documents/AzureDeployment.md) for instructions. 

# Running the Pet Checker Azure Function

You can [run the Azure Function locally or deploy it to Azure](Documents/AzureFunction.md)

# Demo Scripts
There is a detailed step-by-step demo script in the [demoscripts](Documents/DemoScripts) folder of this repo that you can use in your own presentations. In order to perform the demos, you will need to deploy the application resources to Azure first.

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
