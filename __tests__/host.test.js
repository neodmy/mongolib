const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const host = require('../src/host');
const instance = require('../src/instance');

describe('Host tests', () => {
    describe('#host', () => {
        it('should create host', () => {
            const ins = host({ host: 'localhost' });
            expect(ins.state).to.have.property('host').equal('localhost');
        });
    });

    let hostTest;
    beforeEach(() => { hostTest = host({ host: 'localhost' }); });

    describe('#addAlias', () => {
        it('should create 2 aliases', () => {
            hostTest.addAlias('secondalias');
            hostTest.addAlias('thirdalias');
            expect(hostTest.state).to.have.property('aliases').eql(['secondalias', 'thirdalias']);
        });
    });

    describe('#removeAlias', () => {
        it('should remove an alias', () => {
            hostTest.addAlias('secondalias');
            hostTest.addAlias('thirdalias');
            hostTest.removeAlias('secondalias');
            expect(hostTest.state).to.have.property('aliases').eql(['thirdalias']);
        });
    });

    describe('#addInstance', () => {
        it('should not add instance: port not a number', () => expect(hostTest.addInstance('notvalid')).to.be.rejectedWith('port is not a number'));
        it('should not add instance: instance already exists', async () => {
            await hostTest.addInstance(27017);
            expect(hostTest.addInstance(27017)).to.be.rejectedWith('27017: instance already exists');
        });
        it('should add instance', async () => {
            await hostTest.addInstance(27017);
            const instanceTest = hostTest.state.instances.get(27017);
            expect(instanceTest).to.deep.include({ state: { host: 'localhost', port: 27017, mongoUrl: 'mongodb://localhost:27017' } });
        });
    });

    describe('#getInstance', () => {
        it('should not get instance: empty', () => {
            expect(hostTest.getInstance(27017)).to.be.undefined;
        });
        it('should get instance', async () => {
            await hostTest.addInstance(27017);
            expect(hostTest.getInstance(27017)).to.deep.include({ state: { host: 'localhost', port: 27017, mongoUrl: 'mongodb://localhost:27017' } });
        });
    });

    describe('#removeInstance', () => {
        it('should not remove: no instances', () => {
            expect(hostTest.removeInstance()).to.be.false;
        });
        it('should remove instance', async () => {
            await hostTest.addInstance(27017);
            await hostTest.addInstance(27018);
            expect(hostTest.removeInstance(27017)).equal(27017);
            expect(hostTest.state.instances.size).equal(1);
            const instanceTest = hostTest.state.instances.get(27018);
            expect(instanceTest).to.deep.include({ state: { host: 'localhost', port: 27018, mongoUrl: 'mongodb://localhost:27018' } });
        });
    });
});
