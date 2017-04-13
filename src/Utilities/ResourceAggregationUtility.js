/**
 * Clone the object using Javscript's JSON API
 * @param {Object} object 
 */
const cloneObject = (object) => {
  return JSON.parse(JSON.stringify(object));
}

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
  //If group has more than 0 resources
  if(groupedResources.length > 0 && type && order) {
    const derivedAttrs = derivedAttrsCallback(groupedResources);
    const aggregateResource = {};
    Object.assign(aggregateResource, cloneObject(type), cloneObject(order), cloneObject(derivedAttrs));
    storedResources.push(aggregateResource);
  }
}

/**
 * This function aggregates adjacent resources of the same type in a post sorted Array
 * @param {Object[]} resources 
 * @param {Function} derivedAttrsCallback - (groupedResources) => aggregateResource 
 * @param {Object} orderSpec - { pluckOrderAttrs(resource), compareOrderAttrs(orderAttrsA, orderAttrsB) }
 * @param {Object} typeSpec - { pluckTypeAttrs(resource), typeAttrsAreEqual(typeAttrsA, typeAttrsB), requiredTypes[] }
 */
export function aggregateAdjacentResources(resources, derivedAttrsCallback, orderSpec, typeSpec) {
  // Define function level scoped variables that will be used throughout the iteration process
  let previousResource, groupedResources = [], previousOrder, previousType;
  const transformedResources = [];
  
  // 1. Sort the resources using the orderSpec
  const sortedResources = resources.sort((resourceA, resourceB) => {
    const resourceAOrderAttrs = orderSpec.pluckOrderAttrs(resourceA);
    const resourceBOrderAttrs = orderSpec.pluckOrderAttrs(resourceB);
    return orderSpec.compareOrderAttrs(resourceAOrderAttrs, resourceBOrderAttrs);
  });

  // 2. Iterate over the sorted resources array like so
  sortedResources.forEach((resource) => {
    const type = typeSpec.pluckTypeAttrs(resource);
    const order = orderSpec.pluckOrderAttrs(resource);

    //2.a Resource is NOT one of the requiredTypes      
    if (!typeSpec.isRequiredType(type)) {
      //2.a.i attempt to store grouped resources
      attemptToCreateAndStoreAggregateResource(groupedResources, derivedAttrsCallback, previousType, previousOrder, transformedResources);
      //2.a.ii Also store the one we just came across that isn't a required type
      transformedResources.push(cloneObject(resource));
      //2.a.iii Reset the the grouped resources
      groupedResources = [];
    } else {
      // 2.b
      // If there was a previously visited valid resource
      // but the types are not equal then we need store
      // the current resource group and then reset it 
      if (previousResource !== undefined && !typeSpec.typeAttrsAreEqual(type, previousType)) {
        attemptToCreateAndStoreAggregateResource(groupedResources, derivedAttrsCallback, previousType, previousOrder, transformedResources);
        groupedResources = []; //reset grouped resources
      }

      // 2.c This is either the first or successive resource we are iterating over that's of a required type
      groupedResources.push(resource);
      previousResource = resource;
    }

    // 2.d Update the previousType and previousOrder based on what has changed with the previousResource
    previousType = previousResource ? typeSpec.pluckTypeAttrs(previousResource) : undefined;
    previousOrder = previousResource ? orderSpec.pluckOrderAttrs(previousResource) : undefined;
  });

  // 3. In case we ended without seeing a different type or non-valid type lets store what's left
  attemptToCreateAndStoreAggregateResource(groupedResources, derivedAttrsCallback, previousType, previousOrder, transformedResources);
  return transformedResources;
}