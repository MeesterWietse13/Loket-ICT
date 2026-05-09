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

for (const name of fileNames) {
  const filePath = path.join(__dirname, 'src', name);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the '0' issue caused by matching `50` in `500` etc.
  // The errors were:
  // bg-[#EAF1F4]0 -> bg-[#385B69] (teal-500 context or sky-500 context) Let's be careful.
  content = content
    .replace(/bg-\[#F4EFE6\]0/g, 'bg-[#96723D]') // amber-500
    .replace(/shadow-\[#F4EFE6\]0/g, 'shadow-[#96723D]') 
    .replace(/border-\[#EAF1F4\]0/g, 'border-[#385B69]') // border-teal-500
    .replace(/bg-\[#EDF2EF\]0/g, 'bg-[#557560]') // bg-emerald-500
    .replace(/shadow-\[#EDF2EF\]0/g, 'shadow-[#557560]') // shadow-emerald-500
    .replace(/shadow-\[#EAF1F4\]0/g, 'shadow-[#385B69]') // shadow-teal-500
    .replace(/shadow-\[#F2E8E9\]0/g, 'shadow-[#9A5B64]') // shadow-rose-500
    .replace(/bg-\[#F2E8E9\]0/g, 'bg-[#9A5B64]') // bg-rose-500
    .replace(/text-\[#F2E8E9\]0/g, 'text-[#9A5B64]') // text-rose-500
    .replace(/bg-\[#EAF1F4\]0/g, 'bg-[#385B69]') // bg-teal-500 or sky-500
    .replace(/to-\[#EAF1F4\]0/g, 'to-[#385B69]') // to-teal-500
    .replace(/border-\[#D4E0D8\]0/g, 'border-[#557560]') // border-emerald-500
    // fix some hover cases
    .replace(/hover:text-\[#F2E8E9\]0/g, 'hover:text-[#9A5B64]'); 

  fs.writeFileSync(filePath, content, 'utf8');
}
