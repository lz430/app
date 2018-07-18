const fs = require('fs');

const env = require('dotenv').parse(
    fs.readFileSync(__dirname + '/.env', { encoding: 'utf8' })
);

//
// These values will end up in our JavaScript builds.
// Only include values here that are SAFE to be
// shared with the general public.
//

const config = {
    RECAPTCHA_PUBLIC_KEY: env.RECAPTCHA_PUBLIC_KEY,
};

const toWrite =
    'export default ' +
    JSON.stringify(config)
        .replace(/"require/g, 'require')
        .replace(/\)"/g, ')');

fs.writeFileSync(__dirname + '/resources/assets/js/config.js', toWrite);
