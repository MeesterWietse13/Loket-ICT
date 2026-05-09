const fs = require('fs');
const path = require('path');

const fileNames = [
  'App.tsx',
  'components/Accounts.tsx',
  'components/Personnel.tsx',
  'components/Planning.tsx',
  'components/Settings.tsx'
];

for (const name of fileNames) {
  const filePath = path.join(__dirname, 'src', name);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  content = content
    // Backgrounds for App.tsx
    .replace(/bg-\[#FDFBF7\]/g, 'bg-[#F6F5F0]')
    .replace(/selection:bg-teal-100 selection:text-teal-900/g, 'selection:bg-[#CFDCE2] selection:text-[#2A4652]')
    // Primary/Teal
    .replace(/bg-teal-700/g, 'bg-[#385B69]')
    .replace(/bg-teal-600/g, 'bg-[#385B69]')
    .replace(/text-teal-700/g, 'text-[#385B69]')
    .replace(/text-teal-600/g, 'text-[#385B69]')
    .replace(/border-teal-600/g, 'border-[#385B69]')
    .replace(/bg-teal-50/g, 'bg-[#EAF1F4]')
    .replace(/bg-teal-100/g, 'bg-[#CFDCE2]')
    .replace(/text-teal-800/g, 'text-[#0F172A]')
    .replace(/text-teal-900/g, 'text-[#0F172A]')
    .replace(/border-teal-100/g, 'border-[#CFDCE2]')
    .replace(/border-teal-200/g, 'border-[#CFDCE2]')
    .replace(/focus:ring-teal-100 focus:border-teal-400/g, 'focus:ring-[#CFDCE2] focus:border-[#385B69]')
    // Slate/Stone standard
    .replace(/text-stone-800/g, 'text-[#0F172A]')
    .replace(/text-slate-900/g, 'text-[#0F172A]')
    .replace(/bg-white/g, 'bg-[#FDFBF7]')
    .replace(/border-stone-100/g, 'border-[#EAE1D2]')
    .replace(/border-stone-200/g, 'border-[#EAE1D2]')
    .replace(/border-slate-100/g, 'border-[#EAE1D2]')
    .replace(/border-slate-200/g, 'border-[#EAE1D2]')
    // Replace text color headings
    .replace(/text-stone-900/g, 'text-[#0F172A]')
    // Blue/Sky
    .replace(/bg-blue-50/g, 'bg-[#EAF1F4]')
    .replace(/text-blue-600/g, 'text-[#487184]')
    .replace(/border-blue-100/g, 'border-[#CFDCE2]')
    .replace(/bg-sky-50/g, 'bg-[#EAF1F4]')
    .replace(/text-sky-600/g, 'text-[#487184]')
    .replace(/text-sky-700/g, 'text-[#487184]')
    .replace(/border-sky-100/g, 'border-[#CFDCE2]')
    .replace(/border-sky-200/g, 'border-[#CFDCE2]')
    // Emerald
    .replace(/bg-emerald-50/g, 'bg-[#EDF2EF]')
    .replace(/text-emerald-500/g, 'text-[#557560]')
    .replace(/text-emerald-600/g, 'text-[#557560]')
    .replace(/text-emerald-700/g, 'text-[#557560]')
    .replace(/text-emerald-900/g, 'text-[#2A4652]')
    .replace(/border-emerald-50/g, 'border-[#D4E0D8]')
    .replace(/border-emerald-100/g, 'border-[#D4E0D8]')
    // Rose
    .replace(/bg-rose-50/g, 'bg-[#F2E8E9]')
    .replace(/text-rose-600/g, 'text-[#9A5B64]')
    .replace(/text-rose-700/g, 'text-[#9A5B64]')
    .replace(/border-rose-100/g, 'border-[#E6D1D4]')
    // Hover states for primary buttons
    .replace(/hover:bg-teal-800/g, 'hover:bg-[#2A4652]')
    .replace(/hover:bg-teal-700/g, 'hover:bg-[#2A4652]')

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}
