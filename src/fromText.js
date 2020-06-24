import { parseXY } from 'xy-parser';

import { fromJSON } from './fromJSON';

/**
 * Convert strings into JCAMP and add extra information
 * @param {string} data - values to add to the file, usually a csv or tsv values
 * @param {object} [options={}]
 * @param {string} [options.info={}] - metadata of the file
 * @param {string} [options.info.title = ''] - title of the file
 * @param {string} [options.info.owner = ''] - owner of the file
 * @param {string} [options.info.origin = ''] - origin of the file
 * @param {string} [options.info.dataType = ''] - type of data
 * @param {string} [options.info.xUnits = ''] - units for the x axis
 * @param {string} [options.info.yUnits = ''] - units for the y axis
 * @param {object} [options.meta = {}] - comments to add to the file
 * @param {object} [options.parser = {}] - 'xy-parser' options. arrayType = 'xyxy' is enforced
 * @return {string} JCAMP of the input
 */
export function fromText(data, options = {}) {
  const { meta = {}, info = {}, parserOptions = {} } = options;

  parserOptions.keepInfo = true;
  let parsed = parseXY(data, parserOptions);

  meta.header = parsed.info.map((i) => i.value).join('\n');

  return fromJSON(parsed.data, { meta, info });
}
