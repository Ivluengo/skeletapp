import fs from 'node:fs/promises';

import fixPackageJsonVersions from './fixPackageJsonVersions.js';
import picocolors from 'picocolors';

const CURR_DIR = process.cwd();

async function createDirectoryContents(templatePath, newProjectPath) {
  try {
    const filesToCreate = await fs.readdir(templatePath);

    for (const file of filesToCreate) {
      const origFilePath = `${templatePath}/${file}`;

      // get stats about the current file
      const stats = await fs.stat(origFilePath);

      if (stats.isFile()) {
        const contents = await fs.readFile(origFilePath, 'utf8');

        // Rename
        if (file === '.npmignore') file = '.gitignore';

        const writePath =
          newProjectPath !== '.' ? `${CURR_DIR}/${newProjectPath}/${file}` : `${CURR_DIR}/${file}`;

        // Fix package.json with latest versions
        file === 'package.json'
          ? await fixPackageJsonVersions(origFilePath, writePath)
          : await fs.writeFile(writePath, contents, 'utf8');
      } else if (stats.isDirectory()) {
        if (newProjectPath !== '.') {
          await fs.mkdir(`${CURR_DIR}/${newProjectPath}/${file}`);
        } else {
          await fs.mkdir(`${CURR_DIR}/${file}`);
        }

        // recursive call
        if (newProjectPath !== '.') {
          await createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
        } else {
          await createDirectoryContents(`${templatePath}/${file}`, `./${file}`);
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
