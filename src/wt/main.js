import { cpus } from 'node:os';
import { Worker } from 'node:worker_threads';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const mergeSortedArrays = (arrays) => {
  const indexes = new Array(arrays.length).fill(0);
  const result = [];

  while (true) {
    let minValue = null;
    let minArrayIndex = -1;

    for (let i = 0; i < arrays.length; i += 1) {
      const currentIndex = indexes[i];

      if (currentIndex >= arrays[i].length) {
        continue;
      }

      const value = arrays[i][currentIndex];

      if (minArrayIndex === -1 || value < minValue) {
        minValue = value;
        minArrayIndex = i;
      }
    }

    if (minArrayIndex === -1) {
      break;
    }

    result.push(minValue);
    indexes[minArrayIndex] += 1;
  }

  return result;
};

const runWorker = (chunk) =>
  new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve('src/wt/worker.js'), {
      workerData: chunk,
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error('Worker stopped with error'));
      }
    });
  });

const main = async () => {
  // Write your code here
  // Read data.json containing array of numbers
  // Split into N chunks (N = CPU cores)
  // Create N workers, send one chunk to each
  // Collect sorted chunks
  // Merge using k-way merge algorithm
  // Log final sorted array
   const dataPath = path.resolve('data.json');
  const fileContent = await readFile(dataPath, 'utf8');
  const numbers = JSON.parse(fileContent);

  const cpuCount = cpus().length;
  const chunkSize = Math.ceil(numbers.length / cpuCount);
  const chunks = [];

  for (let i = 0; i < numbers.length; i += chunkSize) {
    chunks.push(numbers.slice(i, i + chunkSize));
  }

  const sortedChunks = await Promise.all(chunks.map((chunk) => runWorker(chunk)));
  const sortedArray = mergeSortedArrays(sortedChunks);

  console.log(sortedArray);
};

await main();
