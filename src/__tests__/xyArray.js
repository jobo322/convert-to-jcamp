import { convert } from 'jcampconverter';

import { xyArray } from '..';

describe('xyArray', () => {
  test('simple test', () => {
    const data = [[1, 2], [2, 3]];
    const jcamp = xyArray(data);
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
