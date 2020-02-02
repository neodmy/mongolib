/* eslint-disable no-undef */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { MongoClient } = require('mongodb');

chai.use(chaiAsPromised);
const { expect } = chai;

const createCollection = require('../src/components/collection');

describe('Collections tests', () => {
    const database = 'testdb';
    const collection = 'testCollection';
    const address = 'localhost';
    const port = 27017;
    const authCredentials = '';
    let clientDb;
    let collectionDb;
    const doc = { name: 'test' };
    const docs = [{ name: 'test1' }, { name: 'test2' }];

    const initDb = async () => {
        clientDb = await MongoClient.connect(
            `mongodb://${authCredentials}${address}:${port}`,
            { useNewUrlParser: true, useUnifiedTopology: true },
        );
        return clientDb.db(database);
    };

    describe.skip('#createCollection', () => {
        it('should not create collection: no collection arg', async () => {
            const db = await initDb();
            expect(() => createCollection({ database: db })).to.throw('Missing arguments: collection');
        });
        it('should create collection', async () => {
            const db = await initDb();
            expect(createCollection({ database: db, collection })).to.deep.include({ collection });
        });
    });

    beforeEach(async () => {
        const db = await initDb();
        collectionDb = createCollection({ database: db, collection });
    });
    afterEach(async () => {
        await collectionDb.deleteAll();
        await clientDb.close();
    });

    describe('#insertOne', () => {
        it('#should insert valid document', async () => {
            const result = await collectionDb.insertOne(doc);
            expect(result).to.be.deep.equals(doc);
            expect(result).to.have.property('_id');
            expect(result).to.have.property('name');
        });
    });

    describe('#insertMany', () => {
        it('#should insert 2 valid documents', async () => {
            const result = await collectionDb.insertMany(docs);
            expect(result).to.be.eqls(docs);
            expect(result[0]).to.have.property('_id');
            expect(result[0]).to.have.property('name');
            expect(result[1]).to.have.property('_id');
            expect(result[1]).to.have.property('name');
        });
    });

    describe('#deleteAll', () => {
        it('#should delete 2 documents', async () => {
            await collectionDb.insertMany(docs);
            const result = await collectionDb.deleteAll();
            expect(result).to.be.equal(2);
        });
        it('#should delete 0 documents: no documents', async () => {
            const result = await collectionDb.deleteAll();
            expect(result).to.be.equal(0);
        });
    });

    describe('#deleteOneById', () => {
        it('#should delete 1 valid document', async () => {
            const { _id } = await collectionDb.insertOne(doc);
            const result = await collectionDb.deleteOneById(_id);
            expect(result).to.be.equal(1);
        });
        it('#should delete 0 documents: wrong id', async () => {
            const { _id } = await collectionDb.insertOne(doc);
            await collectionDb.deleteAll();
            const result = await collectionDb.deleteOneById(_id);
            expect(result).to.be.equal(0);
        });
    });

    describe('#deleteOne', () => {
        it('#should delete 1 valid document', async () => {
            const docsInsert = await collectionDb.insertMany(docs);
            const result = await collectionDb.deleteOne({ name: docsInsert[0].name });
            expect(result).to.be.equal(1);
        });
        it('#should delete 1 valid document out of 2 with same property', async () => {
            await collectionDb.insertMany([{ name: 'test1' }, { name: 'test1' }]);
            const result = await collectionDb.deleteOne({ name: 'test1' });
            expect(result).to.be.equal(1);
        });
        it('#should delete 0 documents: bad property', async () => {
            await collectionDb.insertMany(docs);
            const result = await collectionDb.deleteOne({ name: 'test2324' });
            expect(result).to.be.equal(0);
        });
    });

    describe('#deleteMany', () => {
        it('#should delete 2 valid document with same property', async () => {
            await collectionDb.insertMany([{ name: 'test1' }, { name: 'test1' }]);
            const result = await collectionDb.deleteMany({ name: 'test1' });
            expect(result).to.be.equal(2);
        });
        it('#should delete 0 documents: bad property', async () => {
            await collectionDb.insertMany([{ name: 'test1' }, { name: 'test1' }]);
            const result = await collectionDb.deleteMany({ name: 'test2324' });
            expect(result).to.be.equal(0);
        });
    });

    describe('#findAll', () => {
        it('#should find 2 documents', async () => {
            await collectionDb.insertMany(docs);
            const result = await collectionDb.findAll();
            expect(result).to.be.an('Array').with.property('length').equal(2);
            expect(result[0]).to.have.property('name').equal('test1');
            expect(result[1]).to.have.property('name').equal('test2');
        });
        it('#should find 0 documents: no documents', async () => {
            const result = await collectionDb.findAll();
            expect(result).eqls([]);
        });
    });

    describe('#findOneById', () => {
        it('#should find 1 document', async () => {
            const { _id } = await collectionDb.insertOne(doc);
            const result = await collectionDb.findOneById(_id);
            expect(result).to.have.property('_id').eqls(_id);
            expect(result).to.have.property('name').equal(doc.name);
        });
        it('#should find 0 documents: bad id', async () => {
            const { _id } = await collectionDb.insertOne(doc);
            await collectionDb.deleteAll();
            const result = await collectionDb.findOneById(_id);
            expect(result).to.be.null;
        });
    });

    describe('#updateOneById', () => {
        it('#should update 1 document by adding property', async () => {
            const { _id } = await collectionDb.insertOne(doc);
            const result = await collectionDb.updateOneById(_id, { task: 'test' });
            expect(result).to.have.property('task').equal('test');
        });
        it('#should update 1 document by replacing property value', async () => {
            const { _id } = await collectionDb.insertOne(doc);
            let result = await collectionDb.updateOneById(_id, { task: 'test' });
            result = await collectionDb.updateOneById(_id, { task: 'test1' });
            expect(result).to.have.property('task').equal('test1');
        });
        it('#should not update document: same property value', async () => {
            const { _id } = await collectionDb.insertOne(doc);
            let result = await collectionDb.updateOneById(_id, { task: 'test' });
            result = await collectionDb.updateOneById(_id, { task: 'test' });
            expect(result).to.have.property('task').equal('test');
        });
        it('#should not update document: bad id', async () => {
            const { _id } = await collectionDb.insertOne(doc);
            await collectionDb.deleteAll();
            const result = await collectionDb.updateOneById(_id, { task: 'test' });
            expect(result).to.be.null;
        });
    });

    describe('#updateOne', () => {
        it('#should update 1 document with no previous property', async () => {
            const { _id } = await collectionDb.insertOne(doc);
            // let result = await collectionDb.updateOneById(_id, { task: 'test' });
            result = await collectionDb.updateOne({ _id }, { $set: { task: 'test2' } });
            console.log(result);
        });
    });
});
