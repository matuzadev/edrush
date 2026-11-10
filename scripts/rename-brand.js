const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.next') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx|js|jsx|json)$/.test(entry.name)) files.push(full);
  }
}

walk(path.join(root, 'src'));
['package.json', 'package-lock.json'].forEach((p) => {
  const full = path.join(root, p);
  if (fs.existsSync(full)) files.push(full);
});

let changed = 0;
for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const original = text;
  const replacements = [
    ['Foco Federal', 'EdRush'],
    ['FOCO FEDERAL', 'EDRUSH'],
    ['FocoFederal', 'EdRush'],
    ['foco federal', 'edrush'],
    ['Foco federal', 'EdRush']
  ];
  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }
  if (text !== original) {
    fs.writeFileSync(file, text);
    changed++;
  }
}

console.log(`Arquivos alterados: ${changed}`);
