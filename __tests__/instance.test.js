const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const createInstance = require('../src/components/instance');

describe.skip('Instance tests', () => {
    let instance;
    const database = 'testdb';
    const address = 'localhost';
    const port = 27017;
    const user = '';
    const password = '';
    const instanceInfo = `Instance with port ${port}`;

    describe.skip('#instance', () => {
        it('should create instance', () => {
            expect(createInstance({ address, port }))
                .to.deep.include({ port, databases: [] });
        });
        it('should not create instance: no port', () => {
            expect(() => createInstance({ address })).to.throw('Missing arguments: port');
        });
    });

    beforeEach(() => {
        instance = createInstance({ address, port });
    });

    describe('#regDatabase', () => {
        it('should register database with default MongoClientOptions', async () => {
            const db = await instance.regDatabase(database, user, password);
            expect(db).to.deep.includes({
                name: database, user, password, collections: new Map(),
            });
            expect(instance.databases).to.deep.include.members([db]);
        });
        it('should not regist database: database already exists', async () => {
            await instance.regDatabase(database, user, password);
            expect(instance.regDatabase(database, user, password))
                .to.be.rejectedWith(`${instanceInfo}. Database with name ${database} and same user, password already registered`);
        });
    });

    describe('#getRegDatabase', () => {
        it('should get no database: no databases', () => {
            expect(instance.getRegDatabase(database, user, password)).to.be.undefined;
        });
        it('should get database', async () => {
            await instance.regDatabase(database, user, password);
            const db = instance.getRegDatabase(database, user, password);
            expect(db).to.deep.include({
                name: database, user, password, collections: new Map(),
            });
        });
    });

    describe('#unregDatabase', () => {
        it('should unregist database', async () => {
            await instance.regDatabase(database, user, password);
            expect(instance.databases).to.have.property('length').equal(1);
            expect(instance.unregDatabase(database, user, password)).to.be.true;
            expect(instance.databases).to.have.property('length').equal(0);
        });
        it('should not unregist database: no databases', () => {
            expect(instance.unregDatabase(database, user, password)).to.be.false;
        });
    });

    describe('#listRegDatabases', () => {
        it('should list 2 databases', async () => {
            await instance.regDatabase(database);
            await instance.regDatabase(`${database}2`);
            expect(instance.listRegDatabases()).to.be.an('Array').with.property('length').equal(2);
            expect(instance.listRegDatabases()).to.deep.include.members([
                {
                    name: database, user, password, collections: [],
                },
                {
                    name: `${database}2`, user, password, collections: [],
                }]);
        });
        it('should list 0 databases', () => {
            expect(instance.listRegDatabases()).to.be.an('Array').with.property('length').eq(0);
        });
    });

    describe('#shutdownInstance', () => {
        it('should shutdown instance with 2 databases', async () => {
            await instance.regDatabase(database);
            await instance.regDatabase(`${database}2`);
            instance.shutdownInstance();
            expect(instance.databases).to.be.an('array').with.property('length').equal(0);
        });
        it('should shutdown instance with no databases', async () => {
            instance.shutdownInstance();
            expect(instance.databases).to.be.an('array').with.property('length').equal(0);
        });
    });
});
