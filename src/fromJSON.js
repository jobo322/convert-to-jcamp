/**
 * Create a jcamp
 * @param {object} data - object of array
 * @param {object} [options={}] - metadata object
 * @param {string} [options.info={}] - metadata of the file
 * @param {string} [options.info.title = ''] - title of the file
 * @param {string} [options.info.owner = ''] - owner of the file
 * @param {string} [options.info.origin = ''] - origin of the file
 * @param {string} [options.info.dataType = ''] - type of data
 * @param {string} [options.info.xUnits = ''] - units for the x axis for variables===undefined
 * @param {string} [options.info.yUnits = ''] - units for the y axis for variables===undefined
 * @param {object} [options.meta = {}] - comments to add to the file
 * @return {string} JCAMP of the input
 */
export function fromJSON(data, options = {}) {
  const { meta = {}, info = {} } = options;

  const {
    title = '',
    owner = '',
    origin = '',
    dataType = '',
    xUnits = '',
    yUnits = '',
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
##XUNITS=${xUnits}
##YUNITS=${yUnits}
##FIRSTX=${firstX}
##LASTX=${lastX}
##FIRSTY=${firstY}
##LASTY=${lastY}\n`;

  for (const key in meta) {
    header +=
      key.toLowerCase() === 'cheminfo'
        ? `##$${key}=${JSON.stringify(meta[key])}\n`
        : `##$${key}=${meta[key]}\n`;
  }

  // we leave the header and utf8 fonts ${header.replace(/[^\t\r\n\x20-\x7F]/g, '')

  return `${header}##NPOINTS=${points.length}
##PEAK TABLE=(XY..XY)
${points.join('\n')}
##END`;
}
