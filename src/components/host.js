const createInstance = require('./instance');
const { validateParams } = require('../lib/utils');

const createHost = ({ name = 'host', address }) => {
    validateParams({ address });

    const instances = new Map();
    const hostInfo = `Host name: ${name} address: ${address}`;

    const getInstance = (port) => instances.get(port);

    const regInstance = async ({
        port, user, password, MongoClientOptions,
    }) => {
        if (port && !Number(port)) throw Error(`${hostInfo}. Cannot convert port: ${port} to number`);
        if (instances.has(port)) throw Error(`${hostInfo}. Instance with port ${port} already registered`);
        const ins = await createInstance(address, {
            port, user, password, MongoClientOptions,
        });
        instances.set(port, ins);
        return ins;
    };

    const unregInstance = (port) => {
        const instance = instances.get(port);
        if (instance) {
            instance.shutdownInstance();
            instances.delete(port);
            return true;
        }
        return !!instance;
    };

    const listRegInstances = () => {
        const result = [];
        instances.forEach((value, key) => {
            result.push({ name: key, databases: value.listRegDatabases() });
        });
        return { instances: result };
    };

    return {
        state: {
            name, address, instances,
        },
        getInstance,
        regInstance,
        unregInstance,
        listRegInstances,
    };
};

module.exports = createHost;
