#!/usr/bin/env node
import meow from 'meow';
import { match } from './utils.js';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync, copyFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const { execSync } = require('child_process');
const prompts = require('prompts');
const packageJson = require('./package.json');
const path = require('path');
const __filename = fileURLToPath(import.meta.url);
// e.g. /Users/name/.nvm/versions/node/v18.14.0/lib/node_modules/create-blank-app/
const __dirname = path.dirname(__filename);
const currentDir = process.cwd(); // current directory where user runs this CLI

const cli = meow(
  `
	Usage
	  $ create-blank-app <name> [search keywords]

	Options
	  --addon  <addon-name>  run an addon script (ex: npx cba --addon tailwind-3)
    --add    <addon-name>  same as --addon

  To use ChatGPT, create a directory, inside, write the prompt in "prompt" (or "prompt.gpt4") file.

	Examples
	  $ cba myapp vite react ts
    $ cd myapp
    $ cba --add tailwind
`,
  {
    flags: {
      addon: {
        type: 'string',
        default: ''
      },
      ai: {
        type: 'string',
        default: ''
      }
    }
  }
);
console.log(`Version: ${packageJson.version}`);

const [appName, ...searchKeys] = cli.input;
console.log('Keywords', searchKeys);
const isGpt4 = existsSync(`${currentDir}/${appName}/prompt.gpt4`);
const isUsingChatGpt = isGpt4 || existsSync(`${currentDir}/${appName}/prompt`);

// init ChatGPTAPI
let chatgpt;
import { ChatGPTAPI } from 'chatgpt';
if (isUsingChatGpt) {
  if (process.env.OPENAI_API_KEY) {
    const model = isGpt4 ? 'gpt-4' : 'gpt-3.5-turbo'; // default: gpt-3.5-turbo
    console.log('ChatGPT model:', model);
    chatgpt = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY,
      completionParams: {
        model
        // temperature: 0.5,
        // top_p: 0.8
      }
    });
  } else {
    console.log('ERROR: OPENAI_API_KEY environment variable not found!');
    process.exit(1);
  }
}

function extractPath(str) {
  let retStr = str.trim();
  retStr = retStr.replace('File:', '');
  retStr = retStr.replace('Filename:', '');
  retStr = retStr.replace('File path:', '');
  retStr = retStr.replace('/root/', '/');

  retStr = retStr.endsWith(':') ? retStr.slice(0, -1) : retStr; // remove the last ':' (if any)

  const pattern = /[\#\:\"\*\?\<\>\|\`\[\]\(\)\{\}]+/g;
  retStr = retStr.replace(pattern, '').trim();

  const matches = retStr.match(/(?:\d+\.\s)?(.*)/);
  retStr = matches ? matches[1] : retStr; // e.g. "1. filename.ext" => remove "1. "

  // if (str.includes(' ')) {
  //   retStr = str.split(' ').splice(1).join(' '); // ignore the first part
  // }
  return retStr;
}

function parseAndCreateFiles(basePath, inputString) {
  const lines = inputString.split('\n');
  let isContent = false;
  let content = '';
  let filePath = '';

  for (let line of lines) {
    if (!isContent) {
      if (line.trim() === '') {
        continue; // skip empty lines (not within a codeblock)
      }
    }

    if (line.startsWith('```')) {
      if (isContent) {
        // If we're in a content block, write the file
        const fileWithPath = extractPath(filePath); // e.g. line content: "5. path/file.ext:"
        console.log('File:', fileWithPath);
        // This is the end of the code block
        // Write the code to the file
        let dir = path.dirname(fileWithPath);
        dir = dir === '.' ? basePath : basePath + dir;

        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
        writeFileSync(basePath + fileWithPath, content);
        content = '';
        filePath = '';
      }
      isContent = !isContent;
    } else if (isContent) {
      // If we're in a content block, add the line to the content
      content += line + '\n';
    } else {
      // If it's not a content block, it's a file path
      filePath = line;
    }
  }
}

async function callChatGPT(basePath, prompt) {
  console.log('Prompt:', prompt);
  let text = `Create a project with the following prompt, with working code only without any proses, each file's codeblock has file path and filename before it. Prompt: ${prompt}`;
  let responseText = '';
  let res;
  let isEOF = false;
  let counter = 0;
  do {
    counter++;
    res = await chatgpt.sendMessage(text, {});
    responseText += res.text;
    text = 'continue';
    console.log(res.text);
    isEOF = res?.text?.trim().endsWith('`') || res?.text?.trim().endsWith('.') || counter >= 5;
  } while (!isEOF);

  // console.log('res.text', res.text);

  writeFileSync(basePath + 'prompt.response', responseText);
  parseAndCreateFiles(basePath, responseText);

  /*
  parseAndCreateFiles(
    basePath,
    `
Some text
temp/file1.txt:
\`\`\`
  file1 content
\`\`\`
More text
**temp/file2.txt**
\`\`\`
  file2 content
\`\`\`

3. **file3.txt**
\`\`\`
  file3 content
\`\`\`
other text
    `
  );
*/
}

// const renameFiles = {
//   _gitignore: '.gitignore',
//   'web/_gitignore': 'web/.gitignore'
// };

function copy(src, dest) {
  const stat = statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    copyFileSync(src, dest);
  }
}

