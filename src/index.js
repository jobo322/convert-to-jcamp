import {parse as parseXY} from 'xy-parser';

/**
 * Convert strings into JCAMP and add extra information
 * @param {string} data - values to add to the file, usually a csv or tsv values
 * @param {object} [options]
 * @param {string} [options.title = ''] - title of the file
 * @param {string} [options.owner = ''] - owner of the file
 * @param {string} [options.origin = ''] - origin of the file
 * @param {string} [options.type = ''] - type of data
 * @param {string} [options.xUnit = ''] - units for the x axis
 * @param {string} [options.yUnit = ''] - units for the y axis
 * @param {object} [options.info = {}] - comments to add to the file
 * @param {object} [options.parser = {}] - 'xy-parser' options. arrayType = 'xyxy' is enforced
 * @return {string} JCAMP of the input
 */
export default function (data, options = {}) {
    const {
        title = '',
        owner = '',
        origin = '',
        type = '',
        xUnit = '',
        yUnit = '',
        info = {},
        parser = {}
    } = options;

    parser.arrayType = 'xyxy';
    var lines = parseXY(data, parser);
    var firstX, lastX, firstY, lastY;
    var points = [];

    for (var i = 0; i < lines.length; i++) {
        if (lines[i].length > 1) {
            var x = Number(lines[i][0]);
            var y = Number(lines[i][1]);
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
            points.push(x + '\t' + y);
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

    return header.replace(/[^\t\r\n\x20-\x7F]/g, '') + points.join('\r\n') + '\r\n##END';
}
