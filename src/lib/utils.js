const setOrError = (map, key, value, message) => {
    if (map.has(key)) throw Error(message);
    map.set(key, value);
};

const validateParams = (params) => {
    let message = '';
    Object.keys(params).forEach((key) => {
        if (!params[key]) message += ` ${key}`;
    });
    if (message.length !== 0) throw Error(`Missing arguments:${message}`);
};

module.exports = {
    setOrError,
    validateParams,
};
