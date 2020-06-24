import { convert } from 'jcampconverter';

import { fromVariables } from '..';

describe('fromVariables', () => {
  it.only('3 variables', () => {
    const variables = {
      x: { data: [1, 2, 3, 4], symbol: 'X', name: 'x value', units: 'x unit' },
      y: { data: [2, 3, 4, 5], symbol: 'Y', name: 'y value', units: 'y unit' },
      z: { data: [3, 4, 5, 6], symbol: 'T', name: 't value', units: 't unit' },
    };

    const jcamp = fromVariables(variables, {
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
        name: 'x value',
        symbol: 'X',
        type: 'INDEPENDENT',
        dim: 4,
        units: 'x unit',
        data: [1, 2, 3, 4],
      },
      y: {
        name: 'y value',
        symbol: 'Y',
        type: 'DEPENDENT',
        dim: 4,
        units: 'y unit',
        data: [2, 3, 4, 5],
      },
      t: {
        name: 't value',
        symbol: 'T',
        type: 'DEPENDENT',
        dim: 4,
        units: 't unit',
        data: [3, 4, 5, 6],
      },
    });
  });

  it('x / y variables no force', () => {
    const variables = {
      x: { data: [1, 2, 3, 4], varName: 'x value', units: 'x unit' },
      y: { data: [2, 3, 4, 5], varName: 'y value', units: 'y unit' },
    };

    const jcamp = fromVariables(variables, {
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

    expect(converted.spectra[0]).toStrictEqual({
      xUnits: 'x value [x unit]',
      yUnits: 'y value [y unit]',
      firstX: 1,
      lastX: 4,
      firstY: 2,
      lastY: 5,
      nbPoints: 4,
      xFactor: 1,
      yFactor: 1,
      isPeaktable: true,
      data: { x: [1, 2, 3, 4], y: [2, 3, 4, 5] },
    });
  });

  it('x / y variables no force variable', () => {
    const variables = {
      x: { data: [1, 2, 3, 4], name: 'x value', units: 'x unit' },
      y: { data: [2, 3, 4, 5], name: 'y value', units: 'y unit' },
    };

    const jcamp = fromVariables(variables, {
      forceNtuples: true,
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

    expect(converted.spectra[0]).toStrictEqual({
      page: 'N=1',
      pageValue: 1,
      pageSymbol: 'N',
      variables: {
        x: {
          name: 'x value',
          symbol: 'x',
          type: 'INDEPENDENT',
          dim: 4,
          units: 'x unit',
          data: [1, 2, 3, 4],
        },
        y: {
          name: 'y value',
          symbol: 'y',
          type: 'DEPENDENT',
          dim: 4,
          units: 'y unit',
          data: [2, 3, 4, 5],
        },
      },
      nbPoints: 4,
      xUnits: 'x value [x unit]',
      yUnits: 'y value [y unit]',
      datatable: '(xy..xy)',
      xFactor: 1,
      yFactor: 1,
      isPeaktable: true,
      data: { x: [1, 2, 3, 4], y: [2, 3, 4, 5] },
    });
  });
});
