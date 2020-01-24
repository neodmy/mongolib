const createInstance = require('./instance');

const createHost = ({ host }) => {
    const aliases = [];
    const instances = new Map();

    const addAlias = (alias) => { aliases.push(alias); };
    const removeAlias = (alias) => { aliases.splice(aliases.findIndex((al) => al === alias), 1); };
    const addInstance = async (port) => {
        if (!Number(port)) throw Error('port is not a number');
        if (instances.has(port)) throw Error(`${port}: instance already exists`);
        const ins = await createInstance({ host, port });
        instances.set(port, ins);
    };
    const removeInstance = (port) => instances.delete(port) && port;
    const getInstance = (port) => instances.get(port);

    return {
        state: { host, aliases, instances },
        addAlias,
        removeAlias,
        addInstance,
        removeInstance,
        getInstance,
    };
};

module.exports = createHost;
