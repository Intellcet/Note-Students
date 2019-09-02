import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

const mountNode = document.getElementById('root');
const renderApplication = () => ReactDOM.render(<App />, mountNode);

renderApplication();

if (module.hot) {
  module.hot.accept('./components/App', renderApplication);
}
