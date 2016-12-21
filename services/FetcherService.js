const requestPromise = require('request-promise');
const fetch = requestPromise.defaults({jar: true});

const fetcher = (options) => {
    return fetch(options);
};

module.exports = {
    fetcher
};
