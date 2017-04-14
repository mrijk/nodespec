const {expect} = require('chai');

const s = require('../lib/spec');

describe('Test the isSpec function', () => {

    it('should return the spec object', () => {
        const foo = s.def('::foo', x => x > 0);
        expect(s.isSpec(foo)).to.equal(foo);
    });

    it('should return null if the parameter is not a spec object', () => {
        const foo = {};
        expect(s.isSpec(foo)).to.be.null;
    });

    it('should return null if the parameter is an integer', () => {
        expect(s.isSpec(1)).to.be.null;
    });
});
