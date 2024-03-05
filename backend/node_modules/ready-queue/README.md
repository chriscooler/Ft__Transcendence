[![Build Status](https://travis-ci.org/kaelzhang/node-ready-queue.svg?branch=master)](https://travis-ci.org/kaelzhang/node-ready-queue)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/node-ready-queue?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/node-ready-queue)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/ready-queue.svg)](http://badge.fury.io/js/ready-queue)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/ready-queue.svg)](https://www.npmjs.org/package/ready-queue)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/node-ready-queue.svg)](https://david-dm.org/kaelzhang/node-ready-queue)
-->

# ready-queue

Ready-queue ensures initialization method only run once, and queues listeners which are registered to it.

## Install

```sh
$ npm install ready-queue --save
```

## Usage

```js
const queue = require('ready-queue')

const q = queue({
  load: (userId) => {
    return getUserPromise(userId)
  }
})

q.add(123).then((userObject) => {
  userObject
})

q.add(123).then((userObject) => {
  // `getUserPromise(123)` only runs once
})

q.add(234).then((userObject) => {
  // then `getUserPromise(234)` runs
})
```

### queue({load, retry = 0})

- **load** `function(args)` if the function is asynchronous, it should return a `Promise`.
  - args `any` arguments which is from `.add(args)` method
- **retry** `number=0` how many times `queue` will retry if fails.

### .add(args)

returns `Promise`

## License

MIT
