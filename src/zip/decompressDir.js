import { mkdir, stat, writeFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createBrotliDecompress } from 'node:zlib';
import path from 'node:path';

const decompressDir = async () => {
  // Write your code here
  // Read archive.br from workspace/compressed/
  // Decompress and extract to workspace/decompressed/
  // Use Streams API
  const compressedDir = path.resolve('workspace/compressed');
  const archivePath = path.join(compressedDir, 'archive.br');
  const outputDir = path.resolve('workspace/decompressed');

  let jsonString = '';

  try {
    const compressedStat = await stat(compressedDir);
    if (!compressedStat.isDirectory()) {
      throw new Error();
    }

    const archiveStat = await stat(archivePath);
    if (!archiveStat.isFile()) {
      throw new Error();
    }

    await mkdir(outputDir, { recursive: true });

    await pipeline(
      createReadStream(archivePath),
      createBrotliDecompress(),
      new Writable({
        write(chunk, encoding, callback) {
          jsonString += chunk.toString();
          callback();
        },
      })
    );

    const archiveData = JSON.parse(jsonString);

    for (const entry of archiveData.entries) {
      const targetPath = path.join(outputDir, entry.path);

      if (entry.type === 'directory') {
        await mkdir(targetPath, { recursive: true });
      } else if (entry.type === 'file') {
        await mkdir(path.dirname(targetPath), { recursive: true });
        await writeFile(targetPath, Buffer.from(entry.content, 'base64'));
      }
    }
  } catch {
    throw new Error('FS operation failed');
  }
};

await decompressDir();
