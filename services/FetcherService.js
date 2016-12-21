const requestPromise = require('request-promise');
const fetch = requestPromise.defaults({jar: true});
const request = require('request');

const fetcher = (options) => {
    return fetch(options);
};

const streamFetcher = (options, stream, resolve, reject) => {
    return request(options)
        .on('error', () => {
            error(`download of '${options}' failed!`, false);
            reject()
        })
        .on('end', () => {
            resolve();
        })
        .pipe(stream);
};

module.exports = {
    fetcher, streamFetcher
};
