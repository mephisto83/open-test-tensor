var activateAndPosition = require('./helpers/activateAndPosition');
var fs = require('fs');
var glob = require("glob")
var file = '/Users/andrewporter/Library/Developer/CoreSimulator/Devices/DED4C8F3-4715-4534-B01B-BCC75984644D/data/Containers/Bundle/Application/7C52FC04-B811-4FC7-BE3E-DB793C52C314/OpenTestTensorNativeBaseUIElements.app/open-test-tensor-current.json';
var documentpath = '../ui-examples/react-native/nativebase/';// '~/Documents/';
var documentpathfolder = '../ui-examples/react-native/nativebase/images/';
var robot = require("robotjs");
robot.setKeyboardDelay(200);
var btnOffset = 25;
var btnOffset_y = 45;
var lastItem = null;
var screenshotdata = [];
var image_count = 0;
var window_header_height = 22;
var windowPos = { x: 100, y: 100 };
var total_images = 1;
var pause = () => {
    return new Promise(resove => {
        setTimeout(() => {
            resove();
        }, 1000)
    })
};
// console.log(activateAndPosition);
var TestBoundaries = null;
function generateImage() {
    return activateAndPosition.activateAndPosition().then((result) => {
        return activateAndPosition.setPosition(100, 100).then(() => {
            return result;
        });
    }).then((boundaries) => {
        TestBoundaries = boundaries;
        return new Promise(resolve => {
            fs.readFile(file, 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }

                lastItem = JSON.parse(data);
                console.log(lastItem)
                screenshotdata.push(lastItem);
                resolve(lastItem)
            });
        });
    }).then((action) => {
        console.log(action);
        robot.moveMouse(windowPos.x + btnOffset, windowPos.y + btnOffset_y)
        return Promise.resolve().then(() => {
            return action;
        });
    }).then((action) => {
        var filename = `${lastItem.type}-${Date.now()}.jpg`;
        lastItem.filename = filename;

        return activateAndPosition.takeScreenShot(
            windowPos.x + action.pageX,
            windowPos.y + action.pageY + window_header_height,//
            action.frameWidth,
            action.frameHeight, `${documentpathfolder}${filename || 'unnamed.jpg'}`).then(() => {
                return action;
            });
    }).then((action) => {
        console.log(action);
        return robot.moveMouse(windowPos.x + btnOffset, windowPos.y + btnOffset_y);
    }).then(() => {
        robot.mouseClick('left', 1);
    }).then(pause).catch(e => {
        console.log(e);
    }).then(() => {
        image_count++;
        if (image_count < total_images) {
            return generateImage();
        }
        else {
            return Promise.resolve().then(() => {
                var fileData = {
                    screenshotdata,
                    folder: 'images'
                }
                return new Promise(resolve => {
                    fs.writeFile(`${documentpath}im-${Date.now()}.json`, JSON.stringify(fileData, null, 4), 'utf-8', function (err, data) {
                        if (err) {
                            console.log(err);
                        }
                        resolve();
                    });
                });
            })
        }
    });
}

glob("/Users/andrewporter/Library/Developer/CoreSimulator/Devices/**/*/OpenTestTensorNativeBaseUIElements.app/open-test-tensor-current.json", function (er, files) {
    // files is an array of filenames.
    // If the `nonull` option is set, and nothing
    // was found, then files is ["**/*.js"]
    // er is an error object or null.
    console.log(files);
    console.log(er);
    if (files.length) {
        file = files[0];
        generateImage();
    }

})