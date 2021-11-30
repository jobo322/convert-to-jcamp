import { DataXY } from 'cheminfo-types';

import { JcampOptions } from './JcampOptions';
import { addInfoData } from './utils/addInfoData';
import { ensureInteger } from './utils/ensureInteger';
import { peakTableCreator } from './utils/peakTableCreator';
import { xyDataCreator } from './utils/xyDataCreator';

const infoDefaultKeys = [
  'title',
  'owner',
  'origin',
  'dataType',
  'xUnits',
  'yUnits',
  'xFactor',
  'yFactor',
];
/**
 * Create a jcamp
 * @param data object of array
 * @param [options={meta:{},info:{}} - metadata object
 * @returns JCAMP of the input
 */
export function fromJSON(data: DataXY, options: JcampOptions = {}): string {
  const { meta = {}, info = {}, xyEncoding } = options;

  let {
    title = '',
    owner = '',
    origin = '',
    dataType = '',
    xUnits = '',
    yUnits = '',
    xFactor,
    yFactor,
  } = info;

  data = { x: data.x, y: data.y };

  let header = `##TITLE=${title}
##JCAMP-DX=4.24
##DATA TYPE=${dataType}
##ORIGIN=${origin}
##OWNER=${owner}
##XUNITS=${xUnits}
##YUNITS=${yUnits}\n`;
  const infoKeys = Object.keys(info).filter(
    (keys) => !infoDefaultKeys.includes(keys),
  );
  header += addInfoData(info, infoKeys, '##');
  header += addInfoData(meta);

  // we leave the header and utf8 fonts ${header.replace(/[^\t\n\x20-\x7F]/g, '')

  if (xyEncoding) {
    let ensuredX = ensureInteger(data.x, { factor: xFactor });
    data.x = ensuredX.array;
    xFactor = ensuredX.factor;
    let ensuredY = ensureInteger(data.y, { factor: yFactor });
    data.y = ensuredY.array;
    yFactor = ensuredY.factor;
    return `${header}##NPOINTS=${data.x.length}
${xyDataCreator(data, { info: { xFactor, yFactor }, xyEncoding }).join('\n')}
##END=`;
  } else {
    if (xFactor === undefined) xFactor = 1;
    if (yFactor === undefined) yFactor = 1;
    if (xFactor !== 1) {
      // @ts-expect-error
      data.x = data.x.map((value) => value / xFactor);
    }
    if (yFactor !== 1) {
      // @ts-expect-error
      data.y = data.y.map((value) => value / yFactor);
    }
    return `${header}##NPOINTS=${data.x.length}
${peakTableCreator(data, { info: { xFactor, yFactor } }).join('\n')}
##END=`;
  }
}
