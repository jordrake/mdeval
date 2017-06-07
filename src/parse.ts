import { readFileSync } from 'fs';
import { resolve } from 'path';

import { CodeBlock } from './types/CodeBlock';

type Line = {
  contents: string;
  number: number;
};

function toLines(markdown: string): Array<Line> {
  return markdown.split(/\r\n|\r|\n/).map((contents, index) => ({ contents, number: index + 1 }));
}

function groupCodeLines(lines: Array<Line>): Array<Array<Line>> {
  let queue: Array<Array<Line>> = [];
  let inCodeBlock = false;

  lines.forEach(line => {
    const matchStart = line.contents.match(/^```(javascript|js)$/);
    const matchEnd = line.contents.match(/^```$/);

    if (matchStart && !inCodeBlock) {
      inCodeBlock = true;
      queue.push([]);
      return;
    }
    if (matchEnd && inCodeBlock) {
      inCodeBlock = false;
    }
    if (inCodeBlock) {
      queue[queue.length - 1].push(line);
      return;
    }
  });

  return queue.filter(line => line.length > 0);
}

function toCodeBlocks(lineGroups: Array<Array<Line>>): Array<CodeBlock> {
  return lineGroups.map(lines => {
    const code = lines.reduce((prev, next) => {
      return prev.concat(prev ? '\n' : '').concat(next.contents);
    }, '');

    return {
      startingLineNumber: lines[0].number - 1,
      code
    };
  });
}

export default function markdownToCodeBlocks(markdown: string): Array<CodeBlock> {
  return toCodeBlocks(groupCodeLines(toLines(markdown)));
}
