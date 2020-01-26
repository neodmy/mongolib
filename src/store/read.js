const { ObjectId } = require('mongodb');

const Read = (collection) => {
    const findAll = () => collection.find().toArray();
    const findOneById = (id) => collection.findOne({ _id: new ObjectId(id) });
    const findOne = (query, options) => collection.findOne(query, options);

    return {
        findAll,
        findOneById,
        findOne,
    };
};


module.exports = Read;
