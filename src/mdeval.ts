import markdownToCodeBlocks from './parse';
import evaluate from './evaluate';

type Options = {
  context?: object;
  filename?: string;
};

export default function mdeval(markdown: string, options: Options) {
  const codeBlocks = markdownToCodeBlocks(markdown);
  return evaluate(codeBlocks, options);
}
