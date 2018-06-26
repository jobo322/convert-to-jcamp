import { parseXY } from 'xy-parser';
import xyConvert from 'ml-xy-convert';

import creator from './creator';

/**
 * Convert strings into JCAMP and add extra information
 * @param {string} data - values to add to the file, usually a csv or tsv values
 * @param {object} [options]
 * @param {string} [options.meta] - metadata of the file
 * @param {string} [options.meta.title = ''] - title of the file
 * @param {string} [options.meta.owner = ''] - owner of the file
 * @param {string} [options.meta.origin = ''] - origin of the file
 * @param {string} [options.meta.type = ''] - type of data
 * @param {string} [options.meta.xUnit = ''] - units for the x axis
 * @param {string} [options.meta.yUnit = ''] - units for the y axis
 * @param {object} [options.meta.info = {}] - comments to add to the file
 * @param {object} [options.parser = {}] - 'xy-parser' options. arrayType = 'xyxy' is enforced
 * @return {string} JCAMP of the input
 */
export default function convertToJcamp(data, options = {}) {
  const { meta = {}, parserOptions = {} } = options;

  parserOptions.arrayType = 'xyxy';
  parserOptions.keepInfo = true;
  var parsed = parseXY(data, parserOptions);
  if (!meta.info) meta.info = {};
  meta.info.header = parsed.info.map((i) => i.value).join('\n');
  let jcamp = creator(parsed.data, meta);
  return jcamp;
}

/**
 * Parse from any supported format in ml-xy-convert
 * @param {*} data - object or array with a set of points
 * @param {object} [meta] - metadata object
 * @return {string} JCAMP of the input
 */
export function fromJson(data, meta = {}) {
  const parsed = xyConvert(data, { outputFormat: 'xyxyArray' });
  return creator(parsed, meta);
}
