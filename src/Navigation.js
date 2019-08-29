import React from 'react';
import { Link, Route } from 'react-router-dom';

import Home from './Home';
import About from './About';
import CalculusI from './classes/calcI/CalculusI';
import Review from './classes/calcI/Review';

export class RouteObject {
  constructor(id, name, path, component, children) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.component = component;
    this.children = children;
  }
}

export const routes = [
  new RouteObject('0', 'Home', 'Home', Home, undefined),
  new RouteObject('1', 'About', 'About', About, undefined),
  new RouteObject('2', 'Classes', 'Classes', undefined, [
    new RouteObject('3', 'Calculus I', 'CalcI', CalculusI, [
      new RouteObject('4', 'Review', 'IntroReview', Review, undefined),
    ]),
  ]),
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
