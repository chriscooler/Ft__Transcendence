export const find = (
  equal: Function,
  //
  max: number,
  array: Array,
  item: any
) => {

  let i = array.length
  max = i - max - 1

  while (i -- && i > max) {
    if (equal(array[i], item)) {
      return i
    }
  }

  return -1
}

export const isNullOrUndefined = x => x === undefined || x === null
export const isObject = x => Object(x) === x
