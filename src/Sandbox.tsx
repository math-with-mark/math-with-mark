import React from 'react';
import { addStyles, EditableMathField, MathField } from 'react-mathquill';

import * as mathwm from './utils/mathwm';
import * as rules from './utils/rules';

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
    this.mathField = null as unknown as MathField; // assigned on mount
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
    let rule: rules.Rule = rules.RULES[s.ruleID];
    return (
      <li key={s.node.toString()}>
        {s.node.toString()} ({rule.name}
        {rule.latex ? (
          <>
            {/* inline LaTeX */}: <div>{`$${rule.latex}$`}</div>
          </>
        ) : (
          <></>
        )}
        )
      </li>
    );
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
