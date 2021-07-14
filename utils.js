const synonymMap = {
  'create-react-app': ['cra'],
  vite: ['vitejs'],
  react: ['reactjs'],
  typescript: ['ts', 'type'],
  vue: ['vuejs']
};

const CMD_CRA = 'npx create-react-app $name';
const CMD_VITE = 'npm init vite@latest $name -- --template';
const commandArr = [
  {
    command: `${CMD_CRA}`,
    keywords: ['create-react-app', 'react']
  },
  {
    command: `${CMD_CRA} --template typescript`,
    keywords: ['create-react-app', 'react', 'typescript']
  },
  {
    command: `${CMD_VITE} react`,
    keywords: ['vite', 'react']
  },
  {
    command: `${CMD_VITE} react-ts`,
    keywords: ['vite', 'react', 'typescript']
  },
  {
    command: `${CMD_VITE} vue`,
    keywords: ['vite', 'vue']
  },
  {
    command: `${CMD_VITE} vue-ts`,
    keywords: ['vite', 'vue', 'typescript']
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
// console.log('commandArr', commandArr);

export function getScore(search, cmdItem) {
  let score = 0;
  for (let idx = 0; idx < cmdItem.allKeywords.length; idx++) {
    const kw = cmdItem.allKeywords[idx];
    if (kw.toLowerCase() === search) {
      score = score + 1;
      score = score - idx * 0.1; // reduce score if it matches at lower index (in the case of same score).
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
    matches.push({ ...cmdItem, totalScore });
    matches.sort((a, b) => b.totalScore - a.totalScore);
  }
  matches.map((item) => {
    item.command = item.command.replace(/\$name/, appName);
    // console.log(item.command);
  });
  return matches;
}
