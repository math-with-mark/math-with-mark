import React from 'react';
import MathJax from 'react-mathjax';

const Latex = (props: LatexProps) => (
  <MathJax.Provider>
    <MathJax.Node inline={props.inline} formula={props.content} />
  </MathJax.Provider>
);

interface LatexProps {
  content: string;
  inline?: boolean;
}

export default Latex;
