/**
 * @file A tree view that displays the ouptout from trasnforming a collection of
 *  resources using an one of the resource aggregation utility funtions
 * 
 * @see {@link https://github.com/chenglou/react-treeview/blob/master/demos/uncontrolled.js} for source that is component is based off of.
 */

import React from 'react';
import TreeView from 'react-treeview';
//NOTE: Have to use relevative path for import since the css file is in a node_modules/ package folder and not one of the folders under src/
import TreeViewStyle from '../../../node_modules/react-treeview/react-treeview.css';
import OutputTreeViewStyle from './OutputTreeView.scss';
// Import Business Logic Crap
import { aggregateAdjacentResources } from '/Utilities/ResourceAggregation/ResourceAggregationUtility.js';
import strategy from '/Utilities/ResourceAggregation/Strategies/AggregateAdjacentResources/PersonStrategy.js';
import input from '/Common/Data/chartlytics-js-test-input.js';

const output = aggregateAdjacentResources(input, strategy);

// This example data format is totally arbitrary. No data massaging is
// required and you use regular js in `render` to iterate through and
// construct your nodes.
const dataSource = [
  {
    type: 'Resources',
    collapsed: false,
    collection: output,
  },
];

const OutputTreeView = () => (
  <div>
    {dataSource.map((node, nodeIndex) => {
      const type = node.type;
      const rootLabel = <span className="node itemLabel">{type}</span>;
      return (
        <TreeView className="itemNode" key={`${type}|${nodeIndex}`} nodeLabel={rootLabel} defaultCollapsed={false}>
          {node.collection.map(item => {
            let itemNodeName = '';
            if (item.name) {
              itemNodeName = item.name;
            } else {
              itemNodeName = item.people.join();
            }
            const itemLabel = <span className="node itemLabel">{`${item.order}. ${itemNodeName}`}</span>;
            return (
              <TreeView className="itemNode" nodeLabel={itemLabel} key={`${item.type}|${item.order}`} defaultCollapsed={false}>
                <div className="itemProperties">
                  <div className="info">
                    <span>type:</span>
                    <span>{item.type}</span>
                  </div>
                  <div className="info">
                    <span>order:</span>
                    <span>{item.order}</span>
                  </div>
                </div>
              </TreeView>
            );
          })}
        </TreeView>
      );
    })}
  </div>
);

export default OutputTreeView;