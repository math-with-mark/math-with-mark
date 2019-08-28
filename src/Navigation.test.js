import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import Navigation from './Navigation';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <HashRouter>
      <Navigation />
    </HashRouter>,
    div,
  );
});
