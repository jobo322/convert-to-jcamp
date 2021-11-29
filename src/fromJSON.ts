import { DataXY } from 'cheminfo-types';

// @ts-expect-error
import { JcampOptions } from './JcampOptions';
import { ensureYInteger } from './utils/ensureInteger';
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
  const { meta = {}, info = {}, xyEncoding } = options;

  let {
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
    (keys) => !infoDefaultKeys.includes(keys),
  );
  header += addInfoData(info, infoKeys, '##');
  header += addInfoData(meta);

  // we leave the header and utf8 fonts ${header.replace(/[^\t\n\x20-\x7F]/g, '')

  if (xyEncoding) {
    yFactor = ensureYInteger(data, { yFactor });

    return `${header}##NPOINTS=${data.x.length}
${xyDataCreator(data, { info: { xFactor, yFactor }, xyEncoding }).join('\n')}
##END=`;
  } else {
    return `${header}##NPOINTS=${data.x.length}
${peakTableCreator(data, { info: { xFactor, yFactor } }).join('\n')}
##END=`;
  }
}
