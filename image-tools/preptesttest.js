const pt = require('./helpers/prepareTest');

pt.prompt().then(res => {
    console.log(res);
    return pt.promptfpNew()
}).then(res => {
    if (res) {
        console.log('adding a new test');
    }
    else {
        console.log('no new test')
    }
})