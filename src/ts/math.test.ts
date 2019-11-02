import * as mathjs from 'mathjs';
import { coefficient } from './math';

describe('coefficient', () => {
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

  it('only gets powers of a given symbol', () => {
    let sut = mathjs.parse('2x^2 + 4y^2 + 1x^2');
    expect(coefficient(sut, 'x', 2)).toBe(3);
  });

  it('only gets power of a given degree', () => {
    let sut = mathjs.parse('1x^2 + 3x^3 + 2x^2 + 4x^3');
    expect(coefficient(sut, 'x', 3)).toBe(7);
  });
});
