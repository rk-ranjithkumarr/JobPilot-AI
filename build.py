#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SHELL_HTML = ROOT / "src" / "index-shell.html"
CSS_FILE = ROOT / "src" / "css" / "styles.css"
JS_DIR = ROOT / "src" / "js"
OUT_FILE = ROOT / "index.html"

with open(SHELL_HTML, "r", encoding="utf-8") as f:
    shell_content = f.read()

with open(CSS_FILE, "r", encoding="utf-8") as f:
    css_content = f.read()

# Replace css link
shell_content = re.sub(
    r'<link rel="stylesheet" href="css/styles\.css"\s*/?>',
    f'<style>\n{css_content}\n</style>',
    shell_content
)

# Replace script tags
def replace_script(match):
    src = match.group(1) # e.g. "js/store.js"
    filename = Path(src).name
    js_path = JS_DIR / filename
    if js_path.exists():
        with open(js_path, "r", encoding="utf-8") as jf:
            js_code = jf.read()
        return f'<script>\n{js_code}\n</script>'
    return match.group(0)

shell_content = re.sub(
    r'<script src="(js/[a-zA-Z0-9_.-]+\.js)"></script>',
    replace_script,
    shell_content
)

with open(OUT_FILE, "w", encoding="utf-8") as f:
    f.write(shell_content)

print(f"Successfully built {OUT_FILE} ({len(shell_content)} bytes)")
