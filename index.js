import { Command } from 'commander';

const program = new Command();

program.name('skeletapp').description('Create a new project from a template').version('1.0.0');

program
  .command('add <template-path>')
  .description('Add a template to skeletapp global directory')
  .action(async (templatePath) => {
    const { add } = await import('./add.js');
    add(templatePath);
  });

// If no command is provided, run the main file
if (process.argv.length === 2) {
  await import('./create.js');
} else {
  program.parse();
}
