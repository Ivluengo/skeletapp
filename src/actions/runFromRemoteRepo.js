import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import degit from 'degit';
import inquirer from 'inquirer';
import picocolors from 'picocolors';

import createDirectoryContents from '../utils/createDirectoryContents.js';
import createDirectory from '../utils/createDirectory.js';

export async function runFromRemoteRepo(repoUrl) {
  const CURRENT_DIR = process.cwd();

  const tmpDir = path.join(os.tmpdir(), `skeletapp-temp-${Date.now()}`);
  const emitter = degit(repoUrl, { cache: false, force: true, verbose: false });

  try {
    console.log(picocolors.blue(`📦  Cloning ${repoUrl}...`));
    await emitter.clone(tmpDir);

    const templatesDir = path.join(tmpDir, 'templates');
    if (!fs.existsSync(templatesDir)) {
      console.log(picocolors.yellow('❌  No templates folder found in repository.'));
      process.exit(1);
    }

    const templates = fs.readdirSync(templatesDir);
    if (!templates.length) {
      console.log(picocolors.yellow('❌  No templates found in "templates" folder.'));
      process.exit(1);
    }

    const { projectChoice, projectName } = await inquirer.prompt([
      {
        type: 'list',
        name: 'projectChoice',
        message: 'Which template would you like to generate?',
        choices: templates,
      },
      {
        type: 'input',
        name: 'projectName',
        message: 'Folder name: (use "." for current folder)',
        validate: function (input) {
          if (/^([A-Za-z\-\\_\d])+$/.test(input) || input === '.') return true;
          else
            return 'Folder names can only include letters, numbers, hyphens and underscores. You can also use a dot to create it in the current folder.';
        },
      },
    ]);

    if (projectName !== '.') {
      createDirectory(path.join(CURRENT_DIR, projectName));
    }

    const templatePath = path.join(templatesDir, projectChoice);

    await createDirectoryContents(templatePath, projectName);

    console.log(picocolors.green(`✅  Project created.`));
  } catch (error) {
    console.error(picocolors.red('❌  Error creating project from repo'));
    console.error(error);
    process.exit(1);
  } finally {
    console.log(picocolors.blue(`🗑️  Cleaning up...`));
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}
