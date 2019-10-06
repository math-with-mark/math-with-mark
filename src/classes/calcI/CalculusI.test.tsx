import React from 'react';
import ReactDOM from 'react-dom';

import CalculusI from './CalculusI';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CalculusI />, div);
});
