const {expect} = require('chai');

const s = require('../lib/spec');

const {isNumber, isVector} = s.utils;

describe('Test the every function', () => {
    before(() => {
        s.def('::vnum3', s.every(isNumber, {kind: isVector, count: 3, distinct: true}));
    });
    
    describe('should handle valid input', () => {
        it('should return a spec for a collection', () => {
            expect(s.isValid('::vnum3', [1, 2, 3])).to.be.true;
        });

        it('explainData should return null', () => {
            expect(s.explainData('::vnum3', [1, 2, 3])).to.be.null;
        });
    });

    it('should implement describe', () => {
        expect(s.describe('::vnum3')).to.eql(['every', 'isNumber', 'kind', 'isArray', 'count', 3, 'distinct', true]);
    });
});
