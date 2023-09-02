export class StringUtil {
  // to capitalize first char
  static toCapitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  // Convert camelCase to snake_case
  static toSnakeCase(str: string) {
    return str
      .split(/(?=[A-Z])/)
      .join('_')
      .toLocaleLowerCase();
  }
  // Convert snake_case to camelCase
  static toCamelCase(str: string) {
    return str
      .split('_')
      .map((s, i) => (i === 0 ? s.toLowerCase() : this.toCapitalize(s)))
      .join('');
  }
}
