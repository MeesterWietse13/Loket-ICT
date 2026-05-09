const fs = require('fs');
const path = require('path');

const fileNames = [
  'App.tsx',
  'components/Accounts.tsx',
  'components/Dashboard.tsx',
  'components/Personnel.tsx',
  'components/Planning.tsx',
  'components/Settings.tsx',
  'components/TeacherPortal.tsx',
  'components/Sidebar.tsx'
];

const colorMap = {
  // Teal
  'teal-50': '#EAF1F4',
  'teal-100': '#CFDCE2',
  'teal-200': '#CFDCE2',
  'teal-300': '#CFDCE2',
  'teal-400': '#487184',
  'teal-500': '#385B69',
  'teal-600': '#385B69',
  'teal-700': '#385B69',
  'teal-800': '#2A4652',
  'teal-900': '#0F172A',
  
  // Emerald
  'emerald-50': '#EDF2EF',
  'emerald-100': '#D4E0D8',
  'emerald-200': '#D4E0D8',
  'emerald-300': '#6D9179',
  'emerald-400': '#6D9179',
  'emerald-500': '#557560',
  'emerald-600': '#557560',
  'emerald-700': '#557560',
  'emerald-800': '#2A4652',
  'emerald-900': '#0F172A',

  // Rose
  'rose-50': '#F2E8E9',
  'rose-100': '#E6D1D4',
  'rose-200': '#E6D1D4',
  'rose-300': '#B26E77',
  'rose-400': '#B26E77',
  'rose-500': '#9A5B64',
  'rose-600': '#9A5B64',
  'rose-700': '#9A5B64',
  'rose-800': '#2A4652',
  'rose-900': '#0F172A',

  // Sky
  'sky-50': '#EAF1F4',
  'sky-100': '#CFDCE2',
  'sky-200': '#CFDCE2',
  'sky-300': '#5B889C',
  'sky-400': '#5B889C',
  'sky-500': '#487184',
  'sky-600': '#487184',
  'sky-700': '#487184',
  'sky-800': '#2A4652',
  'sky-900': '#0F172A',

  // Indigo
  'indigo-50': '#EAF1F4',
  'indigo-100': '#CFDCE2',
  'indigo-200': '#CFDCE2',
  'indigo-300': '#5B889C',
  'indigo-400': '#5B889C',
  'indigo-500': '#487184',
  'indigo-600': '#487184',
  'indigo-700': '#487184',
  'indigo-800': '#2A4652',
  'indigo-900': '#0F172A',

  // Amber
  'amber-50': '#F4EFE6',
  'amber-100': '#EAE1D2',
  'amber-200': '#EAE1D2',
  'amber-300': '#B0894F',
  'amber-400': '#B0894F',
  'amber-500': '#96723D',
  'amber-600': '#96723D',
  'amber-700': '#96723D',
  'amber-800': '#2A4652',
  'amber-900': '#0F172A',
  
  // Blue
  'blue-50': '#EAF1F4',
  'blue-100': '#CFDCE2',
  'blue-200': '#CFDCE2',
  'blue-300': '#5B889C',
  'blue-400': '#5B889C',
  'blue-500': '#487184',
  'blue-600': '#487184',
  'blue-700': '#487184',
  'blue-800': '#2A4652',
  'blue-900': '#0F172A',

  // Some extra specific patches
  'bg-white': 'bg-[#FDFBF7]',
  'border-stone-100': 'border-[#EAE1D2]',
  'border-stone-200': 'border-[#EAE1D2]',
};

for (const name of fileNames) {
  const filePath = path.join(__dirname, 'src', name);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace colors like bg-teal-50, text-teal-100, border-teal-200, shadow-teal-500/20, from-teal-400
  // regex that matches prefixes: (bg|text|border|ring|shadow|from|via|to|fill|stroke|selection:bg|selection:text)-<color>-<shade>
  const prefixes = ['bg', 'text', 'border', 'ring', 'shadow', 'from', 'via', 'to', 'fill', 'stroke', 'selection:bg', 'selection:text', 'hover:bg', 'hover:text', 'hover:border', 'group-hover:bg', 'group-hover:text', 'group-hover:border', 'focus:ring', 'focus:border'];
  
  for (const [key, hex] of Object.entries(colorMap)) {
    // Escape standard keys
    if (key === 'bg-white' || key === 'border-stone-100' || key === 'border-stone-200') {
      content = content.replace(new RegExp(key, 'g'), colorMap[key]);
      continue;
    }

    for (const prefix of prefixes) {
      // e.g. bg-teal-50 -> bg-[#EAF1F4]
      // or shadow-teal-500/20 -> shadow-[#385B69]/20
      const searchPattern = new RegExp(`${prefix}-${key}(/[0-9]+)?`, 'g');
      content = content.replace(searchPattern, (match, opacity) => {
        return `${prefix}-[${hex}]${opacity || ''}`;
      });
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}
