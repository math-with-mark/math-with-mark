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
  [Rule.COUNT_MINUS_ONE]: node => node,
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
 * Evaluate a given expression either arithmetically or algebraically
 * @param node The expression to evaluate
 * @param arithmetic True to evaluate as an arithmetic expression.
 * False for algebraic evaluation
 * @return the evaluation of the expression. If expression cannot be evaluated,
 * return original expression
 */
export function evaluate(node: MathNode, arithmetic: boolean): MathNode {
  let func = arithmetic ? mathjs.evaluate : mathjs.simplify;
  try {
    // stringify, apply function, stringify result, parse stringified result
    let resultString = func(node.toString()).toString();
    return mathjs.parse(resultString);
  } catch (err) {
    return node;
  }
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
  let transformed = node.transform(
    (node, path, parent): MathNode => {
      // if can be arithmetically evaluated
      // and none of its children are division nodes
      let arithmeticEvaluation = evaluate(node, true);
      let hasDivision = node.toString().indexOf('/') !== -1;
      if (!hasDivision) {
        return arithmeticEvaluation;
      } else {
        return node;
      }
    },
  );
  return transformed;
}

export function texToMath(tex: string): string {
  tex = tex.split('{').join('(');
  tex = tex.split('}').join(')');
  tex = tex.split('\\left').join('');
  tex = tex.split('\\right').join('');
  tex = tex.split(/\\cdot ?/).join(' * ');
  return tex;
}

export function tryParse(mathText: string): MathNode | null {
  if (mathText.trim() === '') return null;
  try {
    let node = mathjs.parse(mathText);
    return node;
  } catch (err) {
    return null;
  }
}

/**
 * Returns the step-by-step evaluation of this node, as dictated by rules.
 * First element of the array is the node itself with the no-op rule.
 * Rules are applied in order (arithmetic first, then algebra)
 * If any rule transforms the node, it is used as the next step
 * Final node is not changed by any of the rule functions
 * @param node
 */
export function steps(node: MathNode): Step[] {
  let steps: Step[] = [{ node, rule: Rule.None }];
  let done = false;
  while (!done) {
    done = true; // assume no rule will further simplify the expression
    let lastNode: MathNode = steps[steps.length - 1].node;
    for (let i = 0; i < Rule.COUNT_MINUS_ONE; i++) {
      let rule: Rule = i as Rule;
      let transformed = rulesToFunctions[rule](lastNode);
      if (transformed.toString() !== lastNode.toString()) {
        done = false;
        steps.push({ node: transformed, rule });
        break; // restart from beginning of list with new lastNode
      }
    }
  }

  return steps;
}
