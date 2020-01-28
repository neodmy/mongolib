const createHost = require('./components/host');

module.exports = () => {
    const initInstance = async (
        { name, address },
        {
            port, user, password, MongoClientOptions,
        }) => {
        const instance = await createHost({ name, address }).regInstance({
            port, user, password, MongoClientOptions,
        });
        return instance;
    };

    const initDatabase = async (
        { name, address },
        {
            port, user, password, MongoClientOptions,
        },
        database) => {
        const instance = await initInstance({ name, address }, {
            port, user, password, MongoClientOptions,
        });
        return instance.regDatabase(database);
    };

    const initCollection = async (
        { name, address },
        {
            port, user, password, MongoClientOptions,
        },
        database,
        collection) => {
        const db = await initDatabase({ name, address }, {
            port, user, password, MongoClientOptions,
        }, database);
        return db.regCollection(collection);
    };


    return {
        initHost: createHost,
        initInstance,
        initDatabase,
        initCollection,
    };
};
