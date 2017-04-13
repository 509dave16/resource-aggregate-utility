/**
 * Check for equality between two objects based on JSON stringification
 * @param {Object} objectA 
 * @param {Object} objectB 
 */
export const jsonStringifyEquality = (objectA, objectB) => {
  return JSON.stringify(objectA) === JSON.stringify(objectB);
}

/**
 * Clone the object using Javscript's JSON API
 * @param {Object} object 
 */
export const jsonCloneObject = (object) => {
  return JSON.parse(JSON.stringify(object));
}