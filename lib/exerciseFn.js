const _ = require('lodash');

const exercise = require('./exercise');
const fdef = require('./fdef');

function exerciseFn(f, n = 10) {
    const spec = fdef.specs(f).args;
    
    const samples = exercise(spec, n);
    
    return _.map(samples, ([args]) => [args, f.apply(null, args)]);
}

module.exports = exerciseFn;
