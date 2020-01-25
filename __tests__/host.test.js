const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const createHost = require('../src/host');

describe.skip('Host tests', () => {
    describe('#host', () => {
        it('should create host', () => {
            const ins = createHost({ host: 'localhost' });
            expect(ins.state).to.have.property('host').equal('localhost');
        });
    });

    let host;
    beforeEach(() => { host = createHost({ host: 'localhost' }); });

    describe('#regAlias', () => {
        it('should create 2 aliases', () => {
            host.regAlias('secondalias');
            host.regAlias('thirdalias');
            expect(host.state).to.have.property('aliases').eql(['secondalias', 'thirdalias']);
        });
    });

    describe('#unregAlias', () => {
        it('should remove an alias', () => {
            host.regAlias('secondalias');
            host.regAlias('thirdalias');
            host.unregAlias('secondalias');
            expect(host.state).to.have.property('aliases').eql(['thirdalias']);
        });
    });

    describe('#regInstance', () => {
        it('should not add instance: port not a number', () => expect(host.regInstance('notvalid')).to.be.rejectedWith('port is not a number'));
        it('should not add instance: instance already exists', async () => {
            await host.regInstance(27017);
            expect(host.regInstance(27017)).to.be.rejectedWith('27017: instance already exists');
        });
        it('should add instance', async () => {
            await host.regInstance(27017);
            const instanceTest = host.state.instances.get(27017);
            expect(instanceTest).to.deep.include({ state: { host: 'localhost', port: 27017, mongoUrl: 'mongodb://localhost:27017' } });
        });
    });

    describe('#getInstance', () => {
        it('should not get instance: empty', () => {
            expect(host.getInstance(27017)).to.be.undefined;
        });
        it('should get instance', async () => {
            await host.regInstance(27017);
            expect(host.getInstance(27017)).to.deep.include({ state: { host: 'localhost', port: 27017, mongoUrl: 'mongodb://localhost:27017' } });
        });
    });

    describe('#unregInstance', () => {
        it('should not remove: no instances', () => {
            expect(host.unregInstance()).to.be.false;
        });
        it('should remove instance', async () => {
            await host.regInstance(27017);
            await host.regInstance(27018);
            expect(host.unregInstance(27017)).equal(27017);
            expect(host.state.instances.size).equal(1);
            const instanceTest = host.state.instances.get(27018);
            expect(instanceTest).to.deep.include({ state: { host: 'localhost', port: 27018, mongoUrl: 'mongodb://localhost:27018' } });
        });
    });

    describe('#listRegInstances', () => {
        it('should not list: no instances', () => {
            expect(host.listRegInstances()).eqls([]);
        });
        it('should get 2 instances', async () => {
            await host.regInstance(27017);
            await host.regInstance(27018);
            expect(host.listRegInstances()).eqls([27017, 27018]);
        });
    });
});
