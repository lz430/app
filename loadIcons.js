const fs = require('fs');

const bodyStyles = fs.readdirSync(__dirname + '/public/images/body-styles', 'utf8');
const zondicons = fs.readdirSync(__dirname + '/public/images/zondicons', 'utf8');

const write = (things, pathSegment) => {
    let output = {};
    things.reduce((acc, file) => {
        const filename = file.split('.')[0];

        acc[filename] = `require('./images/${pathSegment}/${file}')`;
        return acc;
    }, output);

    const toWrite = 'export default ' + JSON.stringify(output).replace(/"require/g, 'require').replace(/\)"/g, ')');
    fs.writeFileSync(__dirname + '/public/' + pathSegment + '.js', toWrite);
};

write(bodyStyles, 'body-styles');
write(zondicons, 'zondicons');