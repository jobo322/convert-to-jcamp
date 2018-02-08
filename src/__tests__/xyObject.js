import { convert } from 'jcampconverter';

import { xyObject } from '..';

describe('xyObject', () => {
  test('simple test', () => {
    const data = { x: [1, 2], y: [2, 3] };
    const jcamp = xyObject(data);
    expect(convert(jcamp).spectra).toEqual([{
      data: [[
        1, 2,
        2, 3
      ]],
      dataType: '',
      firstX: 1,
      firstY: 2,
      isPeaktable: true,
      lastX: 2,
      lastY: 3,
      nbPoints: 2,
      title: '',
      xFactor: 1,
      xUnit: '',
      yFactor: 1,
      yUnit: ''
    }]);
  });
});
