import React from 'react';
import { addStyles, EditableMathField, MathField } from 'react-mathquill';

import * as mathwm from '../ts/mathwm';
import RuleID from '../ts/rules';

addStyles();

/** Wraps StatefulSandbox for procedurally-generated routing */
const Sandbox = (): JSX.Element => <StatefulSandbox />;

class StatefulSandbox extends React.Component<any, any> {
  mathField: MathField;
  constructor(props?: any) {
    super(props);
    this.state = {
      latex: '', // used for initial population
    };
    this.mathField = (null as unknown) as MathField; // assigned on mount
  }

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
    const node = mathwm.tryParse(mathText);
    const evaluation =
      node === null
        ? 'Invalid expression'
        : mathwm.evaluate(node, false).toString();
    super.setState({ latex, text, evaluation });
  }

  evaluationSteps = (): JSX.Element => {
    const mathText = mathwm.texToMath(this.state.latex);
    const node = mathwm.tryParse(mathText);
    if (node === null) return <p>Invalid expression</p>;
    const steps = mathwm.steps(node);
    return (
      <div>
        <p>Evaluation steps:</p>
        <ol>{steps.map(this.step)}</ol>
      </div>
    );
  };

  step = (s: mathwm.Step): JSX.Element => {
    return (
      <li key={s.node.toString()}>
        <p>
          {s.node.toString()} ({this.nameOf(s.rule as RuleID)})
        </p>
      </li>
    );
  };

  nameOf = (rule: RuleID): string => {
    switch (rule) {
      case RuleID.None:
        return 'Initial expression';
      case RuleID.Arithmetic:
        return 'Arithmetic';
      case RuleID.ProductOfOneVariable:
        return 'Product of One Variable';
      case RuleID.PowerToPower:
        return 'Power to Power';
      default:
        return 'Unknown';
    }
  };

  render() {
    return (
      <div>
        Enter an expression:{' '}
        <EditableMathField
          latex={this.state.latex}
          onChange={this.onChange}
          mathquillDidMount={this.mathQuillDidMount}
        />
        <br />
        <div>(Unprocessed) Tex: {this.state.latex}</div>
        <br />
        <div>(Processed) MathText: {mathwm.texToMath(this.state.latex)}</div>
        <br />
        <div>Evaluation of MathText: {this.state.evaluation}</div>
        <br />
        {this.evaluationSteps()}
      </div>
    );
  }
}

export default Sandbox;
