const createDatabase = require('./database');
const { validateParams } = require('../lib/utils');

const createInstance = ({ address, port }) => {
    validateParams({ address, port });

    const instanceInfo = `Instance with port ${port}`;

    const databases = [];

    const getRegDatabase = (database, user = '', password = '') => databases.find(
        (el) => el.name === database && el.user === user && el.password === password,
    );

    const getRegDatabaseIndex = (database, user = '', password = '') => databases.findIndex(
        (el) => el.name === database && el.user === user && el.password === password,
    );

    const regDatabase = async (database, user = '', password = '', mongoClientOptions) => {
        if (getRegDatabase(database, user, password)) { throw Error(`${instanceInfo}. Database with name ${database} and same user, password already registered`); }
        const db = await createDatabase({ address, port }, {
            database, user, password, mongoClientOptions,
        });
        databases.push({
            ...db,
        });
        return db;
    };

    const unregDatabase = (database, user = '', password = '') => {
        const dbIndex = getRegDatabaseIndex(database, user, password);
        if (dbIndex !== -1) {
            const db = databases[dbIndex];
            db.shutdownDatabase();
            databases.splice(dbIndex, 1);
            return true;
        }
        return false;
    };

    const listRegDatabases = () => databases.map((el) => ({
        name: el.name,
        user: el.user,
        password: el.password,
        collections: el.listRegCollections(),
    }));


    const shutdownInstance = () => {
        databases.forEach((el) => {
            el.shutdownDatabase();
        });
        databases.splice(0, databases.length);
    };

    return {
        port,
        databases,
        getRegDatabase,
        regDatabase,
        unregDatabase,
        listRegDatabases,
        shutdownInstance,
    };
};

module.exports = createInstance;
