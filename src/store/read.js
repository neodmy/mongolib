const { ObjectId } = require('mongodb');

const Read = (collection) => {
    const findAll = async () => collection.find().toArray();
    const findOneById = async (id) => collection.findOne({ _id: new ObjectId(id) });
    const findOne = async (query, options) => collection.findOne(query, options);

    return {
        findAll,
        findOneById,
        findOne,
    };
};


module.exports = Read;
