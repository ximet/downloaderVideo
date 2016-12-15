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
    // authenticate(email, password)
    //     .then(item => {
    //         console.log('Authenticated!')
    //     })
    //     .catch(err => console.error(err));
    const isProAccount = false;
    getVideoData(commander.url, isProAccount)
        .then(item => item)
}

function getCountVideoInPlaylist (source, listURLs) {
    const regexp = /<h4 class="title"><a href="(https:\/\/egghead.io\/lessons\/.+?)">/g;
    let match;

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
    return getCountVideoInPlaylist(source, lessonURLs);
    //TODO add download full playlist
}

function getLessons (lesson) {

    return fetch({
            uri: `https://egghead.io/api/v1/lessons/${lesson}/next_up`,
            json: true
           })
            .then(response => {
                const { lessons } = response.list || {lessons: []};

                return lessons.map((lesson) => {
                    console.log(lesson.download_url);
                    const pattern = /https:\/\/.*\/lessons\/.*\/(.*)\?.*/;
                    const [url, filename] = pattern.exec(lesson.download_url);

                    console.log({url, filename});
                    return {url, filename}
                })
            })
        .catch(error => console.log(error));
}

function getVideoData (urlValue, isProAccount) {
        const [, isLesson] = /egghead.io\/lessons\/([^\?]*)/.exec(urlValue) || [];

        return fetch(urlValue)
            .then(source => {
                if (isLesson) {
                    downloadLesson()
                } else {
                    let lessonURLs = downloadPlaylist(source, []);

                    if (isProAccount) {
                        const firstLesson = lessonURLs[0];
                        const pattern = /egghead.io\/lessons\/(.*)\?/;
                        const [, lessonSlug] = pattern.exec(firstLesson) || [];
                        getLessons(lessonSlug);
                    }

                    console.log('Fetching lesson pages');
                    const promises = lessonURLs.map(getLessonsObjectInPromiseFormat);
                }
        });
}

function getLessonsObjectInPromiseFormat (url) {
    return new Promise((resolve, reject) => {
        fetch(url).then((source) => {
            const videoData = getNameAndUrlLesson(source);
            console.log(videoData);
            if (videoData) {
                resolve(videoData)
            } else {
                reject(url)
            }
        }, () => {
            reject(url)
        })
    })
}

function getNameAndUrlLesson (source) {
    const re = /<meta itemprop="name" content="([^"]+?)".+?<meta itemprop="contentURL" content="http[^"]+?.wistia.com\/deliveries\/(.+?)\.bin"/
    const result = re.exec(source)
    if (result) {
        return {
            filename: result[1],
            url: `https://embed-ssl.wistia.com/deliveries/${result[2]}/file.mp4`
        }
    }
}


