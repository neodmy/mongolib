const { MongoClient } = require('mongodb');

const createCollection = require('./collection');
const { validateParams } = require('../lib/utils');

const createDatabase = async (
    { address, port },
    {
        database, user = '', password = '', mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true },
    }) => {
    validateParams({ address, port, database });

    const authCredentials = user && password ? `${user}:${password}@` : '';
    const mongoUrl = `mongodb://${authCredentials}${address}:${port}`;
    const mongoClient = await MongoClient.connect(
        mongoUrl,
        mongoClientOptions,
    );
    const db = mongoClient.db(database);
    const databaseInfo = `Database ${database}`;
    const collections = new Map();

    const getCollection = (collection) => collections.get(collection);

    const regCollection = (collection) => {
        if (collections.has(collection)) throw Error(`${databaseInfo}. Collection ${collection} already registered`);
        const col = createCollection({ database: db, collection });
        collections.set(collection, col);
        return col;
    };

    const unregCollection = (collection) => collections.delete(collection) && collection;

    const listRegCollections = () => Array.from(collections.values())
        .map((collection) => ({ name: collection.state.collection }));

    const listDatabaseCollections = async () => {
        const colls = await db.listCollections().toArray();
        return colls;
    };

    const listInstanceDatabases = async () => {
        const dblist = await mongoClient.db().admin().listDatabases();
        return dblist.databases;
    };

    const shutdownDatabase = () => {
        mongoClient.close().then().catch();
    };

    return {
        name: database,
        user,
        password,
        collections,
        getCollection,
        regCollection,
        unregCollection,
        listRegCollections,
        listDatabaseCollections,
        listInstanceDatabases,
        shutdownDatabase,
    };
};

module.exports = createDatabase;
