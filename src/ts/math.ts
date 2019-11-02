import * as mathjs from 'mathjs';
import { cast } from './cast';

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
export function coefficient(
  root: mathjs.MathNode,
  symbol: string,
  power: number,
): number {
  // node is OperatorNode from contract, either '+' or '*'
  let op = cast<string>(root.op, '');
  let children = args(root);
  if (op === '+') {
    let coeff = 0;
    coeff += coefficient(children[0], symbol, power);
    coeff += coefficient(children[1], symbol, power);
    return coeff;
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

/**
 * Get the children of this node, aka its args.
 * Returns [] when there are no children present
 */
function args(node: mathjs.MathNode): mathjs.MathNode[] {
  return cast<mathjs.MathNode[]>(node.args, []);
}
