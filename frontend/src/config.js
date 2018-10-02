export default {
    RECAPTCHA_PUBLIC_KEY: process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY,
    MARKETING_URL: process.env.REACT_APP_MARKETING_URL,
    MIXPANEL_TRACK: process.env.REACT_APP_MIXPANEL_TRACK,
    GOOGLE_ANALYTICS_UA: process.env.REACT_APP_GA_TOKEN,
    LIVECHAT_LICENSE: process.env.REACT_APP_LIVECHAT_LICENSE,
    API_URL: process.env.REACT_APP_API_URL,
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
        gmloyalty: 'gmloyalty',
    },
}