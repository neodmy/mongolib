const { MongoClient } = require('mongodb');

const createDatabase = require('./database');

const createInstance = async ({ host, port }) => {
    const mongoUrl = `mongodb://${host}:${port}`;
    const databases = new Map();
    const mongoClient = await MongoClient.connect(
        mongoUrl,
        { useNewUrlParser: true, useUnifiedTopology: true },
    );

    const getRegDatabase = (database) => databases.get(database);
    const regDatabase = (database) => {
        if (databases.has(database)) throw Error(`${database}: database already exists`);
        databases.set(database, createDatabase({ mongoClient, database }));
    };
    const unregDatabase = (database) => databases.delete(database) && database;
    const listRegDatabases = () => Array.from(databases.keys());
    const listInstanceDatabases = async () => {
        const dblist = await mongoClient.db().admin().listDatabases();
        return dblist.databases;
    };
    const shutdownInstance = () => {
        try {
            mongoClient.close();
        } catch (err) { }
    };


    return {
        state: {
            host, port, mongoUrl, databases, mongoClient,
        },
        getRegDatabase,
        regDatabase,
        unregDatabase,
        listRegDatabases,
        listInstanceDatabases,
        shutdownInstance,
    };
};

module.exports = createInstance;
