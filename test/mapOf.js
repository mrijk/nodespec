const _ = require('lodash');

const {expect} = require('chai');

const s = require('../lib/spec');

const {idemPotent} = require('./utils');

const {isInteger, isString} = s.utils;

describe('Test the mapOf function', () => {
    before(() => {
        s.def('::scores', s.mapOf(isString, isInteger));
        s.def('::scores2to3', s.mapOf(isString, isInteger, {minCount: 2, maxCount: 3}));
    });
    
    describe('should handle valid input', () => {
        it('should return a spec for a map', () => {
            expect(s.isValid('::scores', {'Sally': 1000, 'Joe': 500})).to.be.true;
        });

        it('explainData should return null', () => {
            expect(s.explainData('::scores', {'Sally': 1000, 'Joe': 500})).to.be.null;
        });

        it('conform the keys if conformKeys is set to true', () => {
            s.def('::foo', s.mapOf(s.conformer(_.toUpper), isInteger, {conformKeys: true}));
            expect(s.conform('::foo', {'Sally': 1000, 'Joe': 500})).to.eql({'SALLY': 1000, 'JOE': 500});
        });
    });

    describe('should reject invalid input', () => {
        it('should fail on invalid data', () => {
            expect(s.isValid('::scores', {'Sally': 1000, 'Joe': '500'})).to.be.false;
        });

        it('explainData should report about wrong type', () => {
            expect(s.explainData('::scores', new Map([['Sally', '1000'], [true, 500]]))).to.eql({
                problems: [
                    {
                        path: [1],
                        pred: 'isInteger',
                        val: '1000',
                        via: ['::scores'],
                        'in': ['Sally', '1000']
                    },
                    {
                        path: [0],
                        pred: 'isString',
                        val: true,
                        via: ['::scores'],
                        'in': [true, 500]
                    }
                ]
            });
        });

        it('should accept an object of type Map as input', () => {
            const map = new Map(_.toPairs({'Sally': '1000', 'Joe': 500}));
            expect(s.isValid('::scores', map)).to.be.false;
        });

        it('should fail if less than minCount', () => {
            expect(s.isValid('::scores2to3', {'Sally': 1000})).to.be.false;
        });
        
        it('should fail if greater than minCount', () => {
            expect(s.isValid('::scores2to3', {'Sally': 1000, 'Joe': 1000, 'Susan': 1000, 'Mike': 1000})).to.be.false;
        });
    });


    it('should unform a conformed value', () => {
        expect(idemPotent('::scores', {'Sally': 1000, 'Joe': 500})).to.be.true;
    });

    it('should implement a generator', () => {
        expect(s.exercise('::scores2to3')).to.have.length(10)
            .to.satisfy(sample => _.every(sample, v => _.isArray(v) && v.length === 2));
    });

    it('should implement describe', () => {
        expect(s.describe('::scores')).to.eql(['mapOf', 'isString', 'isInteger']);
    });
});
