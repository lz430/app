# Deliver My Ride
## Requirements
- PHP >= 5.6
- Composer
- Node
- Yarn
- Cross-env
  - `npm install -g cross-env`
  
## Create test database (uses mysql for tests)
`delivermyride-testing`

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

## Load data from JATO
```
php artisan jato:load 
```

## Load data from Vauto
```
php artisan vauto:load 
```

## Load Dummy Saved Vehicles
```
php artisan db:seed --class=DummySavedVehicleSeeder
```

## JATO API Tests
```
phpunit tests/JATO
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