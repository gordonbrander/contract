// @ts-check

/** @type {(value) => value is string} */
export const isString = value => typeof value === 'string'

/** @type {(value) => value is number} */
export const isNumber = value => typeof value === 'number'

/** @type {(value) => value is bigint} */
export const isBigInt = value => typeof value === 'bigint'

/** @type {(value) => value is boolean} */
export const isBoolean = value => typeof value === 'boolean'
export const isBool = isBoolean

/** @type {(value) => value is NonNullable<object>} */
export const isObject = value => typeof value === 'object' && value !== null

/** @type {(value) => value is function} */
export const isFunction = value => typeof value === 'function'

/** @type {(value) => value is symbol} */
export const isSymbol = value => typeof value === 'symbol'

export const isArray = Array.isArray

/** @type {(value) => value is null | undefined} */
export const isNullish = value => value == null

/**
 * Decorate a predicate to return true for nullish values
 * @template T
 * @param {(value) => value is T} predicate
 * @returns {(value) => value is T | null | undefined}
 */
export const maybe = predicate => {
  /** @type {(value) => value is T | null | undefined} */
  const isMaybe = value => isNullish(value) || predicate(value)
  return isMaybe
}

/**
 * Create a predicate that checks if a value is an instance of a class
 * @template {function} T
 * @param {T} constructor 
 * @returns {(value) => value is T}
 */
export const instance = constructor => {
  /** @type {(value) => value is T} */
  const isInstanceOf = value => value instanceof constructor
  return isInstanceOf
}

/**
 * Create a predicate that checks if a value is constructor for a class
 * @template {function} T
 * @param {T} constructor 
 * @returns {(value) => value is T}
 */
export const constructor = constructor => {
  /** @type {(value) => value is T} */
  const isConstructorOf = value => value.constructor === constructor
  return isConstructorOf
}

/**
 * Create a predicate that checks if an object conforms to a shape
 * @template T
 * @param {Object.<string, (value) => boolean>} defn
 * @returns {(value) => value is T}
 */
export const shape = (defn) => {
  /** @type {(value) => value is T} */
  const isShapeOf = value => {
    if (!isObject(value)) {
      return false
    }
    for (const key of Object.keys(defn)) {
      const predicate = defn[key]
      if (!predicate(value[key])) {
        return false
      }
    }
    return true
  }
  return isShapeOf
}

/**
 * Create a predicate that checks if every value of array is valid.
 * @template T
 * @param {(value) => value is T} predicate 
 * @returns {(value) => value is Array<T>}
 */
export const array = predicate => {
  /** @type {(value) => value is Array<T>} */
  const isArrayOf = value => {
    if (!isArray(value)) {
      return false
    }
    return value.every(predicate)
  }
  return isArrayOf
}

/**
 * Check if value is valid.
 * Throw a TypeError if it isn't.
 * Otherwise, return the value.
 * @template T
 * @param {(value) => value is T} predicate
 * @param {any} value
 * @param {string} message 
 * @throws {TypeError}
 * @returns {T}
 */
export const guard = (
  predicate,
  value,
  message=`Value didn't pass guard with predicate ${predicate.name}`
) => {
  if (!predicate(value)) {
    throw new TypeError(message)
  }
  return value
}
