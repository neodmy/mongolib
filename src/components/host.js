const createInstance = require('./instance');
const { validateParams } = require('../lib/utils');

const createHost = ({ name = 'host', address }) => {
    validateParams({ address });

    const instances = new Map();
    const hostInfo = `Host name: ${name} address: ${address}`;

    const getInstance = (port) => instances.get(port);

    const regInstance = (port) => {
        if (!Number(port)) throw Error(`${hostInfo}. Cannot convert argument '${port}' to number`);
        if (instances.has(port)) throw Error(`${hostInfo}. Instance with port ${port} already registered`);
        const ins = createInstance({ address, port });
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
            result.push({ port: key, databases: value.listRegDatabases() });
        });
        return result;
    };

    const getHostInfo = () => ({ name, address, instances: listRegInstances() });

    const shutdownHost = () => {
        instances.forEach((el) => {
            el.shutdownInstance();
        });
        instances.clear();
    };

    return {
        name,
        address,
        instances,
        getInstance,
        regInstance,
        unregInstance,
        listRegInstances,
        getHostInfo,
        shutdownHost,
    };
};

module.exports = createHost;
