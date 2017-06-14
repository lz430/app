const fuelAxios = window.axios.create({
    baseURL: 'https://api.fuelapi.com/v1/json',
    auth: {
        username: window.Laravel.fuelApiKey,
        password: '',
    },
});

delete fuelAxios.defaults.headers.common['X-CSRF-TOKEN'];

const fuel = {
    // getVehicleId: ({ year, make, model, body, doors, drive, trim }) => {
    getVehicleId: (year, make, model, trim = null, doors = '', body = null, drive = null) => {
        return fuelAxios.get('/vehicles', {
            params: {
                year: year,
                make: make,
                model: model,
                trim: trim,
                body: body,
                doors: doors,
                drive: drive,
            },
        });
    },
    getImagesByVehicleId: (vehicleID) => {
        return fuelAxios.get(`/vehicle/${vehicleID}`);
    },
};

export default fuel;

// REQUIRED: vehicleID or VIN
// OPTIONAL: productID (show only assets for a particular product) - This is required if you wish to specify a shot code or color.
//     OPTIONAL: shotCode (used to retrieve a single shot – see SHOT CODES table below for possible values)
// OPTIONAL: color (can be OEM color value, simple color name, or hex RGB value)
// OPTIONAL: proto (http or https - indicates the asset url protocols in the response, overrides the default setting for the application)
