export default {
    RECAPTCHA_PUBLIC_KEY: process.env.MIX_RECAPTCHA_PUBLIC_KEY,
    MARKETING_URL: process.env.MIX_MARKETING_URL,
    MIXPANEL_TRACK: process.env.MIX_MIXPANEL_TRACK,

    EMPLOYEE_PRICING_WHITELIST_BRANDS: [
        'Chrysler',
        'Dodge',
        'Jeep',
        'Ford',
        'Lincoln',
        'Chevrolet',
        'Cadillac',
        'Buick',
        'GMC',
        'Ram',
        'Fiat',
        'Nissan',
    ],

    SUPPLIER_PRICING_WHITELIST_BRANDS: [
        'Chrysler',
        'Dodge',
        'Jeep',
        'Ford',
        'Lincoln',
        'Chevrolet',
        'Cadillac',
        'Buick',
        'GMC',
        'Ram',
    ],

    PRICING_ROLE_MAP: {
        default: 'd',
        employee: 'e',
        supplier: 's',
        college: 'col',
        military: 'mil',
        conquest: 'con',
        loyal: 'loy',
        responder: 'resp',
        gmcompetitive: 'gmcomp',
        gmlease: 'gmlease',
        cadillaclease: 'cadlease',
    },
};
