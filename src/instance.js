const { MongoClient } = require('mongodb');

const createDatabase = require('./database');

const createInstance = async ({ host, port }) => {
    const mongoUrl = `mongodb://${host}:${port}`;
    const databases = new Map();
    const mongoClient = await MongoClient.connect(
        mongoUrl,
        { useNewUrlParser: true, useUnifiedTopology: true },
    );

    const addDatabase = (database) => {
        if (databases.has(database)) throw Error(`${database}: database already exists`);
        databases.set(database, createDatabase({ mongoClient, database }));
    };


    return {
        state: { host, port, mongoUrl },
        addDatabase,
    };
};

module.exports = createInstance;
