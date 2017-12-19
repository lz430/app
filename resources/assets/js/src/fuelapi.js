const fuelAxios = window.axios.create({
    baseURL: 'https://api.fuelapi.com/v1/json',
    auth: {
        username: window.Laravel.fuelApiKey,
        password: '',
    },
});

delete fuelAxios.defaults.headers.common['X-CSRF-TOKEN'];

const fuel = {
    internalImageCodes: [
        '039',
        '040',
        '051',
        '052',
        '053',
        '057',
        '059',
        '061',
        '062',
        '063',
        '064',
        '065',
        '066',
        '086',
        '087',
        '088',
        '111',
        '113',
        '115',
        '122',
        '123',
        '126',
        '130',
        '140',
        '147',
    ],
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
    getExternalImages: (vehicleID, color = 'white') => {
        return fuelAxios.get(`/vehicle/${vehicleID}`, {
            params: {
                productID: 2,
                productFormatIDs: '6,8,12',
                proto: 'https',
                color,
            },
        });
    },
    getInternalImages: vehicleID => {
        return fuelAxios.get(`/vehicle/${vehicleID}`, {
            params: {
                productID: 1,
                productFormatIDs: 17,
                proto: 'https',
            },
        });
    },
};

export default fuel;
