const { MongoClient } = require('mongodb');

const createDatabase = require('./database');
const { validateParams } = require('../lib/utils');

const createInstance = async (
    address,
    {
        port,
        user = '',
        password = '',
        MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true },
    }) => {
    validateParams({ port });

    const instanceInfo = `Instance with port ${port}`;
    const authCredentials = user && password ? `${user}:${password}@` : '';
    const mongoUrl = `mongodb://${authCredentials}${address}:${port}`;
    const databases = new Map();
    const mongoClient = await MongoClient.connect(
        mongoUrl,
        MongoClientOptions,
    );

    const getRegDatabase = (database) => databases.get(database);

    const regDatabase = (database) => {
        if (databases.has(database)) throw Error(`${instanceInfo}. Database ${database} database already registered`);
        const db = createDatabase({ mongoClient, database });
        databases.set(database, db);
        return db;
    };

    const unregDatabase = (database) => databases.delete(database) && database;

    const listRegDatabases = () => {
        const result = [];
        databases.forEach((value, key) => {
            result.push({ name: key, collections: value.listRegCollections() });
        });
        return result;
    };

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
            port, user, password, databases,
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
