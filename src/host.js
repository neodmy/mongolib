const createInstance = require('./instance');

const createHost = ({ host }) => {
    const aliases = [];
    const instances = new Map();

    const regAlias = (alias) => { aliases.push(alias); };
    const unregAlias = (alias) => { aliases.splice(aliases.findIndex((al) => al === alias), 1); };

    const getInstance = (port) => instances.get(port);
    const regInstance = async (port) => {
        if (!Number(port)) throw Error('port is not a number');
        if (instances.has(port)) throw Error(`${port}: instance already exists`);
        const ins = await createInstance({ host, port });
        instances.set(port, ins);
    };
    const unregInstance = (port) => {
        const instance = instances.get(port);
        if (instance) {
            instance.shutdownInstance();
            instances.delete(port);
            return port;
        }
        return !!instance;
    };
    const listRegInstances = () => Array.from(instances.keys());

    return {
        state: { host, aliases, instances },
        regAlias,
        unregAlias,
        getInstance,
        regInstance,
        unregInstance,
        listRegInstances,
    };
};

module.exports = createHost;
