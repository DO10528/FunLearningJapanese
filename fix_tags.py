import os
import re

def fix_text_content(dir_path):
    # This regex looks for .textContent = `...` where the inside contains a <tag>
    # It uses non-greedy matching .*? inside the backticks.
    pattern = re.compile(r'\.textContent\s*=\s*`([^`]*?<[a-zA-Z/]+[^>]*>[^`]*?)`')
    
    # Also handle single-line single/double quotes, e.g. .textContent = '<i class...>'
    pattern2 = re.compile(r'\.textContent\s*=\s*(["\'])(.*?<[a-zA-Z/]+[^>]*>.*?)\1')

    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.js') or file.endswith('.html'):
                filepath = os.path.join(root, file)
                if 'node_modules' in filepath or '.git' in filepath:
                    continue
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # Replace backtick multiline assignments
                content = pattern.sub(r'.innerHTML = `\1`', content)
                
                # Replace quote single-line assignments
                content = pattern2.sub(r'.innerHTML = \1\2\1', content)
                
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Fixed {filepath}")
                    
fix_text_content('.')
