import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import Navigation, { RouteObject } from './Navigation';

const Home = () => <h1>Home</h1>;

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <HashRouter>
      <Navigation routes={[]} />
    </HashRouter>,
    div,
  );
});

it('renders simple links', () => {
  const div = document.createElement('div');
  const routes = [
    new RouteObject('0', 'Home', 'Home', Home, undefined),
  ];

  ReactDOM.render(
    <HashRouter>
      <Navigation routes={routes} />
    </HashRouter>,
    div,
  );
});
