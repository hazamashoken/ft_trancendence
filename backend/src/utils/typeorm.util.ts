export interface TypeormQueryOption {
  limit?: number;
  offset?: number;
  fields?: string[];
}

export class TypeormUtil {
  static setFindOption(options: TypeormQueryOption) {
    let findOption: any = {};
    if (options.fields && options.fields.length > 0) {
      findOption = Object.assign(findOption, {
        select: options.fields.reduce(
          (obj, val) => ({ ...obj, [val]: true }),
          {},
        ),
      });
    }
    return findOption;
  }
}
