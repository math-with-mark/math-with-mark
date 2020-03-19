import * as mathjs from 'mathjs';
import * as mathwm from './mathwm';
import Rule from './rules';

describe('coefficient', () => {
  let coefficient = mathwm.coefficient;
  it('works in the simplest case', () => {
    let sut = mathjs.parse('1x^2');
    expect(coefficient(sut, 'x', 2)).toBe(1);
  });

  it('works in a trivial sum', () => {
    let sut = mathjs.parse('1x^2 + 1x^2');
    expect(coefficient(sut, 'x', 2)).toBe(2);
  });

  it('works with non-1 coefficients', () => {
    let sut = mathjs.parse('2x^2 + 3x^2');
    expect(coefficient(sut, 'x', 2)).toBe(5);
  });

  it('only gets powers of the given variable', () => {
    let sut = mathjs.parse('2x^2 + 4y^2 + 1x^2');
    expect(coefficient(sut, 'x', 2)).toBe(3);
  });

  it('only gets power of the given degree', () => {
    let sut = mathjs.parse('1x^2 + 3x^3 + 2x^2 + 4x^3');
    expect(coefficient(sut, 'x', 3)).toBe(7);
  });
});

describe('evaluate product of one variable', () => {
  let sut = (mathText: string): string => {
    let node = mathjs.parse(mathText);
    node = mathwm.applyRule(node, Rule.ProductOfOneVariable);
    return node.toString();
  };
  it('works in nominal case', () => {
    expect(sut('x^2*x^3')).toBe('x ^ (2 + 3)');
  });

  it('returns given text when rule cannot be applied', () => {
    expect(sut('1+4')).toBe('1 + 4');
  });

  it('does not mistakenly evaluate addition', () => {
    expect(sut('(x+2)+(x+3)')).toBe('(x + 2) + (x + 3)');
  });
});

describe('tryEvaluateArithmetic', () => {
  let tryEvaluate = mathwm.tryEvaluateArithmetic;
  it("Evaluates empty string to 'Invalid expression'", () => {
    let sut = '';
    expect(tryEvaluate(sut)).toBe('Invalid expression');
  });

  it('Evaluates numbers to their value', () => {
    let sut = '42';
    expect(tryEvaluate(sut)).toBe('42');
  });

  it('Evaluates first three hyperoperators on real numbers', () => {
    let sut = '1 + 2 - 3 * 4 / 5 + 6 ^ 7 - log(e)';
    expect(tryEvaluate(sut)).toBe('279935.6');
  });

  it('Evaluates expressions with complex numbers', () => {
    let sut = '2 + i - 3 + 2i';
    expect(tryEvaluate(sut)).toBe('-1 + 3i');
  });
});

describe('evaluateArithmetic', () => {
  // compare string representations, should be equal
  let sut = (testCase: string): string => {
    let node = mathjs.parse(testCase);
    return mathwm.evaluateArithmetic(node).toString();
  };
  it('does not evaluate algebra', () => {
    expect(sut('x+x')).toEqual('x + x');
  });

  it('does evaluate arithmetic', () => {
    expect(sut('1+2')).toEqual('3');
  });

  it('evaluates arithmetic inside algebraic expression', () => {
    expect(sut('(1+1)*x')).toEqual('2 * x');
  });

  it('does not evaluate division', () => {
    expect(sut('2/3')).toEqual('2 / 3');
  });

  it('does simplify arithmetic in numerators and denominators', () => {
    expect(sut('(2+3)/(5+7)')).toEqual('5 / 12');
  });

  // TODO
  xit('combines fractions of the same denominator', () => {
    expect(sut('1/3 + 1/3')).toEqual('2 / 3');
    expect(sut('1/3 * 2/3')).toEqual('2 / 9');
  });

  xit('simplifies fractions', () => {
    expect(sut('4/6')).toEqual('2 / 3');
    expect(sut('8/2')).toEqual('4');
  });

  xit('combines fractions of different denominators', () => {
    expect(sut('1/2 + 1/4')).toEqual('3 / 4');
    expect(sut('1/2 * 1/4')).toEqual('1 / 8');
  });

  xit('combines and simplifies fractions', () => {
    expect(sut('1/4 + 1/4')).toEqual('1 / 2');
    expect(sut('3/4 * 1/3')).toEqual('1 / 4');
  });
});

describe('texToMath', () => {
  let sut = mathwm.texToMath;

  it('replaces all instances of curly braces with parentheses', () => {
    expect(sut('x^{1+2}+y^{3+4}')).toBe('x^(1+2)+y^(3+4)');
  });

  it('removes "\\left" and "\\right"', () => {
    expect(sut('\\left(x\\right)')).toBe('(x)');
  });

  it('replaces "\\cdot" with "*"', () => {
    expect(sut('a\\cdot b')).toBe('a * b');
    expect(sut('1\\cdot2')).toBe('1 * 2');
  });
});
