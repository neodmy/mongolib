const store = require('../store');
const { validateParams } = require('../lib/utils');


const createCollection = ({ database, collection }) => {
    validateParams({ collection });

    const col = database.collection(collection);
    const Store = store(col);

    return {
        state: { collection },
        ...Store,
    };
};

module.exports = createCollection;
