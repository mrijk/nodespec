const {every} = require('lodash');

const {expect} = require('chai');

const s = require('../lib/spec');

const {check, exerciseFunc, idemPotent} = require('./utils');

const {isEven, isInteger, invalidString, unknownString} = s.utils;

describe('Test the and function', () => {
    before(() => {
        s.def('::even?', s.and(isInteger, isEven));        
    });
    
    it('should test the and of 1 spec', () => {
        s.def('::integer?', s.and(isInteger));
        expect(s.isValid('::integer?', 12)).to.be.true;
        expect(s.isValid('::integer?', 'foobar')).to.be.false;
    });
    
    it('should test the and of 2 specs', () => {
        expect(s.conform('::even?', 0)).to.equal(0);
        expect(s.conform('::even?', 13)).to.equal(invalidString);
    });

    it('should promote the conform return value', () => {
        s.def('::one-bigger', ({n1}) => n1);
        expect(s.conform(s.and(s.cat('n1', isInteger), '::one-bigger'), [13])).to.eql({n1: 13});
    });

    it('should allow zero predicates on any input', () => {
        expect(s.isValid(s.and(), [])).to.be.true;
    });

    it('should unform a conformed value', () => {
        expect(idemPotent('::even?', 42)).to.be.true;
    });

    it('should implement explain', () => {
        expect(s.explainData('::even?', 0)).to.be.null;
        expect(s.explainData('::even?', 1)).to.eql({
            problems: [
                {
                    path: [],
                    pred: 'isEven',
                    val: 1,
                    via: ['::even?'],
                    'in': []
                }
            ]
        });
    });

    it('should implement a generator', () => {
        expect(s.exercise('::even?', 7)).to.have.length(7)
            .to.satisfy(sample => every(sample, ([v]) => isInteger(v) && isEven(v)));
    });

    it('should implement describe', () => {
        expect(s.describe('::even?')).to.eql(['and', 'isInteger', 'isEven']);
    });

    it('should use the spec to test', () => {
        expect(check(s.and, '../specs/and')).to.have.property('result').to.equal(true);
    });

    // Fails because it can generate 'impossible' specs
    xit('should exercise the and spec', () => {
        exerciseFunc(s.and, '../specs/and');
    });
});

