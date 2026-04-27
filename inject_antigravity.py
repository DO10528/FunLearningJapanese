import os
import glob
import re

html_files = glob.glob('/Users/daisuke/Desktop/FunLearningJapanese/*.html')
script_to_inject = """
<script>
// Antigravity Session Cleanup
window.addEventListener('antigravity-session-end', function() {
    if (typeof window.performNavCleanup === 'function') {
        window.performNavCleanup();
    }
});
</script>
</body>
"""

success_count = 0
for filepath in html_files:
    # Skip main menus and non-game pages
    if os.path.basename(filepath) in ['index.html', 'old_index.html', 'culture_map.html', 'premium.html', 'login.html']:
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'antigravity-session-end' in content:
        continue
        
    # Replace the last closing body tag
    if '</body>' in content:
        content = content.replace('</body>', script_to_inject, 1) # Only replace the first match from the bottom if we were going backwards, but it's usually just one. Let's do right replace
        
        # A safer replace for just the last body tag
        parts = content.rsplit('</body>', 1)
        if len(parts) == 2:
            content = parts[0] + script_to_inject + parts[1]
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            success_count += 1

print(f"Successfully injected Antigravity cleanup listener into {success_count} HTML files.")
