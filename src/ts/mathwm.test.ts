import * as mathjs from 'mathjs';
import * as mathwm from './mathwm';
import Rule from './rules';

let ruleSut = (rule: Rule): ((mathText: string) => string) => {
  return (mathText: string) => {
    let node = mathjs.parse(mathText);
    node = mathwm.applyRule(node, rule);
    return node.toString();
  };
};

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
  let sut = ruleSut(Rule.ProductOfOneVariable);
  it('works in nominal case', () => {
    expect(sut('x^2*x^3')).toBe('x ^ (2 + 3)');
  });

  it('returns given text when rule cannot be applied', () => {
    expect(sut('1+4')).toBe('1 + 4');
  });

  it('does not mistakenly evaluate addition', () => {
    expect(sut('(x+2)+(x+3)')).toBe('(x + 2) + (x + 3)');
  });

  it('only simplifies outermost application in recursive case', () => {
    expect(sut('x ^ 2 * x ^ 3 * x ^ 4')).toBe('x ^ (2 + 3) * x ^ 4');
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

describe('tryParse', () => {
  let sut = (input: string): string | null => {
    let node = mathwm.tryParse(input);
    if (node === null) return null;
    return node.toString();
  };

  it('parses algebraic expressions', () => {
    expect(sut('x + 2')).toBe('x + 2');
  });

  it('works on invalid expressions', () => {
    expect(sut('+')).toBe(null);
  });

  it('returns null on strings of whitespace', () => {
    expect(sut('')).toBe(null);
    expect(sut(' \t ')).toBe(null);
  });
});

describe('evaluate', () => {
  let sut = (mathText: string, arithmetic: boolean): string => {
    let node = mathjs.parse(mathText);
    let evaluation = mathwm.evaluate(node, arithmetic);
    return evaluation.toString();
  };

  it('evaluates arithmetic', () => {
    expect(sut('1 + 1', true)).toBe('2');
  });

  it('evaluates algebraic expressions', () => {
    expect(sut('x + x', false)).toBe('2 * x');
  });

  it('fails to evaluate algebraic expressions arithmetically', () => {
    expect(sut('x + x', true)).toBe('x + x');
  });
});

describe('steps', () => {
  let sut = (mathText: string): string => {
    let node = mathjs.parse(mathText);
    let result = mathwm.steps(node);
    let str = '[';
    for (let i = 0; i < result.length; i++) {
      let step = result[i];
      if (i > 0) str += ', ';
      str += "{'";
      str += step.node.toString();
      str += "', ";
      str += Rule[step.rule];
      str += '}';
    }
    str += ']';
    return str;
  };

  it('returns a one-element array when no step can be applied', () => {
    expect(sut('x+2')).toBe(`[{'x + 2', ${Rule[Rule.None]}}]`);
  });

  it('simplifies arithmetic in one step', () => {
    expect(sut('1 + 1')).toBe(
      `[{'1 + 1', ${Rule[Rule.None]}}, {'2', ${Rule[Rule.Arithmetic]}}]`,
    );
    expect(sut('1 + 2 + 3')).toBe(
      `[{'1 + 2 + 3', ${Rule[Rule.None]}}, {'6', ${Rule[Rule.Arithmetic]}}]`,
    );
  });

  it('simplifies multi-step algebraic expressions', () => {
    expect(sut('x^(1+1)*x^(2+2)')).toBe(
      `[{'x ^ (1 + 1) * x ^ (2 + 2)', ${Rule[Rule.None]}}, ` +
        `{'x ^ 2 * x ^ 4', ${Rule[Rule.Arithmetic]}}, ` +
        `{'x ^ (2 + 4)', ${Rule[Rule.ProductOfOneVariable]}}, ` +
        `{'x ^ 6', ${Rule[Rule.Arithmetic]}}]`,
    );
  });
});
