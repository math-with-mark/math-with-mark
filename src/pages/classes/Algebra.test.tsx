import React from 'react';
import ReactDOM from 'react-dom';

import Algebra from './Algebra';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Algebra />, div);
});
