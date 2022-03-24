#!/bin/bash
echo --- addon to install Tailwind v3 to an existing project.

# STEP 1 - install dependencies
npm install tailwindcss postcss autoprefixer --save-dev
npx tailwindcss init -p
mkdir -p ./src

# STEP 2 - tailwind.config.js
FILE1="tailwind.config.js"
echo $FILE1
[ -f $FILE1 ] && echo \> file existed: overriding.
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
[ -f $FILE2 ] && echo \> file existed: overriding.
echo "
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  },
  darkMode: 'class',
  plugins: [
    // require('nightwind'), // install nightwind for auto dark mode.
    require('tailwindcss'),
    require('autoprefixer')
  ]
};
" > $FILE2

# STEP 4 - src/index.css - add: import @tailwind base styles
FILE3="src/index.css"
echo $FILE3
echo "
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply text-sm py-2 px-6 rounded-lg border border-gray-100 bg-gray-200;
  }
  .btn:hover {
    @apply bg-gray-900 text-white;
  }
}

$(cat $FILE3)" > $FILE3

echo "example: try with tailwind className=\"font-bold underline\""
