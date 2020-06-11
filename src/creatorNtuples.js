import maxFct from 'ml-array-max';
import minFct from 'ml-array-min';

/**
 * Parse from a xyxy data array
 * @param {Array<Array<number>>} data
 * @param {object} [meta] - same metadata object format that the fromText
 * @return {string} JCAMP of the input
 */
export default function creatorNtuples(data, options) {
  const { variables, meta = {}, info = {} } = options;

  const { title = '', owner = '', origin = '', dataType = '' } = info;

  const symbol = [];
  const varName = [];
  const varType = [];
  const varDim = [];
  const units = [];
  const first = [];
  const last = [];
  const min = [];
  const max = [];
  const factor = [];

  const keys = Object.keys(variables);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    let variable = variables[key];
    symbol.push(key.toUpperCase());
    varName.push(variable.varName || key);
    varDim.push(data[key].length);
    varType.push(i === 0 ? 'INDEPENDENT' : 'DEPENDENT');
    units.push(variable.units || '');
    first.push(data[key][0]);
    last.push(data[key][data[key].length - 1]);
    min.push(minFct(data[key]));
    max.push(maxFct(data[key]));
    factor.push(1);
  }

  let header = `##TITLE=${title}
##JCAMP-DX=6.00
##DATA TYPE=${dataType}
##ORIGIN=${origin}
##OWNER=${owner}
##NTUPLES= ${dataType}
##VAR_NAME=  Weight,        Temperature,     Time
##SYMBOL=    ${symbol.join()}
##VAR_TYPE=  ${varType.join()}
##VAR_DIM=   ${varDim.join()}
##UNITS=     ${units.join()}
##PAGE= N=1\n`;

  for (const key of Object.keys(meta)) {
    header += `##$${key}=${meta[key]}\n`;
  }

  header += `##DATA TABLE= (${symbol.join('')}..${symbol.join('')}), PEAKS\n`;

  for (let i = 0; i < data[keys[0]].length; i++) {
    let point = [];
    for (let key of keys) {
      point.push(data[key][i]);
    }
    header += `${point.join('\t')}\n`;
  }

  header += '##END';
  return header;
}
