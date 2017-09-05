var QRCode = require('qrcode')
var Keys = require('./keys');
var Canvas = require('canvas')
    , Image = Canvas.Image
    , qrcode = require('jsqrcode')(Canvas)
const Datauri = require('datauri');
var fs = require('fs');

var promise = Promise.resolve();
for (var i in Keys) {
    promise = promise.then(((i) => {
        return new Promise((resolve, fail) => {
            //  console.log(content)
            var imagefile = `./qr/${i}.png`;
            console.log(imagefile);
            QRCode.toFile(imagefile, i, {
                color: {
                    dark: '#000000',  // Black dots
                    light: '#ffffff' // white background
                }
            }, function (err) {
                if (err) throw err
                console.log('done');
                resolve();
                // const datauri = new Datauri();

                // datauri.on('encoded', content => {

                //     console.log('encoded')

                //     var image = new Image()
                //     image.onload = function () {
                //         var result;
                //         try {
                //             result = qrcode.decode(image);
                //             console.log('result of qr code: ' + result);
                //         } catch (e) {
                //             console.log(e)
                //             console.log('unable to read qr code');
                //         }
                //     }
                //     image.src = imagefile
                // });
                // //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."; 

                // datauri.on('error', err => console.log(err));
                // datauri.encode(imagefile);
            });
        });
    }).bind(null, i));
}