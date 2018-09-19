# conference-booking

conference-booking Server, based on Flugzeug.

## Install mysql

```
$ sudo apt update
$ sudo apt install mysql-server mysql-client
```

## Configure mysql

Create database and fix timezone utc error
```
$ mysql -u root -p
$ mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root -p mysql

mysql> CREATE DATABASE `conference-booking`;
```

## Install dependencies
```
$ npm install
```

On Mac OS also
```
$ npm install gulp@3.9.0
```

## Development

Read the documentation at ``docs/Framework.md``

```
gulp watch
```

## Prepare for production

```
gulp production
```

## Run in production

```
npm start
```

or

```
node dist/main.js
```

## Seed database (see app/seed.ts)

```
gulp seed
```

## Print database creation SQL (Useful when writing migrations)

```
gulp sql
```
