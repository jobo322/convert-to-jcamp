import type { DoubleArray, OneLowerCase } from 'cheminfo-types';
import isAnyArray from 'is-any-array';
import maxFct from 'ml-array-max';
import minFct from 'ml-array-min';

import { JcampOptions } from './JcampOptions';
import type { MeasurementXYorZVariables } from './fromVariables';
import { addInfoData } from './utils/addInfoData';
import { checkArray } from './utils/checkArray';
import { checkMatrix } from './utils/checkMatrix';
import { rescale } from './utils/rescale';
import { vectorEncoder } from './utils/vectorEncoder';

/**
 * Parse from a xyxy data array
 * @param variables - Variables to convert to jcamp
 * @param [options={}] - options that allows to add meta data in the jcamp
 * @return JCAMP-DX text file corresponding to the variables
 */
export default function creatorNtuples(
  variables: MeasurementXYorZVariables,
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

    const firstLast = getFirstLast(variable.data);
    symbol.push(variable.symbol || key);
    varName.push(name || key);
    varDim.push(variable.data.length);
    first.push(firstLast.first);
    last.push(firstLast.last);
    max.push(firstLast.max);
    min.push(firstLast.min);
    factor.push(variable.factor);

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
  }

  let header = `##TITLE=${title}
##JCAMP-DX=6.00
##DATA TYPE=${dataType}
##DATA CLASS= NTUPLES
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
##UNITS=     ${units.join()}
##FIRST=     ${first.join()}
##LAST=      ${last.join()}
##MIN=       ${min.join()}
##MAX=       ${max.join()}\n`;

  if (options.isNMR) {
    let xData = variables.x.data;
    let yData = variables.y.data;
    checkArray(xData);
    checkArray(yData);
    if (options.isPeakData) {
      header += `##DATA TABLE= (XY..XY), PEAKS\n`;
      for (let point = 0; point < varDim[0]; point++) {
        header += `${xData[point]}, ${yData[point]}\n`;
      }
    } else if (options.isXYData) {
      if (options.is2D) {
        checkMandatoryParameters(meta);

        const zData = variables.z?.data || [];
        checkMatrix(zData);

        const { direct, indirect, dependent } = getDimensionIndices(symbol);

        const nuc1 = String(meta.NUC1);
        const nuc2 = String(meta.NUC2);
        const nucleus = new Array(3);
        nucleus[direct] = nuc1;
        nucleus[indirect] = nuc2;

        const sfo1 = Number(meta.SFO1);
        const sfo2 = Number(meta.SFO2);
        const optionsScaleAndJoin = {
          indices: { direct, indirect },
          sfo1,
          sfo2,
        };

        const index = header.indexOf('##NTUPLES');
        header = header.substring(0, index);
        header += `##NTUPLES= ${dataType}
##VAR_NAME=  ${varName.join()}
##SYMBOL=    ${symbol.join()}
##VAR_TYPE=  ${varType.join()}
##VAR_DIM=   ${varDim.join()}
##.NUCLEUS=  ${nucleus.join()}
##UNITS=     ${units.join()}
##FACTOR=    ${factor.join()}
##FIRST=     ${scaleAndJoin(first, optionsScaleAndJoin)}
##LAST=      ${scaleAndJoin(last, optionsScaleAndJoin)}
##MIN=       ${scaleAndJoin(min, optionsScaleAndJoin)}
##MAX=       ${scaleAndJoin(max, optionsScaleAndJoin)}\n`;
        header += `##VAR_FORM= AFFN, AFFN, ASDF\n`;
        header += '##NUM DIM= 2\n';

        if (keys[direct] !== 'x') {
          [yData, xData] = [xData, yData];
        }
        const directSymbol = symbol[direct].toUpperCase();
        const indirectSymbol = symbol[indirect].toUpperCase();

        const firstY = yData[0] * sfo2;
        const lastY = yData[yData.length - 1] * sfo2;
        const firstX = xData[0];
        const lastX = xData[xData.length - 1];
        const deltaX = (lastX - firstX) / (xData.length - 1);
        const deltaY = (lastY - firstY) / (yData.length - 1);

        let firstData = new Float64Array(3);
        firstData[direct] = firstX * sfo1;
        firstData[indirect] = firstY;

        for (let index = 0; index < zData.length; index++) {
          firstData[dependent] = zData[index][0];
          header += `##PAGE= ${indirectSymbol}=${firstY + deltaY * index}\n`;
          header += `##FIRST=  ${firstData.join()}\n`;
          header += `##DATA TABLE= (${directSymbol}++(Y..Y)), PROFILE\n`;
          header += vectorEncoder(zData[index], firstX, deltaX, xyEncoding);
          header += '\n';
        }
      } else {
        const firstX = xData[0];
        const lastX = xData[xData.length - 1];
        const deltaX = (lastX - firstX) / xData.length;
        for (const key of ['r', 'i'] as Array<'r' | 'i'>) {
          const variable = variables[key];
          if (variable) {
            checkArray(variable.data);
            header += `##PAGE= ${key === 'r' ? 1 : 2}\n`;
            header += `##DATA TABLE= (X++(${
              key === 'r' ? 'R..R' : 'I..I'
            })), XYDATA\n`;
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
    header += `##PAGE= N=1\n`;
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
  header += '##END=';
  return header;
}

function getFirstLast(data: DoubleArray | DoubleArray[]) {
  if (isAnyArray(data[0])) {
    checkMatrix(data);
    const firstRow = data[0];
    return {
      first: firstRow[0],
      last: data[data.length - 1][data[0].length - 1],
      ...getMinMax(data),
    };
  } else {
    checkArray(data);
    return {
      first: data[0],
      last: data[data.length - 1],
      min: minFct(data),
      max: maxFct(data),
    };
  }
}

function getMinMax(data: DoubleArray[]) {
  const minOfRows = new Float64Array(data.length - 1);
  const maxOfRows = new Float64Array(data.length - 1);
  for (let i = 0; i < data.length - 1; i++) {
    minOfRows[i] = minFct(data[i]);
    maxOfRows[i] = maxFct(data[i]);
  }

  return {
    min: minFct(minOfRows),
    max: maxFct(maxOfRows),
  };
}

function scaleAndJoin(
  variable: number[],
  options: {
    indices: { direct: number; indirect: number };
    sfo1: number;
    sfo2: number;
  },
) {
  const { sfo1, sfo2 } = options;
  const { direct, indirect } = options.indices;
  const copy = variable.slice();
  copy[direct] *= sfo1;
  copy[indirect] *= sfo2;
  return copy.join();
}

function getDimensionIndices(entry: string[]) {
  const symbol = entry.map((e) => e.toUpperCase());
  const direct = symbol.includes('F2')
    ? symbol.indexOf('F2')
    : symbol.indexOf('T2');
  const indirect = symbol.includes('F1')
    ? symbol.indexOf('F1')
    : symbol.indexOf('T1');
  if (direct === -1 || indirect === -1) {
    throw new Error(
      'F2/T2 and F1/T1 symbol should be defined for nD NMR SPECTRUM',
    );
  }
  return { direct, indirect, dependent: 3 - direct - indirect };
}

function checkMandatoryParameters(meta: Record<string, any>) {
  const list = ['SFO1', 'SFO2', 'NUC1', 'NUC2'];

  for (const key of list) {
    if (!meta.includes(key)) {
      throw new Error(`${key} in options.meta should be defined`);
    }
  }
}
