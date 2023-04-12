import * as mathjs from 'mathjs';

import { RuleID } from './rules';
import * as mathwm from './mathwm';
import { describe, test, expect } from 'vitest';

describe('coefficient', () => {
  let coefficient = mathwm.coefficient;
  test('works in the simplest case', () => {
    let sut = mathjs.parse('1x^2');
    expect(coefficient(sut, 'x', 2)).toBe(1);
  });

  test('works in a trivial sum', () => {
    let sut = mathjs.parse('1x^2 + 1x^2');
    expect(coefficient(sut, 'x', 2)).toBe(2);
  });

  test('works with non-1 coefficients', () => {
    let sut = mathjs.parse('2x^2 + 3x^2');
    expect(coefficient(sut, 'x', 2)).toBe(5);
  });

  test('only gets powers of the given variable', () => {
    let sut = mathjs.parse('2x^2 + 4y^2 + 1x^2');
    expect(coefficient(sut, 'x', 2)).toBe(3);
  });

  test('only gets power of the given degree', () => {
    let sut = mathjs.parse('1x^2 + 3x^3 + 2x^2 + 4x^3');
    expect(coefficient(sut, 'x', 3)).toBe(7);
  });
});

describe('texToMath', () => {
  const sut = mathwm.texToMath;

  test('replaces all instances of curly braces with parentheses', () => {
    expect(sut('x^{1+2}+y^{3+4}')).toBe('x ^ (1 + 2) + y ^ (3 + 4)');
  });

  test('removes "\\left" and "\\right"', () => {
    expect(sut('\\left(x\\right)')).toBe('x');
  });

  test('replaces "\\cdot" with "*"', () => {
    expect(sut('a\\cdot b')).toBe('a * b');
    expect(sut('1\\cdot2')).toBe('1 * 2');
  });
});

describe('tryParse', () => {
  const sut = (input: string): string | null => {
    let node = mathwm.tryParse(input);
    if (node === null) return null;
    return node.toString();
  };

  test('parses algebraic expressions', () => {
    expect(sut('x + 2')).toBe('x + 2');
  });

  test('works on invalid expressions', () => {
    expect(sut('+')).toBe(null);
  });

  test('returns null on strings of whitespace', () => {
    expect(sut('')).toBe(null);
    expect(sut(' \t ')).toBe(null);
  });
});

describe('evaluate', () => {
  const sut = (mathText: string, arithmetic: boolean): string => {
    let node = mathjs.parse(mathText);
    let evaluation = mathwm.evaluate(node, arithmetic);
    return evaluation.toString();
  };

  test('evaluates arithmetic', () => {
    expect(sut('1 + 1', true)).toBe('2');
  });

  test('evaluates algebraic expressions', () => {
    expect(sut('x + x', false)).toBe('2 * x');
  });

  test('fails to evaluate algebraic expressions arithmetically', () => {
    expect(sut('x + x', true)).toBe('x + x');
  });
});

describe('steps', () => {
  const sut = (mathText: string): string => {
    let node = mathjs.parse(mathText);
    let result = mathwm.steps(node);
    let str = '[';
    for (let i = 0; i < result.length; i++) {
      let step = result[i];
      if (i > 0) str += ', ';
      str += "{'";
      str += step.node.toString();
      str += "', ";
      str += RuleID[step.ruleID];
      str += '}';
    }
    str += ']';
    return str;
  };

  test('returns a one-element array when no step can be applied', () => {
    expect(sut('x + 2')).toBe(`[{'x + 2', ${RuleID[RuleID.None]}}]`);
  });

  test('simplifies arithmetic in one step', () => {
    expect(sut('1 + 1')).toBe(
      `[{'1 + 1', ${RuleID[RuleID.None]}}, {'2', ${
        RuleID[RuleID.Arithmetic]
      }}]`,
    );
    expect(sut('1 + 2 + 3')).toBe(
      `[{'1 + 2 + 3', ${RuleID[RuleID.None]}}, {'6', ${
        RuleID[RuleID.Arithmetic]
      }}]`,
    );
  });

  test('simplifies multi-step algebraic expressions', () => {
    expect(sut('x ^ (1 + 1) * x ^ (2 + 2)')).toBe(
      `[{'x ^ (1 + 1) * x ^ (2 + 2)', ${RuleID[RuleID.None]}}, ` +
        `{'x ^ 2 * x ^ 4', ${RuleID[RuleID.Arithmetic]}}, ` +
        `{'x ^ (2 + 4)', ${RuleID[RuleID.ProductOfOneVariable]}}, ` +
        `{'x ^ 6', ${RuleID[RuleID.Arithmetic]}}]`,
    );
  });

  test('evaluates two unique algebraic rules', () => {
    const node = mathjs.parse('(x ^ 2) ^ 3 * x ^ 4');
    const actual = mathwm.steps(node);
    expect(actual.length).toBeGreaterThan(1);
    expect(actual[actual.length - 1].node.toString()).toBe('x ^ 10');
    expect(actual.map((el) => el.ruleID)).toContain(RuleID.None);
    expect(actual.map((el) => el.ruleID)).toContain(RuleID.Arithmetic);
    expect(actual.map((el) => el.ruleID)).toContain(
      RuleID.ProductOfOneVariable, // prettier adds trailing comma, oh well
    );
    expect(actual.map((el) => el.ruleID)).toContain(RuleID.PowerToPower);
  });
});
