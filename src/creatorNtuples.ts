import type { OneLowerCase, MeasurementXYVariables, MeasurementVariable} from 'cheminfo-types';
import maxFct from 'ml-array-max';
import minFct from 'ml-array-min';

import { JcampOptions } from './JcampOptions';
import { addInfoData } from './utils/addInfoData';
import { rescale } from './utils/rescale';
import { vectorEncoder } from './utils/vectorEncoder';

// type MeasurementZVariable = 

/**
 * Parse from a xyxy data array
 * @param variables - Variables to convert to jcamp
 * @param [options={}] - options that allows to add meta data in the jcamp
 * @return JCAMP-DX text file corresponding to the variables
 */
export default function creatorNtuples(
  variables: any,
  options: JcampOptions,
): string {
  const { meta = {}, info = {}, xyEncoding = '' } = options;

  const {
    title = '',
    owner = '',
    origin = '',
    dataType = '',
    xFactor = 1,
    yFactor = 1,
  } = info;

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

  const infoKeys = Object.keys(info).filter(
    (e) => !['title', 'owner', 'origin', 'dataType'].includes(e),
  );
  header += addInfoData(info, infoKeys, '##');
  header += addInfoData(meta);

  header += `##NTUPLES= ${dataType}
##VAR_NAME=  ${varName.join()}
##SYMBOL=    ${symbol.join()}
##VAR_TYPE=  ${varType.join()}
##VAR_DIM=   ${varDim.join()}
##UNITS=     ${units.join()}\n`;

  if (options.isNMR) {
    if (options.isPeakData) {
      header += `##DATA TABLE= (XY..XY), PEAKS\n`;
      const { x, y } = variables;
      for (let point = 0; point < varDim[0]; point++) {
        header += `${x[point]}, ${y[point]}\n`;
      }
    } else if (options.isXYData) {
      if (options.is2D) {
        const zData = variables.z?.data || [[]];
        const sfo1 = Number(meta.sfo1);
        const sfo2 = Number(meta.sfo2);
        const xIndex = keys.indexOf('x');
        const yIndex = keys.indexOf('y');
        console.log(min[yIndex], yIndex)
        const firstY = min[yIndex] * sfo1;
        const lastY = max[yIndex] * sfo1;
        const firstX = min[xIndex] * sfo2;
        const lastX = max[xIndex] * sfo2;
        const deltaX = (lastX - firstX) / zData[0].length;
        const deltaY = (lastY - firstY) / zData.length;
        for (let yPoint = 0; yPoint < zData.length; yPoint++) {
          header += `##PAGE= ${(firstX + deltaX * yPoint)}\n`;
          header += `##FIRST= ${firstX} ${firstY} ${zData[yPoint][0]}\n`;
          header += `##DATA TABLE= (F2++(Y..Y)), PROFILE\n`;
          header += vectorEncoder(zData[yPoint], firstY / sfo1 / yFactor, deltaY / sfo1 / yFactor);
          header += '\n';
        }
      } else {
        const xData = variables.x.data;
        const firstX = xData[0];
        const lastX = xData[xData.length];
        const deltaX = (lastX - firstX) / xData.length;
        for (const key of ['r', 'i'] as Array<'r'| 'i'>) {
          const variable = variables[key];
          if (variable) {
            header += `##PAGE= ${key === 'r' ? 1 : 2}\n`;
            header += `##DATA TABLE= ${key === 'r' ? '(X++(R..R))' : '(X++(I..I))'}, XYDATA\n`
            header += vectorEncoder(
              rescale(variable.data, yFactor),
              firstX / xFactor,
              deltaX / xFactor,
              xyEncoding,
            );
          }
        }
      }
    }
  } else {
    header += `##PAGE= 1\n`;
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
  }

  header += `##NTUPLES= ${dataType}\n`;
  header += '##END';
  return header;
}
