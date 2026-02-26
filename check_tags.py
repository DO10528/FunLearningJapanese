import os
import re

def find_html_in_textcontent(dir_path):
    # match .textContent = `...` or "..." or '...'
    pattern = re.compile(r'\.textContent\s*=\s*(["\'`])([\s\S]*?)\1')
    
    found = False
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.js') or file.endswith('.html'):
                filepath = os.path.join(root, file)
                if 'node_modules' in filepath or '.git' in filepath:
                    continue
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # find all matches
                for match in pattern.finditer(content):
                    inner_content = match.group(2)
                    if re.search(r'<[a-zA-Z/][^>]*>', inner_content):
                        found = True
                        print(f"Match found in {filepath}:")
                        snippet = inner_content[:100].replace('\n', ' ')
                        print(f"  ... {snippet} ...")

    if not found:
        print("All clean! No HTML tags assigned to textContent found.")

find_html_in_textcontent('.')
