const store = require('../store');
const { validateParams, execAsync } = require('../lib/utils');


const createCollection = ({ database, collection }) => {
    validateParams({ collection });

    const col = database.collection(collection);
    const Store = store(col);

    return {
        state: { collection },
        findAll: () => execAsync(() => Store.findAll()),
        findOneById: (id) => execAsync(() => Store.findOneById(id)),
        findOne: (query, options) => execAsync(() => Store.findOne(query, options)),
        insertOne: (doc, options) => execAsync(() => Store.insertOne(doc, options)),
        insertMany: (docs, options) => execAsync(() => Store.insertMany(docs, options)),
        deleteOneById: (id) => execAsync(() => Store.deleteOneById(id)),
        deleteOne: (filter, options) => execAsync(() => Store.deleteOne(filter, options)),
        deleteMany: (filter, options) => execAsync(() => Store.deleteMany(filter, options)),
        deleteAll: (filter, options) => execAsync(() => Store.deleteMany(filter, options)),
    };
};

module.exports = createCollection;
