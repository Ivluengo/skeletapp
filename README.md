# Skeletapp

A simple CLI tool to create a new project from a template.

## Features

- Create a new project from a LOCAL template.
- Create a new project in the current folder.
- Create a new project in a folder of your choice.
- Fix the versions of the dependencies in the `package.json` file of your templates.
- Create a new project from a REMOTE template.

## Simple Usage without installing

1. You can use the command `npx skeletapp <repository-url>` in your terminal and:
   1.  Skeletapp will check that the repository you are trying to use is a valid GitHub repository. You can use either a full Github URL or a combination of the owner and the repository name. Example: `https://github.com/Ivluengo/skeletapp` or `Ivluengo/skeletapp`.
   2.  Skeletapp will clone the repository, will show you the list of templates available in the repository and will ask you to choose one.
   3.  Skeletapp will create the project in the folder you chose.

## Usage installing Skeletapp locally

1. Install Skeletapp locally by running the command `npm install -g skeletapp` in your terminal.
2. Skeletapp will create a global directory called `.skeletapp` in your home directory with a `templates` folder inside.
3. Inside the `templates` folder, add your own template folders.
   1. When you will launch the tool, you will be asked to choose a template.
4. Inside the template folder, add your own files.
5. If you want Skeletapp to fix your package.json file, so whenever you create a new project from this template, the versions of the dependencies will be the latest ones, you need to add an asterisk (`*`) to the version of the dependencies you want to be updated.
6. Recommended to delete the `package-lock.json` file so it won't collide with the versions Skeletapp will fix.

```json
{
  "dependencies": {
    "react": "*",
    "react-dom": "*"
  }
}
```

## Extras

- You can also use the command `skeletapp add <template-path>` in your terminal to add a template from any folder to the global directory.
- You can also use the command `skeletapp add repo <repository-url>` in your terminal all the templates from a remote repository to the global directory.
  - The url can be a full Github URL or a combination of the owner and the repository name. Example: `https://github.com/Ivluengo/skeletapp` or `Ivluengo/skeletapp`.


## License

MIT

## Author

Ivan Luengo

Thanks to [Leonardo](https://github.com/leoroese) for the first idea and the first version a similar tool called `template-cli`.