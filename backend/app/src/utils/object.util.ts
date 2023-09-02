import { StringUtil } from './string.util';

export class ObjectUtil {
  static toSnakeKey(obj: any) {
    const result = {};
    Object.keys(obj).forEach((key) => {
      result[StringUtil.toSnakeCase(key)] = obj[key];
    });
    return result;
  }

  static toCamelKey(obj: any) {
    const result = {};
    Object.keys(obj).forEach((key) => {
      result[StringUtil.toCamelCase(key)] = obj[key];
    });
    return result;
  }
}
