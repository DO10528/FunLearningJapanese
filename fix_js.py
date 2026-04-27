import os
import re
import glob

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

success_count = 0

for file in files_to_process:
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()

    cat_id = mapping.get(file, '')

    if 'exitGameToCategory' not in html:
        js_snippet = js_snippet_template.replace('{cat_id}', cat_id)
        # using case-insensitive replace for </body>
        html = re.sub(r'(</body>)', js_snippet + r'\n\1', html, flags=re.IGNORECASE)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(html)
        success_count += 1

print(f"Injected JS into {success_count} files.")
