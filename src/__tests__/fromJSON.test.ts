// @ts-expect-error
import { convert } from 'jcampconverter';

import { fromJSON } from '../fromJSON';

describe('fromJSON', () => {
  it('create and read spectrum', () => {
    const spectrum = {
      x: [1, 2, 3, 4],
      y: [2, 3, 4, 5],
    };

    const jcamp = fromJSON(spectrum, { xydata: true });
    const spectrumReaded = convert(jcamp, { xy: true });
    const spectrumData = spectrumReaded.flatten[0].spectra[0].data;

    expect(spectrumData.x).toStrictEqual(spectrum.x);
    expect(spectrumData.y).toStrictEqual(spectrum.y);
  });
});
