import React from 'react';
import { addStyles, EditableMathField, MathField } from 'react-mathquill';

import * as mathwm from '../ts/mathwm';
import Latex from '../Latex';

addStyles();

/** Wraps StatefulSandbox for procedurally-generated routing */
const Sandbox = (): JSX.Element => <StatefulSandbox />;

class StatefulSandbox extends React.Component<any, any> {
  mathField: MathField;
  expressionLatex: string;
  answerString: string;
  constructor(props?: any) {
    super(props);
    this.state = {
      latex: '', // used for initial population
    };
    this.mathField = (null as unknown) as MathField; // assigned on mount
    this.expressionLatex = this.answerString = ''; // assigned in `new`
    this.new();
  }

  new = (): void => {
    if (this.mathField) this.mathField.latex('');
    let a = Math.ceil(Math.random() * 10);
    let b = Math.ceil(Math.random() * 10);
    this.expressionLatex = `x^{${a}}x^{${b}}`;
    this.answerString = `x ^ ${a + b}`;
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
    const mathText = mathwm.texToMath(latex);
    const evaluation = mathwm.tryEvaluateAlgebraic(mathText);
    super.setState({ latex, text, evaluation });
  }

  isCorrect = (): boolean => {
    return (
      this.state.evaluation === mathwm.tryEvaluateAlgebraic(this.answerString)
    );
  };

  render() {
    return (
      <div>
        <p>
          Evaluate <Latex inline content={this.expressionLatex} />.
        </p>
        <p>
          Your answer:{' '}
          <EditableMathField
            latex={this.state.latex}
            onChange={this.onChange}
            mathquillDidMount={this.mathQuillDidMount}
          />
        </p>
        <div className="result-container">
          <p>(Unprocessed) Tex: {this.state.latex}</p>
          <p>(Processed) MathText: {mathwm.texToMath(this.state.latex)}</p>
          <p>Evaluation of MathText: {this.state.evaluation}</p>
          <p>Correct answer: {this.answerString}</p>
          <p>Your answer is {this.isCorrect() ? 'correct!' : 'incorrect.'}</p>
        </div>
        <button onClick={this.new}>New Challenge</button>
      </div>
    );
  }
}

export default Sandbox;
