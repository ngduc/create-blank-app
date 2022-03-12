#!/bin/bash
# addon to install tailwind v3 to an existing project.

# STEP 1 - install dependencies
npm install tailwindcss postcss autoprefixer --save-dev
npx tailwindcss init -p

# STEP 2 - tailwind.config.js
echo "tailwind.config.js"
[ -f "tailwind.config.js" ] && echo ^ file existed: overriding.
echo "
module.exports = {
  content: [\"./src/**/*.{html,js,jsx,ts,tsx}\"],
  theme: {
    extend: {},
  },
  plugins: [],
}
" > tailwind.config.js

# STEP 3 - postcss.config.js
echo "postcss.config.js"
[ -f "postcss.config.js" ] && echo ^ file existed: overriding.
echo "
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
" > postcss.config.js

# STEP 4 - src/index.css - add: import @tailwind base styles
echo "src/index.css"
echo "
@tailwind base;
@tailwind components;
@tailwind utilities;

$(cat src/index.css)" > src/index.css

echo "example: try with tailwind className=\"font-bold underline\""
