import React from 'react';
import { Route } from 'react-router-dom';

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
  new RouteObject('0', 'Home', 'Home', Home, []),
  new RouteObject('1', 'About', 'About', About, []),
  new RouteObject('2', 'Classes', 'Classes', undefined, [
    new RouteObject('3', 'Calculus I', 'CalcI', CalculusI, [
      new RouteObject('4', 'Review', 'IntroReview', Review, []),
    ]),
  ]),
];

const Routes = props => (
  <div>{props.routes.map(element => route(element, ''))}</div>
);

function route(element, basePath) {
  let fullPath = `${basePath}/${element.path}`;
  if (element.children.length > 0) {
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

export default Routes;
