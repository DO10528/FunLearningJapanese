import os
import re
import glob

# 1. Parse index.html for mapping
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

parts = content.split('id: "')
mapping = {}
for part in parts[1:]:
    cat_id = part.split('"')[0]
    urls = re.findall(r'url:\s*"([^"]+\.html)"', part)
    for url in urls:
        mapping[url] = cat_id

html_files = glob.glob('*.html')
# filter out non-game files
exclude_files = ['index.html', 'old_index.html']
files_to_process = [f for f in html_files if f not in exclude_files]

js_snippet_template = """
<script>
// 【重要】画面遷移前にタイマーや音声を破棄する共通関数
window.performNavCleanup = function() {
    if (typeof timerInterval !== 'undefined') clearInterval(timerInterval);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (typeof recognition !== 'undefined' && recognition !== null) {
        try { recognition.stop(); } catch(e) {}
    }
};

window.exitGameToHome = function() {
    if(window.performNavCleanup) window.performNavCleanup();
    window.location.href = "index.html";
};

window.exitGameToCategory = function() {
    if(window.performNavCleanup) window.performNavCleanup();
    window.location.href = "index.html?cat={cat_id}";
};
</script>
"""

nav_html_snippet = """
<!-- スマートナビゲーションバー -->
<div class="smart-nav-bar">
    <button class="smart-nav-btn" onclick="exitGameToHome()" aria-label="ホームに戻る">
        <i class="fa-solid fa-house"></i>
    </button>
    <button class="smart-nav-btn" onclick="exitGameToCategory()" aria-label="前に戻る">
        <i class="fa-solid fa-arrow-rotate-left"></i>
    </button>
</div>
"""

success_count = 0

for file in files_to_process:
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()

    # Skip if already applied
    if 'smart-nav-bar' in html and 'exitGameToHome()' in html:
        continue

    # Determine category
    cat_id = mapping.get(file)
    if not cat_id:
        # If not explicitly mapped, fallback to root
        cat_id = ''

    # 1. Inject HTML after <body>
    # Find <body> tag, which might have attributes
    body_match = re.search(r'<body[^>]*>', html, re.IGNORECASE)
    if body_match:
        body_tag = body_match.group(0)
        # Avoid injecting twice
        if 'class="smart-nav-bar"' not in html:
            html = html.replace(body_tag, body_tag + "\n" + nav_html_snippet, 1)
            
    # 2. Inject JS before </body>
    if 'exitGameToCategory' not in html:
        js_snippet = js_snippet_template.replace('{cat_id}', cat_id)
        html = html.replace('</body>', js_snippet + '\n</body>', 1)
        
    # 3. Add css/common_ui.css if not present
    if 'common_ui.css' not in html:
        head_match = re.search(r'</head>', html, re.IGNORECASE)
        if head_match:
            html = html.replace('</head>', '  <link rel="stylesheet" href="css/common_ui.css">\n</head>', 1)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    success_count += 1

print(f"Successfully processed {success_count} files.")
