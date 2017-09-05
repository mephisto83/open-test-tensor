'use strict';
const keyboardState = require('./keyboardstate');
exports.shutdown = () => {
    keyboardState.shutdown();
}
var recordTest = (appBoundaries) => {
    var result = [];
    var start = Date.now();
    var promise = Promise.resolve().then(() => {
        keyboardState.start();
    }).then(() => {
        return new Promise((resolve, fail) => {
           
            keyboardState.onEvent((pressedState, state, id, ops) => {
                if (keyboardState.is(keyboardState.CTRL, keyboardState.One)) {
                    keyboardState.shutdown();
                    result.pop();
                    resolve();
                }
                else {
                    console.log(ops.keyup)
                    result.push({
                        type: keyboardState.KEY,
                        key: (ops.keydown),
                        keycode: ops.keydown,
                        modifiers: {
                            [keyboardState.COMMAND]: keyboardState.is(keyboardState.COMMAND)
                        },
                        state: Object.assign({}, state),
                        pressedState: Object.assign({}, pressedState),
                        time: Date.now() - start,
                        appBoundaries
                    });
                }
            }, keyboardState.KEY);
            // keyboardState.onEvent((pressedState, state, id, ops) => {
            //     if (keyboardState.is(keyboardState.CTRL, keyboardState.One)) {
            //         result.pop();
            //         keyboardState.shutdown();
            //         resolve();
            //     }
            //     else {
            //         console.log(ops.keydown)
            //         result.push({
            //             type: keyboardState.KEY_DOWN,
            //             key: String.fromCharCode(ops.keydown),
            //             keycode: ops.keydown,
            //             state: Object.assign({}, state),
            //             modifiers: {
            //                 [keyboardState.COMMAND]: keyboardState.is(keyboardState.COMMAND)
            //             },
            //             pressedState: Object.assign({}, pressedState),
            //             time: Date.now() - start,
            //             appBoundaries
            //         });
            //     }
            // }, keyboardState.KEY_DOWN);

            // keyboardState.onEvent((pressedState, state, id, ops) => {
            //     if (keyboardState.is(keyboardState.CTRL, keyboardState.One)) {
            //         keyboardState.shutdown();
            //         resolve();
            //     }
            //     else {
            //         console.log(ops.keyup)
            //         result.push({
            //             type: keyboardState.KEY_UP,
            //             key: (ops.keyup),
            //             keycode: ops.keyup,
            //             modifiers: {
            //                 [keyboardState.COMMAND]: keyboardState.is(keyboardState.COMMAND)
            //             },
            //             state: Object.assign({}, state),
            //             pressedState: Object.assign({}, pressedState),
            //             time: Date.now() - start,
            //             appBoundaries
            //         });
            //     }
            // }, keyboardState.KEY_UP);

            keyboardState.onEvent((mousePosition, mouseClick) => {
                result.push({
                    type: keyboardState.MOUSE_CLICK,
                    mouseClick,
                    time: Date.now() - start,
                    appBoundaries
                });
            }, keyboardState.MOUSE_CLICK);

            keyboardState.onEvent((mouseDrag, mouseClick) => {
                result.push({
                    type: keyboardState.MOUSE_DRAG,
                    mouseDrag,
                    time: Date.now() - start,
                    appBoundaries
                });
            }, keyboardState.MOUSE_DRAG);
        });
    })
    var caught = false;
    return promise.catch((e) => {
        caught = e;
    }).then(() => {
        keyboardState.shutdown();
        if (caught) {
            return Promise.reject(caught);
        }
    }).then(() => { return result; });
}

exports.recordTest = recordTest;