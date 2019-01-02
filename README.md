# conference-booking

conference-booking Server, based on Flugzeug.

## Install MySQL (Linux)

```
$ sudo apt update
$ sudo apt install mysql-server mysql-client
```

## Install MySQL (macOS)

```
# Install brew from https://brew.sh
$ brew update
$ brew install mysql
```

## Configure MySQL

Create database and fix timezone utc error
```
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root -p mysql

mysql -u root -p

mysql> CREATE DATABASE `conference-booking`;
mysql> CREATE USER 'conference-booking'@'localhost' IDENTIFIED WITH mysql_native_password BY '___YOUR_PASSWORD_HERE___';
mysql> GRANT ALL PRIVILEGES ON `conference-booking`.* TO 'conference-booking'@'localhost';
mysql> FLUSH PRIVILEGES;
```

## Update `.env` file with MySQL credentials

```
$ cp .env.example .env
$ code .env
```

## Install dependencies

```
$ npm install
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
