// NOTE: Phooey :| ! We need to have this file transformed by Webpack or Babel so that we can use es6 imports. Darn it!
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
    expect(aggregateAdjacentResources(inputResources, () => {}, {}, {})).toBe(output);
  });
});
