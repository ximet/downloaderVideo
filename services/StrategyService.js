const { authenticate } = require('./services/AuthService.js');
const { getVideoData } = require('./services/VideoURLService.js');
const { saveVideosToPath } = require('./services/StreamService.js');

class Strategy {
    constructor (strategy) {
        this.strategy = strategy;
    }

    run () {
        return this.strategy();
    }

}

const definitionStrategy = (email, password, url, outputDir, isProAccount) => {
    return strategyEgghead(email, password, url, outputDir, isProAccount); //ToDo need fix
};

const strategyEgghead = (email, password, url, outputDir, isProAccount) => {
    return authenticate(email, password)
        .then(() => {
            console.log('Authenticated!')
        })
        .then(() => {
            getVideoData(url, isProAccount)
                .then(videos => {
                    saveVideosToPath(videos, outputDir);
                })
                .then(result => console.log('Done! Thank you!'))
        })
        .catch(err => console.error(err));
};

module.exports = {
    Strategy, definitionStrategy
};
