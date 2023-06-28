import { Config, TypeKind } from '../interfaces';

export class TypeConverter {
  typeOverrides: Record<string, string> = {};
  exportedNamePrefix: string = '';
  exportedNameSuffix: string = '';

  convert(path: string | string[], useAffixes:boolean=true) {
    let fullName: string | undefined;
    let name: string | undefined;
    if (Array.isArray(path)) {
      fullName = path.join('.');
      name = path.at(-1) || '';
    } else {
      fullName = undefined;
      name = path || '';
    }

    if (!name && !fullName) {
      console.log('convertType received a bad type path:', path);
      return 'ERROR';
    }

    let newName: string | undefined = undefined;

    if (fullName) {
      newName = this.typeOverrides[fullName];
    }

    if (!newName) {
      newName = this.typeOverrides[name];
    }

    if (!newName && useAffixes) {
      newName = `${this.exportedNamePrefix}${name}${this.exportedNameSuffix}`;
    }

    return newName || name;
  }
}
