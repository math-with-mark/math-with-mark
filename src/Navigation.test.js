import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Link } from 'react-router-dom';
import { shallow, render } from 'enzyme';

import Navigation, { RouteObject } from './Navigation';

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
  const id = '0',
    name = 'Home (where the heart is)',
    path = 'Home',
    component = () => <h1>Home</h1>,
    children = [];
  const routes = [new RouteObject(id, name, path, component, children)];
  const expectedChild = <Link to={`/${path}`}>{name}</Link>;

  const wrapper = shallow(<Navigation routes={routes} />);

  expect(wrapper.containsMatchingElement(expectedChild)).toEqual(true);
});

it('renders nested links', () => {
  const id = '0',
    id2 = '1',
    name = 'Home (where the heart is)',
    name2 = 'More Details',
    path = 'Home',
    path2 = 'MoreDeets',
    component = () => <h1>Home</h1>,
    component2 = () => <h2>More</h2>;
  const routes = [
    new RouteObject(id, name, path, component, [
      new RouteObject(id2, name2, path2, component2, []),
    ]),
  ];

  const wrapper = render(
    <HashRouter>
      <Navigation routes={routes} />
    </HashRouter>,
  );

  expect(wrapper.find(`a[href="#/${path}"]`).length).toBe(1);
  expect(wrapper.find(`a[href="#/${path}/${path2}"]`).length).toBe(1);
});

it('renders link nested in non-link', () => {
  const id = '0',
    id2 = '1',
    name = 'Home (where the heart is)',
    name2 = 'More Details',
    path = 'Home',
    path2 = 'MoreDeets',
    component2 = () => <h2>More</h2>;
  const routes = [
    new RouteObject(id, name, path, undefined, [
      new RouteObject(id2, name2, path2, component2, []),
    ]),
  ];

  const wrapper = render(
    <HashRouter>
      <Navigation routes={routes} />
    </HashRouter>,
  );

  // one link only, should be a link to path/path2
  expect(wrapper.find('a').length).toBe(1);
  expect(wrapper.find(`a[href="#/${path}/${path2}"]`).length).toBe(1);
});

it('renders multiple children deeply nested', () => {
  const routes = [
    new RouteObject('0', 'Home', 'home', () => <></>, [
      new RouteObject('1', 'Oldest Child', 'oldest', undefined, [
        new RouteObject('2', 'Older grandchild', 'oldergrand', () => <></>, []),
        new RouteObject('3', 'Younger grandchild', 'youngg', undefined, []),
      ]),
      new RouteObject('4', 'Middle Child', 'middle', () => <></>, []),
      new RouteObject('5', 'Best  Child', 'best', () => <></>, []),
    ]),
    new RouteObject('6', 'About', 'about', undefined, []),
  ];

  const wrapper = render(
    <HashRouter>
      <Navigation routes={routes} />
    </HashRouter>,
  );

  expect(wrapper.find('li').length).toBe(7);
});
