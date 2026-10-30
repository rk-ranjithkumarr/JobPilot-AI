/* ============================================================
   JobPilot AI — Core application logic: SVG Icons, router, modals, toasts
   ============================================================ */
'use strict';

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ---------- SVG Icon Vector System ---------- */
const SVG_DEFS = {
  logo: '<polygon points="12 2 19 21 12 17 5 21 12 2"/>',
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  starFilled: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>',
  pipeline: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2 5-2"/><path d="M12 9v5s3.03-.55 4.5-2c1.63-1.62 2-5 2-5"/>',
  resume: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
  studio: '<path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>',
  brain: '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  note: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"/><path d="M18 4H6v7a6 6 0 0 0 12 0V4z"/>',
  key: '<path d="m21 2-2 2m-1.5 1.5L14 9l-3-3 2.5-2.5a4.95 4.95 0 0 0-7 7L2 15v5h5l4.5-4.5a4.95 4.95 0 0 0 7-7Z"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  dollar: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  bot: '<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>',
  bulb: '<path d="M12 2a6 6 0 0 0-6 6c0 2.22 1.2 4.16 3 5.2V17a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3.8c1.8-1.04 3-2.98 3-5.2a6 6 0 0 0-6-6z"/><line x1="9" y1="21" x2="15" y2="21"/>'
};

