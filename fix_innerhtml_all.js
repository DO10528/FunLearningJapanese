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
    
    // Split into lines for analysis
    const lines = content.split('\n');
    let newLines = [];
    
    for(let i=0; i<lines.length; i++) {
        let line = lines[i];
        
        // Skip some specific lines that need to build HTML (like in loops creating buttons)
        if (line.includes('.innerHTML') && !line.includes('+=') && !line.includes('`<') && !line.includes('`\n<') && !line.includes('"<') && !line.includes('\'<') ) {
            // Usually safe to switch to textContent
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
