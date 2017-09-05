var activateAndPosition = require('./helpers/activateAndPosition')
console.log(activateAndPosition);
activateAndPosition.activateAndPosition().then((result) => {
    return activateAndPosition.setPosition(100, 100).then(() => {
        return result;
    });
}).then((boundaries) => {
    return activateAndPosition.takeScreenShot(100, 100, boundaries[0], boundaries[1]);
});