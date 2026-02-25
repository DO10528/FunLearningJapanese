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

// This is where we extract common CSS
let commonCss = `/* Common CSS */
:root {
    --primary-color: #fca311;
    --secondary-color: #14213d;
    --bg-color: #f8f9fa;
    --text-color: #333;
    --accent-color: #e63946;
}
body {
    font-family: 'Zen Maru Gothic', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    margin: 0; padding: 0; padding-bottom: 80px;
    display: flex; flex-direction: column; min-height: 100vh;
}
header {
    background: var(--primary-color);
    color: white; padding: 15px 20px;
    display: flex; justify-content: space-between; align-items: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    position: sticky; top: 0; z-index: 100;
}
.header-btn {
    background: rgba(255,255,255,0.2); border: none; padding: 8px 15px;
    border-radius: 20px; color: white; font-weight: bold; cursor: pointer;
    text-decoration: none; display: flex; align-items: center; gap: 5px;
    transition: background 0.2s;
}
`;

fs.writeFileSync(path.join('css', 'common.css'), commonCss, 'utf8');

