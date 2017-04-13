import { aggregateAdjacentResources } from '../ResourceAggregationUtility.js';

// Don't need this yet setup yet
// beforeEach(() => {
// });

describe('aggregateAdjacentResources', () => {
  const inputResources = [{
    type: 'Person',
    order: 1,
    name: 'Brian',
  }, {
    type: 'Place',
    order: 2,
    name: 'Ohio',
  }, {
    type: 'Place',
    order: 12,
    name: 'Ohio',
  }, {
    type: 'Person',
    order: 14,
    name: 'Sarah',
  },  {
    type: 'Person',
    order: 199,
    name: 'Sam',
  }, {
    type: 'Person',
    order: 19,
    name: 'Eric',
  }, {
    type: 'Place',
    order: 20,
    name: 'Home',
  }];

  const output = [
    {
      "type": "Person",
      "order": 1,
      "people": [
        "Brian"
      ]
    },
    {
      "type": "Place",
      "order": 2,
      "name": "Ohio"
    },
    {
      "type": "Place",
      "order": 12,
      "name": "Ohio"
    },
    {
      "type": "Person",
      "order": 19,
      "people": [
        "Sarah",
        "Eric"
      ]
    },
    {
      "type": "Place",
      "order": 20,
      "name": "Home"
    },
    {
      "type": "Person",
      "order": 199,
      "people": [
        "Sam"
      ]
    }
  ];
  test('the almighty test :) !!!', () => {

    const jsonStringifyEquality = (objectA, objectB) => {
      return JSON.stringify(objectA) === JSON.stringify(objectB);
    }

    const derivedAttrsCallback = (groupedResources) => {
      const people = [];
      groupedResources.forEach((resource) => {
        people.push(resource.name);
      });
      return {
        people
      };
    };

    const orderSpec = {
      pluckOrderAttrs: (resource) => {
        const order = resource.order;
        return { order };
      },
      compareOrderAttrs: (orderAttrsA, orderAttrsB) => {
        return orderAttrsA.order - orderAttrsB.order;
      },
    };

    const typeSpec = {
      pluckTypeAttrs: (resource) => {
        const type = resource.type;
        return { type };
      },
      typeAttrsAreEqual: jsonStringifyEquality,
      isRequiredType: (type) => {
        const requiredTypes = [
          { type: "Person" }
        ]

        return requiredTypes.some((otherType) => {
          return jsonStringifyEquality(type, otherType);
        })
      },
    }
    
    expect(aggregateAdjacentResources(inputResources, derivedAttrsCallback, orderSpec, typeSpec)).toEqual(output);
  });
});
