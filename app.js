const fs = require('fs')
const commander = require('commander');
const requestPromise = require('request-promise');
const fetch = requestPromise.defaults({jar: true});

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
    authenticate(commander.email, commander.password)
        .then(item => {
            console.log('Authenticated!')
        })
        .catch(err => console.error(err))
}


function getToken () {
    return fetch(SIGN_IN_URL)
            .then(body => {
                const pattern = /<meta name="csrf-token" content="(.*)" \/>/;
                const [, CSRFToken] = pattern.exec(body) || [];

                return CSRFToken;
    });
}

function authenticate (email, password) {
    return getToken()
            .then(token => {
                return {
                    method: 'POST',
                    uri: SIGN_IN_URL,
                    form: {
                        'user[email]': email,
                        'user[password]': password,
                        'authenticity_token': token
                    },
                    simple: false,
                    resolveWithFullResponse: true
                };
            })
            .then(options => fetch(options))
            .then(response => {
                if (response.statusCode !== 302) {
                    throw Error('Failed to authenticate.');
                }
            });
}
