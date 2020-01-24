const createInstance = ({ host, port }) => {
    const mongoUrl = `mongodb://${host}:${port}`;

    return {
        state: { port, mongoUrl },
    };
};

module.exports = createInstance;
