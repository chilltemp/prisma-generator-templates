import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { Config } from '../interfaces';

export async function initializeOutput(config: Config) {
  await mkdir(path.dirname(config.output), {
    recursive: true,
  });

  await writeFile(config.output, '', { encoding: 'utf8', flag: 'w' });
}

export async function writeOutput(fullPath:string, content: string) {
  await mkdir(path.dirname(fullPath), {
    recursive: true,
  });

  await writeFile(fullPath, content, { encoding: 'utf8', flag: 'w' });
}
