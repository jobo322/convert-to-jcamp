import { convert } from 'jcampconverter';

import { fromJSON } from '..';

test('createJSON Ntuples', () => {
  const data = {
    x: [1, 2, 3, 4],
    y: [2, 3, 4, 5],
    t: [3, 4, 5, 6],
  };
  const variables = {
    x: { varName: 'x value', units: 'x unit' },
    y: { varName: 'y value', units: 'y unit' },
    t: { varName: 't value', units: 'z unit' },
  };

  const jcamp = fromJSON(data, {
    variables,
    meta: {
      meta1: 'value1',
      meta2: 'value2',
    },
    info: {
      title: 'Hello world',
      dataType: 'TEST',
    },
  });

  let converted = JSON.parse(
    JSON.stringify(convert(jcamp, { keepRecordsRegExp: /^\$.*/ })),
  ).flatten[0];

  expect(converted.meta).toStrictEqual({ meta1: 'value1', meta2: 'value2' });

  expect(converted.spectra[0].data).toStrictEqual({
    x: [1, 2, 3, 4],
    y: [2, 3, 4, 5],
    t: [3, 4, 5, 6],
  });

  expect(converted.spectra[0].variables).toStrictEqual({
    x: {
      varname: 'Weight',
      symbol: 'X',
      vartype: 'INDEPENDENT',
      vardim: 4,
      units: 'x unit',
    },
    y: {
      varname: 'Temperature',
      symbol: 'Y',
      vartype: 'DEPENDENT',
      vardim: 4,
      units: 'y unit',
    },
    t: {
      varname: 'Time',
      symbol: 'T',
      vartype: 'DEPENDENT',
      vardim: 4,
      units: 'z unit',
    },
  });
});
