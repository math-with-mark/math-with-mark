import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import ConstructionAlert from './ConstructionAlert';
import Navigation from './Navigation';

const App = () => (
  <div>
    <ConstructionAlert />
    <Router>
      <Navigation />
    </Router>
  </div>
);

export default App;
