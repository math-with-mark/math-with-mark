import React from 'react';
import ReactDOM from 'react-dom';

import About from './About';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<About />, div);
  expect(true).toBe(false); // introduced failure to test Circle CI
});
