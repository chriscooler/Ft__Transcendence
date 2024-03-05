import {find, isNullOrUndefined, isObject} from './util'

const APConcat = Array.prototype.concat
const strictEqual = (a, b) => a === b

const run = (equal, ...items) => {
  return items.reduce((prev, current, i) => {
    if (i === 1) {
      if (isNullOrUndefined(prev)) {
        return APConcat.call(prev, current)
      }

      if (!Array.isArray(prev)) {
        // Actually, `APConcat.call(1, 2)` -> `[Object(1), 2]`
        // but this behavior is really weird and error-prone,
        // so `lazyConat(1, 2)` will be `[1, 2]`
        prev = [prev]
      }
    }

    const isArray = Array.isArray(current)
    const item = isArray
      ? current[0]
      : current
    const max = isArray
      ? current.length
      : 1

    const index = find(equal, max, prev, item)
    return ~index
      ? APConcat.call(prev.slice(0, index), current)
      : APConcat.call(prev, current)
  })
}

const factory = ({equal = strictEqual} = {}) => {
  return (...items) => run(equal, ...items)
}

const concat = factory()
concat.factory = factory

export default concat
