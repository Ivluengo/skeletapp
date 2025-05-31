import fs from 'node:fs/promises';

import cliSpinners from 'cli-spinners';
import ora from 'ora';
import picocolors from 'picocolors';

import getLatestPackageVersions from './getLatestPackageVersions.js';

export default async function fixPackageJsonVersions(origFilePath, writePath) {
  // Printing an animation while the file is being fixed
  const spinner = ora(cliSpinners.dots12).start();
  const sections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

  try {
    const contents = await fs.readFile(origFilePath, 'utf8');

    const parsedContent = JSON.parse(contents);

    for (const section of sections) {
      if (!parsedContent[section]) continue;
      for (const [pkg, version] of Object.entries(parsedContent[section])) {
        if (version === '*') parsedContent[section][pkg] = await getLatestPackageVersions(pkg);
      }
    }
    await fs.writeFile(writePath, JSON.stringify(parsedContent, null, 2), 'utf8');
    spinner.stop();
    console.log(picocolors.green('✅ Successfully fixed package.json versions'));
  } catch (error) {
    console.error('Error fixing package.json versions:', error);
    spinner.stop();
    console.log(picocolors.red('❌ Failed to fix package.json versions'));
    throw error;
  }
}
