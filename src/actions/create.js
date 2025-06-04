import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';

import inquirer from 'inquirer';
import picocolors from 'picocolors';

import createDirectoryContents from '../utils/createDirectoryContents.js';
import createDirectory from '../utils/createDirectory.js';

// Get the current working directory
const CURRENT_DIR = process.cwd();

// Create a global and local user template directory if don't exist
const GLOBAL_TEMPLATE_DIR = path.join(os.homedir(), '.skeletapp', 'templates');

createDirectory(GLOBAL_TEMPLATE_DIR);

// Get the list of templates
const globalChoices = fs
  .readdirSync(GLOBAL_TEMPLATE_DIR)
  .map((template) => ({ template, origin: GLOBAL_TEMPLATE_DIR }));

const CHOICES = globalChoices.map((choice) => choice.template);

const QUESTIONS = [
  {
    name: 'projectChoice',
    type: 'list',
    message: 'Which template would you like to generate?',
    choices: CHOICES,
  },
  {
    name: 'projectName',
    type: 'input',
    message: 'Folder name: (use "." for current folder)',
    validate: function (input) {
      if (/^([A-Za-z\-\\_\d])+$/.test(input) || input === '.') return true;
      else
        return 'Folder names can only include letters, numbers, hyphens and underscores. You can also use a dot to create it in the current folder.';
    },
  },
];

inquirer
  .prompt(QUESTIONS)
  .then(async (answers) => {
    const { projectChoice, projectName } = answers;

    const template = globalChoices.find((choice) => choice.template === projectChoice);

    if (!template) {
      console.log(picocolors.red('❌ Template not found'));
      process.exit(1);
    }

    const templatePath = path.join(template.origin, projectChoice);

    if (projectName !== '.') {
      createDirectory(path.join(CURRENT_DIR, projectName));
    }

    await createDirectoryContents(templatePath, projectName);

    console.log(picocolors.green('✅ Project created successfully'));
  })
  .catch((error) => {
    console.log(picocolors.red('❌ Error creating project'));
    console.log(error);
    process.exit(1);
  });
