const createCollection = require('./collection');

const createDatabase = ({ mongoClient, database }) => {
    const db = mongoClient.db(database);
    const collections = new Map();


    return {
        status: { database, collections },
    };
};

module.exports = createDatabase;
