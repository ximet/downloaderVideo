const fs = require('fs');
const commander = require('commander');
const requestPromise = require('request-promise');
const fetch = requestPromise.defaults({jar: true});
const { authenticate } = require('./services/AuthService.js');
const { getVideoData } = require('./services/VideoURLService.js');

commander
    .version('0.0.1')
    .option('-e, --email <email>', 'Account email your video system(egghead, youtube, etc...)')
    .option('-p, --password [password]', 'Account password')
    .option('-c, --count', 'Add the count number of the video to the filename')
    .option('-u, --url [url]', 'Link video for donwload')
    .parse(process.argv);

if (process.argv.slice(2).length < 2) {
    commander.outputHelp();
    process.exit();
}

downloadVideo(commander.email, commander.password);

function downloadVideo (email, password) {
    // authenticate(email, password)
    //     .then(item => {
    //         console.log('Authenticated!')
    //     })
    //     .catch(err => console.error(err));
    const isProAccount = false;
    getVideoData(commander.url, isProAccount)
        .then(videos => {
            console.log(videos)
        })
}
