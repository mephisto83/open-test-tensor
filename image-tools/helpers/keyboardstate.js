'use strict';

const ioHook = require('iohook');
const keycodes = require('./keycodes');
var keyboardState = {};
var keyboardPressed = {};
var keydown = null;
var keyup = null;
var mousePosition = null;
var mouseClick = null;
var mouseDrag = null;
var mouseDragStart = null;
exports.start = () => {
    ioHook.on("mousemove", event => {
        mousePosition = event;
    });
    ioHook.on('mouseclick', event => {
        mouseClick = event;
        clicked();
    })
    ioHook.on('mousedrag', event => {
        if (mouseDragStart == null) {
            mouseDragStart = event;
        }
        else {

        }
        mouseDrag = event;
    });
    ioHook.on('mouseup', event => {
        if (mouseDragStart) {
            mousedrag({ start: mouseDragStart, end: mouseDrag });
            mouseDragStart = null;
        }
    })

    ioHook.on('keyup', event => {
        keyboardState[event.keycode] = false;
        if (keyboardState[event.keycode] === true) {
            keyboardPressed[event.keycode] = true;
        }
        keyup = keycodes.keyobjmap[(event.keycode)] || event.keycode;
        console.log(event);
        kaction(KEY_UP)
    });
    ioHook.on('keydown', event => {
        keyboardPressed = {};
        keydown = keycodes.keyobjmap[(event.keycode)] || event.keycode;
        keyboardState[event.keycode] = true;
        console.log(event);
        pressed();

        kaction(KEY_DOWN)
    })
    //Register and start hook 
    ioHook.start();
}

exports.keyBoardState = () => {
    return keyboardState;
}
var pressedId = 0;
var listeners = []
exports.onEvent = (func, type) => {
    pressedId++;
    listeners.push({ type, func, id: pressedId });
    return pressedId;
}
function pressed() {
    listeners.filter(x => x.type === KEY).forEach(l => {
        l.func(keyboardPressed, keyboardState, l.id, { keyup, keydown });
    });
}
function kaction(filter) {
    listeners.filter(x => x.type === filter).forEach(l => {
        l.func(keyboardPressed, keyboardState, l.id, { keyup, keydown });
    });
}
function clicked() {
    listeners.filter(x => x.type === MOUSE_CLICK).forEach(l => {
        l.func(mousePosition, mouseClick, l.id);
    });
}
function mousedrag(res) {
    listeners.filter(x => x.type === MOUSE_DRAG).forEach(l => {
        l.func(res, mouseClick, l.id);
    });
}
const KEY = 'KEY';
const KEY_UP = 'KEY_UP';
const KEY_DOWN = 'KEY_DOWN';
const MOUSE_CLICK = 'MOUSE_CLICK';
const MOUSE_DRAG = 'MOUSE_DRAG';
exports.KEY = KEY;
exports.KEY_DOWN = KEY_DOWN;
exports.KEY_UP = KEY_UP;
exports.MOUSE_DRAG = MOUSE_DRAG;
exports.MOUSE_CLICK = MOUSE_CLICK;
exports.MousePosition = 'MousePosition';
exports.CTRL = 'ctrl';
exports.COMMAND = 'command';
exports.COMMAND_KEY_CODE = 3675;
exports.One = 'one';
exports.is = (spk, key) => {
    var result = false;
    switch (spk) {
        case exports.CTRL:
            result = !!keyboardState[29];
            break;
        case exports.COMMAND:
            result = !!keyboardState[3675];
            break;
        default:
            result = false;
            break;
    }
    switch (key) {
        case exports.One:
            result = result && !!keyboardState[2]
            break;
    }
    return result;
}
exports.keyBoardPressed = () => {
    return keyboardPressed;
}
exports.shutdown = () => {
    ioHook.unload();
}