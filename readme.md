# Deliver My Ride

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
