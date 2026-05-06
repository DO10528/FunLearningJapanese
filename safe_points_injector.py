import os
import glob
import re
import json

js_dir = '/Users/daisuke/Desktop/FunLearningJapanese/js'
js_files = glob.glob(os.path.join(js_dir, '*.js'))

report = []

for filepath in js_files:
    basename = os.path.basename(filepath)
    # Skip our core files and manually fixed files
    if basename in ['auth.js', 'common_ui.js', 'firebase-config.js', 'clock.js', 'kanji_quiz.js']:
        continue
        
    game_id = basename.replace('.js', '')
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'addPointsToUser' not in content:
        continue
        
    original_content = content
    
    # Safe Regex: match exactly what's between window.addPointsToUser( and the FIRST closing parenthesis )
    # Because our grep showed NO nested parentheses in the arguments.
    pattern = r'window\.addPointsToUser\s*\(([^)]+)\)'
    
    count_replacements = 0
    
    def safe_repl(m):
        global count_replacements
        count_replacements += 1
        
        args_str = m.group(1).strip()
        args = [arg.strip() for arg in args_str.split(',')]
        
        if len(args) == 2:
            question_id = args[1]
            return f"window.Antigravity.addPoint('{game_id}', {question_id})"
        else:
            # Only 1 argument (or more? but none have more than 2).
            # If 1 argument, there is no question ID provided. We can use a generic fallback.
            # E.g. Math.random() is fine for games with no tracking, or we could just use a static string.
            # But wait, Math.random() defeats the daily limit. Let's use `Date.now()` which limits it to 1 per millisecond, 
            # wait, if we want them to get 1 point per success, but they have no ID, 
            # we can just pass Date.now().
            return f"window.Antigravity.addPoint('{game_id}', Date.now().toString())"

    content, num_subs = re.subn(pattern, safe_repl, content)
    
    # Clean up existence checks safely
    content = content.replace("typeof window.addPointsToUser === 'function'", "window.Antigravity && window.Antigravity.addPoint")
    content = content.replace("typeof window.addPointsToUser !== 'function'", "!(window.Antigravity && window.Antigravity.addPoint)")
    content = content.replace("if(window.addPointsToUser)", "if(window.Antigravity && window.Antigravity.addPoint)")
    content = content.replace("if (window.addPointsToUser)", "if (window.Antigravity && window.Antigravity.addPoint)")
    
    # Also clean up assignments like: window.addPointsToUser = async () => { return false; };
    content = re.sub(r'window\.addPointsToUser\s*=\s*async\s*\(\)\s*=>\s*\{?\s*return false;?\s*\}?;?', '', content)
    content = re.sub(r'window\.addPointsToUser\s*=\s*async\s*\(\)\s*=>\s*false;?', '', content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        report.append({
            "file": basename,
            "replacements": num_subs
        })

report_path = '/Users/daisuke/Desktop/FunLearningJapanese/scan_report_safe.json'
with open(report_path, 'w') as f:
    json.dump(report, f, indent=4)

print(f"Safe native point injection completed. Modified {len(report)} files. Report saved to {report_path}")
