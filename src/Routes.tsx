import React from 'react';
import { Route } from 'react-router-dom';

import Home from './Home';
import About from './About';
import CalculusI from './classes/calcI/CalculusI';
import Review from './classes/calcI/Review';

export class RouteObject {
  id: string;
  name: string;
  path: string;
  component: (() => JSX.Element) | null;
  children: RouteObject[];
  constructor(
    id: string,
    name: string,
    path: string,
    component: (() => JSX.Element) | null,
    children: RouteObject[],
  ) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.component = component;
    this.children = children;
  }
}

export const routes: RouteObject[] = [
  new RouteObject('0', 'Home', 'Home', Home, []),
  new RouteObject('1', 'About', 'About', About, []),
  new RouteObject('2', 'Classes', 'Classes', null, [
    new RouteObject('3', 'Calculus I', 'CalcI', CalculusI, [
      new RouteObject('4', 'Review', 'IntroReview', Review, []),
    ]),
  ]),
];

const Routes = (props: { routes: RouteObject[] }): JSX.Element => (
  <div>{props.routes.map(element => route(element, ''))}</div>
);

function route(element: RouteObject, basePath: string): JSX.Element {
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

function routeFor(element: RouteObject, fullPath: string): JSX.Element {
  return (
    <Route
      key={element.id}
      exact
      path={fullPath}
      // Ternary just to quiet type-checker. Check is done in route method
      component={element.component ? element.component : undefined}
    ></Route>
  );
}

export default Routes;
