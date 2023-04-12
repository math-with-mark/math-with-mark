import * as mathjs from 'mathjs';
import * as rules from './rules';

/** Type alias, we may change away from mathjs in the future */
export type MathNode = mathjs.MathNode;

export interface Step {
  node: MathNode;
  ruleID: rules.RuleID;
}

/**
 * Returns the coefficient of terms of the form (COEFFICIENT)(SYMBOL)^(POWER).
 *
 * CONTRACT: Expression must be of the form \sum{Ax^B}, A, B constant; x any
 * variable
 * @param root A `+` or `*` node in `A*x^B + C*x^D + ...`
 * @param variable The variable to evaluate, the `x` in the above expression
 * @param exponent The power to which the variable is raised (`B` or `D` or ...)
 */
export function coefficient(
  root: mathjs.MathNode,
  variable: string,
  exponent: number,
): number {
  const opRoot = root as mathjs.OperatorNode; // from contract
  if (opRoot.op === '+') {
    return (
      // Both children are `*` operator nodes
      coefficient(opRoot.args[0] as mathjs.OperatorNode, variable, exponent) +
      coefficient(opRoot.args[1] as mathjs.OperatorNode, variable, exponent)
    );
  }
  // op === '*', left child is coeff, right child is exp node
  const expNode = opRoot.args[1] as mathjs.OperatorNode;
  // RL node is variable, RR node is exponent
  const actualVariable = (expNode.args[0] as mathjs.SymbolNode).name;
  const actualExponent = (expNode.args[1] as mathjs.ConstantNode).value;
  if (actualVariable === variable && actualExponent === exponent) {
    return (opRoot.args[0] as mathjs.ConstantNode).value;
  }
  // not a match, this term does not contribute to coefficient
  return 0;
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
  try {
    // stringify, apply function, stringify result, parse stringified result
    const nodeStr = node.toString();
    const resultString = (
      arithmetic ? mathjs.evaluate(nodeStr) : mathjs.simplify(nodeStr)
    ).toString();
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
export function applyRule(node: MathNode, rule: rules.RuleID): MathNode {
  return node.transform(rules.RULES[rule].func);
}

export function texToMath(tex: string): string {
  tex = tex.split('{').join('(');
  tex = tex.split('}').join(')');
  tex = tex.split('\\left').join('');
  tex = tex.split('\\right').join('');
  tex = tex.split(/\\cdot ?/).join(' * ');
  return tex;
}

export const texToNode = (tex: string): mathjs.MathNode | null => {
  try {
    return mathjs.parse(texToMath(tex));
  } catch (err) {
    return null;
  }
};

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
  let steps: Step[] = [{ node, ruleID: rules.RuleID.None }];
  let done = false;
  while (!done) {
    done = true; // assume no rule will further simplify the expression
    let lastNode: MathNode = steps[steps.length - 1].node;
    const rulesInSimplestFirstOrder = [
      rules.RuleID.Arithmetic,
      rules.RuleID.ProductOfOneVariable,
      rules.RuleID.PowerToPower,
    ];
    for (let rule of rulesInSimplestFirstOrder) {
      let transformed = applyRule(lastNode, rule);
      if (transformed.toString() !== lastNode.toString()) {
        done = false;
        steps.push({ node: transformed, ruleID: rule });
        break; // restart from beginning of list with new lastNode
      }
    }
  }

  return steps;
}
