const { expect, assert } = require('chai');

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
        it('should not add instance: port not a number', () => {
            expect(() => hostTest.addInstance('notvalid')).to.throw('port is not a number');
        });
        it('should not add instance: duplicated', () => {
            hostTest.addInstance(27017);
            expect(() => hostTest.addInstance(27017)).throw('instance duplicated');
        });
        it('should add instance', () => {
            hostTest.addInstance(27017);
            const ins = instance({ host: 'localhost', port: 27017 });
            expect(hostTest.state).to.have.property('instances').eql(new Map().set(27017, ins));
        });
    });

    describe('#removeInstance', () => {
        it('should not remove: no instances', () => {
            assert.isFalse(hostTest.removeInstance());
        });
        it('should remove instance', () => {
            hostTest.addInstance(27017);
            hostTest.addInstance(27018);
            const ins = instance({ host: 'localhost', port: 27018 });
            assert.equal(hostTest.removeInstance(27017), 27017);
            expect(hostTest.state.instances).to.be.eql(new Map().set(27018, ins));
        });
    });

    describe('#getInstance', () => {
        it('should not get instance: empty', () => {
            expect(hostTest.getInstance(27017)).to.be.undefined;
        });
        it('should get instance', () => {
            hostTest.addInstance(27017);
            expect(hostTest.getInstance(27017)).to.eql(instance({ host: 'localhost', port: 27017 }));
        });
    });
});
