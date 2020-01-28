const createCollection = require('./collection');
const { validateParams } = require('../lib/utils');

const createDatabase = ({ mongoClient, database }) => {
    validateParams({ database });

    const databaseInfo = `Database ${database}`;
    const db = mongoClient.db(database);
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

    return {
        state: { database, collections },
        getCollection,
        regCollection,
        unregCollection,
        listRegCollections,
        listDatabaseCollections,
    };
};

module.exports = createDatabase;
