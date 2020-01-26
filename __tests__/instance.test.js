const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const createInstance = require('../src/instance');
const createDatabase = require('../src/database');

describe.skip('Instance tests', () => {
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
        instance = await createInstance({ host: 'localhost', port: 27017 });
    });

    describe('#regDatabase', () => {
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

    describe('#getRegDatabase', () => {
        it('should get no database: no databases', () => {
            expect(instance.getRegDatabase('test')).to.be.undefined;
        });
        it('should get database', () => {
            instance.regDatabase('test');
            const db = createDatabase({ mongoClient: instance.state.mongoClient, database: 'test' });
            expect(instance.getRegDatabase('test')).eqls(db);
        });
    });

    describe('#unregDatabase', () => {
        it('should unregist database', () => {
            instance.regDatabase(databaseName);
            expect(instance.unregDatabase(databaseName)).to.be.equal(databaseName);
            expect(instance.state).to.have.property('databases').to.be.a('Map').with.property('size').equal(0);
        });
        it('should not unregist database: no databases', () => {
            expect(instance.unregDatabase(databaseName)).to.be.false;
        });
    });

    describe('#listRegDatabases', () => {
        it('should list 2 databases', () => {
            instance.regDatabase(databaseName);
            instance.regDatabase(`${databaseName}2`);
            expect(instance.listRegDatabases()).to.be.an('Array').with.property('length').equal(2);
            expect(instance.listRegDatabases()).to.include.members([databaseName, `${databaseName}2`]);
        });
        it('should list 0 databases', () => {
            expect(instance.listRegDatabases()).with.property('length').eq(0);
        });
    });

    describe('#listInstanceDatabases', () => {
        it('should list databases', async () => {
            const databases = await instance.listInstanceDatabases();
            expect(databases).to.be.an('array');
        });
    });
});
