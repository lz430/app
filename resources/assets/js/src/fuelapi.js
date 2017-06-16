const fuelAxios = window.axios.create({
    baseURL: 'https://api.fuelapi.com/v1/json',
    auth: {
        username: window.Laravel.fuelApiKey,
        password: '',
    },
});

delete fuelAxios.defaults.headers.common['X-CSRF-TOKEN'];

const fuel = {
    getVehicleId: (
        year,
        make,
        model,
        trim = null,
        doors = '',
        body = null,
        drive = null
    ) => {
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
    getImagesByVehicleId: vehicleID => {
        return fuelAxios.get(`/vehicle/${vehicleID}`, {
            params: {
                productID: 1,
                productFormatIDs: 17,
            }
        });
    },
};

export default fuel;
