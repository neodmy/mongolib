const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const createInstance = require('../src/components/instance');
const createDatabase = require('../src/components/database');

describe('Instance tests', () => {
    describe.skip('#instance', () => {
        it('should create instance', () => {
            expect(createInstance({ host: 'localhost', port: 27017 }))
                .to.eventually.deep.include(
                    {
                        state:
                            { host: 'localhost', port: 27017, mongoUrl: 'mongodb://localhost:27017' },
                    },
                );
        });
    });
    let instance;
    const databaseName = 'testdb';
    beforeEach(async () => {
        instance = await createInstance('localhost', { port: 27017 });
    });

    describe.skip('#regDatabase', () => {
        it('should register database', () => {
            instance.regDatabase(databaseName);
            const db = createDatabase({ mongoClient: instance.state.mongoClient, database: databaseName });
            expect(instance.state).to.have.property('databases').to.be.a('Map').with.property('size').equal(1);
            expect(instance.state.databases.get(databaseName)).to.deep.include(db);
        });
        it('should not regist database: database already exists', () => {
            instance.regDatabase(databaseName);
            expect(() => instance.regDatabase(databaseName)).to.throw('database already exists');
        });
    });

    describe.skip('#getRegDatabase', () => {
        it('should get no database: no databases', () => {
            expect(instance.getRegDatabase('test')).to.be.undefined;
        });
        it('should get database', () => {
            instance.regDatabase('test');
            const db = createDatabase({ mongoClient: instance.state.mongoClient, database: 'test' });
            expect(instance.getRegDatabase('test')).eqls(db);
        });
    });

    describe.skip('#unregDatabase', () => {
        it('should unregist database', () => {
            instance.regDatabase(databaseName);
            expect(instance.unregDatabase(databaseName)).to.be.equal(databaseName);
            expect(instance.state).to.have.property('databases').to.be.a('Map').with.property('size').equal(0);
        });
        it('should not unregist database: no databases', () => {
            expect(instance.unregDatabase(databaseName)).to.be.false;
        });
    });

    describe.skip('#listRegDatabases', () => {
        it('should list 2 databases', () => {
            instance.regDatabase(databaseName);
            instance.regDatabase(`${databaseName}2`);
            console.log(instance.listRegDatabases());
            expect(instance.listRegDatabases()).to.be.an('Array').with.property('length').equal(2);
            expect(instance.listRegDatabases()).to.deep.include.members([
                { name: databaseName, collections: [] },
                { name: `${databaseName}2`, collections: [] }]);
        });
        it('should list 0 databases', () => {
            expect(instance.listRegDatabases()).with.property('length').eq(0);
        });
    });

    describe.skip('#listInstanceDatabases', () => {
        it('should list databases', async () => {
            const databases = await instance.listInstanceDatabases();
            expect(databases).to.be.an('array');
        });
    });
});
