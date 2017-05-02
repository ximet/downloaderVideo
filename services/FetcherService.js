// const requestPromise = require('request-promise');
// const fetch = requestPromise.defaults({jar: true});
const request = require('request');
const REQUEST_AND_CONNECT_TIMEOUT = 30000;


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

const fetcher = (url) => {
    return new Promise((resolve, reject) => {
        const XHR = new window.XMLHttpRequest();

        XHR.open('GET', url, true);

        XHR.timeout = REQUEST_AND_CONNECT_TIMEOUT;

        XHR.onreadystatechange = function () {
            const XHR_READY_STATE_DONE = 4;

            if (XHR.readyState === XHR_READY_STATE_DONE) {
                resolve({ target: { status: XHR.status, data: XHR.response }});
            }
        };

        XHR.onload = resolve;
        XHR.loadend = resolve;

        XHR.onerror = reject;
        XHR.onabort = reject;
        XHR.ontimeout = reject;

        XHR.send();
    });
};

module.exports = {
    fetcher, streamFetcher
};

