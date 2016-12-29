const { fetcher } = require('./FetcherService.js');
const { executorRegExp, patternSearchLinkLessonEgghead } = require('./RegExpService.js');

function getVideoData (urlValue, isProAccount) {
    const [, isLesson] = /egghead.io\/lessons\/([^\?]*)/.exec(urlValue) || [];

    return fetcher(urlValue)
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
        fetcher(url).then((source) => {
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

    return fetcher({
        uri: `https://egghead.io/api/v1/lessons/${lesson}/next_up`,
        json: true
    })
        .then(response => {
            const { lessons } = response.list || {lessons: []};

            return lessons.map((lesson) => {

                const [url, filename] = executorRegExp(patternSearchLinkLessonEgghead, lesson.download_url);

                return {url, filename}
            })
        })
        .catch(error => console.log(error));
}


module.exports = {
    getVideoData
};
