FROM microsoft/aspnetcore:2.0 AS base
WORKDIR /app
EXPOSE 80

FROM base as withnode
RUN apt-get update && apt-get install -my wget gnupg
RUN apt-get -qq update && apt-get -qqy --no-install-recommends install \
    git \
    unzip

RUN curl -sL https://deb.nodesource.com/setup_6.x |  bash -
RUN apt-get install -y nodejs

FROM microsoft/aspnetcore-build:2.0 AS build
WORKDIR /src
COPY SmartHotel360.PublicWeb.csproj .
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /webapp

FROM build AS publish
RUN npm rebuild node-sass
RUN dotnet publish -c Release -o /webapp

FROM withnode AS final
WORKDIR /app
COPY --from=publish /webapp .
ENTRYPOINT ["dotnet", "SmartHotel360.PublicWeb.dll"]
