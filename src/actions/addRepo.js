import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

import degit from 'degit';
import { copySync } from 'fs-extra/esm';
import picocolors from 'picocolors';

import createDirectory from '../utils/createDirectory.js';

const GLOBAL_TEMPLATE_DIR = path.join(os.homedir(), '.skeletapp', 'templates');
await createDirectory(GLOBAL_TEMPLATE_DIR);

export async function addTemplateFromRepo(repoUrl, alias = null) {
  const tmpDir = path.join(os.homedir(), '.skeletapp', `skeletapp-temp-${Date.now()}`);

  const emitter = degit(repoUrl, {
    cache: false,
    force: true,
    verbose: false,
  });

  try {
    console.log(picocolors.blue(`📦  Cloning ${repoUrl}...`));
    await emitter.clone(tmpDir);
    console.log(picocolors.blue(`✅  Repository cloned successfully`));

    const tmpRepoTemplatesPath = path.join(tmpDir, 'templates');

    if (!fs.existsSync(tmpRepoTemplatesPath)) {
      console.log(picocolors.red(`❌  Templates folder not found in ${repoUrl}`));
      return;
    }

    if (alias) {
      const aliasTemplatesPath = path.join(tmpRepoTemplatesPath, alias);
      if (!fs.existsSync(aliasTemplatesPath)) {
        console.log(picocolors.red(`❌  Alias template folder not found in ${repoUrl}`));
        return;
      }

      const destination = path.join(GLOBAL_TEMPLATE_DIR, alias);

      if (fs.existsSync(destination)) {
        console.log(picocolors.yellow(`⚠️  Alias template "${alias}" already exists, skipping`));
        return;
      }

      console.log(picocolors.blue(`📦  Copying alias template to global directory...`));
      copySync(aliasTemplatesPath, destination);
      console.log(
        picocolors.green(`✅  Alias template "${alias}" added to skeletapp global directory`)
      );

      return;
    }

    const repoTemplates = fs.readdirSync(tmpRepoTemplatesPath);

    console.log(picocolors.blue(`📦  Adding templates to skeletapp global directory...`));
    for (const templateName of repoTemplates) {
      const templatePath = path.join(tmpRepoTemplatesPath, templateName);
      const destination = path.join(GLOBAL_TEMPLATE_DIR, templateName);

      if (fs.existsSync(destination)) {
        console.log(picocolors.yellow(`⚠️  Template "${templateName}" already exists, skipping`));
        continue;
      }

      copySync(templatePath, destination);
      console.log(
        picocolors.green(`✅  Template "${templateName}" added to skeletapp global directory`)
      );
    }
  } catch (error) {
    console.log(picocolors.red(`❌  Error adding templates from ${repoUrl}`));
    console.log(error);
  } finally {
    console.log(picocolors.blue(`🗑️  Cleaning up...`));
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}
