// add.js
import path from 'node:path';
import os from 'node:os';
import { copySync } from 'fs-extra/esm';

export function add(templatePath) {
  const templateName = path.basename(templatePath);
  const destination = path.join(os.homedir(), '.skeletapp', 'templates', templateName);
  copySync(templatePath, destination);
  console.log(`✅ Template "${templateName}" added to skeletapp global directory`);
}
