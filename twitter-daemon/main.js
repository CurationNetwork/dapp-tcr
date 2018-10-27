const observer = require('./observer');
const twitter = require('./twitter');
const log = require('./log')('main');
const conf = require('./config');


observer.initContracts([{
    name: 'ranking',
    abi: JSON.parse(conf.contract.abi),
    address: conf.contract.address
}]);

let count = 0;

observer.subscribe({
    contractName: 'ranking',
    eventName: conf.contract.event,
    fromBlock: 0
}, (event) => {
    if (count < 1) {
        log.info(`Event ${JSON.stringify(event)}`);

        twitter.newTweet({status: `Moving started itemID: ${event.returnValues.itemId} movingID: ${event.returnValues.movingId}`})
            .then(r => {
                log.info(JSON.stringify(r));
            });

    }

    count++;
});


process.on('uncaughtException', (err) => {
    log.error('Unexpected error:', JSON.stringify(err));
});

process.on('unhandledRejection', (err) => {
    log.error('Unexpected error:', JSON.stringify(err));
});