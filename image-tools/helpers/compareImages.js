//https://github.com/Automattic/node-canvas/wiki/Installation---OSX
//to install Cairo

exports.compare = (img, img2) => {
    return new Promise((resolve, fail) => {

        var fs = require('fs');

        var resemble = require('node-resemble-v2');

        var github_img1 = fs.readFileSync('./image2.png');

        var github_img2 = fs.readFileSync('./image1.png');

        resemble(github_img1).onComplete(function (data) {
            console.log(data);
        });

        resemble(github_img1).compareTo(github_img2).onComplete(function (data) {
            console.log(data);
            resolve();
        });
    })
};