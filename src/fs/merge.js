import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const merge = async () => {
  // Write your code here
  // Default: read all .txt files from workspace/parts in alphabetical order
  // Optional: support --files filename1,filename2,... to merge specific files in provided order
  // Concatenate content and write to workspace/merged.txt
  const workspacePath = path.resolve('workspace');
  const partsPath = path.join(workspacePath, 'parts');
  const outputPath = path.join(workspacePath, 'merged.txt');

  try {
    const partsStat = await stat(partsPath);
    if (!partsStat.isDirectory()) {
      throw new Error();
    }

    const filesIndex = process.argv.indexOf('--files');
    let filesToMerge = [];

    if (filesIndex !== -1 && process.argv[filesIndex + 1]) {
      filesToMerge = process.argv[filesIndex + 1]
        .split(',')
        .map((file) => file.trim())
        .filter(Boolean);

      for (const file of filesToMerge) {
        const filePath = path.join(partsPath, file);
        const fileStat = await stat(filePath);
        if (!fileStat.isFile()) {
          throw new Error();
        }
      }
    } else {
      const entries = await readdir(partsPath);
      filesToMerge = entries
        .filter((file) => path.extname(file) === '.txt')
        .sort();

      if (filesToMerge.length === 0) {
        throw new Error();
      }
    }

    let mergedContent = '';

    for (const file of filesToMerge) {
      const filePath = path.join(partsPath, file);
      mergedContent += await readFile(filePath, 'utf8');
    }

    await writeFile(outputPath, mergedContent, 'utf8');
  } catch {
    throw new Error('FS operation failed');
  }
};

await merge();
