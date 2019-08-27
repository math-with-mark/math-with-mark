import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

import About from './About';

function ConstructionAlert() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="primary" onClose={() => setShow(false)} dismissible>
        This site is under construction.
      </Alert>
    );
  }
  return '';
}

const Index = () => (
  <div>
    <h2>Home</h2>
    <p>This site doesn't exist yet, unfortunately. But I'm working on it!</p>
  </div>
);

const Navigation = () => (
  <nav>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/about/">About</Link>
      </li>
    </ul>
  </nav>
);

const App = () => (
  <div>
    <ConstructionAlert />
    <Router>
      <div>
        <Navigation />
        <Route path="/" exact component={Index} />
        <Route path="/about/" component={About} />
      </div>
    </Router>
  </div>
);

export default App;
