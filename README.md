# conference-booking

conference-booking Server, based on Flugzeug.

## Table of contents

1. [Production](#production)
2. [Development](#development)
3. [Docs](#docs)
4. Print database creation SQL
5. [License](#license)

## Production

Check the `.env.example` file to set up the appropriate environment variables and run `docker-compose up --build`.

Check a [basic deploy strategy](https://github.com/ksquarelabsmx/conference-server/wiki/Basic-deploy-strategy-using-Docker,-Git-hooks,-nginx-and-FCGI-Wrap) in the wiki to set up a basic CI environment.

## Development

1. Install MySQL (Linux)
    ```bash
    # Linux
    sudo apt update
    sudo apt install mysql-server mysql-client

    # macOS
    brew update
    brew install mysql
    ```

2. Configure MySQL
    ```bash
    # Fix to ERROR 1298 (HY000): Unknown or incorrect time zone: 'UTC'
    mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root -p mysql

    # Connect to MySQL server
    mysql -u root -p
    ```

3. Create database
    ```mysql
    CREATE DATABASE `conference-booking`;
    CREATE USER 'conference-booking'@'localhost' IDENTIFIED WITH mysql_native_password BY '___YOUR_PASSWORD_HERE___';
    GRANT ALL PRIVILEGES ON `conference-booking`.* TO 'conference-booking'@'localhost';
    FLUSH PRIVILEGES;
    ```

4. Create a `.env` file and update it with you MySQL credentials
    ```bash
    cp .env.example .env
    code .env
    ```

5. Install dependencies
    ```bash
    npm install
    ```

6. Seed the database
    ```bash
    gulp seed
    ```

7. Start the development server
    ```bash
    gulp watch

## Docs

Read the documentation at `docs/Framework.md`

## Print database creation SQL (Useful when writing migrations)

```
gulp sql
```

## License

[MIT](https://github.com/ksquareincmx/conference-server/blob/master/LICENSE)
