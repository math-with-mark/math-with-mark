import * as React from 'react';
import { MathJaxContext } from 'better-react-mathjax';
import MathJax from 'better-react-mathjax/MathJax';
import { EditableMathField, addStyles } from 'react-mathquill';

addStyles();

function App() {
  const [latex, setLatex] = React.useState('\\frac{1}{\\sqrt{2}}\\cdot 2');

  return (
    <MathJaxContext>
      <EditableMathField
        latex={latex}
        onChange={(mathField) => setLatex(mathField.latex())}
      />
      <MathJax>{`$$${latex}$$`}</MathJax>
    </MathJaxContext>
  );
}

export default App;
