import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const clc = require('cli-color');

const synonymMap = {
  angular: ['angularjs', 'ng'],
  'create-next-app': ['next', 'nextjs', 'cna'],
  'create-nuxt-app': ['nuxt', 'nuxtjs'],
  'create-react-app': ['createreactapp', 'cra'],
  'create-react-native-app': ['crna', 'react-native', 'rn', 'native'],
  'create-expo-app': ['expo', 'ts'],
  'react-native': ['reactnative', 'rn', 'native'],
  'create-web3js-app': ['cwa'],
  'express-generator-typescript': ['express', 'expressjs'],
  nuxt: ['nuxtjs'],
  mobile: ['phone', 'android', 'ios'],
  vite: ['vitejs'],
  bun: ['bunjs'],
  preact: ['preactjs'],
  lit: ['lit-element', 'litjs'],
  react: ['reactjs'],
  typescript: ['ts', 'type'],
  js: ['javascript', 'vanilla', 'vanillajs'],
  vue: ['vuejs']
};

const CMD_ANGULAR = `npx -p @angular/cli@latest ng new $name`;
const CMD_ANGULAR_COLOR = `npx -p ${clc.yellow('angular')}/cli@latest ng new $name`;
const CMD_NEXT = 'npx create-next-app $name --use-npm';
const CMD_NEXT_COLOR = `npx ${clc.yellow('create-next-app')} $name --use-npm`;
const CMD_NUXT = 'npx create-nuxt-app $name';
const CMD_NUXT_COLOR = `npx ${clc.yellow('create-nuxt-app')} $name`;
const CMD_CRA = 'npx create-react-app $name';
const CMD_CRA_COLOR = `npx ${clc.yellow('create-react-app')} $name`;
const CMD_CWA = 'npx create-web3js-app $name';
const CMD_CWA_COLOR = `npx ${clc.yellow('create-web3js-app')} $name`;
const CMD_VITE = 'npm init vite@latest $name -- --template';
const CMD_VITE_COLOR = `npm init ${clc.yellow('vite')}@latest $name -- --template`;
// using bunx for now as 'bun' has errors on macos: https://github.com/oven-sh/bun/issues/4646#issuecomment-1713732417
const CMD_BUN_NEXT = 'bunx create-t3-app@latest $name';
const CMD_BUN_NEXT_COLOR = `npx ${clc.yellow('bunx')} create-t3-app@latest $name`;
const CMD_BUN_VITE = 'bunx create-vite@latest $name';
const CMD_BUN_VITE_COLOR = `${clc.yellow('bunx')} create-vite@latest $name`;
const CMD_EXPRESS = `npx express-generator-typescript $name`;
const CMD_EXPRESS_COLOR = `npx ${clc.yellow('express-generator-typescript')} $name`;
const CMD_RN = `npx react-native init $name`;
const CMD_RN_COLOR = `npx ${clc.yellow('react-native')} init $name`;
const CMD_RN_TS = `npx react-native init $name --template react-native-template-typescript`;
const CMD_RN_TS_COLOR = `npx ${clc.yellow('react-native')} init $name --template react-native-template-typescript`;
const CMD_CRN = `npx create-react-native-app $name`;
const CMD_CRN_COLOR = `npx ${clc.yellow('create-react-native-app')} $name`;
const CMD_EXPO = `npx create-expo-app $name`;
const CMD_EXPO_COLOR = `npx ${clc.yellow('create-expo-app')} $name`;
const CMD_EXPO_TS = `npx create-expo-app $name -t expo-template-blank-typescript`;
const CMD_EXPO_TS_COLOR = `npx ${clc.yellow('create-expo-app')} $name -t expo-template-blank-typescript`;

