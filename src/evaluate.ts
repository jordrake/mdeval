import { runInNewContext } from 'vm';

import { CodeBlock } from './types/CodeBlock';
import { enhanceError } from './isError';

function filterUndefineds(target: object): object {
  return Object.entries(target).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

function generateContext(context: object = {}) {
  const localGlobals = { exports, require, module, __filename, __dirname };
  return Object.assign({}, localGlobals, global, context);
}

function run(code: string, context: object, vmOptions: object): any {
  const totalContext = generateContext(context);

  try {
    return runInNewContext(code, totalContext, vmOptions);
  } catch (e) {
    return enhanceError(e);
  }
}

type Options = {
  context?: object;
  filename?: string;
};

export default function evaluate(codeBlocks: Array<CodeBlock>, options: Options = {}) {
  return codeBlocks.map(codeBlock => {
    const vmOptions = filterUndefineds({
      filename: options.filename,
      lineOffset: codeBlock.startingLineNumber
    });

    return run(codeBlock.code, options.context, vmOptions);
  });
}
