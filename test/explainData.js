const {expect} = require('chai');;

const s = require('../lib/spec');

const {isString, unknownString} = s.utils;

describe('Test the explainData function', () => {
    it('should return null if succesful on a predicate function', () => {
        expect(s.explainData(isString, 'foobar')).to.equal(null);
    });

    it('should return null if succesful on an array', () => {
        expect(s.explainData([1, 2], 2)).to.equal(null);
    });

    it('should report a problem when the value is not in the array', () => {
        expect(s.explainData([1, 2], 3)).to.eql({
            problems: [{
                path: [],
                pred: unknownString,
                val: 3,
                via: [],
                'in': []
            }]            
        });
    });

    it('should return an object explaining why the spec fails', () => {
        expect(s.explainData(isString, 1)).to.eql({
            problems: [{
                path: [],
                pred: 'isString',
                val: 1,
                via: [],
                'in': []
            }]
        });
    });

    it('should throw an error if spec doesn\'t exist', () => {
        expect(() => s.explainData('::foobar', 5)).to.throw(Error, /Unable to resolve spec/);
    });
});

