import React from 'react';
import { routeTo } from '../../Routes';
import IntegerExponents from './Preliminaries/IntegerExponents';
import { Link } from 'react-router-dom';

const Preliminaries = () => (
  <div>
    <h2>Preliminaries</h2>
    <p>
      In this chapter, we will cover topics that are essential to solving
      algebraic problems. These topics might seem relatively simple, but they
      are fundamental for the complex material covered in later chapters.
    </p>
    <ol>
      <li>
        <Link to={routeTo(IntegerExponents)}>Integer Exponents</Link>: The
        properties of exponents that are most common in algebraic expressions.
        This section focuses on positive integers for simplicity, and other
        exponent types are covered later.
      </li>
    </ol>
  </div>
);

export default Preliminaries;
