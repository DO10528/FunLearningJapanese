const fs = require('fs');
const path = require('path');

const dir = '.'; // Desktop/FunLearningJapanese

function getFiles(base, ext, files, result) {
  files = files || fs.readdirSync(base);
  result = result || [];
  files.forEach(file => {
    const newbase = path.join(base, file);
    if(fs.statSync(newbase).isDirectory()) {
      if(file !== '.git' && file !== 'assets' && file !== 'css' && file !== 'js' && file !== 'data') {
         result = getFiles(newbase, ext, fs.readdirSync(newbase), result);
      }
    } else {
      if(file.endsWith(ext) && file !== 'split_code.js') result.push(newbase);
    }
  });
  return result;
}

const htmlFiles = getFiles(dir, '.html');
let modifiedCount = 0;

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // 1. Firebase Script Replacement (Common configuration)
    const firebaseRegex = /<script type="module">\s*\/\/\s*★重要：Firebaseのバージョンを安定版[\s\S]*?<\/script>/i;
    // or just look for initializeApp
    const firebaseAltRegex = /<script type="module">[\s\S]*?import \{ initializeApp \} from[\s\S]*?firebaseConfig = \{[\s\S]*?<\/script>/i;

    if (firebaseRegex.test(content) || firebaseAltRegex.test(content)) {
        content = content.replace(firebaseRegex, '<script type="module" src="js/firebase-config.js"></script>');
        content = content.replace(firebaseAltRegex, '<script type="module" src="js/firebase-config.js"></script>');
        modified = true;
    }

    // 2. We'll handle inline styles via a simpler manual inspection 
    // because extracting exactly everything perfectly might break some page-specific rules.
    // Instead, let's just make the firebase config external for now. 

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log(`Updated ${file}`);
    }
}
console.log(`Script finished. Files modified: ${modifiedCount}`);
