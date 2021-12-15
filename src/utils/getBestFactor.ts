import { DoubleArray } from 'cheminfo-types';
import { xMinMaxValues } from 'ml-spectra-processing';

export function getBestFactor(
  array: DoubleArray,
  options: {
    factor?: number;
    /**
     * The maximum absolute value
     */ maxValue?: number;
  } = {},
): number {
  const maxValue =
    options.maxValue === undefined ? 2 ** 31 - 1 : Math.abs(options.maxValue);

  if (options.factor !== undefined) {
    return options.factor;
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
    return 1;
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
  return factor;
}
