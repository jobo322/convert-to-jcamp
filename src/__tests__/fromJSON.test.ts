// @ts-expect-error
import { convert } from 'jcampconverter';

import { fromJSON } from '../fromJSON';
import { XYEncoding } from '../JcampOptions';

const createData = (firstX: number, lastX: number, nbPoints: number) => {
  const x = new Array(nbPoints);
  const jump = (lastX - firstX) / (nbPoints - 1);
  for (let i = 0; i < nbPoints; i++) {
    x[i] = firstX + jump * i;
  }
  return x;
};

const xAxis = createData(1, 150, 150);
const yPositive = createData(1, 150, 150);
const yNegative = createData(-1, -150, 150);
const yZeros = createData(0, 0, 150);

describe('fromJSON', () => {
  it('create and read spectrum differents xyEncoding', () => {
    const spectrum = {
      x: xAxis,
      y: yPositive,
    };

    const encodingList: XYEncoding[] = [
      'DIF',
      'DIFDUP',
      'FIX',
      'SQZ',
      'CSV',
      'PAC',
    ];
    for (let xyEncoding of encodingList) {
      const jcamp = fromJSON(spectrum, { xyData: true, xyEncoding });
      const spectrumReaded = convert(jcamp, { xy: true });
      const spectrumData = spectrumReaded.flatten[0].spectra[0].data;

      expect(spectrumData.x).toStrictEqual(spectrum.x);
      expect(spectrumData.y).toStrictEqual(spectrum.y);
    }
  });

  it('create and read spectrum y in zeros differents xyEncoding', () => {
    const spectrum = {
      x: xAxis,
      y: yZeros,
    };

    const encodingList: XYEncoding[] = [
      'DIF',
      'DIFDUP',
      'FIX',
      'SQZ',
      'CSV',
      'PAC',
    ];
    for (let xyEncoding of encodingList) {
      const jcamp = fromJSON(spectrum, { xyData: true, xyEncoding });
      const spectrumReaded = convert(jcamp, { xy: true });
      const spectrumData = spectrumReaded.flatten[0].spectra[0].data;

      expect(spectrumData.x).toStrictEqual(spectrum.x);
      expect(spectrumData.y).toStrictEqual(spectrum.y);
    }
  });

  it('create and read spectrum DIFDUP xyEncoding negative values', () => {
    const spectrum = { x: xAxis, y: yNegative };

    const jcamp = fromJSON(spectrum, { xyData: true, xyEncoding: 'DIFDUP' });
    const spectrumReaded = convert(jcamp, { xy: true });
    const spectrumData = spectrumReaded.flatten[0].spectra[0].data;
    expect(spectrumData.x).toStrictEqual(spectrum.x);
    expect(spectrumData.y).toStrictEqual(spectrum.y);
  });
});
