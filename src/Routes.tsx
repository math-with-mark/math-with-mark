import React from 'react';
import { Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Algebra from './pages/classes/Algebra';
import Preliminaries from './pages/classes/alg/Preliminaries';
import IntegerExponents from './pages/classes/alg/01_preliminaries/IntegerExponents';

const Routes = (props: { routes: RouteObject[] }): JSX.Element => (
  <div>{props.routes.map(element => route(element, ''))}</div>
);

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
  new RouteObject('0', 'Home', '', Home, []),
  new RouteObject('1', 'About', 'About', About, []),
  new RouteObject('2', 'Classes', 'Classes', null, [
    new RouteObject('3', 'Algebra', 'Alg', Algebra, [
      new RouteObject('5', 'Preliminaries', 'Preliminaries', Preliminaries, [
        new RouteObject(
          '4',
          'Integer Exponents',
          'IntegerExponents',
          IntegerExponents,
          [],
        ),
      ]),
    ]),
  ]),
];

/**
 * Returns the absolute path to the component, if it exists. Otherwise, returns
 * the absolute path to 404.
 * @param component The component to route to
 */
export function routeTo(
  component: () => JSX.Element,
  routeList = routes,
  pathTo404 = '',
): string {
  return routeOr404(componentRoute(component, routeList), pathTo404);
}

/**
 * Returns the given route if it's defined, otherwise returns the path to 404.
 * @param route The potentially-defined route
 */
function routeOr404(route: string | undefined, pathTo404: string) {
  if (route === undefined) return pathTo404;
  return route;
}

/**
 * @param component The component to route to
 * @returns the path to the given component, if it exists, or undefined
 */
function componentRoute(
  component: () => JSX.Element,
  routes: RouteObject[],
): string | undefined {
  return componentRouteHelper(component, '', routes);
}

function componentRouteHelper(
  component: () => JSX.Element,
  path: string,
  routes: RouteObject[],
): string | undefined {
  let basePath = path;
  for (let route of routes) {
    path = `${basePath}/${route.path}`;
    if (route.component === component) return path;
    let childrenResult = componentRouteHelper(component, path, route.children);
    if (childrenResult) return childrenResult;
  }
  return undefined;
}

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
