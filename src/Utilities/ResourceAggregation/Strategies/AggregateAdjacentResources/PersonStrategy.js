/**
 * @file Supplies a concrete strategy for the function AggregateAdjacentResources
 * @see {@link /Utilities/ResourceAggregation/ResourceAggregationUtility.js#AggregateAdjacentResources}
 */

import { jsonStringifyEquality } from "/Utilities/JSONUtilities.js"

/**
 * Produces the derived attributes for a group of resources
 * @param {Array<Object>} groupedResources
 * @return {Object} - derived attributes that should be attached to an aggregate resource
 */
const derivedAttrsCallback = (groupedResources) => {
  const people = [];
  groupedResources.forEach((resource) => {
    people.push(resource.name);
  });
  return {
    people
  };
};

//NOTE: whatever order attrs you pluck are what's passed to compareOrderAttrs!!!

/**
 * Plucks the attrs that are considered to comprise the "order" of a resource
 * @param {Object} resource
 * @return {Object} - object containing plucked attrs
 */
const pluckOrderAttrs = (resource) => {
  const order = resource.order;
  return { order };
}

/**
 * Comparator for objects produced from pluckOrderAttrs
 * @param {Object} orderAttrsA 
 * @param {Object} orderAttrsB 
 * @return {Number} - indicates if 
 *  1. a is greater than b : 1
 *  2. b is greater than a : -1
 *  3. a is equal to b : 0
 */
const orderAttrsComparator = (orderAttrsA, orderAttrsB) => {
  return orderAttrsA.order - orderAttrsB.order;
};

//NOTE: whatever type attrs you pluck are what's passed to isRequiredType!!!

/**
 * Plucks the attrs that are considered to comprise the "type" of a resource
 * @param {Object} resource 
 * @return {Object} - object containing plucked attrs
 */
const  pluckTypeAttrs = (resource) => {
  const type = resource.type;
  return { type };
}

/**
 * Checks if the provided type Object that originated from pluckTypeAttrs is
 * in the set of types of resources that are required to be aggregated
 * @param {Object} type 
 * @return {Boolean} - indicates if the provided type is a required one
 */
const isRequiredType = (type) => {
  const requiredTypes = [
    { type: "Person" }
  ]
  return requiredTypes.some((otherType) => {
    return jsonStringifyEquality(type, otherType);
  })
};

export default {
  derivedAttrsCallback,
  pluckOrderAttrs,
  orderAttrsComparator,
  pluckTypeAttrs,
  isRequiredType
};