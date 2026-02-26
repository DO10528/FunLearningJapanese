import os

html_files = []
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.html'):
            html_files.append(os.path.join(root, f))

insertion_css = '\n<link rel="stylesheet" href="css/common_ui.css">\n'
insertion_js = '\n<script src="js/common_ui.js"></script>\n'

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "common_ui.css" in content and "common_ui.js" in content:
        continue # Already injected
        
    # Inject CSS
    if "common_ui.css" not in content:
        head_end = content.find('</head>')
        if head_end != -1:
            content = content[:head_end] + insertion_css + content[head_end:]
            
    # Inject JS
    if "common_ui.js" not in content:
        body_end = content.find('</body>')
        if body_end != -1:
            content = content[:body_end] + insertion_js + content[body_end:]
        elif "</head>" in content:
            # Fallback to head if body end not found
            head_end = content.find('</head>')
            content = content[:head_end] + insertion_js + content[head_end:]

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Injected into {len(html_files)} files.")
