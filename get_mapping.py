import re

html_content = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'const gameStructure = (\[.*?\]);', html_content, re.DOTALL)
if match:
    # Need to make it parseable JSON or just eval it in node.
    js_code = "const gameStructure = " + match.group(1) + ";\n" + """
    const mapping = {};
    gameStructure.forEach(cat => {
        cat.games.forEach(game => {
            mapping[game.url] = cat.id;
        });
    });
    console.log(JSON.stringify(mapping, null, 2));
    """
    with open('extract.js', 'w', encoding='utf-8') as f:
        f.write(js_code)
