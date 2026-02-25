const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = '.';

function getHtmlFiles(base, result) {
  result = result || [];
  const files = fs.readdirSync(base);
  files.forEach(file => {
    const newbase = path.join(base, file);
    if(fs.statSync(newbase).isDirectory()) {
      if(file !== '.git' && file !== 'assets' && file !== 'css' && file !== 'js' && file !== 'data' && file !== 'node_modules') {
         result = getHtmlFiles(newbase, result);
      }
    } else {
      if(file.endsWith('.html')) result.push(newbase);
    }
  });
  return result;
}

const htmlFiles = getHtmlFiles(dir);

if (!fs.existsSync('css')) fs.mkdirSync('css');
if (!fs.existsSync('js')) fs.mkdirSync('js');

let modifiedCount = 0;

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let originalTitle = path.basename(file, '.html');
    
    // Skip index.html for now or do it carefully
    if (originalTitle === 'index') continue;

    const styleRegex = /<style>([\s\S]*?)<\/style>/i;
    const scriptRegex = /<script>([\s\S]*?)<\/script>/i;

    const styleMatch = content.match(styleRegex);
    const scriptMatch = content.match(scriptRegex);

    let cssChanged = false;
    let jsChanged = false;

    if (styleMatch && styleMatch[1].trim().length > 0) {
        const cssContent = styleMatch[1].trim();
        const cssPath = path.join('css', `${originalTitle}.css`);
        
        // Check if css file already exists, if so append, else write
        if (!fs.existsSync(cssPath)) {
            fs.writeFileSync(cssPath, cssContent, 'utf8');
        } else {
            // fs.appendFileSync(cssPath, '\n' + cssContent, 'utf8');
            // assuming we don't want duplicates, we just write
            fs.writeFileSync(cssPath, cssContent, 'utf8');
        }
        
        content = content.replace(styleMatch[0], `<link rel="stylesheet" href="css/${originalTitle}.css">`);
        cssChanged = true;
    }

    if (scriptMatch && scriptMatch[1].trim().length > 0) {
        let jsContent = scriptMatch[1].trim();
        const jsPath = path.join('js', `${originalTitle}.js`);
        
        if (!fs.existsSync(jsPath)) {
            fs.writeFileSync(jsPath, jsContent, 'utf8');
        } else {
            fs.writeFileSync(jsPath, jsContent, 'utf8');
        }
        
        content = content.replace(scriptMatch[0], `<script src="js/${originalTitle}.js"></script>`);
        jsChanged = true;
    }

    if (cssChanged || jsChanged) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log(`Extracted CSS/JS from ${file}`);
    }
}
console.log(`Script finished. Files modified: ${modifiedCount}`);
