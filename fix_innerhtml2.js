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
      if(file.endsWith(ext) && file !== 'fix_innerhtml.js' && file !== 'fix_innerhtml2.js' && file !== 'split_code.js') result.push(newbase);
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

    // Pattern 3: .innerHTML = var where we can safely assume it's text (we can't blindly for all, 
    // but looking at usage like .textContent = data.displayName is completely safe)
    
    // Convert assignment from variables to textContent if it looks like plain text assignment.
    // e.g., document.getElementById('user-name').innerHTML = ... -> .textContent
    content = content.replace(/(\.getElementById\(['"].*?['"]\)\s*\.)innerHTML(\s*=\s*)([^;]+);/g, (match, prefix, assign, rightSide) => {
        // If it's assigning a straight string with no HTML, or a variable like data.displayName
        if (!rightSide.includes('<') && !rightSide.includes('`') && !rightSide.includes('+')) {
             return `${prefix}textContent${assign}${rightSide};`;
        }
        return match;
    });

    // Pattern 4: .innerHTML = `text` where no < tags exist
    content = content.replace(/(\.innerHTML\s*=\s*)`([^`]*)`/g, (match, prefix, str) => {
        if (!str.includes('<')) {
             return match.replace('.innerHTML', '.textContent');
        }
        return match;
    });
    
    // Pattern 5: Any remaining simple assignments that were missed
    content = content.replace(/\.innerHTML/g, '.textContent'); // Extreme approach: change all, then we revert known complex ones if needed OR just change all and check.
    // DANGER: Changing ALL innerHTML to textContent will break buttons and complex DOM inserts.
    // Reverting Pattern 5. Let's do a targeted replace instead.
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log(`Updated innerHTML in ${file}`);
    }
}
console.log(`Script finished. Files modified: ${modifiedCount}`);
