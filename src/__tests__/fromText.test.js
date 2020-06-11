import fs from 'fs';

import { convert } from 'jcampconverter';

import { fromText } from '..';

describe('fromText', () => {
  it('check valid with jcampconverter', () => {
    const testData = `ABCDE
      -1 2
      2 3
      3 4
      4 5
      5 6
      6 7
      7 8
      8 9`;
    let options = {
      info: {
        title: 'test',
        owner: 'cheminfo',
        origin: 'manually',
        dataType: 'MASS SPECTRUM',
        xUnits: 'M/Z',
        yUnits: 'relative abundance',
      },
      meta: {
        info1: 'value1',
        info2: 'value2',
      },
    };
    let jcamp = fromText(testData, options);

    expect(jcamp).toMatchSnapshot();

    let jcampObject = JSON.parse(JSON.stringify(convert(jcamp))).flatten[0];
    expect(jcampObject).toStrictEqual({
      ntuples: {},
      info: {},
      meta: {},
      title: 'test',
      dataType: 'MASS SPECTRUM',
      spectra: [
        {
          data: {
            x: [-1, 2, 3, 4, 5, 6, 7, 8],
            y: [2, 3, 4, 5, 6, 7, 8, 9],
          },
          firstX: -1,
          firstY: 2,
          isPeaktable: true,
          lastX: 8,
          lastY: 9,
          nbPoints: 8,
          xFactor: 1,
          xUnits: 'M/Z',
          yFactor: 1,
          yUnits: 'relative abundance',
        },
      ],
    });
  });

  it('check with default values', () => {
    const testData = `2 3
1 2
3 4
-4 5
5 16
6 7
7 8
8 9`;

    let jcamp = fromText(testData);
    let jcampObject = JSON.parse(JSON.stringify(convert(jcamp))).flatten[0];
    expect(jcampObject).toStrictEqual({
      dataType: '',
      info: {},
      meta: {},
      ntuples: {},
      spectra: [
        {
          data: { x: [2, 1, 3, -4, 5, 6, 7, 8], y: [3, 2, 4, 5, 16, 7, 8, 9] },
          firstX: -4,
          firstY: 2,
          isPeaktable: true,
          lastX: 8,
          lastY: 16,
          nbPoints: 8,
          xFactor: 1,
          xUnits: '',
          yFactor: 1,
          yUnits: '',
        },
      ],
      title: '',
    });
  });

  it('check big IV file', () => {
    const testData = fs.readFileSync(`${__dirname}/iv.txt`, 'utf8');

    let jcamp = fromText(testData);

    let jcampObject = convert(jcamp).flatten[0];

    expect(jcampObject.spectra[0].data.x).toHaveLength(6472);
  });
});
