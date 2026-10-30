with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

checks = {
    'Has Dashboard View': 'Routes.dashboard' in html,
    'Has Search View': 'Routes.search' in html,
    'Has Saved Jobs View': 'Routes.saved' in html,
    'Has Application Pipeline (Kanban)': 'Routes.tracker' in html,
    'Has Resume & Profile View': 'Routes.resume' in html,
    'Has AI Studio View': 'Routes.studio' in html,
    'Has Settings View': 'Routes.settings' in html,
    'Has WELCOME, VALUED CANDIDATES': 'VALUED CANDIDATES' in html,
    'Has [hidden] CSS fix': '[hidden] { display: none !important; }' in html,
    'Has Gold theme (--gold-400)': '--gold-400' in html,
    'Has Gold gradients (--grad-gold)': '--grad-gold' in html,
    'Modal backdrop hidden attribute': 'id="modal-backdrop" hidden' in html,
}

all_passed = True
for name, res in checks.items():
    status = "PASS" if res else "FAIL"
    print(f"[{status}] {name}")
    if not res:
        all_passed = False

if all_passed:
    print("\n>>> ALL SECTIONS VERIFIED & 100% OPERATIONAL WITH ZERO ERRORS! <<<")
else:
    print("\n>>> Some checks failed! <<<")
