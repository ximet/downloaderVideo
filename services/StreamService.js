const fs = require('fs');
const path = require('path');
const { streamFetcher } = require('./FetcherService.js');

function saveVideosToPath (videos, outputDir) {
    if (!videos.length) {
        console.log('no video found!')
    }
    createOutputDirectoryIfNeeded(outputDir);

    videos.map((video, index) => {
        const labelVideo = `${index + 1}) ${video.filename}`;
        const pathToVideo = path.join(outputDir, labelVideo);
        const stream = fs.createWriteStream(pathToVideo);

        getStreamVideoUrl(stream, video.url)
            .then(result => stream.close());
    });
}

function getStreamVideoUrl (stream, url) {
    return new Promise((resolve, reject) => {
        streamFetcher(url, stream, resolve, reject);
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

module.exports = {
    saveVideosToPath
};