function copyDir(srcDir, destDir) {
  mkdirSync(destDir, { recursive: true });
  for (const file of readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

async function init() {
  const matches = match(appName, searchKeys);
  matches.map((item) => {
    console.log(item.command);
  });

  // if (!name) {
  //   console.log('ERROR: missing project name.');
  //   process.exit(1);
  // }
  // if (existsSync(name)) {
  //   console.log('ERROR: directory already exists.');
  //   process.exit(1);
  // }
  // console.log(`Creating web3 app "${name}"`);
  // // console.log(name || 'unicorns', cli.flags);

  // mkdirSync(name);

  // const template = 'vite-web3-react-ts';
  // const templateDir = path.join(__dirname, `template-${template}`);

  // const write = (root, file, content) => {
  //   const targetPath = renameFiles[file] ? path.join(root, renameFiles[file]) : path.join(root, file);
  //   if (content) {
  //     writeFileSync(targetPath, content);
  //   } else {
  //     copy(path.join(templateDir, file), targetPath);
  //   }
  // };

  // const files = readdirSync(templateDir);
  // for (const file of files.filter((f) => f !== 'package.json')) {
  //   write(name, file);
  // }

  // const pkg = require(path.join(templateDir, `web/package.json`));
  // pkg.name = name;
  // write(name, 'web/package.json', JSON.stringify(pkg, null, 2));

  // console.log(`\nDone. Now run:\n$ cd ${name}/web\n$ yarn`);
}

(async () => {
  const [appName, ...searchKeys] = cli.input;

  const addon = cli.flags.addon || cli.flags.add || '';
  if (addon) {
    // console.log('cli.flags', cli.flags.addon);
    // console.log('__dirname', __dirname);
    const addonStdout = execSync(`sh ${__dirname}/addons/${addon}/run.sh`);
    console.log(addonStdout.toString());
    return;
  }
  if (isUsingChatGpt) {
    let data;
    if (isGpt4) {
      data = readFileSync(`${currentDir}/${appName}/prompt.gpt4`, { encoding: 'utf8', flag: 'r' });
    } else {
      data = readFileSync(`${currentDir}/${appName}/prompt`, { encoding: 'utf8', flag: 'r' });
    }

    if (data) {
      await callChatGPT(`${currentDir}/${appName}/`, data);
    } else {
      console.log('ERROR: cannot read the prompt file!');
      return;
    }
    return;
  }
  console.log('Keywords', searchKeys);

  const matches = match(appName, searchKeys);
  const choices = matches.map((item) => {
    // console.log(item.command);
    return { title: item.colorCommand, value: item.command };
  });

  const response = await prompts([
    {
      type: 'select',
      name: 'command',
      message: 'Matched commands:',
      choices
    }
  ]);

  if (response.command) {
    console.log('Command:', response.command);
    return require('child_process').execSync(response.command, { stdio: 'inherit' });
  }
  // => { twitter: 'terkelg', color: [ '#ff0000', '#0000ff' ] }

  // init().catch((e) => {
  //   console.error(e);
  // });
})();
