const { ObjectId } = require('mongodb');

const Delete = (collection) => {
    const deleteAll = async () => {
        const { deletedCount } = await collection.deleteMany({});
        return deletedCount;
    };

    const deleteOneById = async (id) => {
        const { deletedCount } = await collection.deleteOne({ _id: new ObjectId(id) });
        return deletedCount;
    };

    const deleteOne = async (filter, options) => {
        const { deletedCount } = await collection.deleteOne(filter, options);
        return deletedCount;
    };

    const deleteMany = async (filter, options) => {
        const { deletedCount } = await collection.deleteMany(filter, options);
        return deletedCount;
    };

    return {
        deleteAll,
        deleteOneById,
        deleteOne,
        deleteMany,
    };
};

module.exports = Delete;
