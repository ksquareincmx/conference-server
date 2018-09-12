# conference-booking

conference-booking Server, based on Flugzeug.

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