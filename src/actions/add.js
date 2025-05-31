// add.js
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { copySync } from 'fs-extra/esm';
import picocolors from 'picocolors';

export function add(templatePath) {
  const templateName = path.basename(templatePath);
  const destination = path.join(os.homedir(), '.skeletapp', 'templates', templateName);

  if (fs.existsSync(destination)) {
    console.log(picocolors.yellow(`⚠️ Template "${templateName}" already exists, skipping`));
    return;
  }

  copySync(templatePath, destination);
  console.log(
    picocolors.green(`✅ Template "${templateName}" added to skeletapp global directory`)
  );
}
