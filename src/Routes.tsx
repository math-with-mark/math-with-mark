import React from 'react';
import { Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Algebra from './pages/classes/Algebra';
import Preliminaries from './pages/classes/alg/Preliminaries';
import IntegerExponents from './pages/classes/alg/01_preliminaries/IntegerExponents';
import Sandbox from './pages/Sandbox';

const Routes = (props: { routes: RouteObject[] }): JSX.Element => (
  <div>{props.routes.map(element => recursiveRoute(element, ''))}</div>
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
  new RouteObject('6', 'Sandbox', 'Sandbox', Sandbox, []),
];

/**
 * Returns the absolute path to the component, if it exists. Otherwise, returns
 * the absolute path to 404. Used globally to generate paths in links.
 * @param component The component to route to
 * @param routeObjects may contain RouteObject corresponding to component
 * @param pathTo404 path to return in case there is no corresponding RouteObject
 */
export function path(
  component: () => JSX.Element,
  routeObjects = routes,
  pathTo404 = '',
): string {
  let potentialPath = pathHelper(component, '', routeObjects);
  return potentialPath !== null ? potentialPath : pathTo404;
}

/**
 * Searches recursively through `routeObjects`, looking for an object whose
 * component matches `component`. If one is found, returns the path to that
 * `routeObject`. Else, returns null.
 * @param component the component to path to
 * @param partialPath the path generated so far
 * @param routeObjects
 * @return path to component, or null if no match found
 */
function pathHelper(
  component: () => JSX.Element,
  partialPath: string,
  routeObjects: RouteObject[],
): string | null {
  let basePath = partialPath; // must save base before repeatedly updating
  for (let routeObject of routeObjects) {
    partialPath = `${basePath}/${routeObject.path}`;
    if (routeObject.component === component) return partialPath; // found match
    // no match here, search children of this RouteObject
    let childrenResult = pathHelper(
      component,
      partialPath,
      routeObject.children,
    );
    if (childrenResult !== null) return childrenResult;
    // no match in these children, start again with next element in list
  }
  return null;
}

/**
 * Returns a div containing a `Route` for each of this `RouteObject` and this
 * `RouteObject`'s descendants
 * @param routeObject
 * @param basePath
 */
function recursiveRoute(routeObject: RouteObject, basePath: string): JSX.Element {
  let fullPath = `${basePath}/${routeObject.path}`;
  return (
    <div key={routeObject.id}>
      {routeObject.component ? route(routeObject, fullPath) : ''}
      {routeObject.children.map(child => recursiveRoute(child, fullPath))}
    </div>
  );
}

/**
 * Returns the `Route` corresponding to the given `RouteObject` and `path`.
 * Does not return the route for any children
 * @param routeObject
 * @param path
 * @precondition `typeof(routeObject.component) === '() => JSX.Element'`
 */
function route(routeObject: RouteObject, path: string): JSX.Element {
  return (
    <Route
      key={routeObject.id}
      exact
      path={path}
      component={routeObject.component as () => JSX.Element}
    ></Route>
  );
}

export default Routes;
