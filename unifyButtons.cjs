const fs = require('fs');
const path = require('path');

const fileNames = [
  'components/Accounts.tsx',
  'components/Dashboard.tsx',
  'components/Personnel.tsx',
  'components/Planning.tsx',
  'components/Settings.tsx'
];

for (const name of fileNames) {
  const filePath = path.join(__dirname, 'src', name);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  content = content
    .replace(/bg-stone-800/g, 'bg-[#2A4652]')
    .replace(/hover:bg-black/g, 'hover:bg-[#1f343d]')
    .replace(/shadow-stone-800\/10/g, 'shadow-[#2A4652]/20')
    .replace(/bg-stone-50/g, 'bg-[#F4EFE6]')
    .replace(/text-slate-300/g, 'text-[#8BA3AC]')
    .replace(/placeholder:text-slate-300/g, 'placeholder:text-[#8BA3AC]')
    .replace(/placeholder:text-stone-400/g, 'placeholder:text-[#8BA3AC]')
    .replace(/bg-slate-300/g, 'bg-[#CAD6DC]');

  fs.writeFileSync(filePath, content, 'utf8');
}
