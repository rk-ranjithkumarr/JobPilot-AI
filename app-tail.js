/* ============================================================
   JobPilot AI — App tail: Job modal details, match analytics & init
   ============================================================ */
'use strict';

/* ---------- Job Details + AI Modal ---------- */
function openJobModal(job) {
  const saved = Store.isSaved(job.id);
  const tracked = Store.isTracked(job.id);
  const resumeText = Store.state.resume.content || '';
  const matchData = Jobs.matchScore(job, resumeText);

  const applyLink = job.url && job.url !== '#'
    ? `<a class="btn btn-sm btn-gold-soft" href="${escapeHtml(job.url)}" target="_blank" rel="noopener">${AppIcon('external', 13)} View Original Posting ↗</a>`
    : '';
  const applyBtn = job.url && job.url !== '#'
    ? `<a class="btn btn-primary" href="${escapeHtml(job.url)}" target="_blank" rel="noopener">${AppIcon('external', 14)} Apply on Site ↗</a>`
    : '';

  let matchVisual = '';
  if (matchData) {
    const fitLabel = matchData.score >= 70 ? 'Strong Candidate Alignment' : matchData.score >= 45 ? 'Moderate Match Fit' : 'Stretch Role Opportunity';
    const fitColor = matchData.score >= 70 ? 'var(--ok)' : matchData.score >= 45 ? 'var(--warn)' : 'var(--gold-400)';
    
    matchVisual = `
      <div class="score-big">
        <div class="score-donut" style="--p:${matchData.score}">
          <span>${matchData.score}%</span>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:750;font-size:15px;color:${fitColor}">Resume Match: ${fitLabel}</div>
          <div style="font-size:12.5px;color:var(--text-muted);margin-top:2px">Keyword alignment between your resume and this posting's requirements:</div>
          <div class="kw-list">
            ${matchData.matched.slice(0, 10).map(w => `<span class="chip ok" style="font-size:11px">${AppIcon('check', 11)} ${escapeHtml(w)}</span>`).join('')}
          </div>
        </div>
      </div>`;
  } else if (!resumeText) {
    matchVisual = `
      <div class="score-big" style="background:rgba(218,165,32,0.06);border-color:rgba(218,165,32,0.25)">
        <div style="font-size:24px;color:var(--gold-300)">${AppIcon('bulb', 26)}</div>
        <div>
          <div style="font-weight:750;color:var(--gold-300);font-size:14px">Resume profile not added yet</div>
          <div style="font-size:12.5px;color:var(--text-muted)"><a href="#/resume" onclick="closeModal()">Add your resume</a> to unlock instant AI match scoring and keyword gap analysis.</div>
        </div>
      </div>`;
  }

  openModal(`
    <div class="job-head" style="margin-bottom:14px">
      ${jobLogo(job)}
      <div style="flex:1;min-width:0">
        <h2>${escapeHtml(job.title)}</h2>
        <div class="modal-sub">${escapeHtml(job.company)} · ${AppIcon('pin', 12)} ${escapeHtml(job.location || 'Remote')} ${job.pubDate ? ' · ' + AppIcon('clock', 12) + ' ' + timeAgo(job.pubDate) : ''}</div>
      </div>
    </div>
    
    <div class="job-meta" style="margin-bottom:16px">
      ${sourceChip(job)}
      ${job.jobType ? `<span class="chip">${AppIcon('clock', 12)} ${escapeHtml(job.jobType)}</span>` : ''}
      ${job.salary ? `<span class="chip ok">${AppIcon('dollar', 12)} ${escapeHtml(job.salary)}</span>` : ''}
      ${(job.tags || []).slice(0, 10).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
    </div>

    ${matchVisual}

    <div style="display:flex;align-items:center;justify-content:space-between;margin:20px 0 10px">
      <h3 style="margin:0">Job Description</h3>
      ${applyLink}
    </div>
    <div class="job-desc">${job.description || '<p>No full description text available in this feed.</p>'}</div>

    <h3 style="margin-top:20px">AI Application Assistants</h3>
    <div class="job-actions" style="margin:0 0 12px">
      <button class="btn btn-gold-soft" data-ai="match">${AppIcon('target', 13)} Fit Assessment</button>
      <button class="btn btn-gold-soft" data-ai="coverLetter">${AppIcon('mail', 13)} Cover Letter</button>
      <button class="btn btn-gold-soft" data-ai="tailor">${AppIcon('target', 13)} Tailor Resume</button>
      <button class="btn btn-gold-soft" data-ai="interview">${AppIcon('mic', 13)} Interview Prep</button>
      <button class="btn btn-gold-soft" data-ai="coldEmail">${AppIcon('send', 13)} Outreach Email</button>
      <button class="btn btn-gold-soft" data-ai="plan">${AppIcon('compass', 13)} 90-Day Plan</button>
    </div>

    <div class="modal-actions">
      <button class="btn btn-gold-soft" id="jm-apply">${AppIcon('send', 14)} Apply for Job</button>
      <button class="btn btn-primary" id="jm-track">${AppIcon('pipeline', 14)} ${tracked ? 'In Pipeline' : 'Track Application'}</button>
      <button class="btn" id="jm-save">${AppIcon(saved ? 'starFilled' : 'star', 14)} ${saved ? 'Saved' : 'Save Job'}</button>
      ${job.url && job.url !== '#' ? `<a class="btn btn-primary" href="${escapeHtml(job.url)}" target="_blank" rel="noopener">${AppIcon('external', 14)} Apply on Site ↗</a>` : ''}
    </div>
  `, true);

  $('#jm-apply').addEventListener('click', function () {
    openApplyModal(job);
  });

  $('#jm-track').addEventListener('click', function (e) {
    trackFromUI(job);
    e.target.innerHTML = `${AppIcon('pipeline', 14)} In Pipeline`;
  });

  $('#jm-save').addEventListener('click', function (e) {
    toggleSave(job);
    const isNowSaved = Store.isSaved(job.id);
    e.target.innerHTML = `${AppIcon(isNowSaved ? 'starFilled' : 'star', 14)} ${isNowSaved ? 'Saved' : 'Save Job'}`;
  });

  $$('#modal [data-ai]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      runToolWithSpinner(btn.dataset.ai, job, btn);
    });
  });
}

/* ---------- Application Init & Subscriptions ---------- */
function updateAIChip() {
  const chip = $('#ai-status-chip');
  if (!chip) return;
  const llm = AI.mode() === 'llm';
  chip.classList.toggle('connected', llm);
  chip.querySelector('.ai-status-text').textContent = llm
    ? 'AI: ' + AI.providerInfo().name
    : 'Template Engine (Offline)';
}

function tickClock() {
  const el = $('#clock');
  if (el) {
    el.textContent = new Date().toLocaleString(undefined, {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }
}

function init() {
  initNavIcons();
  updateAIChip();
  refreshNavCounts();
  tickClock();
  setInterval(tickClock, 30000);

  // Check if daily jobs need syncing
  const lastSync = Store.state.lastDailyUpdate || 0;
  if (!lastSync || (Date.now() - lastSync > 18 * 3600000)) {
    Jobs.fetchAll('', '', true).then(list => {
      refreshNavCounts();
      if (currentRoute === 'search') renderSearchResults();
    }).catch(() => {});
  }

  $('#menu-btn').addEventListener('click', function () {
    $('#sidebar').classList.toggle('open');
  });

  $$('#nav a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      navigate(a.dataset.route);
    });
  });

  const initial = (location.hash || '').replace('#/', '') || 'dashboard';
  navigate(Routes[initial] ? initial : 'dashboard');
}

init();
