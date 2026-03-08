import { mkdir, readdir, readFile, stat } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createBrotliCompress } from 'node:zlib';
import path from 'node:path';

const compressDir = async () => {
  // Write your code here
  // Read all files from workspace/toCompress/
  // Compress entire directory structure into archive.br
  // Save to workspace/compressed/
  // Use Streams API
    const sourceDir = path.resolve('workspace/toCompress');
  const compressedDir = path.resolve('workspace/compressed');
  const archivePath = path.join(compressedDir, 'archive.br');

  const entries = [];

  const scan = async (currentPath) => {
    const items = await readdir(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const fileStat = await stat(fullPath);
      const relativePath = path.relative(sourceDir, fullPath);

      if (fileStat.isDirectory()) {
        entries.push({
          path: relativePath,
          type: 'directory',
        });
        await scan(fullPath);
      } else if (fileStat.isFile()) {
        const content = await readFile(fullPath);
        entries.push({
          path: relativePath,
          type: 'file',
          content: content.toString('base64'),
        });
      }
    }
  };

  try {
    const sourceStat = await stat(sourceDir);
    if (!sourceStat.isDirectory()) {
      throw new Error();
    }

    await scan(sourceDir);
    await mkdir(compressedDir, { recursive: true });

    const archiveData = JSON.stringify({ entries });

    await pipeline(
      Readable.from([archiveData]),
      createBrotliCompress(),
      createWriteStream(archivePath)
    );
  } catch {
    throw new Error('FS operation failed');
  }
};

await compressDir();
