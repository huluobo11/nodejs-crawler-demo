 const http = require('http');
 const https = require('https');
 const fs = require('fs');
 const path = require('path');
 const { promisify } = require('util');
 const witeFile = promisify(fs.writeFile);
 
 module.exports = async (src, dir) => {
    if(/\.(jpg|png|gif)$/.test(src)) {
        await urlToImg(src, dir);
    }else {
        await base64ToImg(src, dir);
    }
};

// url -> image
const urlToImg = promisify((url, dir, callback) => {
    const mod = /^https:/.test(url) ? https : http;
    const ext = path.extname(url);
    const file = path.join(dir, `${Date.now()}${ext}`);

    mod.get(url, res => {
        res.pipe(fs.createWriteStream(file))
            .on('finish', () => {
                callback();
                console.log(file);
            });
    });
});

// base64 -> image
const base64ToImg = async function (base64Str, dir){
    // data:image/jpeg;base64,/abcd1234
    const matchs = base64Str.match(/^data:(.+?);base64,(.+)$/);
    try{
        const ext = matchs[1].split('/')[1].replace('jpeg', 'jpg');
        const file = path.join(dir, `${Date.now()}.${ext}`);
        const conent = matchs[2];
    
        await witeFile(file, conent, 'base64');
        console.log(file);
    }catch(e) {
        console.log('非法的base64字符串')
    }
};
