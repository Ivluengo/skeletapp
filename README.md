# Skeletapp

A simple CLI tool to create a new project from a template.

## Before installing globally

1. Fork, clone or download this repository.
2. Inside the `templates` folder, add your own template folders.
   1. When you will launch the tool, you will be asked to choose a template.
3. Inside the template folder, add your own files.
4. If you want Skeletapp to fix your package.json file so whenever you create a new project from this template, the versions of the dependencies will be the latest ones, you need to add an asterisk (`*`) to the version of the dependencies you want to be updated.
5. Recommended to delete the `package-lock.json` file so it won't collide with the versions Skeletapp will fix.

```json
{
  "dependencies": {
    "react": "*",
    "react-dom": "*"
  }
}
```

## Installing locally

1. First of all you need to install the Skeletapp dependencies in order to use it. Run the following command in your terminal at the root of Skeletapp project

```bash
npm install
```

2. Then you can install the Skeletapp CLI tool globally in your computer by running this command at the root of the Skeletapp project;

```bash
npm install -g
```

## Usage

1. To use it you just need to run the command `skeletapp` in your terminal wherever you want to create a new project.

```bash
skeletapp
```

2. You will be asked to choose a template.
3. You will be asked to choose a folder name.
   1. If you choose a dot (`.`), the tool will create the project in the current folder.
4. The tool will create the project in the folder you chose.
   1. If the template you chose has a `package.json` file, the tool will fix the versions of any dependency you have added to the `package.json` files of your templates with an asterisk (`*`).


## License

MIT

## Author

Ivan Luengo

Thanks to [Leonardo](https://github.com/leoroese) for the idea and the first version of the tool. (template-cli)