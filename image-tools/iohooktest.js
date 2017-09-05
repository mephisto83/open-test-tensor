'use strict';
const ioHook = require('iohook');

ioHook.on("mousemove", event => {
    console.log(event);
    /* You get object like this
      {
        type: 'mousemove',
        x: 700,
        y: 400
      }
     */
});

ioHook.on('keyup', event => {
    console.log(event);
});
ioHook.on('keydown', event=>{
    
})
//Register and start hook 
ioHook.start();