import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import About from './About';

const Index = () => (
  <div>
    <h2>Home</h2>
    <p>This site doesn't exist yet, unfortunately. But I'm working on it!</p>
  </div>
);

const App = () => (
  <div>
    <Alert variant="primary">This site is under construction.</Alert>
    <Router>
      <div>
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

        <Route path="/" exact component={Index} />
        <Route path="/about/" component={About} />
      </div>
    </Router>
  </div>
);

export default App;
