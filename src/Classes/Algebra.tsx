import React from 'react';
import { Link, HashRouter } from 'react-router-dom';
import { routeTo } from '../Routes';
import Preliminaries from './Alg/Preliminaries';

const Algebra = (): JSX.Element => (
  <HashRouter>
    <h2>Algebra</h2>
    <p>
      Algebra is the introduction to abstraction in math. Instead of writing all
      values explicitly, some values are replaced with symbols to mark unknowns.
      In this way, the core structure of the expression can be manipulated
      without concern for the actual values. An understanding of these abstract
      manipulations are key to success not only in mathematics, but also in
      logic, philosophy, and communication.
    </p>
    <h3>
      <Link to={routeTo(Preliminaries)}>Preliminaries</Link>
    </h3>
  </HashRouter>
);

export default Algebra;
