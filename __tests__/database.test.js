const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { MongoClient } = require('mongodb');

chai.use(chaiAsPromised);
const { expect } = chai;

const createDatabase = require('../src/database');

describe('Database tests', () => {
    describe('#listDatabaseCollections', () => {
        it('should list database collections', async () => {
            const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
            const database = createDatabase({ mongoClient: client, database: 'local' });
            expect(database.listDatabaseCollections()).to.eventually.be.an('array');
        });
    });
});
