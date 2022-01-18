import { DataXY, DoubleArray } from 'cheminfo-types';

import { JcampOptions } from '../JcampOptions';
import { rescale } from './rescale';

import { vectorEncoder } from './vectorEncoder';

export function xyDataCreator(data: DataXY, options: JcampOptions = {}) {
  const { xyEncoding = 'DIF' } = options;
  const { xFactor = 1, yFactor = 1 } = options.info || {};
  let firstX = data.x[0];
  let lastX = data.x[data.x.length - 1];
  let firstY = data.y[0];
  let lastY = data.y[data.y.length - 1];
  let nbPoints = data.x.length;
  let deltaX = (lastX - firstX) / (nbPoints - 1);
  let lines = [];

  lines.push(`##FIRSTX=${firstX}`);
  lines.push(`##LASTX=${lastX}`);
  lines.push(`##FIRSTY=${firstY}`);
  lines.push(`##LASTY=${lastY}`);
  lines.push(`##DELTAX=${deltaX}`);
  lines.push(`##XFACTOR=${xFactor}`);
  lines.push(`##YFACTOR=${yFactor}`);
  lines.push('##XYDATA=(X++(Y..Y))');

  let line = vectorEncoder(
    rescale(data.y, yFactor),
    firstX / xFactor,
    deltaX / xFactor,
    xyEncoding,
  );
  if (line) lines.push(line);
  return lines;
}
