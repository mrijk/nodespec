const _ = require('lodash');

const {expect} = require('chai');

const s = require('../lib/spec');

const {idemPotent} = require('./utils');

const {isString} = s.utils;

describe('Test the keys function', () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/

    before(() => {
        s.def('::email-type', s.and(isString, s => emailRegex.test(s)));
        
        s.def('::first-name', isString);
        s.def('::last-name', isString);
        s.def('::email', '::email-type');
        s.def('::phone', isString);
        s.def('::person', s.keys({req: ['::first-name', '::last-name', '::email'], opt: ['::phone']}));
    });

    it('should should accept object with required keys', () => {
        expect(s.isValid('::person',
                         {
                             '::first-name': 'Elon',
                             '::last-name': 'Musk',
                             '::email': 'elon@example.com'
                         })).to.be.true;
    });
    
    it('should should accept object with required and optional keys', () => {
        expect(s.isValid('::person',
                         {
                             '::first-name': 'Elon',
                             '::last-name': 'Musk',
                             '::email': 'elon@example.com',
                             '::phone': '06 12345678'
                         })).to.be.true;
    });

    it('should fail if required key is missing', () => {
        expect(s.isValid('::person',
                         {
                             '::first-name': 'Elon'
                         })).to.be.false;
    });

    it('should fail if attribute doesn\'t conform', () => {
        expect(s.isValid('::person',
                         {
                             '::first-name': 'Elon',
                             '::last-name': 'Musk',
                             '::email': 'n/a'
                         })).to.be.false;
    });

    it('should unform a conformed value', () => {
        const input = {
            '::first-name': 'Elon',
            '::last-name': 'Musk',
            '::email': 'elon@example.com'
        };
        expect(idemPotent('::person', input)).to.be.true;
    });

    it('should implement a generator', () => {
        const req = ['::first-name', '::last-name'];
        const opt = ['::phone'];
        s.def('::oldPerson', s.keys({req, opt}));
        
        expect(s.exercise('::oldPerson')).to.have.length(10)
            .to.satisfy(sample => _.every(sample, ([v]) => _.every(req, k => _.has(v, k))));
    });

    it('should implement describe', () => {
        expect(s.describe('::person')).to.eql(['keys', 'req', ['::first-name', '::last-name', '::email'], 'opt', ['::phone']]);
    });
});

