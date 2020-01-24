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

    describe('#regAlias', () => {
        it('should create 2 aliases', () => {
            hostTest.regAlias('secondalias');
            hostTest.regAlias('thirdalias');
            expect(hostTest.state).to.have.property('aliases').eql(['secondalias', 'thirdalias']);
        });
    });

    describe('#unregAlias', () => {
        it('should remove an alias', () => {
            hostTest.regAlias('secondalias');
            hostTest.regAlias('thirdalias');
            hostTest.unregAlias('secondalias');
            expect(hostTest.state).to.have.property('aliases').eql(['thirdalias']);
        });
    });

    describe('#regInstance', () => {
        it('should not add instance: port not a number', () => expect(hostTest.regInstance('notvalid')).to.be.rejectedWith('port is not a number'));
        it('should not add instance: instance already exists', async () => {
            await hostTest.regInstance(27017);
            expect(hostTest.regInstance(27017)).to.be.rejectedWith('27017: instance already exists');
        });
        it('should add instance', async () => {
            await hostTest.regInstance(27017);
            const instanceTest = hostTest.state.instances.get(27017);
            expect(instanceTest).to.deep.include({ state: { host: 'localhost', port: 27017, mongoUrl: 'mongodb://localhost:27017' } });
        });
    });

    describe('#getInstance', () => {
        it('should not get instance: empty', () => {
            expect(hostTest.getInstance(27017)).to.be.undefined;
        });
        it('should get instance', async () => {
            await hostTest.regInstance(27017);
            expect(hostTest.getInstance(27017)).to.deep.include({ state: { host: 'localhost', port: 27017, mongoUrl: 'mongodb://localhost:27017' } });
        });
    });

    describe('#unregInstance', () => {
        it('should not remove: no instances', () => {
            expect(hostTest.unregInstance()).to.be.false;
        });
        it('should remove instance', async () => {
            await hostTest.regInstance(27017);
            await hostTest.regInstance(27018);
            expect(hostTest.unregInstance(27017)).equal(27017);
            expect(hostTest.state.instances.size).equal(1);
            const instanceTest = hostTest.state.instances.get(27018);
            expect(instanceTest).to.deep.include({ state: { host: 'localhost', port: 27018, mongoUrl: 'mongodb://localhost:27018' } });
        });
    });
});
