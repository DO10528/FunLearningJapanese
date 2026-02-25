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
      if(file.endsWith(ext) && file !== 'fix_innerhtml.js' && file !== 'split_code.js') result.push(newbase);
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

    // We will do some safe innerHTML -> textContent replacements where it's clearly just text
    // E.g. element.innerHTML = "some text" or variable without HTML tags
    
    // Pattern 1: .innerHTML = ""; -> .textContent = "";
    content = content.replace(/\.innerHTML\s*=\s*(['"])(.*?)\1/g, (match, q, text) => {
        if (!text.includes('<') && !text.includes('&')) {
            return `.textContent = ${q}${text}${q}`;
        }
        return match;
    });

    // Pattern 2: .innerHTML = variable -> .insertAdjacentHTML if we know it has tags, or we leave it for manual if unsure.
    // For automatic safety without breaking layout, it's hard to blindly replace all variable assignments.
    // We will target specific known safe patterns.
    
    // Simple text replacement (score text, messages, etc)
    content = content.replace(/\.innerHTML\s*=\s*['"](.*?)['"]/g, (match, text) => {
        if (!text.includes('<')) {
            return match.replace('.innerHTML', '.textContent');
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log(`Updated innerHTML in ${file}`);
    }
}
console.log(`Script finished. Files modified: ${modifiedCount}`);
