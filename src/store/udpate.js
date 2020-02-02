const { ObjectId } = require('mongodb');

const Update = (collection) => {
    const updateOneById = async (id, doc) => {
        const { value } = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: doc },
            { returnOriginal: false },
        );
        return value;
    };

    const findOneAndUpdate = async (filter, update, options = { returnOriginal: false }) => {
        const { value } = await collection.findOneAndUpdate(
            filter,
            update,
            options,
        );
        return value;
    };

    const updateOne = async (filter, update, options = { returnOriginal: false }) => {
        const { result: { nModified } } = await collection.updateOne(filter, update, options);
        return nModified;
    };

    const updateMany = async (filter, update, options = { returnOriginal: false }) => {
        const { result: { nModified } } = await collection.updateMany(filter, update, options);
        return nModified;
    };

    return {
        updateOneById,
        findOneAndUpdate,
        updateOne,
        updateMany,
    };
};

module.exports = Update;
