import React from 'react';
import { addStyles, EditableMathField, MathField } from 'react-mathquill';

import { tryEvaluate } from '../ts/math';

addStyles();

const initialLatex = '3^{2} + 4^{2}';

/** Wraps StatefulSandbox for generated routing */
const Sandbox = (): JSX.Element => <StatefulSandbox latex={initialLatex} />;

class StatefulSandbox extends React.Component<any, any> {
  mathField: MathField;
  initialLatex: string;
  constructor(props: { latex: string }) {
    super(props);
    this.initialLatex = props.latex; // save for resetting
    this.state = {
      latex: initialLatex, // used for initial population
    };
    this.mathField = (null as unknown) as MathField; // assigned on mount
  }

  reset = (): void => {
    this.mathField.latex(initialLatex);
  };

  onChange = (): void => {
    this.updateState();
  };

  mathQuillDidMount = (mathField: MathField): void => {
    this.mathField = mathField;
    this.updateState();
  };

  updateState(): void {
    const latex = this.mathField.latex();
    const text = this.mathField.text();
    const evaluation = tryEvaluate(text);
    super.setState({ latex, text, evaluation });
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

export default Sandbox;
