import React from 'react';

import { addStyles, EditableMathField, MathField } from 'react-mathquill';

addStyles();

interface State {
  latex: string
}

const Sandbox = (props?: State): JSX.Element => (
    <EditableMathField
    latex={props ? props.latex : ''}
    onChange={mathField => {
      console.log(mathField.latex())
    }}
    />
)

export default Sandbox


const initialLatex =
  '\\cos\\left(A\\right)=\\frac{b^2+c^2-a^2}{2\\cdot b\\cdot c}'

export class EditableMathExample extends React.Component<any, any> {
  mathQuillEl: null | MathField;
  resetField: () => void;
  constructor(props: any) {
    super(props)

    this.state = {
      latex: initialLatex,
      text: 'cos(A)=(b^2+c^2-a^2)/(2*b*c)',
    }

    this.mathQuillEl = null

    this.resetField = () => {
      (this.mathQuillEl as MathField).latex(initialLatex)
    }
  }

  render() {
    console.log(this)
    return (
      <div>
        Math field:{' '}
        <EditableMathField
          latex={this.state.latex}
          onChange={mathField => {
            const latex = mathField.latex()
            const text = (mathField as any).text()
            console.log('latex changed:', latex)
            console.log('text changed:', text)
            this.setState({ latex, text })
          }}
          mathquillDidMount={el => {
            this.mathQuillEl = el
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
        <button onClick={this.resetField}>Reset field</button>
      </div>
    )
  }
}
