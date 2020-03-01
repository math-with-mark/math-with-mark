import * as mathjs from 'mathjs';

/**
 * Returns the coefficient of terms of the form (COEFFICIENT)(SYMBOL)^(POWER).
 *
 * CONTRACT: Expression must be of the form \sum{Ax^B}, A, B constant; x any
 * symbol
 * @param root The root of the AST
 * @param symbol The symbol to evaluate
 * @param power The power to which `symbol` is raised
 */
export function coefficient(
  root: mathjs.MathNode,
  symbol: string,
  power: number,
): number {
  // node is OperatorNode from contract, either '+' or '*'
  let leftChild = args(root)[0];
  let rightChild = args(root)[1];
  if (root.op === '+') {
    return (
      coefficient(leftChild, symbol, power) +
      coefficient(rightChild, symbol, power)
    );
  }
  // op === '*', left child is coeff, right child is exp node
  let actualSymbol = args(rightChild)[0].name;
  let actualPower = args(rightChild)[1].value;
  if (actualSymbol === symbol && actualPower === power) {
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
 * Tries to evaluate the given algebraic expression. If the text is not able to
 * be evaluated, returns 'Invalid expression'. Otherwise, returns the evaluation
 * @param text The expression to be evaluated
 * @return the evaluation, if possible, otherwise 'Invalid expression'
 */
export function tryEvaluate(text: string): string {
  let evaluation = 'Invalid expression';
  try {
    evaluation = mathjs.evaluate(text); // may return object, or undefined
  } catch (err) {
    // do nothing, invalid expression
  }
  return evaluation ? evaluation.toString() : 'Invalid expression';
}
