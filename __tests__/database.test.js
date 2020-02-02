/* eslint-disable no-undef */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const createDatabase = require('../src/components/database');

describe.skip('Database tests', () => {
    const address = 'localhost';
    const port = 27017;
    const database = 'testdb';
    const user = '';
    const password = '';
    const databaseInfo = `Database ${database}`;
    const coll = 'testCollection';
    let db;

    describe.skip('#database', () => {
        it('should not create database: no address, port and database', async () => {
            expect(createDatabase({}, {})).to.be.rejectedWith('Missing arguments: address port database');
        });
        it('should create database', () => {
            expect(createDatabase({ address, port }, { database })).to.eventually.deep.include({
                name: database, user, password, collections: new Map(),
            });
        });
    });
    beforeEach(async () => {
        db = await createDatabase({ address, port }, { database });
    });

    describe('#regCollection', () => {
        it('should regist collection', () => {
            const collection = db.regCollection(coll);
            expect(collection).to.deep.include({ collection: coll });
            expect(db.collections).to.be.a('Map').with.property('size').equal(1);
            expect(db.collections.get(coll)).to.deep.include({ collection: coll });
        });
        it('should not regist collection: collection already exists', () => {
            db.regCollection(coll);
            expect(() => db.regCollection(coll)).to.throw(`${databaseInfo}. Collection ${coll} already registered`);
        });
    });

    describe('#getCollection', () => {
        it('should get one collection', () => {
            db.regCollection(coll);
            const collection = db.collections.get(coll);
            expect(db.getCollection(coll)).to.be.eqls(collection);
        });
        it('should not get collection: no collections', () => {
            expect(db.getCollection(coll)).to.be.undefined;
        });
    });

    describe('#unregCollection', () => {
        it('should unregist collection', () => {
            db.regCollection(coll);
            expect(db.collections).to.be.a('Map').with.property('size').equal(1);
            expect(db.unregCollection(coll)).to.be.true;
            expect(db.collections).to.be.a('Map').with.property('size').equal(0);
        });
        it('should not unregist collection: no collections', () => {
            expect(db.collections).to.be.a('Map').with.property('size').equal(0);
            expect(db.unregCollection(coll)).to.be.false;
        });
    });

    describe('#listRegCollections', () => {
        it('should not list collections: no collections', () => {
            expect(db.listRegCollections()).to.deep.equals([]);
        });
        it('should list registered collections', async () => {
            db.regCollection(coll);
            db.regCollection('testCollection2');
            expect(db.listRegCollections()).to.have.members(['testCollection', 'testCollection2']);
        });
    });

    describe('#listDatabaseCollections', () => {
        it('should list database collections at host', async () => {
            const collections = await db.listDatabaseCollections();
            expect(collections[0]).to.deep.include({ name: 'testCollection', type: 'collection' });
        });
    });

    describe('#shutdownDatabase', () => {
        it('should shutdownDatabase', async () => {
            db.regCollection(coll);
            const result = await db.shutdownDatabase();
            expect(result).to.be.true;
            expect(db.collections).to.be.a('Map').with.property('size').equal(0);
            expect(() => db.listDatabaseCollections()).to.throw;
        });
    });
});
