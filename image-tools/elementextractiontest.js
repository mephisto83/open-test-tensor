var activateAndPosition = require('./helpers/activateAndPosition');
var fs = require('fs');
var file = '/Users/andrewporter/Library/Developer/CoreSimulator/Devices/DED4C8F3-4715-4534-B01B-BCC75984644D/data/Containers/Bundle/Application/E4EDA6FB-DBB5-46D0-8A12-42ED8BBBFDCD/OpenTestTensorNativeBaseUIElements.app/open-test-tensor-current.json';

var robot = require("robotjs");
robot.setKeyboardDelay(200);
var screenshotdata = [];
var windowPos = { x: 100, y: 100 };
console.log(activateAndPosition);
activateAndPosition.activateAndPosition().then((result) => {
    return activateAndPosition.setPosition(100, 100).then(() => {
        return result;
    });
}).then((boundaries) => {
    return activateAndPosition.takeScreenShot(100, 100, boundaries[0], boundaries[1]);
}).then(() => {
    return new Promise(resolve => {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            screenshotdata.push(JSON.parse(data));
            resolve(JSON.parse(data))
        });
    });
}).then((action) => {
    return activateAndPosition.takeScreenShot(
        windowPos.x + action.pageX, 
        windowPos.y + action.pageY + (action.frameHeight/2), 
        action.frameWidth, 
        action.frameHeight, `~/Documents/${action.name || 'unnamed.jpg'}`).then(() => {
        return action;
    });
}).then((action) => {
    console.log(action);
    return robot.moveMouse(windowPos.x + action.pageX + (action.frameWidth / 2), windowPos.y + action.pageY + (action.frameHeight));
}).then(() => {
    return new Promise(resove => {
        setTimeout(() => {
            resove();
        }, 4000)
    })
}).then(() => {
    robot.mouseClick('left', 1);
    console.log(screenshotdata);
});