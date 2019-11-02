import { cast } from './cast';

describe('cast', () => {
  it('returns first arg when first arg is defined', () => {
    expect(cast<string>('hello', 'world')).toBe('hello');
  });

  it('returns second arg when first arg is undefined', () => {
    expect(cast<string>(undefined, 'world')).toBe('world');
  });
});
