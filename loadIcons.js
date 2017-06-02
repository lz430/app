const fs = require('fs');

const bodyStyles = fs.readdirSync(__dirname + '/resources/assets/svg/body-styles', 'utf8');
const zondicons = fs.readdirSync(__dirname + '/resources/assets/svg/zondicons', 'utf8');

const write = (things, pathSegment) => {
    let output = {};
    things.reduce((acc, file) => {
        const filename = file.split('.')[0];

        acc[filename] = fs.readFileSync(`./resources/assets/svg/${pathSegment}/${file}`, 'utf8');
        return acc;
    }, output);

    const toWrite = 'export default ' + JSON.stringify(output).replace(/"require/g, 'require').replace(/\)"/g, ')');

    fs.writeFileSync(__dirname + '/resources/assets/js/' + pathSegment + '.js', toWrite);
};

write(bodyStyles, 'body-styles');
write(zondicons, 'zondicons');