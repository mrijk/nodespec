const _ = require('lodash');

const {gen: tcg} = require('testcheck');

const {invalidString} = require('./conform');
const {spec: specize} = require('./def');
const {gen} = require('./gen');
const {checkCount} = require('./util/helper');
const isValid = require('./isValid');

const describe = require('./util/describe');

function collOf(predicate, options = {}) {
    const {kind = () => true, distinct = false, into} = options;
    const uniq = value => !distinct || isUnique(value);

    return {
        conform: value => {
            const spec = specize(predicate);
            const result = kind(value) && uniq(value) && checkCount(value, options)
                  && _.every(value, v => isValid(spec, v));
            return result ? transform(value, into) : invalidString;
        },
        unform: _.identity,
        gen: () => tcg.null.then(() => {
            const count = options.count || 10;
            return tcg.array(gen(predicate), {size: count});
        }),
        describe: () => [collOf.name, ...describe([predicate]), ...describe(_.flatten(_.toPairs(options)))]
    };
}

function isUnique(value) {
    return _.uniq(value).length === value.length;
}

function transform(value, into) {
    if (_.isSet(into)) {
        return new Set(value);
    } else if (_.isArray(into)) {
        return [...value];
    }
    return value;
}

module.exports = collOf;
