import { encode } from '../vectorEncoder';

describe('encoding', () => {
  const y = [5, 4, 3, 2, 1, 5, 5, 5, 10, -102, 0];
  it('DIFF encoding', () => {
    const encodedData = encode(y, 0, 1, 'DIFF');
    expect(encodedData).toBe('0EjjjjM%%Nj12J02\r\n10@');
  });
  it('DIFDUP encoding', () => {
    const y = [5, 4, 3, 2, 1, 5, 5, 5, 10, -102, 0];
    const encodedData = encode(y, 0, 1, 'DIFDUP');
    expect(encodedData).toBe('0EjVM%TNj12J02\r\n10@');
  });
  it('DIFDUP encoding publication example', () => {
    const y = [1, 2, 3, 3, 2, 1, 0, -1, -2, -3];
    const encodedData = encode(y, 0, 1, 'DIFDUP');
    expect(encodedData).toBe('0AJT%jX');
  });
  it('DIFDUP encoding start 1000', () => {
    const y = [1, 2, 3, 3, 2, 1, 0, -1, -2, -3];
    const encodedData = encode(y, 1000, 1, 'DIFDUP');
    expect(encodedData).toBe('1000AJT%jX');
  });
  it('SQZ encoding', () => {
    const y = [5, 4, 3, 2, 1, 5, 5, 5, 10, -102, 0];
    const encodedData = encode(y, 0, 1, 'SQZ');
    expect(encodedData).toBe('0EDCBAEEEA0a02\r\n10@');
  });
  it('FIX encoding', () => {
    const y = [5, 4, 3, 2, 1, 5, 5, 5, 10, -102, 0];
    const encodedData = encode(y, 0, 1, 'FIX');
    expect(encodedData).toBe('0 5 4 3 2 1 5 5 5\r\n8 10 -102 0');
  });
  it('PAC encoding', () => {
    const y = [5, 4, 3, 2, 1, 5, 5, 5, 10, -102, 0];
    const encodedData = encode(y, 0, 1, 'PAC');
    expect(encodedData).toBe('0+5+4+3+2+1+5+5+5\r\n8+10-102+0');
  });
});
