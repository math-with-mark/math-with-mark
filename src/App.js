import React from 'react';
import { HashRouter } from 'react-router-dom';

import ConstructionAlert from './ConstructionAlert';
import Navigation from './Navigation';

const App = () => (
  <div>
    <ConstructionAlert />
    <HashRouter>
      <Navigation />
    </HashRouter>
  </div>
);

export default App;
