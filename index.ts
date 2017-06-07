import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as commander from 'commander';

import mdeval from './src/mdeval';
import { isError } from './src/isError';

commander
  .version('1.0.0')
  .usage('[options] <file>')
  .option(
    '-c, --context [path]',
    'Path to a module that provides additional global context to the executed code blocks',
    path => require(resolve(__dirname, path))
  )
  .action(path => {
    const target = readFileSync(resolve(__dirname, path), 'utf-8');
    const results = mdeval(target, {
      filename: path,
      context: commander.context
    });

    results.forEach(result => {
      if (isError(result)) {
        console.error(result);
        process.exit(1);
      }
    });

    process.exit(0);
  })
  .parse(process.argv);
