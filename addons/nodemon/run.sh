#!/bin/bash
echo --- install Nodemon to an existing Backend project.

# STEP 1 - install Prisma and init (generate .env and other files)
npm install cross-env nodemon tsconfig-paths --save-dev

# STEP 2 - add config file: nodemon.json
FILE1="nodemon.json"
echo $FILE1
[ -f $FILE1 ] && echo \> file existed: overriding.
cat > $FILE1 <<EOL
{
  "watch": [
      "src",
      ".env"
  ],
  "ext": "js,ts,json",
  "ignore": [
      "src/logs/*",
      "src/**/*.{spec,test}.ts"
  ],
  "exec": "ts-node -r tsconfig-paths/register --transpile-only src/index.ts"
}
EOL

# STEP 3 - add "dev" script to package.json
sed -i '' -e 's/"scripts": {/"scripts": {\n    "dev": "cross-env NODE_ENV=development nodemon",/g' package.json

# STEP 4 - verify - try it: npm run dev, then save index.ts file
echo verify - try it: npm run dev, then save index.ts file
