import os
import re

def fix_text_content(dir_path):
    # Pattern to match: .textContent = `...` or "..." or '...'
    # We will read the whole file string.
    # We'll use re.sub with a function to inspect the match.
    
    # regex matches: .textContent[optional whitespace]=[optional whitespace][quote char](anything)[same quote char]
    # It needs to handle multiple lines for backticks.
    pattern = re.compile(r'\.textContent\s*=\s*(["\'`])([\s\S]*?)\1')

    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.js') or file.endswith('.html'):
                filepath = os.path.join(root, file)
                if 'node_modules' in filepath or '.git' in filepath or 'fix_tags.py' in filepath:
                    continue
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                def replacer(match):
                    quote = match.group(1)
                    inner_content = match.group(2)
                    # Check if inner_content contains an HTML tag
                    if re.search(r'<[a-zA-Z/][^>]*>', inner_content):
                        # Use insertAdjacentHTML instead of innerHTML to be safer against scripts
                        # Actually innerHTML is fine for static strings like icons/br.
                        return f'.innerHTML = {quote}{inner_content}{quote}'
                    else:
                        return match.group(0) # No change

                new_content = pattern.sub(replacer, content)
                
                if new_content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed {filepath}")
                    
fix_text_content('.')
