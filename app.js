const fs = require('fs');
const path = require('path');
const commander = require('commander');
const request = require('request');
const requestPromise = require('request-promise');
const fetch = requestPromise.defaults({jar: true});
const { authenticate } = require('./services/AuthService.js');
const { getVideoData } = require('./services/VideoURLService.js');
const { saveVideosToPath } = require('./services/StreamService.js');

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
const isProAccount = false;
const outputDir = path.resolve(__dirname, 'video');

workMain(commander.email, commander.password, outputDir, isProAccount);

function workMain (email, password, outputDir, isProAccount) {
    authenticate(email, password)
        .then(item => {
            console.log('Authenticated!')
        })
        .then(item => {
            getVideoData(commander.url, isProAccount)
                .then(videos => {
                    saveVideosToPath(videos, outputDir);
                })
                .then(result => console.log('Done! Thank you!'))
        })
        .catch(err => console.error(err));

}

