/**
 * Parse from a xyxy data array
 * @param {Array<Array<number>>} data - xyxy array of data
 * @param {object} [meta] - same metadata object format that the convertToJcamp
 * @return {string} JCAMP of the input
 */
export function parser(data, meta = {}) {
  const {
    title = '',
    owner = '',
    origin = '',
    type = '',
    xUnit = '',
    yUnit = '',
    info = {}
  } = meta;
  var firstX, lastX, firstY, lastY;
  var points = [];

  for (var i = 0; i < data.length; i++) {
    if (data[i].length > 1) {
      var x = Number(data[i][0]);
      var y = Number(data[i][1]);
      if ((!firstX) || ((firstX > x) && (x > 0))) {
        firstX = x;
      }
      if ((!lastX) || (lastX < x)) {
        lastX = x;
      }
      if ((!firstY) || (firstY > y)) {
        firstY = y;
      }
      if ((!lastY) || (lastY < y)) {
        lastY = y;
      }
    }
    if (x > 0) {
      points.push(`${x}\t${y}`);
    }
  }

  var header = `##TITLE=${title}
##JCAMP-DX=4.24
##DATA TYPE=${type}
##ORIGIN=${origin}
##OWNER=${owner}
##XUNITS=${xUnit}
##YUNITS=${yUnit}
##FIRSTX=${firstX}
##LASTX=${lastX}
##FIRSTY=${firstY}
##LASTY=${lastY}\r\n`;

  for (const key of Object.keys(info)) {
    header += `##$${key}=${info[key]}\r\n`;
  }

  header += `##NPOINTS=${points.length}
##PEAK TABLE=(XY..XY)\r\n`;

  return `${header.replace(/[^\t\r\n\x20-\x7F]/g, '') + points.join('\r\n')}\r\n##END`;
}
