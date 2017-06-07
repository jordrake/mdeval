import * as test from 'tape';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import markdownToCodeBlocks from '../src/parse';

function getExample(filename: string): string {
  return readFileSync(resolve(__dirname, 'examples', filename), 'utf-8');
}

test('parse returns an empty array for markdown with no codeblocks', t => {
  t.plan(1);
  t.deepEqual(markdownToCodeBlocks(getExample('./no-codeblocks.md')), []);
});

test('parse filters empty codeblocks', t => {
  t.plan(1);
  t.deepEqual(markdownToCodeBlocks(getExample('./empty-codeblock.md')), []);
});

test('parse returns an array with single codeblock', t => {
  t.plan(1);
  t.deepEqual(markdownToCodeBlocks(getExample('./one-codeblock.md')), [{ code: 'pass();', startingLineNumber: 5 }]);
});

test('parse returns an array with multiple codeblocks', t => {
  t.plan(1);
  t.deepEqual(markdownToCodeBlocks(getExample('./many-codeblocks.md')), [
    { code: '"several codeblocks";', startingLineNumber: 1 },
    { code: '"and";\n"with";\n"varying";\n"lengths";', startingLineNumber: 7 }
  ]);
});

test('parse only collects js and javascript codeblocks', t => {
  t.plan(1);
  t.deepEqual(markdownToCodeBlocks(getExample('./languages-codeblocks.md')), [
    { code: '"is parsed";', startingLineNumber: 9 },
    { code: '"so is js";', startingLineNumber: 13 }
  ]);
});
