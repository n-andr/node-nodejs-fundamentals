import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const restore = async () => {
  // Write your code here
  // Read snapshot.json
  // Treat snapshot.rootPath as metadata only
  // Recreate directory/file structure in workspace_restored
  const snapshotPath = path.resolve('snapshot.json');
  const restoredPath = path.resolve('workspace_restored');

  try {
    await stat(restoredPath);
    throw new Error();
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw new Error('FS operation failed');
    }
  }

  let snapshot;

  try {
    const content = await readFile(snapshotPath, 'utf8');
    snapshot = JSON.parse(content);
  } catch {
    throw new Error('FS operation failed');
  }

  try {
    await mkdir(restoredPath, { recursive: false });

    for (const entry of snapshot.entries) {
      const targetPath = path.join(restoredPath, entry.path);

      if (entry.type === 'directory') {
        await mkdir(targetPath, { recursive: true });
      } else if (entry.type === 'file') {
        await mkdir(path.dirname(targetPath), { recursive: true });
        const fileContent = Buffer.from(entry.content, 'base64');
        await writeFile(targetPath, fileContent);
      }
    }
  } catch {
    throw new Error('FS operation failed');
  }
};

await restore();
