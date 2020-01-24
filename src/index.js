const createHost = require('./host');

const start = async () => {
    const host = createHost({ host: 'localhost' });
    await host.addInstance('invalid');
};

start().catch((err) => console.log(err));
