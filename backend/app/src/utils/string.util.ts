export class StringUtil {
  // Convert camelCase to snake_case
  static toSnakeCase(str: string) {
    return str
      .split(/(?=[A-Z])/)
      .join('_')
      .toLocaleLowerCase();
  }
}
