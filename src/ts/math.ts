import * as mathjs from 'mathjs';
import Rule from './rules';

/** Used for functions that apply one rule to an expression and return the result */
type StepFunction = (n: mathjs.MathNode) => mathjs.MathNode;

/** Maps each rule to a function that applies that rule to a given math node */
const rulesToFunctions: Record<Rule, StepFunction> = {
  [Rule.ProductOfOneVariable]: productOfOneVariable,
};

function productOfOneVariable(node: mathjs.MathNode): mathjs.MathNode {
  // If this is a product of two exponentiations (nominal case)
  if (
    node.op === '*' &&
    node.args?.[0].op === '^' &&
    node.args?.[1].op === '^'
  ) {
    let leftVariable = node.args?.[0].args?.[0].name;
    let rightVariable = node.args?.[1].args?.[0].name;
    // If both variables are defined and equal, assume
    if (leftVariable !== undefined && leftVariable === rightVariable) {
      let leftExponent: number = node.args?.[0].args?.[1].value;
      let rightExponent: number = node.args?.[1].args?.[1].value;
      return mathjs.parse(`${leftVariable}^(${leftExponent}+${rightExponent})`);
    }
  }
  return node;
}

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

function tryParse(mathText: string): mathjs.MathNode | null {
  let node: mathjs.MathNode | null = null;
  try {
    node = mathjs.parse(mathText);
  } catch (err) {
    // do nothing, invalid text
  }
  return node;
}

/**
 * Applies the given rule to the given expression
 * @param mathText The string version of the expression in mathjs format
 * @param rule The rule to apply
 * @return the result of applying the given rule to the given expression.
 * If the given expression cannot be parsed or the rule cannot be applied,
 * returns `mathText` as given
 */
export function mwmStep(mathText: string, rule: Rule): string {
  let node: mathjs.MathNode | null = tryParse(mathText);
  if (node === null) return mathText;

  let evaluation = rulesToFunctions[rule](node).toString();
  evaluation = evaluation.replace(/ /g, ''); // remove all spaces
  return evaluation;
}
