import React from 'react';
import ReactDOM from 'react-dom';

import Preliminaries from './Preliminaries';
import { HashRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <HashRouter>
      <Preliminaries />
    </HashRouter>,
    div,
  );
});
