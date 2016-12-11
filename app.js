const fs = require('fs')
const fetch = require('node-fetch');
const commander = require('commander');
const SIGN_IN_URL = 'https://egghead.io/users/sign_in';
// commander
//     .version('0.0.1')
//     .option('-e, --email <email>', 'Account email your video system(egghead, youtube, etc...)')
//     .option('-p, --password [password]', 'Account password')
//     .option('-c, --count', 'Add the count number of the video to the filename')
//     .parse(process.argv);
//
// if (process.argv.slice(2).length < 2) {
//     commander.outputHelp();
//     process.exit();
// }

getToken();


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

function getToken () {
    fetch(SIGN_IN_URL)
        .then(body => {
                const pattern = /<meta name="csrf-token" content="(.*)" \/>/;
                const [, CSRFToken] = pattern.exec(body) || [];

                console.log(CSRFToken);
                return CSRFToken;
    });

}
