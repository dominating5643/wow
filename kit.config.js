const path = require('path');
const kit = require('node-kit');
const fs = require('fs');

const newFilePath = path.resolve(__dirname, 'src', 'html');

try {
    checkDir(newFilePath, newFilePath, '_sourse');
    console.log('Compilation to html was successful');
} catch (err) {
    console.log('Compilation to html failed:');
    console.error(err);
}



function checkDir(newFilePath, prevDirPath, dirName) {
    if (prevDirPath === newFilePath) {
        fs.readdir(path.resolve(prevDirPath), (err, items) => {
            items.filter(item => (/\./.test(item))).forEach(item => {
                fs.unlink(path.resolve(newFilePath, item), (err) => {});
            })
        }); 
    }

    fs.readdir(path.resolve(prevDirPath, dirName), (err, items) => {
        if (!err) {
            tempPrevDirPath = prevDirPath;

            items.forEach(item => { 
                if (item !== 'components') {
                    if (/\./u.test(item)) {
                        let newFileName = item.replace(/\.kit/u, '.html');

                        fs.writeFileSync(path.resolve(newFilePath, newFileName), kit(path.resolve(prevDirPath, dirName, item)));      
                        
                    } else {
                        tempPrevDirPath = path.resolve(prevDirPath, dirName);

                        checkDir(newFilePath, tempPrevDirPath, item);

                        tempPrevDirPath = prevDirPath;
                    }
                }
            });
        } else throw err;
    });
}