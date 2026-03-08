import { Transform } from 'node:stream';

const filter = () => {
  // Write your code here
  // Read from process.stdin
  // Filter lines by --pattern CLI argument
  // Use Transform Stream
  // Write to process.stdout
  const patternIndex = process.argv.indexOf('--pattern');
  const pattern = patternIndex !== -1 ? process.argv[patternIndex + 1] ?? '' : '';

  let buffer = '';

  const transformer = new Transform({
    transform(chunk, encoding, callback) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      const output = lines
        .filter((line) => line.includes(pattern))
        .map((line) => `${line}\n`)
        .join('');

      callback(null, output);
    },

    flush(callback) {
      if (buffer.includes(pattern)) {
        callback(null, buffer);
        return;
      }
      callback();
    },
  });

  process.stdin.pipe(transformer).pipe(process.stdout);
};

filter();
