import React from 'react';
import { HashRouter } from 'react-router-dom';

import ConstructionAlert from './ConstructionAlert';
import Navigation from './Navigation';
import Routes, { routes } from './Routes';
import { EditableMathExample } from './pages/Sandbox';

const App = (): JSX.Element => (
  <div>
    <EditableMathExample />
    <ConstructionAlert />
    <HashRouter>
      <Navigation routes={routes} />
      <Routes routes={routes} />
    </HashRouter>
  </div>
);

export default App;
