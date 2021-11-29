import { DoubleArray } from 'cheminfo-types';
// @ts-expect-error
import { xMinMaxValues } from 'ml-spectra-processing';

export function ensureInteger(
  array: DoubleArray,
  options: {
    factor?: number;
    /**
     * The maximum absolute value
     */ maxValue?: number;
  } = {},
): {
  /**
Factor by which to multiply the array to get back the original array
*/
  factor: number;
  array: DoubleArray;
} {
  const maxValue =
    options.maxValue === undefined ? 2 ** 31 - 1 : Math.abs(options.maxValue);

  if (options.factor !== undefined) {
    const factor = options.factor;
    return { array: array.map((entry) => Math.round(entry / factor)), factor };
  }

  // is there non integer number ?
  let onlyInteger = true;
  for (let y of array) {
    if (Math.round(y) !== y) {
      onlyInteger = false;
      break;
    }
  }
  if (onlyInteger) {
    return { array, factor: 1 };
  }
  // we need to rescale the values
  // need to find the max and min values
  const minMax = xMinMaxValues(array);
  let factor: number;
  if (minMax.min < 0) {
    if (minMax.max > 0) {
      factor = Math.max(-minMax.min, minMax.max) / maxValue;
    } else {
      factor = -minMax.min / maxValue;
    }
  } else {
    factor = minMax.max / maxValue;
  }
  return { array: array.map((entry) => Math.round(entry / factor)), factor };
}
