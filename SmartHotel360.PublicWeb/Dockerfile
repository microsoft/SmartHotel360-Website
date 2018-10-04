FROM microsoft/dotnet:2.2.0-preview2-aspnetcore-runtime-alpine3.8 AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.2.100-preview1-sdk-alpine AS build
WORKDIR /src
COPY SmartHotel360.PublicWeb.csproj .
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /webapp


FROM node:8.12.0-alpine as node
WORKDIR /src
COPY . .
WORKDIR /src/ClientApp
RUN npm install
RUN npm rebuild node-sass
RUN npm run build
RUN cp -r build/* /src/wwwroot

FROM build AS publish
WORKDIR /src/ClientApp
WORKDIR /src
RUN dotnet publish -c Release -o /webapp

FROM base AS final
WORKDIR /app
COPY --from=publish /webapp .
COPY --from=node /src/wwwroot ./wwwroot
ENTRYPOINT ["dotnet", "SmartHotel360.PublicWeb.dll"]
