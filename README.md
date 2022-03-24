# Create-Blank-App (CBA)

`create-blank-app (cba)` - just one command to remember. CBA is a command-line tool for creating a new app by searching for tech stacks using keywords.

Support:
- Angular, create-react-app (CRA), create-next-app (CNA), create-web3js-app (CWA), express-generator-typescript, create-react-native-app (Expo), react-native init.
- Vite: vue, react, preact, lit-element, svelte app.
- Typescript.
- Addons: install tailwind-3, etc.

```
Installation:   $ npm install create-blank-app -g

Usage:          $ cba <name> <keyword1 keyword2 etc.>

Examples:
    $ cba myapp vite react ts
    $ cba myapp cra ts
```

<img src="docs/create-blank-app.gif">

### Addons:

- You can run addon scripts to install and set up libraries to an existing project.

```
$ cd project
$ cba --add tailwind
```

- Addon List:
  - `github-action-ci`: basic Github Action CI workflow.
  - `nodemon`: for backend: auto reload when a file changed.
  - `tailwind`
  - `react-router`
  - `prisma`: for backend: added prisma, @prisma/client and examples of tables, /users route.
