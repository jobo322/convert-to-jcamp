import { readFileSync } from 'fs';
import { join } from 'path';

// @ts-expect-error
import { convert } from 'jcampconverter';
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { XYEncoding } from '../JcampOptions';
import { fromJSON } from '../fromJSON';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const createData = (firstX: number, lastX: number, nbPoints: number) => {
  const x = new Array(nbPoints);
  const jump = (lastX - firstX) / (nbPoints - 1);
  for (let i = 0; i < nbPoints; i++) {
    x[i] = firstX + jump * i;
  }
  return x;
};

const xAxis = createData(1, 150, 150);
const xDecimal = createData(0.1, 15, 150);
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

  it('create and read spectrum y decimal with yEncoding and specify yFactor', () => {
    const spectrum = {
      x: xAxis,
      y: yDecimal,
    };

    const encodingList: XYEncoding[] = ['FIX', 'DIF', 'DIFDUP', 'SQZ', 'PAC'];
    for (let xyEncoding of encodingList) {
      const jcamp = fromJSON(spectrum, { xyEncoding, info: { yFactor: 0.1 } });
      const spectrumReaded = convert(jcamp);
      const spectrumData = spectrumReaded.flatten[0].spectra[0].data;
      expect(spectrumData.x).toBeDeepCloseTo(spectrum.x);
      expect(spectrumData.y).toBeDeepCloseTo(spectrum.y);
    }
  });

  it('create and read spectrum y decimal with yEncoding, no yFactor', () => {
    const spectrum = {
      x: xAxis,
      y: yDecimal,
    };

    const encodingList: XYEncoding[] = ['FIX', 'DIF', 'DIFDUP', 'SQZ', 'PAC'];
    for (let xyEncoding of encodingList) {
      const jcamp = fromJSON(spectrum, { xyEncoding });
      const spectrumReaded = convert(jcamp);
      const spectrumData = spectrumReaded.flatten[0].spectra[0].data;
      expect(spectrumData.x).toBeDeepCloseTo(spectrum.x);
      expect(spectrumData.y).toBeDeepCloseTo(spectrum.y);
    }
  });

  it('create and read spectrum with yEncoding and x and y decimals', () => {
    const spectrum = {
      x: xDecimal,
      y: yDecimal,
    };

    const encodingList: XYEncoding[] = ['FIX', 'DIF', 'DIFDUP', 'SQZ', 'PAC'];
    for (let xyEncoding of encodingList) {
      const jcamp = fromJSON(spectrum, { xyEncoding });
      const spectrumReaded = convert(jcamp);
      const spectrumData = spectrumReaded.flatten[0].spectra[0].data;
      expect(spectrumData.x).toBeDeepCloseTo(spectrum.x);
      expect(spectrumData.y).toBeDeepCloseTo(spectrum.y);
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

  it('create a NMR spectrum', () => {
    const spectrum = JSON.parse(
      readFileSync(join(__dirname, 'data/nmr.json'), 'utf8'),
    );

    const jcamp = fromJSON(spectrum, {
      info: {
        title: 'nmrdb.org predicted spectrum',
        dataType: 'NMR spectrum',
        xUnits: 'PPM',
        yUnits: 'Intensity',
        '.OBSERVE NUCLEUS': '1H',
        '.OBSERVE FREQUENCY': 400,
        '.SOLVENT NAME': 'CDCl3',
      },
      meta: {},
      xyEncoding: 'PAC',
    });
    const spectrumReaded = convert(jcamp);
    const spectrumData = spectrumReaded.flatten[0].spectra[0].data;
    expect(spectrumData.x).toBeDeepCloseTo(spectrum.x);
    expect(spectrumData.y).toBeDeepCloseTo(spectrum.y, 1);
  });
});
