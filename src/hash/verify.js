import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const getFileHash = (filePath) =>
  new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const stream = createReadStream(filePath);

    stream.on('data', (chunk) => {
      hash.update(chunk);
    });

    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });

    stream.on('error', reject);
  });


const verify = async () => {
  // Write your code here
  // Read checksums.json
  // Calculate SHA256 hash using Streams API
  // Print result: filename — OK/FAIL
  const checksumsPath = path.resolve('checksums.json');

  let checksums;

  try {
    const content = await readFile(checksumsPath, 'utf8');
    checksums = JSON.parse(content);
  } catch {
    throw new Error('FS operation failed');
  }

  for (const [filename, expectedHash] of Object.entries(checksums)) {
    try {
      const filePath = path.resolve(filename);
      const actualHash = await getFileHash(filePath);
      const status = actualHash === expectedHash ? 'OK' : 'FAIL';
      console.log(`${filename} — ${status}`);
    } catch {
      console.log(`${filename} — FAIL`);
    }
  }
};

await verify();
