var prompt = require('prompt');
const { spawn } = require('child_process');

var properties = [
    {
        name: 'testName',
        validator: /^[a-zA-Z\s\-]+$/,
        warning: 'Test name must be only letters, spaces, or dashes'
    }
];
var testproperties = [
    {
        name: 'testName',
        validator: /^[a-zA-Z\-]+$/,
        warning: 'Test name must be only letters, or dashes'
    }
];
var textinput = [
    {
        name: 'input'
    }
];

var newTest = [
    {
        name: 'newTest',
        validator: /^[a-zA-Z\s\-]+$/,
        warning: 'Would you like to add another test.'
    }
];
exports.startReactNative = (cwd) => {
    return new Promise((resolve, fail) => {
        console.log(cwd);
        var ls = spawn('react-native', ['run-ios'], {
            cwd: cwd
        });
        console.log('executing ...')
        ls.stdout.on('data', (data) => {
           // console.log(`stdout: ${data}`);
        });

        ls.stderr.on('data', (data) => {
           // console.log(`stderr: ${data}`);
        });

        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            resolve();
        });
    })
}

exports.promptText = (text) => {
    console.log(text);
    return new Promise((resolve, fail) => {

        prompt.start();

        prompt.get(textinput, function (err, result) {
            if (err) { return onErr(err); }
            resolve(result.input);
        });

        function onErr(err) {
            console.log(err);
            fail(err);
        }
    });
}
exports.prompt = (text) => {
    if (text)
        console.log(text);
    return new Promise((resolve, fail) => {

        prompt.start();

        prompt.get(testproperties, function (err, result) {
            if (err) { return onErr(err); }
            resolve(result.testName);
        });

        function onErr(err) {
            console.log(err);
            fail(err);
        }
    });
}
const SELECT_CHOICE = 'Select your choice';
exports.promptChoice = (text, choices) => {
    var count = 4;
    var getanwer = () => {
        return Promise.resolve().then(() => {
            console.log(text);
            choices.forEach((x, i) => {
                console.log(`${i}: ${x.text}`)
            })
            return new Promise((resolve, fail) => {

                prompt.start();

                prompt.get(SELECT_CHOICE, function (err, result) {
                    if (err) { return onErr(err); }
                    resolve(result);
                });

                function onErr(err) {
                    fail(err);
                }
            });
        }).then(res => {
            if (isNaN(res[SELECT_CHOICE])) {
                throw new Error('invalid choice');
            }
            return parseInt(res[SELECT_CHOICE]);
        }).catch(d => {
            count--;
            if (count >= 0) {
                return getanwer();
            }
        });
    }
    return getanwer();
}
exports.promptNew = (explan) => {
    return Promise.resolve().then(() => {
        console.log(explan || 'Would you like to add a new test');
        return new Promise((resolve, fail) => {

            prompt.start();

            prompt.get(newTest, function (err, result) {
                if (err) { return onErr(err); }
                resolve(result);
            });

            function onErr(err) {
                console.log(err);
                fail(err);
            }
        });
    }).then(res => {
        console.log(res);
        if (res.newTest) {
            switch (res.newTest) {
                case 'y':
                case 'yes':
                case '1':
                    return true;
                default:
                    return false;
            }
        }
    });
}