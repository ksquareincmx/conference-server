# Conference Server

Server application to booking conferences room

## Table of contents

1. [Production](#production)
2. [Development](#development)
3. [Docs](#docs)
4. Print database creation SQL
5. [License](#license)

## Installing / Getting started

This app uses [Flugzeug /ˈfluːktsɔʏ̯k/ ✈️](https://github.com/ksquareincmx/flugzeug) framework

It's recommended to have basic knowledge of the technologies and structure using in the framework before working with this project.

## Developing

### Prerequesites

It's neccesary install global dependencies:

1. Install MySQL (Linux)
   ```bash
   # Linux
   sudo apt update
   sudo apt install mysql-server mysql-client
   ```

```bash

npm install -g nyc mocha source-map-support apidoc gulp
```

### Setting up dev

Download and install dependencies:

```bash
git clone https://github.com/ksquareincmx/  conference-server.git
cd conference-server
npm install
```

Set enviroment variables:

```bash
cp env.example .env
```

It's necessary to generate `google oauth` credentials and `jwt secret`, and set enviroment variables.

Generate jwt secret:

```bash
printf "%s\n" $(openssl rand -base64 32 | tr -dc 0-9A-Za-z | head -c 40)
```

[Generate google oauth2 credentials](https://developers.google.com/adwords/api/docs/guides/authentication)

### Building

Execute project in localhost:

```bash
gulp watch
```

You must see the next output:

```bash
[09:11:07] Using gulpfile ~/GitHub/Ksquare/conference-server/gulpfile.js
[09:11:07] Starting 'clean-serve'...
[09:11:07] Starting 'clean'...
[09:11:07] Finished 'clean' after 7.62 ms
[09:11:07] Starting 'copy-views'...
[09:11:07] Finished 'copy-views' after 21 ms
[09:11:07] Starting 'copy-locales'...
[09:11:07] Finished 'copy-locales' after 2.15 ms
[09:11:07] Starting 'compile'...
[09:11:11] Finished 'compile' after 4.06 s
[09:11:11] Starting 'serve'...
[09:11:11] Finished 'serve' after 7.76 ms
[09:11:11] Finished 'clean-serve' after 4.1 s
[09:11:11] Starting 'watch'...
[09:11:11] Finished 'watch' after 16 ms
2019-04-01T15:11:12.733Z - info: conference-booking started at port 8888

```

## Deploying / Publishing

See [deploy strategy](https://github.com/ksquareincmx/conference-server/wiki/Basic-deploy-strategy-using-Docker,-Git-hooks,-nginx-and-FCGI-Wrap)

## API Tests

For run the test is necessary follow the next steps:

```bash
gulp seed
gulp watch
gulp test
```

## Style guide

It's recommended to install [Prettier](https://prettier.io/) plugin and use the default configuration

7. Start the development server

```bash
gulp watch
```

## Docs

## API Refence

You can see the API documentation in dev mode following the next steps:

```bash
gulp apidoc
gulp watch
```

See documentation: `localhost:8888/apidoc`, if you are running your project in production mode you can access change `localhost:port` by your `URL`

## Database

### Install MySQL (Linux)

```bash
sudo apt update
sudo apt install mysql-servemysql-client
```

### Configure MySQL

```bash
# Fix to ERROR 1298 (HY000): Unknown or incorrect time zone: 'UTC'
sudo mysql_tzinfo_to_sql /usr/share/zoneinfo | sudo mysql -u root -p mysql

# Connect to MySQL server
sudo mysql -u root -p

# Create database
mysql> create database `conference-booking`;
```

## License

[MIT](https://github.com/ksquareincmx/conference-server/blob/master/LICENSE)
