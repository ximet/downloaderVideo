const path = require('path');
const commander = require('commander');

const { Strategy, definitionStrategy } = require('./services/StrategyService.js');

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
const isProAccount = false;
const outputDir = path.resolve(__dirname, 'video');

workMain(commander.email, commander.password, commander.url, outputDir, isProAccount);

function workMain (email, password, url, outputDir, isProAccount) {
    const currentStrategy = definitionStrategy(email, password, url, outputDir, isProAccount);
    const objectStrategy = new Strategy(currentStrategy);

    objectStrategy.run();
}

