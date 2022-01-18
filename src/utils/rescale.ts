import { DoubleArray } from 'cheminfo-types';

export function rescale(data: DoubleArray, factor: number) {
  const result = data.slice();
  if (factor !== 1) {
    for (let i = 0; i < result.length; i++) {
      result[i] /= factor;
    }
  }
  return result;
}
