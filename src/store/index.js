/* eslint-disable no-underscore-dangle */

const _create = require('./create');
const _read = require('./read');
const _update = require('./udpate');
const _delete = require('./delete');

const store = (collection) => ({
    ..._create(collection), ..._read(collection), ..._update(collection), ..._delete(collection),
});

module.exports = store;
