export const addInfoData = (
  data: Record<string, any>,
  keys = Object.keys(data),
  prefix = '##$',
) => {
  let header = '';
  for (const key of keys) {
    header +=
      typeof data[key] === 'object'
        ? `${prefix}${key}=${JSON.stringify(data[key])}\n`
        : `${prefix}${key}=${data[key]}\n`;
  }
  return header;
};
