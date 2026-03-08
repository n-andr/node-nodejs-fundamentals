import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const findByExt = async () => {
  // Write your code here
  // Recursively find all files with specific extension
  // Parse --ext CLI argument (default: .txt)
  const workspace = path.resolve("workspace");

  const extIndex = process.argv.indexOf("--ext");
  let ext = ".txt";

  if (extIndex !== -1 && process.argv[extIndex + 1]) {
    ext = process.argv[extIndex + 1].startsWith(".")
      ? process.argv[extIndex + 1]
      : `.${process.argv[extIndex + 1]}`;
  }

  const results = [];

  const scan = async (dir) => {
    const items = await readdir(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const info = await stat(fullPath);

      if (info.isDirectory()) {
        await scan(fullPath);
      } else if (info.isFile() && fullPath.endsWith(ext)) {
        results.push(path.relative(workspace, fullPath));
      }
    }
  };

  try {
    await scan(workspace);
  } catch {
    throw new Error("FS operation failed");
  }

  results.sort();

  for (const file of results) {
    console.log(file);
  }
};

await findByExt();
