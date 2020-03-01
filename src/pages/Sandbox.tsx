import React from 'react';

import * as mathjs from 'mathjs';
import { addStyles, EditableMathField, MathField } from 'react-mathquill';

addStyles();

const initialLatex = '3^{2} + 4^{2}';

const Sandbox = (): JSX.Element => <EditableMathExample latex={initialLatex} />;

export default Sandbox;

export class EditableMathExample extends React.Component<any, any> {
  mathField: null | MathField;
  initialLatex: string
  constructor(props: { latex: string }) {
    super(props);
    this.initialLatex = props.latex; // save for resetting
    this.state = {
      latex: initialLatex, // used for initial population
    };
    this.mathField = null;
  }

  reset = (): void => {
    (this.mathField as MathField).latex(initialLatex);
  }

  onChange = (): void => {
    this.updateState();
  }

  mathQuillDidMount = (mathField: MathField): void => {
    this.mathField = mathField;
    this.updateState();
  }

  updateState(): void {
    const latex = (this.mathField as MathField).latex();
    const text = (this.mathField as any).text();
    const evaluation = this.tryEvaluate(text as string);
    super.setState({ latex, text, evaluation });
  }

  tryEvaluate(text: string): string {
    let evaluation = 'Invalid expression';
    try {
      evaluation = mathjs.evaluate(text);
    } catch (err) {
      // do nothing, invalid expression
    }
    return evaluation.toString();
  }

  render() {
    return (
      <div>
        Math field:{' '}
        <EditableMathField
          latex={this.state.latex}
          onChange={this.onChange}
          mathquillDidMount={this.mathQuillDidMount} 
        />
        <div className="result-container">
          <span>Raw latex:</span>
          <span className="result-latex">{this.state.latex}</span>
        </div>
        <div className="result-container">
          <span>Raw text:</span>
          <span className="result-latex">{this.state.text}</span>
        </div>
        <p>Answer: {this.state.evaluation}</p>
        <button onClick={this.reset}>Reset</button>
      </div>
    );
  }
}
