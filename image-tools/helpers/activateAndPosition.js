const runApplescript = require('run-applescript');
const keycodes = require('./keycodes');
const { spawn } = require('child_process');

var promise = Promise.resolve();

var name = 'tell application "Finder" to get the name of Finder Window 1';
var activate_command = 'tell application "Simulator" to activate';
var keyStroke = () => {
    var number = keycodes.keylettermap['R'];
    console.log(number);
    var stroke = `
    tell application "System Events"
        key code 114 using {command down} -- shift-command-left
    end
    `;
    return runApplescript(stroke).then(result => {
        return result;
        //=> 'unicorn'
    })
}
var setPosition = (x, y) => {
    var set_position = `
    tell application "System Events"
        set position of first window of application process "Simulator" to {${x}, ${y}}
    end tell  
`
    return runApplescript(set_position);
}
var takeScreenShot = (x, y, w, h, path) => {
    path = path || '~/Documents/file.png'
    var take_shot = `
    on run
        set theDesktop to "${path}"
        set theCurrentDate to current date
        set shellCommand to "/usr/sbin/screencapture -R${x},${y},${w},${h} ${path} "
        do shell script shellCommand
    end run
    `;
    return runApplescript(take_shot).then(res => {
        console.log(res);
    });
}

var shrinkImage = (file, outputpath, maxHeightWidth) => {
    maxHeightWidth = maxHeightWidth || 32;
    return new Promise((resolve, fail) => {
        var ls = spawn('sips', [file, '-Z', maxHeightWidth, '--out', outputpath], {
            //cwd: cwd
        });
        console.log('executing ...')
        ls.stdout.on('data', (data) => {
            // console.log(`stdout: ${data}`);
        });

        ls.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            resolve();
        });
    })
}

var constructAndShrink = (x, y, w, h, folder, shrinkFolder, name, wx, hy, stepx, stepy) => {
    return Promise.resolve().then(() => {
        return constructExampleImages(x, y, w, h, folder, name, wx, hy, stepx, stepy)
    }).then(images => {
        return shrinkImages(images, shrinkFolder)
    })
}
var shrinkImages = (files, outputpath, maxHeightWidth) => {
    var promise = Promise.resolve();
    files.forEach((file) => {
        promise = promise.then(() => {
            return shrinkImage(file, outputpath, maxHeightWidth);
        })
    });
    return promise;
}
var constructExampleImages = (x, y, w, h, folder, name, wx, hy, stepx, stepy) => {
    var result = [];
    return Promise.resolve().then(() => {
        var promise = Promise.resolve();
        [].interpolate(x, x + wx, (xt) => {
            [].interpolate(y, y + hy, (yt) => {
                promise = promise.then(() => {
                    return takeScreenShot(xt, yt, w - wx, h - hy, `${folder}/${name}-${xt}-${yt}.png`).then(() => {
                        var filename = `${folder}/${name}-${xt}-${yt}.png`;
                        result.push(filename);
                        console.log(filename);
                    })
                });
            }, stepx);
        }, stepx);
        return promise.then(() => result);
    })
}
var activateAndPosition = () => {
    [activate_command, name].forEach(command => {
        promise = promise.then(((command) => {
            return runApplescript(command).then(result => {
                return result;
                //=> 'unicorn'
            })
        }).bind(null, command));

    })
    return promise.then(name => {
        var get_position = `
        tell application "System Events"
            set the props to get the properties of the front window of application process "Simulator"
            set theSBounds to {size, position} of props
        end tell
        ` ;//`tell application "System Events" to tell application process "Simulator"  to get position of "${name}"`;

        return runApplescript(get_position).then(result => {
            var bounds = result.split(',').map(x => parseFloat(x));
            return bounds;
            //=> 'unicorn'
        })
    })
}
(function (array) {
    if (!array.interpolate) {
        Object.defineProperty(array, 'interpolate', {
            enumerable: false,
            writable: true,
            configurable: true,
            value: function (start, stop, func, step) {
                var collection = this;
                step = step || 1;
                func = func || function (x) { return x; };
                for (var i = start; i < stop; i = i + step) {
                    if (collection instanceof Float32Array) {
                        collection[i - start] = (func(i));
                    }
                    else
                        collection.push(func(i, i - start));
                }
                return collection;
            }
        });
    }
})(Array.prototype);


exports.activateAndPosition = activateAndPosition;
exports.keyStroke = keyStroke;
exports.setPosition = setPosition;
exports.takeScreenShot = takeScreenShot;
exports.constructExampleImages = constructExampleImages;
exports.shrinkImage = shrinkImage;
exports.shrinkImages = shrinkImages;
exports.constructAndShrink = constructAndShrink;