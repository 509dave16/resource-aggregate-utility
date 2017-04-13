/**
 * @file Provides a cohesive set of utility functions for performing aggregate operations on a collection of resources
 */

import { jsonStringifyEquality, jsonCloneObject } from "/Utilities/JSONUtilities.js"

/**
 * Attempt to store grouped resources if there's more than one resource and the type is defined as well as the order
 * TODO: Investigate Deep Cloning Issues from Object.assign
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * @param {Object[]} groupedResources
 * @param {Function} derivedAttrsCallback
 * @param {Object} type 
 * @param {Object} order 
 * @param {Object[]} storedResources 
 */
const attemptToCreateAndStoreAggregateResource = (groupedResources, derivedAttrsCallback, type, order, storedResources) => {
  if(groupedResources.length > 0 && type && order) {
    const derivedAttrs = derivedAttrsCallback(groupedResources, type);
    const aggregateResource = {};
    Object.assign(aggregateResource, jsonCloneObject(type), jsonCloneObject(order), jsonCloneObject(derivedAttrs));
    storedResources.push(aggregateResource);
  }
}

/**
 * This function aggregates adjacent resources of the same type in a post sorted Array
 * based on the strategy provided which is comprised of two concepts: type and order.
 * @see {@link Strategies/AggregateAdjacentResources/PersonStrategy.js}
 * @param {Array<Object>} resources 
 * @param {Object} strategy
 * @return {Array<Object>} - transformed collection of resources of which some or all are aggregate resources
 */
export function aggregateAdjacentResources(resources, strategy) {
  // Define function level scoped variables that will be used throughout the iteration process
  let previousResource, groupedResources = [], previousOrder, previousType;
  const transformedResources = [];
  
  // 1. Sort the resources using the strategy
  const sortedResources = resources.sort((resourceA, resourceB) => {
    const resourceAOrderAttrs = strategy.pluckOrderAttrs(resourceA);
    const resourceBOrderAttrs = strategy.pluckOrderAttrs(resourceB);
    return strategy.orderAttrsComparator(resourceAOrderAttrs, resourceBOrderAttrs);
  });

  // 2. Iterate over the sorted resources array like so
  sortedResources.forEach((resource) => {
    const type = strategy.pluckTypeAttrs(resource);
    const order = strategy.pluckOrderAttrs(resource);

    //2.a Resource is NOT one of the requiredTypes      
    if (!strategy.isRequiredType(type)) {
      //2.a.i attempt to store grouped resources
      attemptToCreateAndStoreAggregateResource(groupedResources, strategy.derivedAttrsCallback, previousType, previousOrder, transformedResources);
      //2.a.ii Also store the one we just came across that isn't a required type
      transformedResources.push(jsonCloneObject(resource));
      //2.a.iii Reset the the grouped resources
      groupedResources = [];
    } else {
      // 2.b
      // If there was a previously visited valid resource
      // but the types are not equal then we need store
      // the current resource group and then reset it 
      if (previousResource !== undefined && !jsonStringifyEquality(type, previousType)) {
        attemptToCreateAndStoreAggregateResource(groupedResources, strategy.derivedAttrsCallback, previousType, previousOrder, transformedResources);
        groupedResources = []; //reset grouped resources
      }

      // 2.c This is either the first or successive resource we are iterating over that's of a required type
      groupedResources.push(resource);
      previousResource = resource;
    }

    // 2.d Update the previousType and previousOrder based on what has changed with the previousResource
    previousType = previousResource ? strategy.pluckTypeAttrs(previousResource) : undefined;
    previousOrder = previousResource ? strategy.pluckOrderAttrs(previousResource) : undefined;
  });

  // 3. In case we ended without seeing a different type or non-valid type lets store what's left
  attemptToCreateAndStoreAggregateResource(groupedResources, strategy.derivedAttrsCallback, previousType, previousOrder, transformedResources);
  return transformedResources;
}