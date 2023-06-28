import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { logger } from '@prisma/sdk';
import path from 'path';
import { GENERATOR_NAME } from './constants';
import { Config } from './interfaces';
import { initializeOutput, writeOutput } from './utils/files';
import { handlebarsGenerator } from './handlebarsGenerator';

const { version } = require('../package.json');

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`);
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    };
  },
  onGenerate: async (options: GeneratorOptions) => {
    try {
      // console.log('cfg:', options);
      // for (const [key, value] of Object.entries(options.generator.config)) {
      //   console.log(`[${key}]`, typeof value);
      // }

      const config: Config = {
        output: options.generator.output?.value || './src/generated/sample.txt',
        template: options.generator.config.template || './template.hbs',
        exportedNamePrefix: options.generator.config.exportedNamePrefix || '',
        exportedNameSuffix: options.generator.config.exportedNameSuffix || '',
      };

      const root = path.dirname(options.schemaPath);
      if(!config.output.startsWith('/')){config.output=path.join(root,config.output)}
      if(!config.template.startsWith('/')){config.template=path.join(root,config.template)}

      const content = await handlebarsGenerator(config, options);

      console.log('WRITE:', config.output);
      await writeOutput(config.output, content);

    } catch (err) {
      // console.error is hidden by Prisma tools
      console.log(err);
      throw err;
    }
  },
});

