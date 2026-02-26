import os
import re

def fix_text_content(dir_path):
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.js') or file.endswith('.html'):
                filepath = os.path.join(root, file)
                if 'node_modules' in filepath or '.git' in filepath or 'fix_tags.py' in filepath:
                    continue
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                lines = content.split('\n')
                modified = False
                for i in range(len(lines)):
                    if '.textContent' in lines[i]:
                        parts = lines[i].split('.textContent', 1)
                        rhs = parts[1]
                        # Check if RHS has HTML tags. Skip if it's just < or > without a tag structure
                        if re.search(r'<[a-zA-Z/][^>]*>', rhs):
                            lines[i] = parts[0] + '.innerHTML' + rhs
                            modified = True
                
                if modified:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write('\n'.join(lines))
                    print(f"Fixed {filepath}")
                    
fix_text_content('.')
