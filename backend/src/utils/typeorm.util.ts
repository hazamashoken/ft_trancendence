import { TypeormQueryOption } from '@backend/interfaces/qeury-option.interface';

export class TypeormUtil {
  static setFindOption(options: TypeormQueryOption) {
    if (!options) {
      return {};
    }
    let findOption: any = {};
    if (options.fields && options.fields.length > 0) {
      let select = {};
      for (const f of options.fields) {
        const projection = f.split('.');
        if (projection.length === 1) {
          select = { ...select, [f]: true };
        } else {
          select = TypeormUtil.setSelectProjection(select, projection);
        }
      }
      findOption = { ...findOption, select };
    }
    if (options.limit && options.limit > 0) {
      findOption = {
        ...findOption,
        take: options.limit,
      };
    }
    if (options.offset && options.offset > 0) {
      findOption = {
        ...findOption,
        skip: options.offset,
      };
    }
    return findOption;
  }

  private static setSelectProjection(select, projection: string[]) {
    const project = projection[0];
    const field = projection[1];
    if (select[project]) {
      select = {
        ...select,
        [project]: {
          ...select[project],
          [field]: true,
        },
      };
    } else {
      select = {
        ...select,
        [project]: {
          [field]: true,
        },
      };
    }
    return select;
  }
}
