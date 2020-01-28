const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { MongoClient } = require('mongodb');

chai.use(chaiAsPromised);
const { expect } = chai;

const createDatabase = require('../src/components/database');

describe.skip('Database tests', () => {
    describe('#listRegCollections', () => {
        it('should list registered collections', async () => {
            const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
            const database = createDatabase({ mongoClient: client, database: 'testdb' });
            database.regCollection('testCollection');
            database.regCollection('testCollection2');
            expect(database.listRegCollections()).to.have.members(['testCollection', 'testCollection2']);
        });
    });
    describe('#listDatabaseCollections', () => {
        it('should list database collections at host', async () => {
            const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
            const database = createDatabase({ mongoClient: client, database: 'testdb' });
            const collections = await database.listDatabaseCollections();
            expect(collections[0]).to.deep.include({ name: 'testCollection', type: 'collection' });
        });
    });
});
