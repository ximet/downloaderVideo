const fs = require('fs')
const fetch = require('node-fetch');
const commander = require('commander');
const SIGN_IN_URL = 'https://egghead.io/users/sign_in';
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
    if (commander.email) {
        authenticate(commander.email, commander.password)
            .then(res => {
                console.log('Authenticated!')
            })
            .catch(err => console.log('Error:', err))
    }
}

function authenticate (email, password) {
    return getToken()
        .then(token => {
            return options = {
                method: 'POST',
                form: {
                    'user[email]': email,
                    'user[password]': password,
                    'authenticity_token': token
                },
                simple: false,
                resolveWithFullResponse: true
            }
        })
        .then(options => fetch(SIGN_IN_URL, options))
        .then(res => {
            console.log(res.status);
            if(res.status !== 302) {
                throw Error('Failed to authenticate.')
            }
        })
}


function getToken () {
    return fetch(SIGN_IN_URL)
        .then(res => res.text())
        .then(body => {
            const pattern = /<meta name="csrf-token" content="(.*)" \/>/;
            const [, CSRFToken] = pattern.exec(body) || [];

            return CSRFToken;
    });
}
