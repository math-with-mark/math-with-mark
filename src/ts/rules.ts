import * as mathjs from 'mathjs';

import { MathNode, evaluate } from './mathwm';

// TODO should be const? const makes for difficult iteration
export enum RuleID {
  None, // should always be first
  Arithmetic, // should always be second
  ProductOfOneVariable,
  PowerToPower,
  COUNT_MINUS_ONE, // only used as metadata, always last
}

export interface Rule {
  func: (n: MathNode) => MathNode;
}

export const RULES: Record<RuleID, Rule> = {
  [RuleID.None]: {
    func: (n) => n,
  },
  [RuleID.Arithmetic]: {
    func: evaluateArithmetic,
  },
  [RuleID.ProductOfOneVariable]: {
    func: productOfOneVariable,
  },
  [RuleID.PowerToPower]: {
    func: powerToPower,
  },
  [RuleID.COUNT_MINUS_ONE]: {
    func: (n) => n,
  },
};

/**
 * Evaluates non-division arithmetic inside an algebraic expression. Does not do any
 * algebraic evaluation.
 * @param node the expression to evaluate
 * @return the arithmetically evaluated expression
 */
export function evaluateArithmetic(node: MathNode): MathNode {
  // if can be arithmetically evaluated
  // and none of its children are division nodes
  let arithmeticEvaluation = evaluate(node, true);
  let noDivision = node.toString().indexOf('/') === -1;
  if (noDivision) {
    return arithmeticEvaluation;
  } else {
    return node;
  }
}

/**
 * Transforms a product of two exponentiations into a base to the power of a sum
 * (a ^ b) ^ c -> a ^ (b + c)
 * If `node` is not a product of two exponentiations, does nothing
 * @param node the expression to evaluate
 * @return if `node` is product of two exponentiations, returns transformed
 * expression, else returns `node`.
 */
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
      let nodeStr = `${leftVariable} ^ (${leftExponent} + ${rightExponent})`;
      return mathjs.parse(nodeStr);
    }
  }
  return node;
}

/**
 * Transforms a power tower with two powers to a base to the power of a product
 * (a ^ b) ^ c -> a ^ (b * c)
 * If `node` is not a power tower, does nothing
 * @param node the expression to evaluate
 * @return if `node` is a power tower with two powers, returns transformed
 * expression, else returns `node`.
 */
function powerToPower(node: MathNode): MathNode {
  if (node.op === '^' && node.args?.[0].content?.op === '^') {
    let lowerExpNode = node.args?.[0].content;
    let base: string = `${lowerExpNode.args?.[0].toString()}`;
    let lowerPower: string = `${lowerExpNode.args?.[1].toString()}`;
    let upperPower: string = `${node.args?.[1]}`;
    let newMathText = `${base} ^ (${lowerPower} * ${upperPower})`;
    return mathjs.parse(newMathText);
  }
  return node;
}
