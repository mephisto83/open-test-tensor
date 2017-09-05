var pt = require('./prepareTest');
const tr = require('./testRecorder');
const ks = require('./keyboardstate');
const aap = require('./activateAndPosition');
var jsonfile = require('jsonfile')
var glob = require("glob");
var fs = require('fs');

var newTestName = null;
var defaultDirectory = null;
var default_opts = null;
exports.createTestSuit = (opts) => {
    opts = opts || default_opts || {};
    default_opts = default_opts || opts;
    defaultDirectory = opts.defaultDirectory || null;
    console.log('################################')
    console.log('Welcome to Hero Test Suite.');
    return pt.promptChoice('Would you like to: ', [{
        text: 'Create a test'
    }, {
        text: 'Run tests'
    }, {
        text: 'Create a mechanism'
    }, {
        text: 'Run mechanisms'
    }, {
        text: 'Construct View Model Images'
    }, {
        text: 'Exit'
    }]).then(res => {
        switch (res) {
            case 0:
                return createTest().then(exports.createTestSuit);
            case 1:
                return runTests().then(exports.createTestSuit);
            case 2:
                return createTest('mech.json').then(exports.createTestSuit);
            case 3:
                return runTests('mech.json').then(exports.createTestSuit);
            case 4:
                return constructViewModelImages().then(exports.createTestSuit);
            default:
                tr.shutdown();
                console.log('shutting down')
                break;
        }
    })
}

var getDirectory = (text) => {
    var count = 4;
    var _getdir = () => {
        return pt.promptText(text || 'Enter directory for tests.').then((res) => {
            if (res === 'exit') {
                return -1;
            }
            if (fs.existsSync(res)) {
                // Do something
                return res;
            }
            else {
                throw new Error('Directory doesnt exist');
            }
        }).catch((e) => {
            console.log(e);
            count--;
            if (count)
                return _getdir(text);
            throw new Error('couldnt get directoy')
        });
    }
    return _getdir();
}

function createTest(type, explan) {
    return Promise.resolve().then(getDirectory).then((res) => {
        defaultDirectory = res;
        if (res == -1) {
            throw new Error('quit');
        }
        return new Promise((resolve, fail) => {
            glob(defaultDirectory + "/*.test.json", function (er, files) {
                if (er) {
                    fail(er);
                }
                console.log(`Found ${files.length} in ${defaultDirectory}`)
                resolve(files);
            })
        });
    }).then(() => {
        return pt.prompt('What would you like to call this test')
    }).then(testName => {
        newTestName = testName;
    }).then(startReactNative).then(() => {
        type = type || 'test.json';
        var file = `${defaultDirectory}/${newTestName}.${type}`;
        return aap.activateAndPosition().then((boundaries) => {
            return tr.recordTest(boundaries).then((res) => {
                var created_test = {
                    directory: defaultDirectory,
                    actions: res,
                    name: newTestName
                }
                return jsonfile.writeFile(file, created_test, { spaces: 2 }, function (err) {
                    console.error(err)
                })
            });
        }).then(() => {
            console.log(`${newTestName}, has been created in the ${defaultDirectory}`);
            return pt.promptNew(explan).then((res) => {
                if (res) {
                    return createTest(type);
                }
            })
        });

    });
}
function constructViewModelImages() {
    var imageDirectory = null;
    var shrunkImageDir = null;
    var screenName = null;
    return Promise.resolve().then(() => {
        var p = !default_opts.directoryForImages ?
            getDirectory('Set directory for images') :
            Promise.resolve(default_opts.directoryForImages);
        return p.then(imageDir => {
            imageDirectory = imageDir;
        }).then(() => {
            p = !default_opts.directoryForShrunkImages ?
                getDirectory('Set directory for shrunk images') :
                Promise.resolve(default_opts.directoryForShrunkImages);
            return p.then(dir => {
                shrunkImageDir = dir;
            });
        }).then(() => {
            return pt.prompt('Name of screen').then(_sn => {
                screenName = _sn;
            });
        }).then(() => {
            return aap.activateAndPosition()
        }).then((boundaries) => {
            return aap.constructAndShrink(
                boundaries[2],
                boundaries[3],
                boundaries[0],
                boundaries[1],
                imageDirectory, shrunkImageDir, screenName, default_opts.simWX, default_opts.simWY)
        });
    });
}
function startReactNative() {
    return Promise.resolve().then(() => {
        console.log(default_opts);
        if (!default_opts.reactNativeProjectDir || !fs.existsSync(default_opts.reactNativeProjectDir))
            return getDirectory('Enter react-native project directory').then((res) => {
                default_opts.reactNativeProjectDir = res;
            })
    }).then(() => {
        if (!reactnativestarted) {
            reactnativestarted = true;
            return pt.startReactNative(default_opts.reactNativeProjectDir);
        }
    });
}
var reactnativestarted = false;
function runTests(pattern) {
    return startReactNative().then(() => {
        return pt.promptChoice('Would you like to run all the tests', [{
            text: 'Yes'
        }, {
            text: 'No'
        }]).then((res) => {
            switch (res) {
                case 0:
                    return runAllTests(pattern);
                case 1:
                    console.log('too bad');
                default:
                    console.log('didnt understand , shutting down')
                    break;
            }
        });
    });
}

