import { xyArray } from './xyArray';

export function xyObject(data, meta = {}) {
  var parsed = [];
  for (var index = 0; index < data.x.length; index++) {
    parsed.push([data.x[index], data.y[index]]);
  }
  return xyArray(parsed, meta);
}
