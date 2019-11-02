import * as mathjs from 'mathjs';
import { coeff } from './math';

describe('coeff', () => {
  it('calculates coefficients of terms of a given power', () => {
    let sut = mathjs.parse('1x^2 + 1x^2');

    expect(coeff(sut, 'x', 2)).toBe(2);
  });

  it('calculates given power !== 2', () => {
    let sut = mathjs.parse('2x^2 + 3x^2');

    expect(coeff(sut, 'x', 2)).toBe(5);
  });
});
