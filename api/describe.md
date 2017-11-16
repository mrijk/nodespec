describe
=====

Usage: ```describe(spec)```

Returns an abbreviated description of the spec as data.

[Source](https://github.com/mrijk/speculaas/blob/master/lib/describe.js)

Example:

```js
const s = require('speculaas');
const {isNumber, isString} = s.utils;

s.def('::ingredient', s.cat(':quantity', isNumber, ':unit', isString));
s.describe('::ingredient');
// ['cat', ':quantity', 'isNumber', ':unit', 'isString']
```
