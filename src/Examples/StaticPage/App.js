import React from 'react';
import ReactDOM from 'react-dom';
import AppStyle from '/Common/Style/App.scss';
import OutputTreeView from './OutputTreeView';

const App = () => (<OutputTreeView />);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);