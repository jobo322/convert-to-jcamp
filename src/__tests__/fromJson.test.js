import { convert } from 'jcampconverter';

import { fromJSON } from '..';

test('xxyyObject test', () => {
  const data = { x: [1, 2], y: [2, 3] };
  const jcamp = fromJSON(data);

  let converted = JSON.parse(JSON.stringify(convert(jcamp))).flatten[0];

  expect(converted).toStrictEqual({
    spectra: [
      {
        xUnits: '',
        yUnits: '',
        firstX: 1,
        lastX: 2,
        firstY: 2,
        lastY: 3,
        nbPoints: 2,
        xFactor: 1,
        yFactor: 1,
        isPeaktable: true,
        data: { x: [1, 2], y: [2, 3] },
      },
    ],
    ntuples: {},
    info: {},
    meta: {},
    title: '',
    dataType: '',
  });
});
