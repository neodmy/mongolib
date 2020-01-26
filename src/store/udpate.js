const { ObjectId } = require('mongodb');

const Update = (collection) => {
    const updateOneAddingById = async (id, doc) => {
        const { value } = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: doc },
            { returnOriginal: false },
        );
        return value;
    };

    const updateOneReplacingById = async (id, doc) => {
        const { value } = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $replaceWith: doc },
            { returnOriginal: false },
        );
        return value;
    };

    const updateOne = async (filter, update, options) => {
        const { value } = await collection.updateOne(filter, update, options);
        return value;
    };

    const updateMany = async (filter, update, options) => {
        const { value } = await collection.updateMany(filter, update, options);
        return value;
    };

    return {
        updateOneAddingById,
        updateOneReplacingById,
        updateOne,
        updateMany,
    };
};

module.exports = Update;
