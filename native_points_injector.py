import os
import glob
import re
import json

js_dir = '/Users/daisuke/Desktop/FunLearningJapanese/js'
js_files = glob.glob(os.path.join(js_dir, '*.js'))

report = []

for filepath in js_files:
    basename = os.path.basename(filepath)
    if basename in ['auth.js', 'common_ui.js', 'firebase-config.js']:
        continue
        
    game_id = basename.replace('.js', '')
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'addPointsToUser' not in content:
        continue
        
    original_content = content
    
    # 1. Replace window.addPointsToUser(POINTS_PER_QUESTION, question_var)
    pattern_2args = r'window\.addPointsToUser\s*\([^,]+,\s*([^)]+)\)'
    def repl_2args(m):
        question_id = m.group(1).strip()
        return f"window.Antigravity.addPoint('{game_id}', {question_id})"
    content, count_2args = re.subn(pattern_2args, repl_2args, content)
    
    # 2. Replace window.addPointsToUser(1) or window.addPointsToUser(POINTS_PER_LEVEL)
    pattern_1arg = r'window\.addPointsToUser\s*\(([^,]+)\)'
    def repl_1arg(m):
        return f"window.Antigravity.addPoint('{game_id}', 'auto_' + Math.random().toString(36).substring(7))"
    content, count_1arg = re.subn(pattern_1arg, repl_1arg, content)
    
    # Clean up existence checks
    content = content.replace("typeof window.addPointsToUser === 'function'", "window.Antigravity && window.Antigravity.addPoint")
    content = content.replace("typeof window.addPointsToUser !== 'function'", "!(window.Antigravity && window.Antigravity.addPoint)")
    content = content.replace("if (window.addPointsToUser)", "if (window.Antigravity && window.Antigravity.addPoint)")
    content = content.replace("if(window.addPointsToUser)", "if(window.Antigravity && window.Antigravity.addPoint)")
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        report.append({
            "file": basename,
            "replacements_with_id": count_2args,
            "replacements_without_id": count_1arg
        })

report_path = '/Users/daisuke/Desktop/FunLearningJapanese/scan_report.json'
with open(report_path, 'w') as f:
    json.dump(report, f, indent=4)

print(f"Native point injection completed. Modified {len(report)} files. Report saved to {report_path}")
