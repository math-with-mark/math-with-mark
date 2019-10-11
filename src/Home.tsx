import React from 'react';
import MathJax from 'react-mathjax';

const Home = (): JSX.Element => (
  <div>
    <h2>Home</h2>
    <p>Free, accessible, interactive math lessons.</p>
    <p>This site is under construction.</p>
    <p>
      Check out{' '}
      <a href="https://github.com/mark-wiemer/math-with-mark">
        the repository on GitHub
      </a>{' '}
      for more information.
    </p>
    <MathJax.Provider>
      <p>
        This is an inline math formula:{' '}
        <MathJax.Node inline formula={'a^2 + b^2 = c^2'} />
      </p>
      <p>
        And a block one:
        <MathJax.Node formula={'F(x) = \\int_a^b f(t)\\,dt'} />
      </p>
    </MathJax.Provider>
  </div>
);

export default Home;
