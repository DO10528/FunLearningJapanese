import os
import re

def fix_text_content(dir_path):
    # Pattern 1: .textContent = `...`
    pattern1 = re.compile(r'\.textContent\s*=\s*`([^`]*?<[a-zA-Z/]+.*?)[^`]*?`', re.DOTALL)
    
    # Pattern 2: .textContent = "..." or '...'
    pattern2 = re.compile(r'\.textContent\s*=\s*(["\'])(.*?<[a-zA-Z/]+.*?\1)', re.DOTALL)

    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.js') or file.endswith('.html'):
                filepath = os.path.join(root, file)
                if 'node_modules' in filepath or '.git' in filepath:
                    continue
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                def repl1(m):
                    # Only replace if there's actually a <tag> pattern
                    if re.search(r'<[a-zA-Z/]+.*?>', m.group(1)):
                        return r'.innerHTML = `' + m.group(1) + '`'
                    return m.group(0)

                # Wait, simpler string replace might just work better if we find the exact match manually
                # Let's just do a manual find loop to be absolutely safe
                
                # Finding `.textContent = `
                idx = 0
                while True:
                    idx = content.find('.textContent', idx)
                    if idx == -1:
                        break
                    
                    # check what comes after
                    eq_idx = content.find('=', idx)
                    if eq_idx != -1 and eq_idx - idx < 20: 
                        # find the quote
                        quote_idx = -1
                        for i in range(eq_idx + 1, eq_idx + 20):
                            if content[i] in ['`', '"', "'"]:
                                quote_idx = i
                                break
                        
                        if quote_idx != -1:
                            quote_char = content[quote_idx]
                            end_quote_idx = content.find(quote_char, quote_idx + 1)
                            
                            if end_quote_idx != -1:
                                inside_str = content[quote_idx+1 : end_quote_idx]
                                if bool(re.search(r'<[a-zA-Z/]+.*?>', inside_str)) and not '${' in inside_str:
                                    # Wait, if there is ${} we CAN replace it as long as the quote is `
                                    pass
                                
                                if bool(re.search(r'<[a-zA-Z/]+[^>]*>', inside_str)):
                                    # It has HTML!
                                    # Replace .textContent with .innerHTML
                                    content = content[:idx] + '.innerHTML' + content[idx+12:]
                                    
                    idx += 1
                
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Fixed {filepath}")
                    
fix_text_content('.')
