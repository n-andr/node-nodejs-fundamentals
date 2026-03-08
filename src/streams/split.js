import { createReadStream, createWriteStream } from 'node:fs';
import { Transform } from 'node:stream';
import path from 'node:path';

const split = async () => {
  // Write your code here
  // Read source.txt using Readable Stream
  // Split into chunk_1.txt, chunk_2.txt, etc.
  // Each chunk max N lines (--lines CLI argument, default: 10)
  const linesIndex = process.argv.indexOf('--lines');
  const maxLines =
    linesIndex !== -1 && process.argv[linesIndex + 1]
      ? Number(process.argv[linesIndex + 1])
      : 10;

  const sourcePath = path.resolve('source.txt');

  let buffer = '';
  let chunkIndex = 1;
  let currentLineCount = 0;
  let writer = createWriteStream(path.resolve(`chunk_${chunkIndex}.txt`));

  const writeLine = (line) => {
    if (currentLineCount === maxLines) {
      writer.end();
      chunkIndex += 1;
      currentLineCount = 0;
      writer = createWriteStream(path.resolve(`chunk_${chunkIndex}.txt`));
    }

    writer.write(`${line}\n`);
    currentLineCount += 1;
  };

  const transformer = new Transform({
    transform(chunk, encoding, callback) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        writeLine(line);
      }

      callback();
    },

    flush(callback) {
      if (buffer.length > 0) {
        writeLine(buffer);
      }
      writer.end();
      callback();
    },
  });

  createReadStream(sourcePath).pipe(transformer);
};

await split();
