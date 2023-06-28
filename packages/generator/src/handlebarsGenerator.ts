import { GeneratorOptions } from '@prisma/generator-helper';
import { Config } from './interfaces';
import Handlebars from 'handlebars';
import helpers from '@budibase/handlebars-helpers';
import { readFile } from 'fs/promises';
import { TypeConverter } from './utils/TypeConverter';

export async function handlebarsGenerator(
  config: Config,
  options: GeneratorOptions,
) {
  console.log('TEMPLATE:', config.template);
  const src = await readFile(config.template, { encoding: 'utf8' });

  // Using a local instance because I don't know if prisma generate creates a new executable instance when this is used more than once per source schema.
  const hb = Handlebars.create();
  hb.registerHelper(helpers());

  const converter = new TypeConverter();
  registerTypeConverterHelpers(hb, converter);

  const template = hb.compile(src, {
    noEscape: true,
  });
  const content = template(options);
  return content;
}

function registerTypeConverterHelpers(hb: typeof Handlebars, converter: TypeConverter) {
  hb.registerHelper({
    registerTypeOverride: (arg1, arg2) => {
      converter.typeOverrides[arg1] = arg2;
    },
    getTypeOverrides: () => {
      return converter.typeOverrides;
    },
    registerTypeNamePrefix: (arg1) => {
      converter.exportedNamePrefix = arg1;
    },
    registerTypeNameSuffix: (arg1) => {
      converter.exportedNameSuffix = arg1;
    },
    convertType: (...args) => {
      // const args = [...context];
      const parts = args.filter((part) => typeof part === 'string' && !!part);

      let useAffixes = true;
      if (typeof args.at(-2) === 'boolean') {
        useAffixes = args.at(-2);
      }

      return converter.convert(parts, useAffixes);
    },
  });
}

