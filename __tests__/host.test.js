const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const createHost = require('../src/components/host');

describe.skip('Host tests', () => {
    let host;
    const name = 'host';
    const address = 'localhost';
    const port = 27017;
    const hostInfo = `Host name: ${name} address: ${address}`;

    describe('#host', () => {
        it('should not create host: no address', () => {
            expect(() => createHost({ name })).to.throw('Missing arguments: address');
        });
        it('should create host', () => {
            const ins = createHost({ name, address });
            expect(ins.state).to.deep.include({ name, address, instances: new Map() });
        });
        it('should create host with default name', () => {
            const ins = createHost({ address });
            expect(ins.state).to.deep.include({ name, address, instances: new Map() });
        });
    });


    beforeEach(() => { host = createHost({ name, address }); });

    describe('#regInstance', () => {
        it('should not add instance: port not a number', () => expect(host.regInstance({ port: 'notvalid' }))
            .to.be.rejectedWith(`${hostInfo}. Cannot convert port: notvalid to number`));

        it('should not add instance: instance already exists', async () => {
            await host.regInstance({ port });
            expect(host.regInstance({ port })).to.be.rejectedWith(`${hostInfo}. Instance with port ${port} already registered`);
        });

        it('should add instance', async () => {
            await host.regInstance({ port });
            const instanceTest = host.state.instances.get(27017);
            expect(instanceTest).to.deep.include({
                state: {
                    port, user: '', password: '', databases: new Map(),
                },
            });
        });
    });

    describe('#getInstance', () => {
        it('should not get instance: empty', () => {
            const res = host.getInstance({ port });
            expect(res).to.be.an('undefined');
        });

        it('should get instance', async () => {
            await host.regInstance({ port });
            expect(host.getInstance(port)).to.deep.include({
                state: {
                    port, user: '', password: '', databases: new Map(),
                },
            });
        });
    });

    describe('#unregInstance', () => {
        it('should not remove: no instances', () => {
            expect(host.unregInstance()).to.be.false;
        });
        it('should remove instance', async () => {
            await host.regInstance({ port });
            await host.regInstance({ port: 27018 });
            expect(host.unregInstance(port)).to.be.true;
            expect(host.state.instances.size).equal(1);
            const instanceTest = host.state.instances.get(27018);
            expect(instanceTest).to.deep.include({
                state: {
                    port: 27018, user: '', password: '', databases: new Map(),
                },
            });
        });
    });

    describe('#listRegInstances', () => {
        it('should not list: no instances', () => {
            expect(host.listRegInstances()).eqls([]);
        });
        it('should get 2 instances', async () => {
            await host.regInstance({ port });
            await host.regInstance({ port: 27018 });
            expect(host.listRegInstances()).eqls([{
                port: 27017, user: '', password: '', databases: new Map(),
            },
            {
                port: 27018, user: '', password: '', databases: new Map(),
            }]);
        });
    });
});
