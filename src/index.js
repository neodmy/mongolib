const createHost = require('./components/host');

const start = async () => {

};

start()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
