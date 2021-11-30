// @ts-expect-error
import { convert } from 'jcampconverter';

import { XYEncoding } from '../JcampOptions';
import { fromJSON } from '../fromJSON';

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
const yDecimal = createData(0.1, 15, 150);

describe('fromJSON', () => {
  it('create and read spectrum differents xyEncoding factor != 1', () => {
    const spectrum = {
      x: xAxis,
      y: yPositive,
    };

    const encodingList: XYEncoding[] = ['DIF', 'DIFDUP', 'FIX', 'SQZ', 'PAC'];
    for (let xyEncoding of encodingList) {
      const jcamp = fromJSON(spectrum, {
        xyEncoding,
      });
      const spectrumReaded = convert(jcamp);
      const spectrumData = spectrumReaded.flatten[0].spectra[0].data;
      expect(spectrumData.x).toStrictEqual(spectrum.x);
      expect(spectrumData.y).toStrictEqual(spectrum.y);
    }
  });
  it('create and read spectrum differents xyEncoding', () => {
    const spectrum = {
      x: xAxis,
      y: yPositive,
    };

    const encodingList: XYEncoding[] = ['DIF', 'DIFDUP', 'FIX', 'SQZ', 'PAC'];
    for (let xyEncoding of encodingList) {
      const jcamp = fromJSON(spectrum, { xyEncoding });
      const spectrumReaded = convert(jcamp);
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

    const encodingList: XYEncoding[] = ['DIF', 'DIFDUP', 'FIX', 'SQZ', 'PAC'];
    for (let xyEncoding of encodingList) {
      const jcamp = fromJSON(spectrum, { xyEncoding });
      const spectrumReaded = convert(jcamp);
      const spectrumData = spectrumReaded.flatten[0].spectra[0].data;
      expect(spectrumData.x).toStrictEqual(spectrum.x);
      expect(spectrumData.y).toStrictEqual(spectrum.y);
    }
  });

  it('create and read spectrum y decimal with yEncoding', () => {
    const spectrum = {
      x: xAxis,
      y: yDecimal,
    };

    const encodingList: XYEncoding[] = ['DIF', 'DIFDUP', 'FIX', 'SQZ', 'PAC'];
    for (let xyEncoding of encodingList) {
      const jcamp = fromJSON(spectrum, { xyEncoding, info: { yFactor: 0.1 } });
      const spectrumReaded = convert(jcamp);
      const spectrumData = spectrumReaded.flatten[0].spectra[0].data;
      expect(spectrumData.x).toStrictEqual(spectrum.x);
      expect(spectrumData.y).toStrictEqual(spectrum.y);
    }
  });

  it('create and read spectrum DIFDUP xyEncoding negative values', () => {
    const spectrum = { x: xAxis, y: yNegative };

    const jcamp = fromJSON(spectrum, { xyEncoding: 'DIFDUP' });
    const spectrumReaded = convert(jcamp);
    const spectrumData = spectrumReaded.flatten[0].spectra[0].data;
    expect(spectrumData.x).toStrictEqual(spectrum.x);
    expect(spectrumData.y).toStrictEqual(spectrum.y);
  });
});
