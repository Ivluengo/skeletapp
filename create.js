#!/usr/bin/env node

import os from 'node:os';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import inquirer from 'inquirer';
import picocolors from 'picocolors';

import createDirectoryContents from './utils/createDirectoryContents.js';
import createDirectory from './utils/createDirectory.js';

// Create a global user template directory if it doesn't exist
const GLOBAL_TEMPLATE_DIR = path.join(os.homedir(), '.skeletapp', 'templates');

createDirectory(GLOBAL_TEMPLATE_DIR);

// Get the current working directory
const CURRENT_DIR = process.cwd();

const __dirname = dirname(fileURLToPath(import.meta.url));

// create a templates directory in the current working directory if it doesn't exist
const TEMPLATES_DIR = path.join(__dirname, 'templates');
createDirectory(TEMPLATES_DIR);

// Get the list of templates
const TEMPLATE_CHOICES = fs.readdirSync(TEMPLATES_DIR);
const GLOBAL_CHOICES = fs.readdirSync(GLOBAL_TEMPLATE_DIR);

const CHOICES = [...TEMPLATE_CHOICES, ...GLOBAL_CHOICES];

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
    message: 'Folder name: (. to create in current folder)',
    validate: function (input) {
      if (/^([A-Za-z\-\\_\d])+$/.test(input) || input === '.') return true;
      else
        return 'Folder names can only include letters, numbers, hyphens and underscores. You can also use a dot to create it in the current folder.';
    },
  },
];

inquirer
  .prompt(QUESTIONS)
  .then((answers) => {
    const projectChoice = answers.projectChoice;
    const projectName = answers.projectName;
    const templatePath = path.join(__dirname, 'templates', projectChoice);
    if (projectName !== '.') {
      fs.mkdirSync(path.join(CURRENT_DIR, projectName));
    }

    createDirectoryContents(templatePath, projectName);

    console.log(picocolors.green('✅ Project created successfully'));
  })
  .catch((error) => {
    console.log(picocolors.red('❌ Error creating project'));
    console.log(error);
    process.exit(1);
  });
