var activateAndPosition = require('./helpers/activateAndPosition')
console.log(activateAndPosition);
activateAndPosition.activateAndPosition().then(() => {
    return activateAndPosition.setPosition(100, 100);
}).then(() => {
    return activateAndPosition.takeScreenShot(100, 100, 100, 100);
}).then(() => {
    //return activateAndPosition.constructExampleImages(100, 100, 300, 600, './genimages', 'random', 10, 10, 5, 5)
}).then(images => {
    //return activateAndPosition.shrinkImages(images, './genimages_small')
}).then(() => {
    return activateAndPosition.constructAndShrink(100, 100, 300, 600, './genimages', './genimages_small', 'random', 10, 10, 5, 5)
});