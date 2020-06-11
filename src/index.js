import { parseXY } from 'xy-parser';

import creator from './creator';
import creatorNtuples from './creatorNtuples';

/**
 * Convert strings into JCAMP and add extra information
 * @param {string} data - values to add to the file, usually a csv or tsv values
 * @param {object} [options={}]
 * @param {string} [options.info={}] - metadata of the file
 * @param {string} [options.info.title = ''] - title of the file
 * @param {string} [options.info.owner = ''] - owner of the file
 * @param {string} [options.info.origin = ''] - origin of the file
 * @param {string} [options.info.dataType = ''] - type of data
 * @param {string} [options.info.xUnit = ''] - units for the x axis
 * @param {string} [options.info.yUnit = ''] - units for the y axis
 * @param {object} [options.meta = {}] - comments to add to the file
 * @param {object} [options.parser = {}] - 'xy-parser' options. arrayType = 'xyxy' is enforced
 * @return {string} JCAMP of the input
 */
export function fromText(data, options = {}) {
  const { meta = {}, info = {}, parserOptions = {} } = options;

  parserOptions.keepInfo = true;
  let parsed = parseXY(data, parserOptions);

  meta.header = parsed.info.map((i) => i.value).join('\n');
  let jcamp = creator(parsed.data, { meta, info });
  return jcamp;
}

/**
 * Create a jcamp or if variables is specified a NTUPLES JCAMP
 * @param {object} data - object of array
 * @param {object} [options={}] - metadata object
 * @param {object} [options.variables={}] - variables metadata like {x:{units:'°C'},y:{units:'s'}}
 * @param {string} [options.info={}] - metadata of the file
 * @param {string} [options.info.title = ''] - title of the file
 * @param {string} [options.info.owner = ''] - owner of the file
 * @param {string} [options.info.origin = ''] - origin of the file
 * @param {string} [options.info.dataType = ''] - type of data
 * @param {string} [options.info.xUnit = ''] - units for the x axis for variables===undefined
 * @param {string} [options.info.yUnit = ''] - units for the y axis for variables===undefined
 * @param {object} [options.meta = {}] - comments to add to the file

 * @return {string} JCAMP of the input
 */
export function fromJSON(data, options = {}) {
  const { variables } = options;
  if (variables) {
    return creatorNtuples(data, options);
  } else {
    return creator(data, options);
  }
}
