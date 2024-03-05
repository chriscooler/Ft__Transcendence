[![Build Status](https://travis-ci.org/kaelzhang/node-lazy-concat.svg?branch=master)](https://travis-ci.org/kaelzhang/node-lazy-concat)
[![Coverage](https://codecov.io/gh/kaelzhang/node-lazy-concat/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/node-lazy-concat)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/node-lazy-concat?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/node-lazy-concat)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/lazy-concat.svg)](http://badge.fury.io/js/lazy-concat)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/lazy-concat.svg)](https://www.npmjs.org/package/lazy-concat)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/node-lazy-concat.svg)](https://david-dm.org/kaelzhang/node-lazy-concat)
-->

# lazy-concat

Lazily concat two arrays and exclude duplicate items at the joint, especially for sequential arrays.

## Install

```sh
$ npm install lazy-concat
```

## Usage

```js
import concat from 'lazy-concat'

concat([1, 2, 3], [2, 3, 9], 9, 10)
// 2 of the second array matches the second position of the first array
// concat([1, 2, 3], [2, 3, 9]) -> [1, 2, 3, 9]
// 9 matches the last item of the previously concat item
// -> [1, 2, 3, 9]
// 10 does not match,
// so the result is [1, 2, 3, 9, 10]

const concat2 = concat.factory({
  equal: (a, b) => a.i = b.i
})

concat2([{i: 1}, {i: 2}], [{i: 2}, {i: 3}])  
// [{i: 1}, {i: 2}, {i: 3}]

concat([1, 2, 3], [1, 9])
// 1 of the second array matches the first item of the first array,
// but the match is too deep
// which is deeper than the length of the second array.
// So the match will be rejected.
// And the result is `[1, 2, 3, 1, 9]`

concat(null, [1, 2])  // it will throw
```

## concat(...items)

- **items** `Array<any>` the first item should not be `null` or `undefined`, or it will throw an error.

Returns `Array`

## concat.factory({equal})

- **equal** `Function` the method to match items, by default:

```js
const equal = (a, b) => a === b
```

Returns `Function` the configured `concat` function.

## License

MIT
