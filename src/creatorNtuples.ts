import type { OneLowerCase, MeasurementXYVariables } from 'cheminfo-types';
import maxFct from 'ml-array-max';
import minFct from 'ml-array-min';

import { JcampOptions } from './JcampOptions';

/**
 * Parse from a xyxy data array
 * @param variables - Variables to convert to jcamp
 * @param [options={}] - options that allows to add meta data in the jcamp
 * @return JCAMP-DX text file corresponding to the variables
 */
export default function creatorNtuples(
  variables: MeasurementXYVariables,
  options: JcampOptions,
): string {
  const { meta = {}, info = {} } = options;

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

  const keys = Object.keys(variables) as OneLowerCase[];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    let variable = variables[key];
    if (!variable) continue;

    let name = variable?.label.replace(/ *\[.*/, '');
    let unit = variable?.label.replace(/.*\[(?<units>.*)\].*/, '$<units>');

    symbol.push(variable.symbol || key);
    varName.push(name || key);
    varDim.push(variable.data.length);

    if (variable.isDependent !== undefined) {
      varType.push(variable.isDependent ? 'DEPENDENT' : 'INDEPENDENT');
    } else {
      varType.push(
        variable.isDependent !== undefined
          ? !variable.isDependent
          : i === 0
          ? 'INDEPENDENT'
          : 'DEPENDENT',
      );
    }

    units.push(variable.units || unit || '');
    first.push(variable.data[0]);
    last.push(variable.data[variable.data.length - 1]);
    min.push(minFct(variable.data));
    max.push(maxFct(variable.data));
    factor.push(1);
  }

  let header = `##TITLE=${title}
##JCAMP-DX=6.00
##DATA TYPE=${dataType}
##ORIGIN=${origin}
##OWNER=${owner}\n`;

  for (const key in meta) {
    header +=
      typeof meta[key] === 'object'
        ? `##$${key}=${JSON.stringify(meta[key])}\n`
        : `##$${key}=${meta[key]}\n`;
  }

  header += `##NTUPLES= ${dataType}
##VAR_NAME=  ${varName.join()}
##SYMBOL=    ${symbol.join()}
##VAR_TYPE=  ${varType.join()}
##VAR_DIM=   ${varDim.join()}
##UNITS=     ${units.join()}
##PAGE= N=1\n`;

  header += `##DATA TABLE= (${symbol.join('')}..${symbol.join('')}), PEAKS\n`;

  for (let i = 0; i < variables.x.data.length; i++) {
    let point = [];
    for (let key of keys) {
      let variable = variables[key];
      if (!variable) continue;
      point.push(variable.data[i]);
    }
    header += `${point.join('\t')}\n`;
  }

  header += '##END';
  return header;
}
