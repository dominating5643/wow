const path = require('path');
const fs = require('fs');

const dirPath = path.resolve(__dirname, 'dist');

const items = fs.readdirSync(dirPath)
    .filter(item => (/\.html/.test(item)))
    .forEach(item => {
        fs.writeFileSync(path.resolve(dirPath, item), fs.readFileSync(path.resolve(dirPath, item), "utf8").replace(/<script (defer|defer="defer") src="main.js"><\/script>/, ''));
    });

fs.unlinkSync(path.resolve(dirPath, 'main.js'));

console.log('Dist is clean');