function AppIcon(name, size = 16, className = '') {
  const content = SVG_DEFS[name] || SVG_DEFS.info;
  const extraClass = className ? ` ${className}` : '';
  return `<svg class="icon-svg${extraClass}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;
}

/* Populate Nav Icons on boot */
function initNavIcons() {
  $$('.nav-ico[data-icon]').forEach(el => {
    const iconName = el.dataset.icon;
    el.innerHTML = AppIcon(iconName, 18, 'nav-svg-icon');
  });
}

/* ---------- Toast Notifications ---------- */
function toast(msg, type = '') {
  const container = $('#toasts');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  
  let iconName = 'zap';
  if (type === 'ok') iconName = 'check';
  else if (type === 'warn') iconName = 'alert';
  else if (type === 'err') iconName = 'close';
  
  el.innerHTML = `
    <span class="toast-icon-wrap">${AppIcon(iconName, 16)}</span>
    <span class="toast-msg">${escapeHtml(msg)}</span>
  `;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 260);
  }, 3400);
}

/* ---------- Clipboard & Download Helpers ---------- */
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(
      () => toast('Copied to clipboard', 'ok'),
      () => fallbackCopy(text)
    );
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    toast('Copied to clipboard', 'ok');
  } catch (e) {
    toast('Copy failed', 'err');
  }
  ta.remove();
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

function downloadBackup() {
  downloadText('jobpilot-backup-' + new Date().toISOString().slice(0, 10) + '.json', Store.exportData());
}

/* ---------- Modal Management ---------- */
function openModal(html, wide) {
  $('#modal-body').innerHTML = html;
  $('#modal').classList.toggle('wide', !!wide);
  $('#modal-backdrop').hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $('#modal-backdrop').hidden = true;
  $('#modal-body').innerHTML = '';
  document.body.style.overflow = '';
}

$('#modal-close').addEventListener('click', closeModal);
$('#modal-backdrop').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---------- In-App Dialogs (Safe alternatives to window.prompt & window.confirm) ---------- */
function appPrompt(title, defaultValue = '', placeholder = '', onConfirm) {
  openModal(`
    <div style="padding:6px 0">
      <h3 style="margin-bottom:8px">${escapeHtml(title)}</h3>
      <textarea id="app-prompt-val" rows="3" placeholder="${escapeHtml(placeholder)}" style="width:100%;margin:12px 0;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);padding:10px;font-family:inherit;font-size:14px;box-sizing:border-box">${escapeHtml(defaultValue)}</textarea>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:14px">
        <button class="btn btn-ghost" id="app-prompt-cancel">Cancel</button>
        <button class="btn btn-primary" id="app-prompt-ok">${AppIcon('check', 13)} Save</button>
      </div>
    </div>
  `);
  setTimeout(() => { const el = $('#app-prompt-val'); if (el) { el.focus(); el.select(); } }, 50);
  $('#app-prompt-cancel').addEventListener('click', closeModal);
  $('#app-prompt-ok').addEventListener('click', () => {
    const val = $('#app-prompt-val').value.trim();
    closeModal();
    if (onConfirm) onConfirm(val);
  });
}

function appConfirm(title, message, confirmText = 'Confirm', isDanger = false, onConfirm) {
  openModal(`
    <div style="padding:6px 0">
      <h3 style="margin-bottom:8px">${escapeHtml(title)}</h3>
      <p style="color:var(--text-muted);font-size:14px;line-height:1.5">${escapeHtml(message)}</p>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
        <button class="btn btn-ghost" id="app-confirm-cancel">Cancel</button>
        <button class="btn ${isDanger ? 'btn-danger' : 'btn-primary'}" id="app-confirm-ok">${escapeHtml(confirmText)}</button>
      </div>
    </div>
  `);
  $('#app-confirm-cancel').addEventListener('click', closeModal);
  $('#app-confirm-ok').addEventListener('click', () => {
    closeModal();
    if (onConfirm) onConfirm();
  });
}

/* ---------- Create Custom Job Application Modal ---------- */
function openCreateJobModal(initial = {}) {
  openModal(`
    <div style="padding:6px 0">
      <div class="job-head" style="margin-bottom:14px">
        <div class="modal-ai-icon">${AppIcon('rocket', 22)}</div>
        <div style="flex:1;min-width:0">
          <h2>Create Job &amp; Track Application</h2>
          <div class="modal-sub">Add any job posting (LinkedIn, Indeed, referral, or company portal) to track and prepare with AI.</div>
        </div>
      </div>

      <div class="form-row">
        <label class="field"><span>Job Title *</span><input type="text" id="cj-title" value="${escapeHtml(initial.title || '')}" placeholder="e.g. Senior Software Engineer" required/></label>
        <label class="field"><span>Company Name *</span><input type="text" id="cj-company" value="${escapeHtml(initial.company || '')}" placeholder="e.g. Stripe, OpenAI, Acme Corp" required/></label>
      </div>

      <div class="form-row">
        <label class="field"><span>Location</span><input type="text" id="cj-location" value="${escapeHtml(initial.location || 'Remote')}" placeholder="e.g. Remote · US / Hybrid / London"/></label>
        <label class="field"><span>Job Type</span>
          <select id="cj-type">
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
          </select>
        </label>
      </div>

      <div class="form-row">
        <label class="field"><span>Salary / Compensation</span><input type="text" id="cj-salary" value="${escapeHtml(initial.salary || '')}" placeholder="e.g. $140k–$175k or €90k"/></label>
        <label class="field"><span>Job Posting URL / Apply Link</span><input type="url" id="cj-url" value="${escapeHtml(initial.url || '')}" placeholder="https://company.com/jobs/..."/></label>
      </div>

      <div class="form-row">
        <label class="field"><span>Initial Pipeline Stage</span>
          <select id="cj-status">
            <option value="wishlist">Wishlist (Planning to apply)</option>
            <option value="applied" selected>Applied (Submitted application)</option>
            <option value="interview">Interview (Screening / Technical round)</option>
            <option value="offer">Offer (Received offer)</option>
          </select>
        </label>
        <label class="field"><span>Tags / Skills (comma-separated)</span><input type="text" id="cj-tags" placeholder="e.g. react, python, aws, kubernetes"/></label>
      </div>

      <label class="field">
        <span>Job Description / Key Requirements</span>
        <textarea id="cj-desc" rows="5" placeholder="Paste the job description, qualifications, or requirements here so JobPilot AI can generate tailored cover letters and interview prep for this role..."></textarea>
      </label>

      <label class="field">
        <span>Personal Notes / Next Steps</span>
        <input type="text" id="cj-note" placeholder="e.g. Submitted via referral; follow up next week"/>
      </label>

      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" id="cj-save-btn">${AppIcon('check', 14)} Create &amp; Add to Pipeline</button>
      </div>
    </div>
  `, true);

  $('#cj-save-btn').addEventListener('click', () => {
    const title = $('#cj-title').value.trim();
    const company = $('#cj-company').value.trim();
    if (!title || !company) {
      toast('Please enter both Job Title and Company Name', 'warn');
      return;
    }
    const jobData = {
      title,
      company,
      location: $('#cj-location').value.trim() || 'Remote',
      jobType: $('#cj-type').value,
      salary: $('#cj-salary').value.trim(),
      url: $('#cj-url').value.trim() || '#',
      tags: $('#cj-tags').value,
      description: $('#cj-desc').value ? '<p>' + escapeHtml($('#cj-desc').value) + '</p>' : '',
      category: 'General'
    };
    const status = $('#cj-status').value;
    const note = $('#cj-note').value.trim();
    const newJob = Store.createCustomJob(jobData, status, note);
    closeModal();
    toast(`Added "${newJob.title}" at ${newJob.company} to Pipeline!`, 'ok');
    refreshNavCounts();
    navigate('tracker');
  });
}

/* ---------- Apply for Job Modal ---------- */
function openApplyModal(job) {
  const isTracked = Store.isTracked(job.id);
  const app = Store.state.applications.find(a => a.job.id === job.id);
  const isApplied = app && app.status === 'applied';

  openModal(`
    <div style="padding:6px 0">
      <div class="job-head" style="margin-bottom:14px">
        ${jobLogo(job)}
        <div style="flex:1;min-width:0">
          <h2>Apply for Position</h2>
          <div class="modal-sub">${escapeHtml(job.title)} · <b style="color:var(--text)">${escapeHtml(job.company)}</b> · ${escapeHtml(job.location || 'Remote')}</div>
        </div>
        ${sourceChip(job)}
      </div>

      <div class="card" style="background:rgba(218,165,32,0.06);border-color:rgba(218,165,32,0.3);margin-bottom:18px">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
          <div>
            <div style="font-weight:750;font-size:15px;color:var(--gold-300)">Application Status: ${isApplied ? 'Already Applied' : isTracked ? 'In Pipeline (' + statusMeta(app.status).label + ')' : 'Not Yet Tracked'}</div>
            <div style="font-size:12.5px;color:var(--text-muted);margin-top:2px">Use the AI tools below to prepare your materials and track application progress.</div>
          </div>
          <button class="btn ${isApplied ? 'btn-tracked-active' : 'btn-primary'}" id="apply-mark-btn">
            ${AppIcon('send', 14)} ${isApplied ? 'Marked as Applied' : 'Mark as Applied'}
          </button>
        </div>
      </div>

      <div style="margin-bottom:18px">
        <h4 style="margin-bottom:10px">1-Click AI Application Toolkit</h4>
        <div class="grid grid-3" style="gap:10px">
          <button class="btn btn-gold-soft" id="apply-tool-letter" style="padding:12px;display:flex;flex-direction:column;align-items:center;gap:6px;height:auto">
            ${AppIcon('mail', 20)}
            <span style="font-weight:700">Cover Letter</span>
            <span style="font-size:11px;color:var(--text-muted)">Generate tailored letter</span>
          </button>
          <button class="btn btn-gold-soft" id="apply-tool-tailor" style="padding:12px;display:flex;flex-direction:column;align-items:center;gap:6px;height:auto">
            ${AppIcon('target', 20)}
            <span style="font-weight:700">ATS Resume Check</span>
            <span style="font-size:11px;color:var(--text-muted)">Align bullet points</span>
          </button>
          <button class="btn btn-gold-soft" id="apply-tool-email" style="padding:12px;display:flex;flex-direction:column;align-items:center;gap:6px;height:auto">
            ${AppIcon('send', 20)}
            <span style="font-weight:700">Outreach Email</span>
            <span style="font-size:11px;color:var(--text-muted)">Contact hiring team</span>
          </button>
        </div>
      </div>

      ${job.url && job.url !== '#' ? `
        <div style="padding:14px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:16px">
          <div>
            <div style="font-weight:700;font-size:14px">Official Company Application Portal</div>
            <div style="font-size:12px;color:var(--text-muted);word-break:break-all">${escapeHtml(job.url)}</div>
          </div>
          <a class="btn btn-primary" href="${escapeHtml(job.url)}" target="_blank" rel="noopener" id="apply-open-link">
            ${AppIcon('external', 14)} Open Official Application ↗
          </a>
        </div>
      ` : `
        <div style="padding:14px;background:var(--bg-glass);border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:16px">
          <div style="font-weight:700;font-size:14px;color:var(--gold-300)">Direct or Custom Application</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Use the generated cover letter and outreach email above to submit your application directly via email or your referral channel.</div>
        </div>
      `}

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px">
        <button class="btn btn-ghost" onclick="closeModal()">Close</button>
        <button class="btn" id="apply-view-details">${AppIcon('studio', 13)} View Full Details</button>
      </div>
    </div>
  `, true);

  $('#apply-mark-btn').addEventListener('click', e => {
    Store.markApplied(job, 'Applied on ' + new Date().toLocaleDateString());
    toast(`Application marked as Applied in Pipeline!`, 'ok');
    e.target.innerHTML = `${AppIcon('check', 14)} Marked as Applied`;
    e.target.classList.add('btn-tracked-active');
    refreshNavCounts();
  });

  $('#apply-tool-letter').addEventListener('click', () => runToolWithSpinner('coverLetter', job, $('#apply-tool-letter')));
  $('#apply-tool-tailor').addEventListener('click', () => runToolWithSpinner('tailor', job, $('#apply-tool-tailor')));
  $('#apply-tool-email').addEventListener('click', () => runToolWithSpinner('coldEmail', job, $('#apply-tool-email')));
  $('#apply-view-details').addEventListener('click', () => openJobModal(job));
}

/* ---------- Router ---------- */
const Routes = {};
let currentRoute = '';
const TITLES = {
  dashboard: 'Executive Dashboard',
  search: 'Live Job Search',
  saved: 'Shortlisted Jobs',
  tracker: 'Application Pipeline',
  resume: 'Resume & Profile',
  studio: 'AI Career Studio',
  settings: 'System & AI Settings'
};

function navigate(route) {
  if (!Routes[route]) route = 'dashboard';
  currentRoute = route;
  if (location.hash !== '#/' + route) location.hash = '#/' + route;
  $('#view-title').textContent = TITLES[route] || 'JobPilot AI';
  $$('#nav a').forEach(a => a.classList.toggle('active', a.dataset.route === route));
  Routes[route]();
  $('#sidebar').classList.remove('open');
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', () => {
  const route = (location.hash || '').replace('#/', '') || 'dashboard';
  if (route !== currentRoute) navigate(route);
});

/* ---------- Search State ---------- */
const SearchState = { jobs: [], filtered: [], loading: false, loaded: false };

/* ---------- Shared Render Helpers ---------- */
const STATUS_KEYS = ['wishlist', 'applied', 'interview', 'offer', 'rejected'];

function statusMeta(s) {
  return {
    wishlist:  { label: 'Wishlist',   icon: 'bulb',    color: '#38bdf8' },
    applied:   { label: 'Applied',    icon: 'send',    color: '#0ea5e9' },
    interview: { label: 'Interview',  icon: 'mic',     color: '#fbbf24' },
    offer:     { label: 'Offer',      icon: 'trophy',  color: '#34d399' },
    rejected:  { label: 'Archived',   icon: 'close',   color: '#f87171' }
  }[s] || { label: s, icon: 'target', color: '#94a3b8' };
}

function sourceChip(job) {
  const isLive = job.source === 'remotive' || job.source === 'arbeitnow';
  const label = job.source === 'remotive' ? 'Remotive Feed' : job.source === 'arbeitnow' ? 'Arbeitnow Feed' : job.source === 'custom' ? 'Custom Job' : 'Verified Feed';
  const icon = isLive ? 'globe' : job.source === 'custom' ? 'rocket' : 'database';
  return `<span class="chip ${isLive ? 'info' : ''}">${AppIcon(icon, 13)} ${label}</span>`;
}

function scoreChip(job) {
  const ms = Jobs.matchScore(job, Store.state.resume.content);
  if (!ms) return '';
  const cls = ms.score >= 70 ? 'score-good' : ms.score >= 45 ? 'score-mid' : '';
  return `<span class="score-badge-card ${cls}">${AppIcon('zap', 12)} ${ms.score}% Match</span>`;
}

function jobLogo(job) {
  if (job.logo) {
    const fallback = escapeHtml(initials(job.company)).replace(/'/g, '');
    return `<div class="job-logo"><img src="${escapeHtml(job.logo)}" alt="" loading="lazy" onerror="this.parentElement.textContent='${fallback}'"></div>`;
  }
  return `<div class="job-logo">${escapeHtml(initials(job.company))}</div>`;
}

function jobCardHTML(job, ctx) {
  const saved = Store.isSaved(job.id);
  const tracked = Store.isTracked(job.id);
  const isNew = Jobs.isNew(job);
  return `
  <div class="job-card" data-job="${escapeHtml(job.id)}" data-ctx="${ctx}">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      ${isNew ? `<span class="chip ok" style="font-weight:700;font-size:11px">${AppIcon('zap', 11)} NEW TODAY</span>` : '<span></span>'}
      ${scoreChip(job)}
    </div>
    <div class="job-head">
      ${jobLogo(job)}
      <div style="min-width:0;padding-right:10px">
        <div class="job-title" title="${escapeHtml(job.title)}">${escapeHtml(job.title)}</div>
        <div class="job-company">${escapeHtml(job.company)}</div>
      </div>
    </div>
    <div class="job-meta">
      ${sourceChip(job)}
      <span class="chip">${AppIcon('pin', 12)} ${escapeHtml((job.location || 'Remote').slice(0, 26))}</span>
      ${job.jobType ? `<span class="chip">${AppIcon('clock', 12)} ${escapeHtml(job.jobType)}</span>` : ''}
      ${job.salary ? `<span class="chip ok">${AppIcon('dollar', 12)} ${escapeHtml(job.salary).slice(0, 24)}</span>` : ''}
    </div>
    ${(job.tags && job.tags.length) ? `<div class="job-tags">${job.tags.slice(0, 4).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
    <div class="job-actions">
      <button class="btn btn-sm btn-gold-soft" data-act="apply">${AppIcon('send', 13)} Apply</button>
      <button class="btn btn-sm btn-primary" data-act="open">${AppIcon('studio', 13)} Details &amp; AI</button>
      <button class="btn btn-sm ${saved ? 'btn-saved-active' : ''}" data-act="save">${AppIcon(saved ? 'starFilled' : 'star', 13)} ${saved ? 'Saved' : 'Save'}</button>
      <button class="btn btn-sm ${tracked ? 'btn-tracked-active' : ''}" data-act="track">${AppIcon('pipeline', 13)} ${tracked ? 'In Pipeline' : 'Track'}</button>
      <span class="job-date">${timeAgo(job.pubDate)}</span>
    </div>
  </div>`;
}

function bindJobCards(container) {
  container.querySelectorAll('.job-card').forEach(card => {
    const jobId = card.dataset.job;
    const job = findJobAnywhere(jobId);
    if (!job) return;
    card.addEventListener('click', e => {
      const act = e.target.closest('[data-act]');
      if (act) {
        e.stopPropagation();
        const a = act.dataset.act;
        if (a === 'apply') openApplyModal(job);
        if (a === 'open') openJobModal(job);
        if (a === 'save') toggleSave(job);
        if (a === 'track') trackFromUI(job);
        return;
      }
      openJobModal(job);
    });
  });
}

function findJobAnywhere(id) {
  return SearchState.jobs.find(j => j.id === id) ||
         Store.state.savedJobs.find(j => j.id === id) ||
         (Store.state.applications.find(a => a.job.id === id) || {}).job || null;
}

function toggleSave(job) {
  if (Store.isSaved(job.id)) {
    Store.update(() => Store.unsaveJob(job.id));
    toast('Removed from saved jobs', '');
  } else {
    Store.update(() => Store.saveJob(job));
    toast('Job saved to shortlists', 'ok');
  }
  refreshNavCounts();
  if (currentRoute === 'search') renderSearchResults();
  if (currentRoute === 'saved') Routes.saved();
}

function trackFromUI(job) {
  if (Store.isTracked(job.id)) {
    toast('Already in your pipeline — see Application Pipeline', 'warn');
    return;
  }
  Store.update(() => Store.trackJob(job));
  toast('Added to Application Pipeline', 'ok');
  refreshNavCounts();
  if (currentRoute === 'search') renderSearchResults();
  if (currentRoute === 'saved') Routes.saved();
}

function refreshNavCounts() {
  const savedCountEl = $('#nav-saved-count');
  const appCountEl = $('#nav-app-count');
  if (savedCountEl) savedCountEl.textContent = Store.state.savedJobs.length;
  if (appCountEl) {
    const active = Store.state.applications.filter(a => a.status !== 'rejected').length;
    appCountEl.textContent = active;
  }
}

/* ---------- AI Output Modal ---------- */
let lastOutput = '';
let lastJobContext = null;

function showOutput(title, textContent, engineNote, jobContext) {
  lastOutput = textContent;
  lastJobContext = jobContext;
  const toolName = (AI.TOOLS[title] && AI.TOOLS[title].name) || title;
  const icon = (AI.TOOLS[title] && AI.TOOLS[title].icon) || 'studio';
  const engineLabel = String(engineNote || '').includes('llm') ? 'Live LLM Engine' : 'Deterministic Template';
  const engineCls = String(engineNote || '').includes('llm') ? 'ok' : 'info';

  openModal(`
    <div class="job-head" style="margin-bottom:14px">
      <div class="modal-ai-icon">${AppIcon(icon, 24)}</div>
      <div style="flex:1;min-width:0">
        <h2>${escapeHtml(toolName)}</h2>
        <div class="modal-sub">${jobContext ? escapeHtml(jobContext.title) + ' · ' + escapeHtml(jobContext.company) : 'Career Intelligence Output'}</div>
      </div>
      <span class="chip ${engineCls}">${AppIcon('bot', 13)} ${engineLabel}</span>
    </div>

    <div class="output-head">
      <button class="btn btn-sm btn-primary" id="out-copy">${AppIcon('copy', 13)} Copy Markdown</button>
      <button class="btn btn-sm" id="out-download">${AppIcon('download', 13)} Export File</button>
      ${jobContext ? `<button class="btn btn-sm btn-gold-soft" id="out-track">${AppIcon('pipeline', 13)} Track Job</button>` : ''}
    </div>

    <div class="ai-output" id="out-content">${mdLite(textContent)}</div>

    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Close</button>
    </div>
  `, true);

  $('#out-copy').addEventListener('click', () => copyText(lastOutput));
  $('#out-download').addEventListener('click', () => {
    const fn = (toolName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'output') + '-' + Date.now() + '.txt';
    downloadText(fn, lastOutput);
  });
  if (jobContext && $('#out-track')) {
    $('#out-track').addEventListener('click', () => {
      trackFromUI(jobContext);
    });
  }
}

async function runToolWithSpinner(toolKey, job, btnEl) {
  const origText = btnEl ? btnEl.innerHTML : '';
  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = `<span class="spinner-inline"></span> Processing…`;
  }
  try {
    const res = await AI.generate(toolKey, job);
    showOutput(toolKey, res.text, res.engine, job);
  } catch (err) {
    toast('Generation error: ' + err.message, 'err');
  } finally {
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.innerHTML = origText;
    }
  }
}

/* Light Markdown Formatter */
function mdLite(md) {
  if (!md) return '<p>No content generated.</p>';
  let h = escapeHtml(md);
  
  // Headings
  h = h.replace(/^### (.*$)/gim, '<h4>$1</h4>');
  h = h.replace(/^## (.*$)/gim, '<h4>$1</h4>');
  h = h.replace(/^# (.*$)/gim, '<h4>$1</h4>');
  
  // Bold and Italic
  h = h.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Bullets
  h = h.replace(/^\s*[-•]\s+(.*$)/gim, '<li>$1</li>');
  h = h.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
  // Clean duplicate <ul> wraps
  h = h.replace(/<\/ul>\s*<ul>/g, '');
  
  // Paragraphs
  h = h.split(/\n\n+/).map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h4>') || p.startsWith('<ul>') || p.startsWith('<li>')) return p;
    return '<p>' + p.replace(/\n/g, '<br/>') + '</p>';
  }).join('');
  
  return h;
}
