import React from 'react';
import { Link } from 'react-router-dom';
import { RouteObject } from './Routes';

/**
 * Procedurally generated, nested, unordered list of internal links
 */
const Navigation = (props: { routes: RouteObject[] }): JSX.Element => (
  <nav>
    <ul>{props.routes.map(element => link(element, ''))}</ul>
  </nav>
);

/* Return component to be rendered */
function link(element: RouteObject, basePath: string): JSX.Element {
  let fullPath = `${basePath}/${element.path}`;
  return (
    <li key={element.id}>
      {element.component ? (
        <Link to={fullPath}>{element.name}</Link>
      ) : (
        element.name
      )}
      <ul>{element.children.map(child => link(child, fullPath))}</ul>
    </li>
  );
}

export default Navigation;
