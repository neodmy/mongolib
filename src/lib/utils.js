const setOrError = (map, key, value, message) => {
    if (map.has(key)) throw Error(message);
    map.set(key, value);
};

module.exports = {
    setOrError,
};
