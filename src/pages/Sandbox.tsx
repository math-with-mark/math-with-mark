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
  termLatex: string;
  answerLatex: string;
  constructor(props?: any) {
    super(props);
    this.state = {
      latex: '', // used for initial population
    };
    this.mathField = (null as unknown) as MathField; // assigned on mount
    this.expressionLatex = this.termLatex = this.answerLatex = ''; // assigned in `new`
    this.new();
  }

  new = (): void => {
    if (this.mathField) this.mathField.latex('');
    let a = Math.ceil(Math.random() * 10);
    let b = Math.ceil(Math.random() * 10);
    this.expressionLatex = `${a}x^{${b}}`;
    this.termLatex = `x^{${b}}`;
    this.answerLatex = `${a}`;
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
    const evaluation = mathwm.tryEvaluateAlgebraic(text);
    super.setState({ latex, text, evaluation });
  }

  isCorrect = (): boolean => {
    return this.state.evaluation === this.answerLatex;
  };

  render() {
    return (
      <div>
        <p>
          What is the coefficient of <Latex inline content={this.termLatex} />{' '}
          in <Latex inline content={this.expressionLatex} />?
        </p>
        Your answer:{' '}
        <EditableMathField
          latex={this.state.latex}
          onChange={this.onChange}
          mathquillDidMount={this.mathQuillDidMount}
        />
        <div className="result-container">
          <p>
            Your answer of '{this.state.text}' is{' '}
            {this.isCorrect() ? 'correct!' : 'incorrect.'}
          </p>
        </div>
        <div className="result-container">
          <p>
            {' '}
            Your answer arithmetically evaluates to:{' '}
            {mathwm
              .tryEvaluateArithmetic(this.state.text ? this.state.text : '0')
              .toString()}
          </p>
        </div>
        <div className="result-container">
          <p>
            {' '}
            Your answer algebraically evaluates to:{' '}
            {mathwm
              .tryEvaluateAlgebraic(this.state.text ? this.state.text : '0')
              .toString()}
          </p>
        </div>
        <button onClick={this.new}>New Challenge</button>
      </div>
    );
  }
}

export default Sandbox;
