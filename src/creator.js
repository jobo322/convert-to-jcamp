/**
 * Parse from a xyxy data array
 * @param {Array<Array<number>>} data
 * @param {object} [meta] - same metadata object format that the fromText
 * @return {string} JCAMP of the input
 */
export default function creator(data, options = {}) {
  const { meta = {}, info = {} } = options;

  const {
    title = '',
    owner = '',
    origin = '',
    dataType = '',
    xUnit = '',
    yUnit = '',
  } = info;
  let firstX = Number.POSITIVE_INFINITY;
  let lastX = Number.NEGATIVE_INFINITY;
  let firstY = Number.POSITIVE_INFINITY;
  let lastY = Number.NEGATIVE_INFINITY;
  let points = [];

  for (let i = 0; i < data.x.length; i++) {
    let x = data.x[i];
    let y = data.y[i];
    if (firstX > x) {
      firstX = x;
    }
    if (lastX < x) {
      lastX = x;
    }
    if (firstY > y) {
      firstY = y;
    }
    if (lastY < y) {
      lastY = y;
    }
    points.push(`${x} ${y}`);
  }

  let header = `##TITLE=${title}
##JCAMP-DX=4.24
##DATA TYPE=${dataType}
##ORIGIN=${origin}
##OWNER=${owner}
##XUNITS=${xUnit}
##YUNITS=${yUnit}
##FIRSTX=${firstX}
##LASTX=${lastX}
##FIRSTY=${firstY}
##LASTY=${lastY}\n`;

  for (const key of Object.keys(meta)) {
    header += `##$${key}=${meta[key]}\n`;
  }

  // we leave the header and utf8 fonts ${header.replace(/[^\t\r\n\x20-\x7F]/g, '')

  return `${header}##NPOINTS=${points.length}
##PEAK TABLE=(XY..XY)
${points.join('\n')}
##END`;
}
