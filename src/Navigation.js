import React from 'react';
import { Link, Route } from 'react-router-dom';

import Home from './Home';
import About from './About';
import CalculusI from './classes/calcI/CalculusI';
import Review from './classes/calcI/Review';

export const routes = [
  {
    id: '0',
    path: '',
    name: 'Home',
    component: Home,
  },
  {
    id: '1',
    path: 'About',
    name: 'About',
    component: About,
  },
  {
    id: '2',
    path: 'Classes',
    name: 'Classes',
    children: [
      {
        id: '3',
        path: 'CalcI',
        name: 'Calculus I',
        component: CalculusI,
        children: [
          {
            id: '4',
            path: 'IntroReview',
            name: 'Review',
            component: Review,
          },
        ],
      },
    ],
  },
];

const Navigation = props => (
  <nav>
    <ul>{props.routes.map(element => link(element, ''))}</ul>
    {props.routes.map(element => route(element, ''))}
  </nav>
);

/* Return component to be rendered */
function link(element, basePath) {
  let fullPath = `${basePath}/${element.path}`;
  if (element.children !== undefined) {
    return (
      <div key={element.id}>
        <li>
          {element.component ? (
            <Link to={fullPath}>{element.name}</Link>
          ) : (
            element.name
          )}
        </li>
        <ul>{element.children.map(child => link(child, fullPath))}</ul>
      </div>
    );
  }
  return (
    <li key={element.id}>
      <Link to={fullPath}>{element.name}</Link>{' '}
    </li>
  );
}

function route(element, basePath) {
  let fullPath = `${basePath}/${element.path}`;
  if (element.children !== undefined) {
    return (
      <div key={element.id}>
        {element.component ? routeFor(element, fullPath) : ''}
        {element.children.map(child => route(child, fullPath))}
      </div>
    );
  }
  return routeFor(element, fullPath);
}

function routeFor(element, fullPath) {
  return (
    <Route
      key={element.id}
      exact
      path={fullPath}
      component={element.component}
    ></Route>
  );
}

export default Navigation;
