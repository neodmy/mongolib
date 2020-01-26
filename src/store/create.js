const Create = (collection) => {
    const insertOne = async (doc, options) => {
        const { ops } = await collection.insertOne(doc, options);
        return ops[0];
    };

    const insertMany = async (docs, options) => {
        const { ops } = await collection.insertMany(docs, options);
        return ops;
    };

    return {
        insertOne,
        insertMany,
    };
};

module.exports = Create;
