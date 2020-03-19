import * as mathjs from 'mathjs';
import Rule from './rules';

/** Type alias, we may change away from mathjs in the future */
export type MathNode = mathjs.MathNode;

/** Used for functions that apply one rule to an expression and return the result */
type RuleApplicationFunction = (n: MathNode) => MathNode;

interface Step {
  node: MathNode;
  rule: Rule;
}

/** Maps each rule to a function that applies that rule to a given math node */
const rulesToFunctions: Record<Rule, RuleApplicationFunction> = {
  [Rule.None]: node => node,
  [Rule.Arithmetic]: evaluateArithmetic,
  [Rule.ProductOfOneVariable]: productOfOneVariable,
};

function productOfOneVariable(node: MathNode): MathNode {
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
  root: MathNode,
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

/** Wrapper to simplify cast of node.args to MathNode[] */
function args(node: MathNode): MathNode[] {
  return node.args as MathNode[];
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
 * @param mathText The expression to be evaluated
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

/**
 * Applies the given rule to the given expression
 * @param node The expression
 * @param rule The rule to apply
 * @return the result of applying the given rule to the given expression.
 * If the given expression cannot be parsed or the rule cannot be applied,
 * returns `mathText` as given
 */
export function applyRule(node: MathNode, rule: Rule): MathNode {
  return rulesToFunctions[rule](node);
}

/**
 * Evaluates non-division arithmetic inside an algebraic expression. Does not do any
 * algebraic evaluation.
 * @param node the expression to evaluate
 * @return the arithmetically evaluated expression
 */
export function evaluateArithmetic(node: MathNode): MathNode {
  let transformed = node.transform(function(node, path, parent) {
    // if can be arithmetically evaluated
    // and none of its children are division nodes
    let arithmeticEvaluation = tryEvaluateArithmetic(node.toString());
    let hasDivision = node.toString().indexOf('/') !== -1;
    if (!hasDivision && arithmeticEvaluation !== 'Invalid expression') {
      return mathjs.parse(arithmeticEvaluation);
    } else {
      return node;
    }
  });
  return transformed;
}

export function texToMath(tex: string): string {
  tex = tex.split('{').join('(');
  tex = tex.split('}').join(')');
  tex = tex.split('\\left').join('');
  tex = tex.split('\\right').join('');
  tex = tex.split('\\cdot ').join(' * ');
  return tex;
}
