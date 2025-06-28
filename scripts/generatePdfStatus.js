const fs = require('fs');
const path = require('path');

const basePath = path.resolve(__dirname, '..'); // points to project root
const subjects = ['physics', 'chemistry', 'botany', 'zoology'];

const years = fs.readdirSync(basePath)
  .filter(name => /^neetx-\d{4}$/.test(name))
  .map(name => name.replace('neetx-', ''));

const result = {};

for (const year of years) {
  const yearDir = path.join(basePath, `neetx-${year}`);
  if (!fs.existsSync(yearDir)) continue;

  const yearData = { fullYear: false };

  const fullPdf = path.join(yearDir, `neetx-${year}-full.pdf`);
  if (fs.existsSync(fullPdf)) {
    yearData.fullYear = true;
  }

  for (const subject of subjects) {
    const subjectDir = path.join(yearDir, subject);
    const subjectData = { subjectPdf: false, chapters: [] };

    if (!fs.existsSync(subjectDir)) {
      yearData[subject] = subjectData;
      continue;
    }

    const subjectPdf = path.join(subjectDir, `${subject}-all.pdf`);
    if (fs.existsSync(subjectPdf)) {
      subjectData.subjectPdf = true;
    }

    const files = fs.readdirSync(subjectDir);
    for (const file of files) {
      if (file.endsWith('.pdf') && !file.includes(`${subject}-all`)) {
        const chapterId = file.replace('.pdf', '');
        subjectData.chapters.push(chapterId);
      }
    }

    yearData[subject] = subjectData;
  }

  result[year] = yearData;
}

// Write output to root directory
fs.writeFileSync(
  path.join(basePath, 'pdfStatus.json'),
  JSON.stringify(result, null, 2),
  'utf-8'
);

console.log('✅ pdfStatus.json generated successfully at root.');
