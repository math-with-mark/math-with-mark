import * as mathjs from 'mathjs';

/**
 * Returns the coefficient of terms of the form (COEFFICIENT)(SYMBOL)^(POWER).
 *
 * CONTRACT: Expression must be of the form \sum{Ax^B}, A, B constant; x any
 * variable
 * @param root The root of the AST
 * @param variable The variable to evaluate
 * @param exponent The power to which the variable is raised
 */
export function coefficient(
  root: mathjs.MathNode,
  variable: string,
  exponent: number,
): number {
  // node is OperatorNode from contract, either '+' or '*'
  let leftChild = args(root)[0];
  let rightChild = args(root)[1];
  if (root.op === '+') {
    return (
      coefficient(leftChild, variable, exponent) +
      coefficient(rightChild, variable, exponent)
    );
  }
  // op === '*', left child is coeff, right child is exp node
  let actualVariable = args(rightChild)[0].name;
  let actualExponent = args(rightChild)[1].value;
  if (actualVariable === variable && actualExponent === exponent) {
    return leftChild.value;
  }
  // not a match, this term does not contribute to coefficient
  return 0;
}

/** Wrapper to simplify cast of node.args to mathjs.MathNode */
function args(node: mathjs.MathNode): mathjs.MathNode[] {
  return node.args as mathjs.MathNode[];
}

/**
 * Tries to evaluate the arithmetic expression. If `mathText` is not able to
 * be evaluated, returns 'Invalid expression'. Otherwise, returns the evaluation
 * @param mathText The expression to be evaluated, as interpreted by mathjs
 * @return the evaluation, if possible, otherwise 'Invalid expression'
 */
export function tryEvaluateArithmetic(mathText: string): string {
  return tryMath(mathText, true);
}

/**
 * Tries to evaluate the algebraic expression. If `mathText` is not able to
 * be evaluated, returns 'Invalid expression'. Otherwise, returns the evaluation
 * @param mathText The expression to be evaluated, as interpreted by mathjs
 * @return the evaluation, if possible, otherwise 'Invalid expression'
 */
export function tryEvaluateAlgebraic(mathText: string): string {
  return tryMath(mathText, false);
}

function tryMath(mathText: string, arithmetic: boolean): string {
  let func = arithmetic ? mathjs.evaluate : mathjs.simplify;
  let evaluation: any = undefined;
  try {
    evaluation = func(mathText); // may return object or undefined
  } catch (err) {
    // do nothing, invalid expression
  }
  return evaluation ? evaluation.toString() : 'Invalid expression';
}
