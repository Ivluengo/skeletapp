import { exec } from 'child_process';

import { promisify } from 'node:util';

const execAsync = promisify(exec);

export default async function getLatestPackageVersions(pkg) {
  try {
    const { stdout } = await execAsync(`npm view ${pkg} version`);
    return '^' + stdout.toString().trim();
  } catch (error) {
    console.log(`Error getting latest version for ${pkg}`);
    return '*';
  }
}
