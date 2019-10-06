import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Procedurally generated nested, unordered list of internal links
 * @param {*} props should contain a `routes` attribute that is a list of
 * `RouteObject`s
 */
const Navigation = props => (
  <nav>
    <ul>{props.routes.map(element => link(element, ''))}</ul>
  </nav>
);

/* Return component to be rendered */
function link(element, basePath) {
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
