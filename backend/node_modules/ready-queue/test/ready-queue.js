const test = require('ava')
const queue = require('..')

test.cb('normal', t => {
  let count = 0
  const q = queue({
    load: () => {
      return Promise.resolve(++ count)
    }
  })

  const expected = [1, 1, 1]
  Promise.all(
    expected.map(() => {
      return q.add()
    })
  ).then((results) => {
    t.is(count, 1, 'ready initialization should not run more than once.')
    t.deepEqual(results, expected)
    t.end()

  }).catch(() => {
    t.fail()
    t.end()
  })

})


test.cb('load returns non-Promise', t => {
  let count = 0
  const q = queue({
    load: () => {
      return ++ count
    }
  })

  const expected = [1, 1, 1]
  Promise.all(
    expected.map(() => {
      return q.add()
    })
  ).then((results) => {
    t.is(count, 1, 'ready initialization should not run more than once.')
    t.deepEqual(results, expected)
    t.end()

  }).catch(() => {
    t.fail()
    t.end()
  })

})


function get_loader (threshold) {
  let count = 0

  return () => {
    count ++

    if (count < threshold) {
      return Promise.reject(count)
    }

    return Promise.resolve(count)
  }
}

test.cb('retry, fail exceeded to retry limit', t => {
  let count = 0
  const q = queue({
    load: get_loader(10)
  })

  q.add().then((result) => {
    t.fail()
    t.end()
  })
  .catch((result) => {
    t.is(result, 1)
    t.end()
  })
})

test.cb('retry, success after retry', t => {
  let count = 0
  const q = queue({
    load: get_loader(10),
    retry: 9
  })

  q.add().then((result) => {
    t.is(result, 10)
    t.end()
  })
  .catch((result) => {
    t.fail()
    t.end()
  })
})

test.cb('arguments', t => {
  const count = {
    a: 0,
    b: 0
  }

  const q = queue({
    load: (arg) => {
      count[arg] ++

      return Promise.resolve(count[arg])
    }
  })

  Promise.all(
    ['a', 'a', 'b'].map((arg) => {
      return q.add(arg)
    })

  ).then((results) => {
    t.deepEqual(results, [1, 1, 1])
    t.end()
  })
})