// keywords are prioritized for matching, also are the 'keys' of 'synonymMap'.
const commandArr = [
  {
    command: `${CMD_ANGULAR}`,
    colorCommand: `${CMD_ANGULAR_COLOR}`,
    keywords: ['angular']
  },
  {
    command: `${CMD_NEXT}`,
    colorCommand: `${CMD_NEXT_COLOR}`,
    keywords: ['create-next-app', 'react']
  },
  {
    command: `${CMD_NEXT} --ts`,
    colorCommand: `${CMD_NEXT_COLOR} --ts`,
    keywords: ['create-next-app', 'react', 'typescript']
  },
  {
    command: `${CMD_NUXT}`,
    colorCommand: `${CMD_NUXT_COLOR}`,
    keywords: ['create-nuxt-app', 'vue']
  },
  {
    command: `${CMD_CRA}`,
    colorCommand: `${CMD_CRA_COLOR}`,
    keywords: ['create-react-app', 'react']
  },
  {
    command: `${CMD_CRA} --template typescript`,
    colorCommand: `${CMD_CRA_COLOR} --template typescript`,
    keywords: ['create-react-app', 'react', 'typescript']
  },
  {
    command: `${CMD_VITE} vanilla`,
    colorCommand: `${CMD_VITE_COLOR} vanilla`,
    keywords: ['vite', 'vanilla']
  },
  {
    command: `${CMD_VITE} vanilla-ts`,
    colorCommand: `${CMD_VITE_COLOR} vanilla-ts`,
    keywords: ['vite', 'vanilla', 'typescript']
  },
  {
    command: `${CMD_VITE} lit-element`,
    colorCommand: `${CMD_VITE_COLOR} lit-element`,
    keywords: ['vite', 'lit-element']
  },
  {
    command: `${CMD_VITE} lit-element-ts`,
    colorCommand: `${CMD_VITE_COLOR} lit-element-ts`,
    keywords: ['vite', 'lit-element', 'typescript']
  },
  {
    command: `${CMD_VITE} react`,
    colorCommand: `${CMD_VITE_COLOR} react`,
    keywords: ['vite', 'react']
  },
  {
    command: `${CMD_VITE} react-ts`,
    colorCommand: `${CMD_VITE_COLOR} react-ts`,
    keywords: ['vite', 'react', 'typescript']
  },
  {
    command: `${CMD_VITE} preact`,
    colorCommand: `${CMD_VITE_COLOR} preact`,
    keywords: ['vite', 'preact']
  },
  {
    command: `${CMD_VITE} preact-ts`,
    colorCommand: `${CMD_VITE_COLOR} preact-ts`,
    keywords: ['vite', 'preact', 'typescript']
  },
  {
    command: `${CMD_VITE} svelte`,
    colorCommand: `${CMD_VITE_COLOR} svelte`,
    keywords: ['vite', 'svelte']
  },
  {
    command: `${CMD_VITE} svelte-ts`,
    colorCommand: `${CMD_VITE_COLOR} svelte-ts`,
    keywords: ['vite', 'svelte', 'typescript']
  },
  {
    command: `${CMD_VITE} vue`,
    colorCommand: `${CMD_VITE_COLOR} vue`,
    keywords: ['vite', 'vue']
  },
  {
    command: `${CMD_VITE} vue-ts`,
    colorCommand: `${CMD_VITE_COLOR} vue-ts`,
    keywords: ['vite', 'vue', 'typescript']
  },
  {
    command: `${CMD_BUN_VITE}`,
    colorCommand: `${CMD_BUN_VITE_COLOR}`,
    keywords: ['bun', 'vite', 'react']
  },
  {
    command: `${CMD_BUN_NEXT}`,
    colorCommand: `${CMD_BUN_NEXT_COLOR}`,
    keywords: ['bun', 'next']
  },
  {
    command: `${CMD_CWA}`,
    colorCommand: `${CMD_CWA_COLOR}`,
    keywords: ['create-web3js-app', 'web3', 'web3js', 'hardhat', 'metamask']
  },
  {
    command: `${CMD_EXPRESS}`,
    colorCommand: `${CMD_EXPRESS_COLOR}`,
    keywords: ['express-generator-typescript', 'typescript']
  },
  {
    command: `${CMD_CRN}`,
    colorCommand: `${CMD_CRN_COLOR}`,
    keywords: ['create-react-native-app', 'mobile']
  },
  {
    command: `${CMD_RN}`,
    colorCommand: `${CMD_RN_COLOR}`,
    keywords: ['react-native', 'mobile']
  },
  {
    command: `${CMD_RN_TS}`,
    colorCommand: `${CMD_RN_TS_COLOR}`,
    keywords: ['react-native', 'mobile', 'typescript']
  },
  {
    command: `${CMD_EXPO}`,
    colorCommand: `${CMD_EXPO_COLOR}`,
    keywords: ['create-expo-app', 'mobile']
  },
  {
    command: `${CMD_EXPO_TS}`,
    colorCommand: `${CMD_EXPO_TS_COLOR}`,
    keywords: ['create-expo-app', 'mobile', 'typescript']
  }
];
commandArr.forEach((item) => {
  item.allKeywords = [];
  for (const kw of item.keywords) {
    item.allKeywords.push(kw);
    if (synonymMap[kw]) {
      item.allKeywords = [...item.allKeywords, ...synonymMap[kw]];
    }
  }
});

export function getScore(searchKeyword, cmdItem, partialMatch = false) {
  let score = 0;
  for (let idx = 0; idx < cmdItem.allKeywords.length; idx++) {
    const kw = cmdItem.allKeywords[idx];
    if (kw.toLowerCase() === searchKeyword) {
      score = score + 1;
      score = score - idx * 0.1; // reduce score if it matches at lower index (in the case of same score).
    } else if (partialMatch && kw.toLowerCase().indexOf(searchKeyword) >= 0) {
      score = score + 0.9;
      score = score - idx * 0.1;
    }
  }
  return score;
}

export function match(appName, searchKeys) {
  const matches = [];
  // const searchKeys = search.split(' ');
  for (const cmdItem of commandArr) {
    let totalScore = 0;
    for (const searchKeyword of searchKeys) {
      totalScore += getScore(searchKeyword.toLowerCase(), cmdItem);
    }
    if (totalScore === 0) {
      // next, try partialMatch
      for (const searchKeyword of searchKeys) {
        totalScore += getScore(searchKeyword.toLowerCase(), cmdItem, true);
      }
    }
    matches.push({ ...cmdItem, totalScore });
    matches.sort((a, b) => b.totalScore - a.totalScore);
  }
  matches.map((item) => {
    item.command = item.command.replace(/\$name/, appName);
    // console.log(item.command);
  });
  return matches;
}
