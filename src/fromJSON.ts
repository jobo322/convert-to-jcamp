import { DataXY } from 'cheminfo-types';

import { JcampOptions } from './JcampOptions';
import { addInfoData } from './utils/addInfoData';
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
  const { meta = {}, info = {}, xyData = false } = options;

  const {
    title = '',
    owner = '',
    origin = '',
    dataType = '',
    xUnits = '',
    yUnits = '',
    xFactor = 1,
    yFactor = 1,
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
    (e) => !infoDefaultKeys.includes(e),
  );
  header += addInfoData(info, infoKeys, '##');
  header += addInfoData(meta);

  // we leave the header and utf8 fonts ${header.replace(/[^\t\r\n\x20-\x7F]/g, '')

  return `${header}##NPOINTS=${data.x.length}
${(xyData
  ? xyDataCreator(data, { info: { xFactor, yFactor } })
  : peakTableCreator(data, { info: { xFactor, yFactor } })
).join('\n')}
##END=`;
}
