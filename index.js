#!/usr/bin/env node

import { Command } from 'commander';

import normalizeRepoUrl from './src/utils/normalizeRepoUrl.js';
import isRemoteRepo from './src/utils/isRemoteRepo.js';

const program = new Command();

program.name('skeletapp').description('Create a new project from a template').version('1.0.0');

const addCommand = program
  .command('add')
  .description('Add a template to skeletapp global directory');

addCommand.argument('<template-path>').action(async (templatePath) => {
  const { add } = await import('./src/actions/add.js');
  add(templatePath);
});

addCommand
  .command('repo <repository-url>')
  .description('Add all templates from a repository')
  .option('--as <alias>', 'Add only a specific template from the repo (must be inside templates/)')
  .action(async (repositoryUrl, options) => {
    const { addTemplateFromRepo } = await import('./src/actions/addRepo.js');
    const repositoryUrlNormalized = normalizeRepoUrl(repositoryUrl);
    addTemplateFromRepo(repositoryUrlNormalized, options.as);
  });

const firstArg = process.argv[2];

if (firstArg && isRemoteRepo(firstArg)) {
  const { runFromRemoteRepo } = await import('./src/actions/runFromRemoteRepo.js');
  await runFromRemoteRepo(normalizeRepoUrl(firstArg));
  process.exit(0);
}

// If no command is provided, run the main file
if (process.argv.length === 2) {
  await import('./src/actions/create.js');
} else {
  program.parse();
}
