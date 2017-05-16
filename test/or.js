const _ = require('lodash');

const {expect} = require('chai');;

const s = require('../lib/spec');

const {idemPotent} = require('./utils');

const {isInt, isInteger, isString} = s.utils;

describe('Test the or function', () => {

    before(() => {
        s.def('::integer?', s.or(':x', isInteger));
        s.def('::name-or-id', s.or(':name', isString, ':id', isInt));
    });

    it('should test the or of 1 spec', () => {
        expect(s.isValid('::integer?', 12)).to.be.true;
        expect(s.isValid('::integer?', 'foobar')).to.be.false;
    });

    it('should test the or of 2 specs', () => {
        expect(s.isValid('::name-or-id', 'abc')).to.be.true;
        expect(s.isValid('::name-or-id', 100)).to.be.true;
        expect(s.isValid('::name-or-id', 3.14)).to.be.false;
    });

    it('should return tag name and conformed value', () => {
        expect(s.conform('::name-or-id', 'abc')).to.eql([':name', 'abc']);
        expect(s.conform('::name-or-id', 13)).to.eql([':id', 13]);
    });

    it('should unform a conformed value', () => {
        expect(idemPotent('::name-or-id', 'abc')).to.be.true;
    });

    it('should throw an exception on unform with invalid key', () => {
        expect(() => s.unform('::name-or-id', [':ID', 13])).to.throw(Error, 'Key :ID does not exist in spec');
    });

    it('should implement a generator', () => {
        expect(s.exercise('::name-or-id', 7)).to.have.length(7)
            .to.satisfy(sample => _.every(sample, ([v]) => isInteger(v) || isString(v)));
    });

    it('should implement describe', () => {
        expect(s.describe('::name-or-id')).to.eql(['or', ':name', 'isString', ':id', 'isInt']);
    });
});
