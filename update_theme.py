import re

with open('src/css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Update Header
css = re.sub(
    r'JobPilot AI [^\n]* Design System',
    'JobPilot AI — Executive Obsidian Black & Radiant Gold / Warm Champagne Design System',
    css
)

# 2. Update :root variables
root_old_snippet = """:root {
  /* Core Obsidian Black Background Hierarchy */
  --bg-main: #030712;
  --bg-sidebar: #050b18;
  --bg-card: #081224;
  --bg-card-glass: rgba(8, 18, 36, 0.78);
  --bg-card-hover: rgba(12, 26, 52, 0.9);
  --bg-surface: #0c1830;
  --bg-input: #040916;
  --bg-input-focus: #071228;

  /* Radiant Sky Blue & Neon Cyan Accents */
  --sky-50: #f0f9ff;
  --sky-100: #e0f2fe;
  --sky-200: #bae6fd;
  --sky-300: #7dd3fc;
  --sky-400: #38bdf8;
  --sky-500: #0ea5e9;
  --sky-600: #0284c7;
  --sky-700: #0369a1;
  --sky-glow: rgba(56, 189, 248, 0.35);
  --sky-glow-lg: 0 0 35px rgba(56, 189, 248, 0.28);
  --sky-subtle: rgba(56, 189, 248, 0.08);

  /* Primary Gradients */
  --accent: var(--sky-400);
  --accent-light: var(--sky-300);
  --accent-dark: var(--sky-600);
  --grad-sky: linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #7dd3fc 100%);
  --grad-sky-subtle: linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(56, 189, 248, 0.08) 100%);
  --grad-card: linear-gradient(180deg, rgba(12, 24, 48, 0.85) 0%, rgba(6, 14, 28, 0.95) 100%);
  --grad-glow: radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.2) 0%, transparent 70%);

  /* Borders & Dividers */
  --border: rgba(56, 189, 248, 0.16);
  --border-strong: rgba(56, 189, 248, 0.38);
  --border-hover: rgba(56, 189, 248, 0.75);
  --border-soft: rgba(255, 255, 255, 0.08);

  /* High-Contrast Typography */
  --text-main: #ffffff;
  --text-body: #e2e8f0;
  --text-muted: #94a3b8;
  --text-faint: #64748b;

  /* Status Colors */
  --ok: #34d399;
  --ok-glow: rgba(52, 211, 153, 0.25);
  --warn: #fbbf24;
  --warn-glow: rgba(251, 191, 36, 0.25);
  --danger: #f87171;
  --danger-glow: rgba(248, 113, 113, 0.25);

  /* Geometry & Shadows */
  --shadow-sm: 0 4px 14px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.65), 0 0 1px rgba(56, 189, 248, 0.25);
  --shadow-lg: 0 20px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(56, 189, 248, 0.2);
  --radius-sm: 8px;
  --radius: 14px;
  --radius-lg: 20px;
  --sidebar-w: 264px;
}"""

root_new_snippet = """:root {
  /* Core Luxury Obsidian Black Background Hierarchy (#1A1A1A & Pure Deep Black) */
  --bg-main: #0c0d10;
  --bg-sidebar: #101115;
  --bg-card: #15161c;
  --bg-card-glass: rgba(21, 22, 28, 0.85);
  --bg-card-hover: rgba(28, 29, 36, 0.95);
  --bg-surface: #1a1b22;
  --bg-input: #0f1014;
  --bg-input-focus: #181920;

  /* Executive Warm Champagne & Radiant Gold Accents (#DAA520 / Deep Gold) */
  --gold-50: #fefce8;
  --gold-100: #fef3c7;
  --gold-200: #fde68a;
  --gold-300: #facc15;
  --gold-400: #daa520;
  --gold-500: #c69214;
  --gold-600: #a16207;
  --gold-700: #713f12;
  --gold-glow: rgba(218, 165, 32, 0.35);
  --gold-glow-lg: 0 0 35px rgba(218, 165, 32, 0.28);
  --gold-subtle: rgba(218, 165, 32, 0.08);

  /* Backward Compatibility Aliases */
  --sky-50: var(--gold-50);
  --sky-100: var(--gold-100);
  --sky-200: var(--gold-200);
  --sky-300: var(--gold-300);
  --sky-400: var(--gold-400);
  --sky-500: var(--gold-500);
  --sky-600: var(--gold-600);
  --sky-700: var(--gold-700);
  --sky-glow: var(--gold-glow);
  --sky-glow-lg: var(--gold-glow-lg);
  --sky-subtle: var(--gold-subtle);

  /* Primary Gradients */
  --accent: var(--gold-400);
  --accent-light: var(--gold-300);
  --accent-dark: var(--gold-600);
  --grad-gold: linear-gradient(135deg, #b8860b 0%, #daa520 45%, #ffd700 80%, #fef08a 100%);
  --grad-gold-subtle: linear-gradient(135deg, rgba(218, 165, 32, 0.22) 0%, rgba(218, 165, 32, 0.06) 100%);
  --grad-sky: var(--grad-gold);
  --grad-sky-subtle: var(--grad-gold-subtle);
  --grad-card: linear-gradient(180deg, rgba(26, 27, 34, 0.85) 0%, rgba(16, 17, 21, 0.95) 100%);
  --grad-glow: radial-gradient(circle at 50% 0%, rgba(218, 165, 32, 0.2) 0%, transparent 70%);

  /* Borders & Dividers */
  --border: rgba(218, 165, 32, 0.18);
  --border-strong: rgba(218, 165, 32, 0.42);
  --border-hover: rgba(218, 165, 32, 0.8);
  --border-soft: rgba(255, 255, 255, 0.08);

  /* High-Contrast Typography */
  --text-main: #ffffff;
  --text-body: #e5e5eb;
  --text-muted: #a3a3b0;
  --text-faint: #737382;

  /* Status Colors */
  --ok: #34d399;
  --ok-glow: rgba(52, 211, 153, 0.25);
  --warn: #fbbf24;
  --warn-glow: rgba(251, 191, 36, 0.25);
  --danger: #f87171;
  --danger-glow: rgba(248, 113, 113, 0.25);

  /* Geometry & Shadows */
  --shadow-sm: 0 4px 14px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.65), 0 0 1px rgba(218, 165, 32, 0.25);
  --shadow-lg: 0 20px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(218, 165, 32, 0.2);
  --radius-sm: 8px;
  --radius: 14px;
  --radius-lg: 20px;
  --sidebar-w: 264px;
}"""

if root_old_snippet in css:
    css = css.replace(root_old_snippet, root_new_snippet)
    print("Replaced :root snippet")
else:
    print("Warning: root_old_snippet not exact match, doing regex replacement")
    css = re.sub(r':root\s*\{[^}]*--sidebar-w:\s*264px;\s*\}', root_new_snippet, css, flags=re.DOTALL)

# 3. Replace rgba color functions
css = re.sub(r'rgba\(56,\s*189,\s*248,\s*([0-9.]+)\)', r'rgba(218, 165, 32, \1)', css)
css = re.sub(r'rgba\(2,\s*132,\s*199,\s*([0-9.]+)\)', r'rgba(184, 134, 11, \1)', css)
css = re.sub(r'rgba\(14,\s*165,\s*233,\s*([0-9.]+)\)', r'rgba(218, 165, 32, \1)', css)
css = re.sub(r'rgba\(8,\s*18,\s*36,\s*([0-9.]+)\)', r'rgba(21, 22, 28, \1)', css)
css = re.sub(r'rgba\(12,\s*26,\s*52,\s*([0-9.]+)\)', r'rgba(28, 29, 36, \1)', css)
css = re.sub(r'rgba\(12,\s*24,\s*48,\s*([0-9.]+)\)', r'rgba(26, 27, 34, \1)', css)
css = re.sub(r'rgba\(6,\s*14,\s*28,\s*([0-9.]+)\)', r'rgba(16, 17, 21, \1)', css)
css = re.sub(r'rgba\(3,\s*7,\s*18,\s*([0-9.]+)\)', r'rgba(12, 13, 16, \1)', css)

# 4. Replace bluish background and accent colors
hex_map = {
    '#030712': '#0c0d10',
    '#040916': '#0f1014',
    '#050b18': '#101116',
    '#060d1c': '#121318',
    '#060e1c': '#121318',
    '#060e1e': '#121318',
    '#070e1d': '#121318',
    '#071228': '#181920',
    '#081224': '#15161c',
    '#091428': '#16171e',
    '#0a162c': '#171820',
    '#0a162e': '#171820',
    '#0a172e': '#171820',
    '#0c1830': '#1a1b22',
    '#0c1a34': '#1a1b22',
    '#0d1933': '#1c1d26',
    '#0d1a34': '#1c1d26',
    '#0e1c38': '#1e1f2a',
    '#102242': '#22232f',
    '#132448': '#242533',
    '#14233e': '#242533',
    '#172642': '#282936',
    '#0284c7': '#c69214',
    '#38bdf8': '#daa520',
    '#7dd3fc': '#fde68a',
    '#0ea5e9': '#daa520',
    '#0369a1': '#a16207',
    '#bae6fd': '#fef3c7',
    '#e0f2fe': '#fefce8',
    '#f0f9ff': '#ffffff',
}

for old_h, new_h in hex_map.items():
    css = css.replace(old_h, new_h)

# 5. Append Gold classes
gold_extra = """
/* Gold Button & Element Variants */
.btn-gold {
  background: var(--grad-gold);
  color: #0c0d10 !important;
  font-weight: 750;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 16px rgba(218, 165, 32, 0.4);
}
.btn-gold:hover {
  box-shadow: 0 6px 24px rgba(218, 165, 32, 0.65);
  transform: translateY(-1px);
  color: #000000 !important;
}
.btn-gold-soft, .btn-sky-soft {
  background: rgba(218, 165, 32, 0.12);
  color: var(--gold-200);
  border: 1px solid rgba(218, 165, 32, 0.28);
}
.btn-gold-soft:hover, .btn-sky-soft:hover {
  background: rgba(218, 165, 32, 0.22);
  color: #ffffff;
  border-color: var(--gold-400);
  box-shadow: 0 0 16px rgba(218, 165, 32, 0.35);
}
"""

if '.btn-gold' not in css:
    css += gold_extra

with open('src/css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("styles.css successfully updated!")
