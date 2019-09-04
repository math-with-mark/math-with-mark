import React from 'react';
import ReactDOM from 'react-dom';

import ConstructionAlert from './ConstructionAlert';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ConstructionAlert />, div);
});
