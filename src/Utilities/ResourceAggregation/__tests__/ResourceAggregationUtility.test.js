/**
 * @file Jest Tests for the Resource Aggregation Utility. Coverage for the following functions:
 *  1. aggregateAdjacentResources
 * @see {@link /Utilities/ResourceAggregation/ResourceAggregationUtility.js#AggregateAdjacentResources}
 */

import { aggregateAdjacentResources } from '../ResourceAggregationUtility.js';
import strategy from '../Strategies/AggregateAdjacentResources/PersonStrategy.js';
import input from '/Common/Data/chartlytics-js-test-input.js';
import output from '/Common/Data/chartlytics-js-test-output.js';

describe('aggregateAdjacentResources', () => {
  test('chartlytics js test', () => {
    expect(aggregateAdjacentResources(input, strategy)).toEqual(output);
  });
});
