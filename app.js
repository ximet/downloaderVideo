const fs = require('fs');
const commander = require('commander');
const requestPromise = require('request-promise');
const fetch = requestPromise.defaults({jar: true});
const { authenticate } = require('./services/AuthService.js');
// const { getVideoData } = require('./services/VideoURLService.js');

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

function downloadPlaylist (source, lessonURLs, isProAccount) {
    const correctLessonsURLs = getCountVideoInPlaylist(source, lessonURLs);

    if (isProAccount) {
        const firstLesson = lessonURLs[0];
        const pattern = /egghead.io\/lessons\/(.*)\?/;
        const [, lessonSlug] = pattern.exec(firstLesson) || [];
        getLessons(lessonSlug);
    }

    console.log('Fetching lesson pages');
    const promises = correctLessonsURLs.map(getLessonsObjectInPromiseFormat);

    return getVideoUrls(promises);
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
                    return downloadPlaylist(source, [], isProAccount);
                }
        });
}

function getVideoUrls(lessons) {
    return Promise.all(lessons.map(reflector))
        .then(result => {
            const videoURLs = result.filter(v => (v.state === 'resolved')).map(v => v.value);
            const failed = result.filter(v => (v.state === 'rejected'));

            if (failed.length) {
                console.log(`Failed to parse the following lesson pages: ${failed.map(v => `'${v.value}'`).join(',')}. They might be for pro subscribers only`, false)
            }

            return videoURLs;
        });
}

function getLessonsObjectInPromiseFormat (url) {
    return new Promise((resolve, reject) => {
        fetch(url).then((source) => {
            const videoData = getNameAndUrlLesson(source);
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
    const regExp = /<meta itemprop="name" content="([^"]+?)".+?<meta itemprop="contentURL" content="http[^"]+?.wistia.com\/deliveries\/(.+?)\.bin"/;
    const result = regExp.exec(source);
    if (result) {
        return {
            filename: result[1],
            url: `https://embed-ssl.wistia.com/deliveries/${result[2]}/file.mp4`
        }
    }
}

function reflector (promise) {
    return promise.then(x => ({state: 'resolved', value: x}),
        e => ({state: 'rejected', value: e}))
}
