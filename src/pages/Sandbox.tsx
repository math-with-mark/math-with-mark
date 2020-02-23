import React from 'react';

import * as mathjs from 'mathjs';
import { addStyles, EditableMathField, MathField } from 'react-mathquill';

addStyles();

const initialLatex = '3^{2} + 4^{2}';

const Sandbox = (): JSX.Element => <EditableMathExample />;

export default Sandbox;

export class EditableMathExample extends React.Component<any, any> {
  mathQuillEl: null | MathField;
  resetField: () => void;
  constructor(props: any) {
    super(props);

    this.state = {
      latex: initialLatex, // used for initial population
      text: undefined, // automatically filled in on mount
    };

    this.mathQuillEl = null;

    this.resetField = () => {
      (this.mathQuillEl as MathField).latex(initialLatex);
    };
  }

  /**
   * Update state, including property for evaluation of text as an expression
   * @param state The partial new state
   */
  setState(state: any) {
    state.simplified = (() => {
      let result = 'Invalid expression';
      try {
        result = mathjs.evaluate(state.text); // sometimes returns an object
      } catch (err) {
        // do nothing, invalid expression
      }
      return result.toString(); // must be cast to string, cannot return object
    })();
    super.setState(state);
  }

  render() {
    return (
      <div>
        Math field:{' '}
        <EditableMathField
          latex={this.state.latex}
          onChange={mathField => {
            const latex = mathField.latex();
            const text = (mathField as any).text();
            this.setState({ latex, text });
          }}
          mathquillDidMount={el => {
            this.mathQuillEl = el;
            let latex = el.latex();
            let text = (el as any).text();
            this.setState({ latex, text });
          }}
        />
        <div className="result-container">
          <span>Raw latex:</span>
          <span className="result-latex">{this.state.latex}</span>
        </div>
        <div className="result-container">
          <span>Raw text:</span>
          <span className="result-latex">{this.state.text}</span>
        </div>
        <p>Answer: {this.state.simplified}</p>
        <button onClick={this.resetField}>Reset field</button>
      </div>
    );
  }
}
