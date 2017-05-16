const _ = require('lodash');

const {invalidString} = require('./conform');
const {spec: specize} = require('./def');
const {gen} = require('./gen');
const isValid = require('./isValid');

const describe = require('./util/describe');

function tuple(...predicates) {
    return {
        conform: values => {
            const result = (values.length === predicates.length &&
                            _.zip(predicates, values).every(([p, v]) => isValid(specize(p), v))) ? values : invalidString;
            return result;
        },
        unform: _.identity,
        gen: () => _.map(predicates, gen),
        describe: () => [tuple.name, ...describe(predicates)]
    };
}

module.exports = tuple;
