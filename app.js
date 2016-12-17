const fs = require('fs');
const path = require('path');
const commander = require('commander');
const request = require('request');
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
const outputDir = path.resolve(__dirname, 'video');

workMain(commander.email, commander.password, outputDir);

function workMain (email, password, outputDir) {
    // authenticate(email, password)
    //     .then(item => {
    //         console.log('Authenticated!')
    //     })
    //     .catch(err => console.error(err));
    const isProAccount = false;
    getVideoData(commander.url, isProAccount)
        .then(videos => {
            if (!videos.length) {
                console.log('no video found!')
            }
            console.log(`Found ${videos.length} ${(videos.length) > 1 ? 'videos' : 'video'}`)

            createOutputDirectoryIfNeeded(outputDir);

            videos.map(video => {
                const labelVideo = video.filename;
                const stream = fs.createWriteStream(labelVideo);

                getStreamVideoUrl(stream, video.url)
                    .then(result => stream.close());
            });

            console.log('Done! Thank you!');
        })
}

function getStreamVideoUrl (stream, url) {
    return new Promise((resolve, reject) => {
        request(url)
            .on('error', () => {
                error(`download of '${url}' failed!`, false);
                reject()
            })
            .on('end', () => {
                resolve();
            })
            .pipe(stream);
    })
}

function createOutputDirectoryIfNeeded (outputDir) {
    try {
        const stats = fs.lstatSync(outputDir);
        if (!stats.isDirectory()) {
            console.log(`Can't create the output directory '${outputDir}' because a file with the same name exists`)
        }
    } catch (e) {
        try {
            fs.mkdirSync(outputDir)
        } catch (err) {
            console.log(`Creating the output directory '${outputDir}' failed with error '${err}'`)
        }
    }
}
