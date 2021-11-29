import { ensureInteger } from '../ensureInteger';

describe('ensureInteger', () => {
  it('integer', () => {
    const y = [1, 2, 3, 4, 5];
    const result = ensureInteger(y);
    expect(result).toStrictEqual({ array: [1, 2, 3, 4, 5], factor: 1 });
  });
  it('integer with factor:1', () => {
    const y = [1, 2, 3, 4, 5];
    const result = ensureInteger(y, { factor: 1 });
    expect(result).toStrictEqual({ array: [1, 2, 3, 4, 5], factor: 1 });
  });
  it('integer with factor:0.5', () => {
    const y = [1, 2, 3, 4, 5];
    const result = ensureInteger(y, { factor: 0.5 });
    expect(result).toStrictEqual({ array: [2, 4, 6, 8, 10], factor: 0.5 });
  });
  it('non-integer factor:0.1', () => {
    const y = [0.1, 0.2, 0.3, 0.4, 0.5];
    const result = ensureInteger(y, { factor: 0.1 });
    expect(result).toStrictEqual({ array: [1, 2, 3, 4, 5], factor: 0.1 });
  });
  it('non-integer maxValue:5', () => {
    const y = [0.1, 0.2, 0.3, 0.4, 0.5];
    const result = ensureInteger(y, { maxValue: 5 });
    expect(result).toStrictEqual({ array: [1, 2, 3, 4, 5], factor: 0.1 });
  });
  it('non-integer negative maxValue:5', () => {
    const y = [-0.1, -0.2, -0.3, -0.4, -0.5];
    const result = ensureInteger(y, { maxValue: 5 });
    expect(result).toStrictEqual({ array: [-1, -2, -3, -4, -5], factor: 0.1 });
  });
  it('non-integer negative and positive maxValue:5', () => {
    const y = [-0.1, -0.2, 0.1, 0.2, 0.3, 0.4, 0.5];
    const result = ensureInteger(y, { maxValue: 5 });
    expect(result).toStrictEqual({
      array: [-1, -2, 1, 2, 3, 4, 5],
      factor: 0.1,
    });
  });
  it('non-integer no max value', () => {
    const y = [0.1, 0.2, 0.3, 0.4, 0.5];
    const result = ensureInteger(y);
    expect(result.array).toStrictEqual([
      429496729, 858993459, 1288490188, 1717986918, 2147483647,
    ]);
    expect(result.factor).toBeCloseTo(2.3283064376228985e-10);
  });
});
