const requestPromise = require('request-promise');
const fetch = requestPromise.defaults({jar: true});

const SIGN_IN_URL = 'https://egghead.io/users/sign_in';

const getToken = () => {
    return fetch(SIGN_IN_URL)
        .then(body => {
            const pattern = /<meta name="csrf-token" content="(.*)" \/>/;
            const [, CSRFToken] = pattern.exec(body) || [];

            return CSRFToken;
        });
};

const authenticate = (email, password) => {
    return getToken()
        .then(token => {
            return {
                method: 'POST',
                uri: SIGN_IN_URL,
                form: {
                    'user[email]': email,
                    'user[password]': password,
                    'authenticity_token': token
                },
                simple: false,
                resolveWithFullResponse: true
            };
        })
        .then(options => fetch(options))
        .then(response => {
            if (response.statusCode !== 302) {
                throw Error('Failed to authenticate.');
            }
        });
};


module.exports = {
    authenticate
};
