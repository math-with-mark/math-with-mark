import React from 'react';
import Latex from '../../../Latex';

const IntegerExponents = (): JSX.Element => (
  <div>
    <h2>Algebra 1-1: Integer Exponents</h2>
    <p>
      Using exponents is very common in algebra. Just like multiplication is
      repeated addition, exponentiation (the fancy math term for raising a
      number to a power) is repeated multiplication.
    </p>
    <h3>Properties</h3>
    <ol>
      <li>
        <Latex inline content={'a^ba^c = a^{b+c}'} />. For example,{' '}
        <Latex inline content={'2^3\\cdot 2^4 = 2^7'} />
      </li>
    </ol>
  </div>
);

export default IntegerExponents;
