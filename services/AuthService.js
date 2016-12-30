const { fetcher } = require('./FetcherService.js');
const { executorRegExp, patternGetAuthTokenEgghead} = require('./RegExpService.js');

const SIGN_IN_URL = 'https://egghead.io/users/sign_in';

const getToken = () => {
    return fetcher(SIGN_IN_URL)
        .then(body => {
            const [, CSRFToken] = executorRegExp(patternGetAuthTokenEgghead, body) || [];

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
        .then(options => fetcher(options))
        .then(response => {
            if (response.statusCode !== 302) {
                throw Error('Failed to authenticate.');
            }
        });
};


module.exports = {
    authenticate
};
