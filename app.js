const fs = require('fs')
const fetch = require('node-fetch');
const commander = require('commander');

commander
    .version('0.0.1')
    .option('-e, --email <email>', 'Account email your video system(egghead, youtube, etc...)')
    .option('-p, --password [password]', 'Account password')
    .option('-c, --count', 'Add the count number of the video to the filename')
    .parse(process.argv);

if (process.argv.slice(2).length < 2) {
    commander.outputHelp();
    process.exit();
}

downloadVideo();


function downloadVideo () {
    if (program.email) {
        authenticate(program.email, program.password)
            .then(res => {
                console.log('Authenticated!')
            })
            .catch(err => error(err))
    }
}

function authenticate (email, password) {
    new Promise(resolve(), reject()); //not correct(fix this)
}
