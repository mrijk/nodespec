const _ = require('lodash');

const {gen: tcg} = require('testcheck');

const {conform, invalidString} = require('./conform');
const {getSpec} = require('./def');
const {gen} = require('./gen');

const describe = require('./util/describe');

function question(spec) {
    const predicate = getSpec(spec);
    return {
        op: 'question',
        conform: values => {
            if (values.length === 0) {
                return null;
            } else if (values.length === 1) {
                return conform(predicate, values[0]);
            } else {
                return invalidString;
            }
        },
        unform: value => [value],
        gen: () => tcg.null.then(() => tcg.array(gen(spec), {size: _.random(1)})),
        describe: () => [question.name, ...describe([spec])]
    };
}

module.exports = question;

