import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const snapshot = async () => {
  // Write your code here
  // Recursively scan workspace directory
  // Write snapshot.json with:
  // - rootPath: absolute path to workspace
  // - entries: flat array of relative paths and metadata
  const workspacePath = path.resolve('workspace');
  const snapshotPath = path.resolve('snapshot.json');
  const entries = [];

  const scan = async (currentPath) => {
    const items = await readdir(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const fileStat = await stat(fullPath);
      const relativePath = path.relative(workspacePath, fullPath);

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
          size: fileStat.size,
          content: content.toString('base64'),
        });
      }
    }
  };

  try {
    const workspaceStat = await stat(workspacePath);
    if (!workspaceStat.isDirectory()) {
      throw new Error();
    }

    await scan(workspacePath);

    const result = {
      rootPath: workspacePath,
      entries,
    };

    await writeFile(snapshotPath, JSON.stringify(result, null, 2), 'utf8');
  } catch {
    throw new Error('FS operation failed');
  }
};

await snapshot();
