import * as React from 'react';
import * as mathjs from 'mathjs';
import { MathJaxContext } from 'better-react-mathjax';
import MathJax from 'better-react-mathjax/MathJax';
import { EditableMathField, addStyles } from 'react-mathquill';
import Sandbox from './Sandbox';

addStyles();

export function texToMath(tex: string): string {
  tex = tex.split('{').join('(');
  tex = tex.split('}').join(')');
  tex = tex.split('\\left').join('');
  tex = tex.split('\\right').join('');
  tex = tex.split(/\\cdot ?/).join(' * ');
  return tex;
}

export function tryParse(mathText: string) {
  if (mathText.trim() === '') return null;
  try {
    let node = mathjs.parse(mathText);
    return node;
  } catch (err) {
    return null;
  }
}

function App() {
  const [latex, setLatex] = React.useState('\\frac{1}{\\sqrt{2}}\\cdot 2');

  return (
    <MathJaxContext>
      <h1>Math with Mark</h1>
      <EditableMathField
        latex={latex}
        onChange={(mathField) => setLatex(mathField.latex())}
      />
      <MathJax>{`$$${latex}$$`}</MathJax>
      <p>{`Parsed LaTeX: ${tryParse(texToMath(latex))?.toString()}`}</p>
      <h2>Sandbox</h2>
      <Sandbox />
    </MathJaxContext>
  );
}

export default App;
