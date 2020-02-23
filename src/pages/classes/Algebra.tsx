import React from 'react';
import { Link, HashRouter } from 'react-router-dom';
import { path } from '../../Routes';
import Preliminaries from './alg/Preliminaries';
import IntegerExponents from './alg/01_preliminaries/IntegerExponents';

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
      <Link to={path(Preliminaries)}>Preliminaries</Link>
    </h3>
    <p>
      In this chapter we focus on properties of expressions used frequently in
      algebra. This includes exponents, polynomials, rational expressions, and
      complex numbers.
    </p>
    <ul>
      <li>
        <p>
          <Link to={path(IntegerExponents)}>Integer Exponents</Link>: The
          properties of exponents that are most common in algebraic expressions.
        </p>
      </li>
    </ul>
  </HashRouter>
);

export default Algebra;
