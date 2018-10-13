const withSass = require('@zeit/next-sass');
module.exports = {
    ...withSass(),
    useFileSystemPublicRoutes: false,
};
