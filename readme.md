# Deliver My Ride

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
phpunit tests/API
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