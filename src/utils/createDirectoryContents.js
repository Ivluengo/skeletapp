import fs from 'node:fs/promises';
import path from 'node:path';

import fixPackageJsonVersions from './fixPackageJsonVersions.js';
import picocolors from 'picocolors';

const CURRENT_DIR = process.cwd();

async function createDirectoryContents(templatePath, newProjectPath) {
  try {
    const filesToCreate = await fs.readdir(templatePath);

    for (const file of filesToCreate) {
      const origFilePath = path.join(templatePath, file);

      // get stats about the current file
      const stats = await fs.stat(origFilePath);

      if (stats.isFile()) {
        const contents = await fs.readFile(origFilePath, 'utf8');

        // Rename
        if (file === '.npmignore') file = '.gitignore';

        const writeDir =
          newProjectPath === '.' ? CURRENT_DIR : path.join(CURRENT_DIR, newProjectPath);

        const writePath = path.join(writeDir, file);

        // Fix package.json with latest versions
        file === 'package.json'
          ? await fixPackageJsonVersions(origFilePath, writePath)
          : await fs.writeFile(writePath, contents, 'utf8');
      } else if (stats.isDirectory()) {
        const newFolderPath =
          newProjectPath === '.' ? path.join(CURRENT_DIR) : path.join(CURRENT_DIR, newProjectPath);

        const newFolderWritePath = path.join(newFolderPath, file);

        await fs.mkdir(newFolderWritePath, { recursive: true });

        // recursive call
        if (newProjectPath !== '.') {
          await createDirectoryContents(origFilePath, path.join(newProjectPath, file));
        } else {
          await createDirectoryContents(origFilePath, file);
        }
      }
    }
  } catch (error) {
    console.error(picocolors.red('❌ Error creating project'));
    console.error(error);
    process.exit(1);
  }
}

export default createDirectoryContents;
