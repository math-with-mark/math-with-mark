import { MathJax } from 'better-react-mathjax';
import React from 'react';
import { EditableMathField } from 'react-mathquill';
import Sandbox from './Sandbox';
import { texToMath, tryParse } from './utils/mathwm';

function App() {
  const [latex, setLatex] = React.useState('\\frac{1}{\\sqrt{2}}\\cdot 2');

  return (
    <>
      <h1>Math with Mark</h1>
      <EditableMathField
        latex={latex}
        onChange={(mathField) => setLatex(mathField.latex())}
      />
      <MathJax dynamic>{`$$${latex}$$`}</MathJax>
      <p>{`Parsed LaTeX: ${tryParse(texToMath(latex))?.toString()}`}</p>
      <h2>Sandbox</h2>
      <Sandbox />
    </>
  );
}

export default App;
