import { convert } from 'jcampconverter';

import { fromJSON } from '..';

describe('fromJSON', () => {
  it('peaktable format', () => {
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
  it('xydata format', () => {
    const data = { x: [1, 2, 3, 4], y: [2, 3, 4, 5] };
    const jcamp = fromJSON(data, { xydata: true });
    let converted = JSON.parse(JSON.stringify(convert(jcamp))).flatten[0];
    expect(converted).toStrictEqual({
      spectra: [
        {
          xUnits: '',
          yUnits: '',
          firstX: 1,
          lastX: 4,
          firstY: 2,
          lastY: 5,
          nbPoints: 4,
          xFactor: 1,
          yFactor: 1,
          deltaX: 1,
          isXYdata: true,
          data: { x: [1, 2, 3, 4], y: [2, 3, 4, 5] },
        },
      ],
      ntuples: {},
      info: {},
      meta: {},
      title: '',
      dataType: '',
    });
  });

  it('xydata format with xFactor', () => {
    const data = { x: [], y: [] };
    for (let i = 0; i < 99; i++) {
      data.x.push(i + 5);
      data.y.push(i + 1);
    }
    data.x[data.x.length - 1] = data.x[0] + 1;
    const jcamp = fromJSON(data, {
      xydata: true,
      info: { xFactor: 1 / (data.x.length - 1) },
    });
    let converted = JSON.parse(JSON.stringify(convert(jcamp))).flatten[0];
    expect(converted).toMatchObject({
      spectra: [
        {
          xUnits: '',
          yUnits: '',
          firstX: 5,
          lastX: 6,
          firstY: 1,
          lastY: 99,
          nbPoints: 99,
          yFactor: 1,
          isXYdata: true,
        },
      ],
      ntuples: {},
      info: {},
      meta: {},
      title: '',
      dataType: '',
    });
  });

  it('xydata format large', () => {
    const data = { x: [], y: [] };
    for (let i = 0; i < 1000; i++) {
      data.x.push(i + 5);
      data.y.push(i + 1);
    }
    const jcamp = fromJSON(data, { xydata: true });
    let converted = JSON.parse(JSON.stringify(convert(jcamp))).flatten[0];
    expect(converted).toMatchObject({
      spectra: [
        {
          xUnits: '',
          yUnits: '',
          firstX: 5,
          lastX: 1004,
          firstY: 1,
          lastY: 1000,
          nbPoints: 1000,
          xFactor: 1,
          yFactor: 1,
          isXYdata: true,
        },
      ],
      ntuples: {},
      info: {},
      meta: {},
      title: '',
      dataType: '',
    });
  });
});