function runAllTests(pattern) {
    var count = 4;
    pattern = pattern || '.test.json';
    function _getFiles() {
        var promise = Promise.resolve();
        promise = promise.then(() => {
            if (!defaultDirectory) {
                return pt.promptText('Enter directory for tests.').then((res) => {
                    defaultDirectory = res;
                });
            }
        }).then(() => {
            return new Promise((resolve, fail) => {
                glob(defaultDirectory + `/*${pattern}`, function (er, files) {
                    if (er || !files.length) {
                        fail(er);
                    }
                    console.log(`Found ${files.length} in ${defaultDirectory}`)
                    resolve(files);
                })
            });
        }).catch(e => {
            console.log('That did not work so well');
            if (count) {
                count--;
                defaultDirectory = null;
                return _getFiles();
            }
        });
        return promise;
    }
    return _getFiles().then(files => {
        var promise = Promise.resolve();
        files.forEach(function (file) {
            promise = promise.then(() => {
                return runTest(defaultDirectory, file)
            });
        }, this);
        return promise;
    });
}
function pause(time) {
    time = time || 200;
    console.log(`pausing : ${time}ms`)
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}

function runTest(dir, file) {
    return Promise.resolve().then(() => {
        return new Promise((resolve, fail) => {
            jsonfile.readFile(file, null, (err, res) => {
                if (err) {
                    fail(err);
                }
                resolve(res);
            });
        });
    }).then(testProject => {
        console.log(testProject);
        console.log('');
        return pause().then(() => {
            return aap.activateAndPosition().then((boundaries) => {
                console.log('activated')
                console.log(boundaries);
                return Promise.resolve(pause).then(() => {
                    return executeJson(testProject, boundaries);
                })
            });
        });
    });
}

var robot = require("robotjs");
robot.setKeyboardDelay(200);
function getActions(testProj) {
    return testProj.actions;
}
function getX(action) {
    if (action && action.appBoundaries)
        return action.appBoundaries[2] || 0
    throw new Error('missing x position');
}
function getY(action) {
    if (action && action.appBoundaries)
        return action.appBoundaries[3] || 0
    throw new Error('missing y position');
}
function executeJson(testProj, bounds) {
    return Promise.resolve().then(() => {
        var promise = Promise.resolve();
        var actions = getActions(testProj) || [];
        actions.forEach((action, i) => {
            promise = promise.then(() => {
                var modifiers = action.modifiers;
                var _promise = Promise.resolve();
                switch (action.type) {
                    case ks.KEY_UP:
                    case ks.KEY_DOWN:
                        var altkey = [ks.COMMAND].find(x => x === action.keycode) ? 'command' : null;
                        if (altkey) {
                            console.log(action);
                            var mods = ['command']
                            console.log(robot.keyToggle(altkey.toLowerCase(), action.type === ks.KEY_DOWN ? 'down' : 'up'));
                        }
                        break;
                    case ks.KEY:
                        var mods = [];//[modifiers && modifiers[ks.COMMAND] ? 'command' : null].filter(x => x);
                        if (action && action.modifiers) {
                            if (action.modifiers.command) {
                                console.log('adding command')
                                mods.push('command')
                            }
                        }
                        console.log(action);
                        console.log(mods);
                        console.log(action.keycode.toLowerCase());
                        robot.keyTap(action.keycode.toLowerCase(), mods);
                        break;
                    case ks.MOUSE_CLICK:
                        _promise = _promise.then(() => {
                            return aap.setPosition(getX(action), getY(action));
                        }).then(() => {
                            if (action.mouseClick) {
                                return robot.moveMouse(action.mouseClick.x, action.mouseClick.y);
                            }
                            else { throw new Error('missing mouse click object') }
                        }).then(() => {
                            robot.mouseClick('left', action.mouseClick.clicks)
                        })
                        break;
                }
                if (i !== actions.length - 1) {
                    var p = actions[i + 1].time - actions[i].time;

                    _promise = _promise.then(() => {
                        return pause(p);
                    });
                }
                return _promise;
            });
        })
        return promise;
    });
}