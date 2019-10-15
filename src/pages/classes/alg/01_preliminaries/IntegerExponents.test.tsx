import React from 'react';
import ReactDOM from 'react-dom';

import IntegerExponents from './IntegerExponents';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<IntegerExponents />, div);
});
