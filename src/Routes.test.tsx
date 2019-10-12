import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import Routes, { routeTo, RouteObject } from './Routes';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <HashRouter>
      <Routes routes={[]} />
    </HashRouter>,
    div,
  );
});

describe('routeTo', () => {
  it('navigates to 404 on empty routes', () => {
    let sut = routeTo(() => <></>, [], '404');
    expect(sut).toBe('404');
  });

  it('navigates to 404 on unfound component', () => {
    let routes = [
      new RouteObject('0', 'mock1', 'path1', null, []),
      new RouteObject('1', 'mock2', 'path2', null, []),
      new RouteObject('2', 'Home', 'homePath', null, []),
    ];

    let sut = routeTo(() => <></>, routes, '404');

    expect(sut).toEqual('404');
  });

  it('navigates to found component', () => {
    let component = () => <></>;

    let routes = [
      new RouteObject('0', 'mock1', 'path1', null, []),
      new RouteObject('1', 'mock2', 'path2', null, []),
      new RouteObject('2', 'Home', 'homePath', component, []),
    ];

    let sut = routeTo(component, routes);

    expect(sut).toBe('/homePath');
  });

  it('navigates to deeply nested component in complex routes', () => {
    let component = () => <></>;

    let routes = [
      new RouteObject('0', 'mock1', 'path1', null, [
        new RouteObject('0', 'mock1', 'path1', null, []),
        new RouteObject('0', 'mock1', 'path1', null, []),
      ]),
      new RouteObject('0', 'mock1', 'A', null, [
        new RouteObject('0', 'mock1', 'path1', null, []),
        new RouteObject('0', 'mock1', 'B', null, [
          new RouteObject('0', 'mock1', 'path1', null, []),
          new RouteObject('0', 'mock1', 'C', component, []),
          new RouteObject('0', 'mock1', 'path1', null, []),
        ]),
      ]),
      new RouteObject('0', 'mock1', 'path1', null, [
        new RouteObject('0', 'mock1', 'path1', null, []),
        new RouteObject('0', 'mock1', 'path1', null, []),
      ]),
    ];

    let sut = routeTo(component, routes);

    expect(sut).toBe('/A/B/C');
  });
});
