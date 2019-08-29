import React from 'react';
import { HashRouter } from 'react-router-dom';

import ConstructionAlert from './ConstructionAlert';
import Navigation, { routes } from './Navigation';

const App = () => (
  <div>
    <ConstructionAlert />
    <HashRouter>
      <Navigation routes={routes} />
    </HashRouter>
  </div>
);

export default App;
