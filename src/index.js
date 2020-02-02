const createHost = require('./components/host');

module.exports = () => {
    const initInstance = (
        { name, address },
        { port },
    ) => createHost({ name, address }).regInstance(port);

    const initDatabase = async (
        { name, address },
        { port },
        {
            database, user, password, mongoClientOptions,
        },
    ) => {
        const instance = initInstance({ name, address }, { port });
        return instance.regDatabase(database, user, password, mongoClientOptions);
    };

    const initCollection = async (
        { name, address },
        { port },
        {
            database, user, password, mongoClientOptions,
        },
        { collection }) => {
        const db = await initDatabase({ name, address }, { port }, {
            database, user, password, mongoClientOptions,
        });
        return db.regCollection(collection);
    };


    return {
        initHost: createHost,
        initInstance,
        initDatabase,
        initCollection,
    };
};
