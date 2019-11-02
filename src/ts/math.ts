import * as mathjs from 'mathjs';

/**
 * Returns the coefficient of terms of the form (COEFFICIENT)(SYMBOL)^(POWER).
 *
 * CONTRACT: Expression must be of the form \sum{Ax^B}, A, B constant; x any
 * symbol
 * @param root The root of the AST
 * @param symbol The symbol to evaluate
 * @param power The power to which the symbol is raised
 * @param coefficient The current coefficient (used in recursive calls)
 */
export function coeff(
  root: mathjs.MathNode,
  symbol: string,
  power: number,
): number {
  // node is OperatorNode from contract, either '+' or '*'
  let op = safe<string>(root.op, '');
  let children = args(root);
  if (op === '+') {
    let coefficient = 0;
    coefficient += coeff(children[0], symbol, power);
    coefficient += coeff(children[1], symbol, power);
    return coefficient;
  }

  // op === '*'. Fields are guaranteed from Ax^B structure
  if (
    args(children[1])[0].name === symbol &&
    args(children[1])[1].value === power
  ) {
    return children[0].value;
  }
  return 0;
}

/** Safely casts arg to type T. If arg is undefined, def is returned */
function safe<T>(arg: T | undefined, def: T): T {
  if (typeof arg === 'undefined') return def;
  return arg;
}

/** Get the children of this node, aka its args */
function args(node: mathjs.MathNode): mathjs.MathNode[] {
  return safe<mathjs.MathNode[]>(node.args, []);
}

/**
 * Returns a string representation of the AST
 * @param root The root of the AST
 */
function toString(root: mathjs.MathNode): string {
  switch (root.type) {
    case 'OperatorNode':
      return (
        toString(args(root)[0]) +
        safe<string>(root.op, '') +
        toString(args(root)[1])
      );
    case 'ConstantNode':
      return root.value;
    case 'SymbolNode':
      return safe<string>(root.name, '');
    default:
      return root.type;
  }
}
