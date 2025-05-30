import fs from 'node:fs';
import picocolors from 'picocolors';

// Create a directory if it doesn't exist and prompt a message when created
export default async function createDirectory(path) {
  try {
    fs.accessSync(path);
  } catch {
    fs.mkdirSync(path, { recursive: true });
    console.log(picocolors.green(`✅ Directory "${path}" created`));
  }
}
