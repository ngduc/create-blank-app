#!/bin/bash
# addon to install tailwind v3 to an existing project.

# STEP 1 - install dependencies
npm install tailwindcss postcss autoprefixer --save-dev
npx tailwindcss init -p
mkdir -p ./src

# STEP 2 - tailwind.config.js
FILE1="tailwind.config.js"
echo $FILE1
[ -f $FILE1 ] && echo ^ file existed: overriding.
echo "
module.exports = {
  content: [\"./src/**/*.{html,js,jsx,ts,tsx}\"],
  theme: {
    extend: {},
  },
  plugins: [],
}
" > $FILE1

# STEP 3 - postcss.config.js
FILE2="postcss.config.js"
echo $FILE2
[ -f $FILE2 ] && echo ^ file existed: overriding.
echo "
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
" > $FILE2

# STEP 4 - src/index.css - add: import @tailwind base styles
FILE3="src/index.css"
echo $FILE3
echo "
@tailwind base;
@tailwind components;
@tailwind utilities;

$(cat $FILE3)" > $FILE3

echo "example: try with tailwind className=\"font-bold underline\""
