import fs from 'fs';

import { convert } from 'jcampconverter';

import { fromText } from '..';

describe('fromText', () => {
  it('check valid with jcampconverter', () => {
    const testData = `ABCDE
      1 2
      2 3
      3 4
      4 5
      5 6
      6 7
      7 8
      8 9`;
    let options = {
      meta: {
        title: 'test',
        owner: 'cheminfo',
        origin: 'manually',
        type: 'MASS SPECTRUM',
        xUnit: 'M/Z',
        yUnit: 'relative abundance',
        info: {
          info1: 'value1',
          info2: 'value2',
        },
      },
    };
    let jcamp = fromText(testData, options);
    expect(jcamp).toMatchSnapshot();

    let jcampObject = JSON.parse(JSON.stringify(convert(jcamp)));

    expect(jcampObject.spectra).toStrictEqual([
      {
        data: [[1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9]],
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
        yUnit: 'relative abundance',
      },
    ]);
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
    let jcampObject = JSON.parse(JSON.stringify(convert(jcamp)));

    expect(jcampObject.spectra).toStrictEqual([
      {
        data: [[2, 3, 1, 2, 3, 4, -4, 5, 5, 16, 6, 7, 7, 8, 8, 9]],
        dataType: '',
        firstX: -4,
        firstY: 2,
        isPeaktable: true,
        lastX: 8,
        lastY: 16,
        nbPoints: 8,
        title: '',
        xFactor: 1,
        xUnit: '',
        yFactor: 1,
        yUnit: '',
      },
    ]);
  });

  it('check big IV file', () => {
    const testData = fs.readFileSync(`${__dirname}/iv.txt`, 'utf8');

    let jcamp = fromText(testData);

    let jcampObject = convert(jcamp);

    expect(jcampObject.spectra[0].data[0]).toHaveLength(12944);
  });
});
