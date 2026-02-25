const fs = require('fs');
const path = require('path');

const dir = '.';

function getFiles(base, ext, files, result) {
  files = files || fs.readdirSync(base);
  result = result || [];
  files.forEach(file => {
    const newbase = path.join(base, file);
    if(fs.statSync(newbase).isDirectory()) {
      if(file !== '.git' && file !== 'assets' && file !== 'css' && file !== 'js' && file !== 'data' && file !== 'node_modules') {
         result = getFiles(newbase, ext, fs.readdirSync(newbase), result);
      }
    } else {
      if(file.endsWith(ext) && !file.includes('fix_innerhtml')) result.push(newbase);
    }
  });
  return result;
}

const targetFiles = [...getFiles(dir, '.html'), ...getFiles(path.join(dir, 'js'), '.js')];
let modifiedCount = 0;

for (const file of targetFiles) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // We will do a manual regex to find all .innerHTML = ... and change to .textContent = ...
    // Exception: If the assigned string contains a < tag, we use DOMParser or insertAdjacentHTML or just leave it for manual check.
    // By tracking how many files had changes, we can pinpoint issues.
    
    // Convert to textContent if no "<" or ">" is detected in the line
    const lines = content.split('\n');
    let newLines = [];
    for(let i=0; i<lines.length; i++) {
        let line = lines[i];
        if (line.includes('.innerHTML') && line.includes('=')) {
           if (!line.includes('<') && !line.includes('>')) {
               line = line.replace(/\.innerHTML/g, '.textContent');
           }
        } else if (line.includes('.innerHTML = ""))') {
           line = line.replace(/\.innerHTML/g, '.textContent');
        } else if (line.includes('.innerHTML = \'\'')) {
           line = line.replace(/\.innerHTML/g, '.textContent');
        }
        newLines.push(line);
    }
    
    content = newLines.join('\n');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
    }
}
console.log(`Script finished. Files modified: ${modifiedCount}`);
