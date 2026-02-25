const fs = require('fs');
const path = require('path');

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
        let cssContent = styleMatch[1].trim();
        const cssPath = path.join('css', `${originalTitle}.css`);
        fs.writeFileSync(cssPath, cssContent, 'utf8');
        content = content.replace(styleRegex, `<link rel="stylesheet" href="css/${originalTitle}.css">`);
        cssChanged = true;
    }

    // Try a global match for multiple <script> tags
    const scriptRegexGlobal = /<script>([\s\S]*?)<\/script>/ig;
    let scripts = [...content.matchAll(scriptRegexGlobal)];
    
    // We only care if there is inline script content. If there's none, or they only have src attributes, skip.
    if (scripts.length > 0) {
        let combinedJs = [];
        for (const s of scripts) {
            combinedJs.push(s[1].trim());
            content = content.replace(s[0], ''); // Remove the inline script tag
        }
        
        let jsContent = combinedJs.join('\n\n');
        
        if (jsContent.length > 0) {
            const jsPath = path.join('js', `${originalTitle}.js`);
            fs.writeFileSync(jsPath, jsContent, 'utf8');
            content = content.replace('</body>', `\n<script src="js/${originalTitle}.js"></script>\n</body>`);
            jsChanged = true;
        }
    }

    if (cssChanged || jsChanged) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log(`Extracted CSS/JS from ${file}`);
    }
}
console.log(`Script finished. Files modified: ${modifiedCount}`);
