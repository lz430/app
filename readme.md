# Deliver My Ride

## Install Dependencies
```
composer install
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

## Load Dummy Saved Vehicles
```
php artisan db:seed --class=DummySavedVehicleSeeder
```

## JATO API Tests
```
phpunit tests/API
```

## Notes
> Option Types
```
/* Option type. O = Option, P = Package, C = ColorTrim, B = Base, A = Accessory, I = ? */
```
