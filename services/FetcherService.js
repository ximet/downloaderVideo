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

const fetcher = (options) => {
    return new Promise((resolve, reject) => {
        const customOptions = parseOptions(options);

        let XHR = new window.XMLHttpRequest();

        XHR.open(customOptions.method, customOptions.url, true);
        XHR = getContentType(customOptions, XHR);
        XHR.timeout = REQUEST_AND_CONNECT_TIMEOUT;

        XHR.onreadystatechange = function () {
            const XHR_READY_STATE_DONE = 4;

            if (XHR.readyState === XHR_READY_STATE_DONE) {
                resolve({ target: { status: XHR.status, data: options.json ? JSON.parse(XHR.response) : XHR.response }});
            }
        };

        XHR.onload = resolve;
        XHR.loadend = resolve;

        XHR.onerror = reject;
        XHR.onabort = reject;
        XHR.ontimeout = reject;

        customOptions.method === 'GET' ? XHR.send() : XHR.send(new FormData(customOptions.form));
    });
};

const getContentType = (options, xhr) => {
    const boundary = String(Math.random()).slice(2);

    if(options.method === 'GET') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    else if(options.json) {
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    }
    else {
        xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    }

    return xhr;
};

const parseOptions = (options) => {
    let currentOptions = {};

    if (typeof options !== "string") {
        currentOptions.url = options.url;
        currentOptions.method = options.method;
        currentOptions.json = options.json;
    }
    else {
        currentOptions.url = options;
        currentOptions.method = 'GET'
    }

    return currentOptions;
};

module.exports = {
    fetcher, streamFetcher
};

