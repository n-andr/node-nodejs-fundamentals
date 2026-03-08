import { Transform } from 'node:stream';

const lineNumberer = () => {
  // Write your code here
  // Read from process.stdin
  // Use Transform Stream to prepend line numbers
  // Write to process.stdout
  let buffer = '';
  let lineNumber = 1;

  const transformer = new Transform({
	transform(chunk, encoding, callback) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      const output = lines
        .map((line) => `${lineNumber++} | ${line}\n`)
        .join('');

      callback(null, output);
    },

    flush(callback) {
      if (buffer.length > 0) {
        callback(null, `${lineNumber} | ${buffer}`);
        return;
      }
      callback();
    },
  });

  process.stdin.pipe(transformer).pipe(process.stdout);
};

lineNumberer();
