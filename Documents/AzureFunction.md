# Running Azure Function

## Running locally

To run Azure Function locally you need the latest version of Visual Studio and Azure Function tools.

Open the solution `SmartHotel360.Website.sln` and open the project `SmartHotel360.WebsiteFunction` edit the `local.settings.json` file with following entries in `Values` section:

* `cosmos_uri`: URL of the CosmosDb (SQL API) to use
* `cosmos_key`: Key of the CosmosDb (SQL API) to use
* `constr`: Connection String for the CosmosDb (SQL API) to use
* `MicrosoftVisionApiKey`: API Key for Vision API
* `MicrosoftVisionApiEndpoint`: Vision API endpoint (i. e. https://eastus2.api.cognitive.microsoft.com/vision/v1.0/)
* `MicrosoftVisionNumTags`: Tags to fetch from Vision API
* `KeyVaultUri`: Uri of the KeyVault to retrieve the secrets. **Leave it blank to not use key vault**
* `AzureSignalRConnectionString`: Connection string to [Azure SignalR](https://azure.microsoft.com/en-us/services/signalr-service/) resource to use.

## Deploy to Azure

To deploy the Azure Function just publish it from Visual Studio following the instructions in the "Publish to Azure" section of the [AF documentation]
(https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-vs).

## Creating needed Azure resources

The Azure Function needs some Azure resources to be created and setup:

1. Create Azure SignalR by deploying the ARM template.
2. Create CosmosDB as part of the ARM template.