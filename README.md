# convert-to-jcamp

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![Test coverage][codecov-image]][codecov-url]
  [![npm download][download-image]][download-url]

Convert strings into JCAMP.

## Installation

`$ npm install --save convert-to-jcamp`

## Usage

```js
import convertToJcamp from 'convert-to-jcamp';
import {convert} from 'jcampconverter';

const testData = `1 2
2 3
3 4
4 5
5 6
6 7
7 8
8 9`;
var options = {
    title: 'test',
    owner: 'cheminfo',
    origin: 'manually',
    type: 'MASS SPECTRUM',
    xUnit: 'M/Z',
    yUnit: 'relative abundance',
    info: {
        info1: 'value1',
        info2: 'value2'
    }
};
var jcamp = convertToJcamp(testData, options);
var jcampObject = convert(jcamp);

/* jcampObject.spectra -> [{
    data: [[
        1, 2,
        2, 3,
        3, 4,
        4, 5,
        5, 6,
        6, 7,
        7, 8,
        8, 9
    ]],
    dataType: 'MASS SPECTRUM',
    firstX: 1,
    firstY: 2,
    isPeaktable: true,
    lastX: 8,
    lastY: 9,
    nbPoints: 8,
    title: 'test',
    xFactor: 1,
    xUnit: 'M/Z',
    yFactor: 1,
    yUnit: 'relative abundance'
}]
*/
```

## [API Documentation](https://cheminfo-js.github.io/convert-to-jcamp/)

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/convert-to-jcamp.svg?style=flat-square
[npm-url]: https://npmjs.org/package/convert-to-jcamp
[travis-image]: https://img.shields.io/travis/cheminfo-js/convert-to-jcamp/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/cheminfo-js/convert-to-jcamp
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo-js/convert-to-jcamp.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/cheminfo-js/convert-to-jcamp
[download-image]: https://img.shields.io/npm/dm/convert-to-jcamp.svg?style=flat-square
[download-url]: https://npmjs.org/package/convert-to-jcamp
