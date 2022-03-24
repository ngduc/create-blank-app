#!/bin/bash
echo --- addon to install basic Github Action CI Workflow: .github/workflows/ci.yml

# STEP 1
mkdir -p .github/workflows
FILE1=".github/workflows/ci.yml"
echo $FILE1
[ -f $FILE1 ] && echo \> file existed: overriding.
cat > $FILE1 <<EOL
name: webapp

on:
  - push
  - pull_request

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x]

    steps:
      - uses: actions/checkout@v2

      - name: Use Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: \${{ matrix.node-version }}

      - name: Cache npm packages
        uses: actions/cache@v2.1.6
        with:
          path: ~/.npm
          key: \${{ runner.os }}-\${{ env.cache-name }}-\${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            \${{ runner.os }}-\${{ env.cache-name }}-
      - run: npm install

      - name: Build
        run: npm run build
EOL

# STEP 2 - verify: try it: push a commit and verify if github runs and shows CI checkmarks next to the commit.
echo verify: try it: push a commit and verify if github runs and shows CI checkmarks next to the commit.
