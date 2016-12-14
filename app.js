const fs = require('fs');
const commander = require('commander');
const requestPromise = require('request-promise');
const fetch = requestPromise.defaults({jar: true});
const { authenticate } = require('./services/AuthService.js');

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
    authenticate(email, password)
        .then(item => {
            console.log('Authenticated!')
        })
        .catch(err => console.error(err));

    getVideoData(commander.url)
        .then(item => item)
}

function getCountVideoInPlaylist (source, listURLs) {
    const regexp = /<h4 class="title"><a href="(https:\/\/egghead.io\/lessons\/.+?)">/g;
    let match = null;

    while ((match = regexp.exec(source))) {
        listURLs.push(match[1])
    }
    console.log(`Found ${listURLs.length} ${(listURLs.length) > 1 ? 'lessons' : 'lesson'}`);

    return listURLs;
}

function downloadLesson () {
    //TODO add downloader for 1 lesson
}

function downloadPlaylist (source, lessonURLs) {
    getCountVideoInPlaylist(source, lessonURLs);
    //TODO add download full playlist
}

function getVideoData (urlValue) {
        const [, isLesson] = /egghead.io\/lessons\/([^\?]*)/.exec(urlValue) || [];

        return fetch(urlValue)
            .then(source => {
                if (isLesson) {
                    downloadLesson()
                } else {
                    let lessonURLs = downloadPlaylist(source, []);
                }
        });
}


