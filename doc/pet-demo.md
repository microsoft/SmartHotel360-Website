# Bring your pet demo

The bring your pet is a demo about using Azure Functions, ComsosDb and Vision API to check if your pet is allowed in the hotel. You can view the demo by accessing directly to [http://smarthotel360public.azurewebsites.net/Pets](http://smarthotel360public.azurewebsites.net/Pets).

One key aspect of the demo is show the ability of VS2017 to easy debug Azure Functions. However for this to run the Azure function in the cloud should not run. As you can't disable the Azure Function in the public environment (which is the one that the web uses) you need to create a new environment and use it.

## Creating the azure resources

The first step is to create the needed azure resources: The _function app_, the storage (for storing the pets images), the CosmosDb (stores documents with the pet information) and the Vision API. Technically the _funcion app_ is not really needed because you won't run the app in Azure, so unless you want to publish the function in Azure later, you can skip it.

To create these resources various ARM scripts are provided in the `/arm` folder:

* `cosmosdb.json`: ARM script for creating the CosmosDb
* `func.json`: ARM script to create the _function app_, the storage and the Vision API

You can deploy each ARM script by typing:

```
deploy <arm-script> <resource-group-name> [-c location]
```

If parameter `-c` and location are added the resource group is created. So, to deploy the `func.json` ARM script in a new EastUS 2 resource group named foo, you can type. If `-c` and location are not specified the resource group must already exist.

```
deploy func foo -c eastus2
```

You need to deploy both ARM scripts in order to have all needed resources.

>**Note**: The `*.parameters` files contains the parameters for the Azure resources. You can leave them as they are.

Once resources are created you need to do some manual operations:

1. Create a blob container called `pets` in the container and ensure it has public access
2. Create a database `pets` in the cosmosdb. Then create a `checks` collection on it.

## Setting up the web to use your own resources

When the web starts up, looks for the `SettingsUrl` environment variable. This variable must contain an URL to a configuration file. If you run the web in local against the public endpoints (recomended configuration) you need to do the following:

* Copy the file `/config-sample.json/sample.json` (this is a configuration file for the web for using the public endpoint) in a new location. Then edit the `pets_config` section with the desired values:

* `blobName`: The name of the storage created
* `blobKey`: The key to the storage created
* `cosmosUri`: The uri of the CosmosDb created (something like `https://xxxxx.documents.azure.com:443/`)
* `cosmosKey`: The key of the CosmosDb created

Once you have the file updated **copy it to a public reaching site**, for example create a new blob container in your storage, and drop the file on it. Be sure that **public access** is allowed. Then update the `SettingsUrl` environment variable to use the URL of your new file. 

Now the web is using your settings.

## Run the function locally

To run the function locally you can use VS2017 and start the Azure function project (`PetCheckedFunction`). But before you must edit the `/PetCheckerFunction/local.settings.json` with the values of your environment:

```
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "PUT STORAGE CONNECTION STRING",
    "AzureWebJobsDashboard": "",
    "cosmos_uri": "https://your-cosmosdb-uri-here.documents.azure.com:443/",
    "cosmos_key": "PUT YOUR COSMOSDB KEY HERE",
    "constr": "PUT YOUT COSMOSDB CONNECTION STRING AccountEndpoint=....;",
    "MicrosoftVisionApiKey": "PUT YOUR VISION API KEY HERE",
    "MicrosoftVisionApiEndpoint": "PUT YOUR API ENDPOINT HERE (i. e. https://eastus2.api.cognitive.microsoft.com/vision/v1.0/)",
    "MicrosoftVisionNumTags": "10"
  }
}
```

> **Note** If you have a _functionapp_ created (you have one if used the ARM scripts provided), copy the `AzureWebJobsStorage` value of the _function app_ here. If you don't have one can use the connection string of the storage created.

Now, you should be able to run both the function and the azure function locally and debug it. If it is not working ensure that the configuration is correct. If the Azure function is not triggered be sure that:

1. The web uses the correct configurations (it should save the images in a blob container called `pets` in your storage)
2. The blob container has public access.
3. The `local.settings` file contains correct values
4. The web uses the correct configuration (it should create documents in a collection called `checks` in a database `pets`. Be sure that the both database and collection exists on CosmosDb

![Pets document in CosmosDb](./pets-document.png)

## Deploying the web on Azure

To deploy the web on Azure, first you can use the ARM script in `/arm/web.json` to create the needed resources. You can deploy it using the provided `deploy.cmd` file:

```
deploy web my-sh360-web -c eastus2
```

This will deploy the `web.json` ARM in a resource group called `my-sh360-web`. Beacuse of `-c eastus2` the resource group will be created in the EastUS2 zone. If `-c location` is not passed the resource group must exist.

Once the resources are created, you can Publish the Web using the VS2017 Publish feature.

>**Note** Once deployed be sure to set correct values in _appsettings_  (basically the `SettingsUrl`).

## Deploying the Azure function on Azure

Assuming you have the _function app_ created, you can use the VS2017 Publish feature to publish the web. The function will be published using the values of the `local.settings` file. You can change these values in the portal.