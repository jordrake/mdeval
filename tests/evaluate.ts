import * as test from 'tape';

import evaluate from '../src/evaluate';
import { isError } from '../src/isError';

function overrideRunInNewContext(fn: (code: string, context: object, options: object) => any): Function {
  const vm = require('vm');
  const original = vm.runInNewContext;
  vm.runInNewContext = fn;
  return () => (vm.runInNewContext = original);
}

test('evaluate returns an array of values from executed codeblocks', t => {
  t.plan(1);

  const codeBlocks = [
    { startingLineNumber: 1, code: '4 + 7;\n12 + 7;' },
    { startingLineNumber: 2, code: 'Buffer;' },
    { startingLineNumber: 3, code: 'require("fs").readFileSync' }
  ];

  t.deepEqual(evaluate(codeBlocks), [19, Buffer, require('fs').readFileSync]);
});

test('evaluate provides the vm with line offsets', t => {
  t.plan(1);
  let givenVmOptions: any;
  const reset = overrideRunInNewContext((code, context, options) => (givenVmOptions = options));
  const codeBlocks = [{ startingLineNumber: 14, code: 'a + b;' }];

  evaluate(codeBlocks);
  reset();

  t.equal(givenVmOptions.lineOffset, 14);
});

test('evaluate returns errors that can be detected with isError', t => {
  t.plan(1);

  const codeBlocks = [{ startingLineNumber: 1, code: 'throw new Error();' }];
  const [error] = evaluate(codeBlocks);

  t.true(isError(error));
});

test('evaluate can take additional context which is accessible to codeblocks', t => {
  t.plan(1);

  const codeBlocks = [{ startingLineNumber: 1, code: 'foo;' }];

  t.deepEqual(evaluate(codeBlocks, { context: { foo: 'bar' } }), ['bar']);
});
