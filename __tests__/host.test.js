const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const createHost = require('../src/components/host');

describe('Host tests', () => {
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
            expect(ins).to.deep.include({ name, address, instances: new Map() });
        });
        it('should create host with default name', () => {
            const ins = createHost({ address });
            expect(ins).to.deep.include({ name, address, instances: new Map() });
        });
    });


    beforeEach(() => { host = createHost({ name, address }); });

    describe('#regInstance', () => {
        it('should not add instance: port not a number', () => {
            expect(() => host.regInstance('notvalid'))
                .to.throw(`${hostInfo}. Cannot convert argument 'notvalid' to number`);
        });

        it('should not add instance: instance already exists', () => {
            host.regInstance(port);
            expect(() => host.regInstance(port))
                .to.throw(`${hostInfo}. Instance with port ${port} already registered`);
        });

        it('should add instance', () => {
            host.regInstance(port);
            const instanceTest = host.instances.get(27017);
            expect(instanceTest).to.deep.include({ port, databases: [] });
        });
    });

    describe('#getInstance', () => {
        it('should not get instance: empty', () => {
            const res = host.getInstance(port);
            expect(res).to.be.an('undefined');
        });

        it('should get instance', () => {
            host.regInstance(port);
            expect(host.getInstance(port)).to.deep.include({ port, databases: [] });
        });
    });

    describe('#unregInstance', () => {
        it('should not remove: no instances', () => {
            expect(host.unregInstance()).to.be.false;
        });
        it('should remove instance', async () => {
            await host.regInstance(port);
            await host.regInstance(27018);
            expect(host.unregInstance(port)).to.be.true;
            expect(host.instances.size).equal(1);
            const instanceTest = host.instances.get(27018);
            expect(instanceTest).to.deep.include({ port: 27018, databases: [] });
        });
    });

    describe('#listRegInstances', () => {
        it('should not list: no instances', () => {
            expect(host.listRegInstances()).eqls([]);
        });
        it('should get 2 instances', () => {
            host.regInstance(port);
            host.regInstance(27018);
            expect(host.listRegInstances()).eqls([{
                port: 27017, databases: [],
            },
            {
                port: 27018, databases: [],
            }]);
        });
    });

    describe('#getHostInfo', () => {
        it('should get host info with no instances', () => {
            expect(host.getHostInfo()).eqls({ name, address, instances: [] });
        });
        it('should get host info with 2 instances', () => {
            host.regInstance(port);
            host.regInstance(27018);
            expect(host.getHostInfo()).eqls({
                name,
                address,
                instances: [{
                    port: 27017, databases: [],
                },
                {
                    port: 27018, databases: [],
                }],
            });
        });
    });

    describe('#shutdownHost', () => {
        it('should shutdown host with no instance', () => {
            host.shutdownHost();
            expect(host.instances).to.be.a('Map').with.property('size').eq(0);
        });
        it('should shutdown host with 2 instance', () => {
            host.regInstance(port);
            host.regInstance(27018);
            host.shutdownHost();
            expect(host.instances).to.be.a('Map').with.property('size').eq(0);
        });
    });
});
