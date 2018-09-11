# Deliver My Ride

## Requirements

-   PHP >= 7.0
-   Composer
-   Node
-   Yarn
-   Cross-env

    -   `npm install -g cross-env`

# Install & Run

See https://delivermyride.atlassian.net/wiki/spaces/GEN/pages/786500/Running+Developing+Locally

# Updating Icons

```bash
yarn run svgr -d resources/assets/js/icons resources/assets/svg
```

## Testing

### PHP Test Setup

Create a test db:

```bash
create database delivermyridetesting;
```

```bash
# list test suits
phpunit --list-suites

#run all tests
phpunit

#run specific test suite
phpunit --testsuite external,feature
```

## Install Project Dependencies

```
composer install && yarn
```

## Run front-end tasks

```
yarn run dev
```

## Create .env file

> Modify the .env file values to your local environment

```
cp .env.example .env
```

## Generate Application Key

```
php artisan key:generate
```

## Migrate Database

```
php artisan migrate
```

## Load data from Vauto

```
php artisan vauto:load
```

## Load Dummy Saved Vehicles

```
php artisan db:seed --class=DummySavedVehicleSeeder
```

## Javascript Tests

```
yarn run test
```

## Javascript Tests Watch

```
yarn run watch-test
```

## Notes

> Option Types

```
/* Option type. O = Option, P = Package, C = ColorTrim, B = Base, A = Accessory, I = ? */
```

> VAuto Uploads Path (Will need to copy from prod to local if needed)

```
// .env
VAUTO_UPLOADS_PATH

// Production
../vauto/uploads

// Local
storage/vauto/uploads
```

> sftp for VAuto

```
host: 67.205.187.113
upload path: /vauto/uploads
u: vauto
p: YuyXZXqoLjyivp3uNGLWLkde
```
