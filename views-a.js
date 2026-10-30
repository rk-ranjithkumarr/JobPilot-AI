/* ============================================================
   JobPilot AI — Views A: Dashboard, Job Search, Saved Jobs
   ============================================================ */
'use strict';

/* ---------- Dashboard ---------- */
Routes.dashboard = function () {
  const s = Store.state;
  const apps = s.applications;
  const counts = {};
  STATUS_KEYS.forEach(k => counts[k] = apps.filter(a => a.status === k).length);
  const max = Math.max(1, ...STATUS_KEYS.map(k => counts[k]));
  const active = apps.filter(a => a.status !== 'rejected').length;
  const conv = apps.length ? Math.round(((counts.interview + counts.offer) / apps.length) * 100) : 0;
  const aiMode = AI.mode();

  $('#view').innerHTML = `
    <div class="hero">
      <div class="hero-badge">
        <span class="hero-dot"></span>
        <span>AI Career Command Center</span>
      </div>
      <h2>WELCOME, ${escapeHtml(s.resume.name ? s.resume.name.toUpperCase() : 'VALUED CANDIDATES')}</h2>
      <p>Your executive AI copilot for modern job search: live feed aggregation, real-time resume compatibility scoring, automated cover letters, interview coaching, and Kanban pipeline tracking.</p>
      <div class="hero-actions">
        <button class="btn btn-primary" data-go="search">${AppIcon('search', 15)} Search Live Postings</button>
        <button class="btn btn-gold-soft" id="dash-create-btn">${AppIcon('rocket', 15)} + Create Job Application</button>
        <button class="btn" id="dash-refresh-jobs">${AppIcon('refresh', 15)} Daily Update Jobs</button>
        <button class="btn" data-go="studio">${AppIcon('studio', 15)} AI Career Studio</button>
        <button class="btn" data-go="resume">${AppIcon('resume', 15)} ${s.resume.content ? 'Review Resume' : '+ Add Resume'}</button>
      </div>
    </div>

    <div class="grid grid-4">
      <div class="card stat-card" data-go="saved" role="button" tabindex="0">
        <div class="stat-icon-wrap">${AppIcon('star', 22)}</div>
        <div class="stat-num">${s.savedJobs.length}</div>
        <div class="stat-label">Shortlisted Jobs</div>
      </div>
      <div class="card stat-card" data-go="tracker" role="button" tabindex="0">
        <div class="stat-icon-wrap">${AppIcon('pipeline', 22)}</div>
        <div class="stat-num">${active}</div>
        <div class="stat-label">Active Applications</div>
      </div>
      <div class="card stat-card" data-go="tracker" role="button" tabindex="0">
        <div class="stat-icon-wrap">${AppIcon('mic', 22)}</div>
        <div class="stat-num">${counts.interview}</div>
        <div class="stat-label">Interview Rounds</div>
      </div>
      <div class="card stat-card" data-go="tracker" role="button" tabindex="0">
        <div class="stat-icon-wrap">${AppIcon('trophy', 22)}</div>
        <div class="stat-num">${counts.offer}</div>
        <div class="stat-label">Offers Received</div>
      </div>
    </div>

    <div class="grid grid-2" style="margin-top:20px">
      <div class="card">
        <div class="card-head-row">
          <div>
            <h3>Application Funnel</h3>
            <p class="sub">Conversion Rate: <b style="color:var(--gold-300)">${conv}%</b> advance to interview or offer</p>
          </div>
          <span class="chip info">${apps.length} Total</span>
        </div>
        ${STATUS_KEYS.map(k => {
          const meta = statusMeta(k);
          const pct = Math.round((counts[k] / max) * 100);
          return `
          <div class="funnel-row">
            <div class="funnel-label">${AppIcon(meta.icon, 14)} <span>${meta.label}</span></div>
            <div class="funnel-track"><div class="funnel-fill" style="width:${pct}%"></div></div>
            <div class="funnel-num">${counts[k]}</div>
          </div>`;
        }).join('')}
      </div>

      <div class="card">
        <div class="card-head-row">
          <div>
            <h3>Recent System Activity</h3>
            <p class="sub">Audited career actions and AI executions</p>
          </div>
        </div>
        <div class="activity-list">
          ${s.activity.length ? s.activity.slice(0, 12).map(a => `
            <div class="activity-item">
              <span class="act-icon-box">${AppIcon(a.icon || 'zap', 14)}</span>
              <span class="act-text">${escapeHtml(a.text)}</span>
              <span class="when">${timeAgo(a.at)}</span>
            </div>`).join('')
          : `<div class="empty" style="padding:28px">
              <div class="empty-icon-box">${AppIcon('bulb', 28)}</div>
              <div class="empty-title">No activity recorded yet</div>
              <div class="empty-desc">Search, create, or shortlist positions to build your pipeline.</div>
            </div>`}
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:20px">
      <div class="card-head-row">
        <div>
          <h3>AI Intelligence Engine</h3>
          <p class="sub">${aiMode === 'llm'
            ? `Connected to <b style="color:var(--gold-300)">${escapeHtml(AI.providerInfo().name)}</b> — Live generative AI models active.`
            : 'Running in <b>Deterministic Template Engine</b> — works 100% offline. Connect an API key in Settings for live LLMs.'}</p>
        </div>
        <span class="chip ${aiMode === 'llm' ? 'ok' : 'warn'}">${AppIcon(aiMode === 'llm' ? 'zap' : 'bot', 13)} ${aiMode === 'llm' ? 'LLM Connected' : 'Offline Mode'}</span>
      </div>

      <div class="tool-grid">
        <button class="tool-card" data-go="settings">
          <div class="tool-icon-wrap">${AppIcon('key', 22)}</div>
          <div class="tool-name">Configure AI Keys</div>
          <div class="tool-desc">OpenAI, Groq (Free Tier), OpenRouter, or Local Ollama</div>
        </button>
        <button class="tool-card" data-go="search">
          <div class="tool-icon-wrap">${AppIcon('target', 22)}</div>
          <div class="tool-name">Smart Match Search</div>
          <div class="tool-desc">Live jobs scored against your resume keywords</div>
        </button>
        <button class="tool-card" data-go="tracker">
          <div class="tool-icon-wrap">${AppIcon('pipeline', 22)}</div>
          <div class="tool-name">Pipeline Board</div>
          <div class="tool-desc">Drag or status-switch cards as you progress</div>
        </button>
      </div>
    </div>`;

  const createBtn = $('#dash-create-btn');
  if (createBtn) createBtn.addEventListener('click', () => openCreateJobModal());
  
  const refreshBtn = $('#dash-refresh-jobs');
  if (refreshBtn) refreshBtn.addEventListener('click', async e => {
    e.target.disabled = true;
    e.target.innerHTML = `<span class="spinner-inline"></span> Syncing…`;
    await Jobs.fetchAll('', '', true);
    toast('Daily jobs refreshed successfully!', 'ok');
    e.target.disabled = false;
    e.target.innerHTML = `${AppIcon('refresh', 15)} Daily Update Jobs`;
    Routes.dashboard();
  });

  $$('#view [data-go]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.go)));
};

function greeting() {
  const h = new Date().getHours();
  return h < 5 ? 'Night Owl Hustle' : h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
}

/* ---------- Job Search ---------- */
const SearchUI = { q: '', category: '', remoteOnly: false, onlyNew: false };

function resetFilters() {
  SearchUI.q = '';
  SearchUI.category = '';
  SearchUI.remoteOnly = false;
  SearchUI.onlyNew = false;
  const sq = $('#sq'); if (sq) sq.value = '';
  const scat = $('#scat'); if (scat) scat.value = '';
  const srem = $('#sremote'); if (srem) srem.checked = false;
  const snew = $('#snew'); if (snew) snew.checked = false;
  doSearch();
}

Routes.search = function () {
  const lastSyncStr = Store.state.lastDailyUpdate ? timeAgo(Store.state.lastDailyUpdate) : 'recently';

  $('#view').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" id="s-create-btn">${AppIcon('rocket', 14)} + Create Job Application</button>
        <button class="btn btn-gold-soft" id="s-daily-sync">${AppIcon('refresh', 14)} Daily Update (Fetch New Jobs)</button>
      </div>
      <div style="font-size:12.5px;color:var(--text-muted)">
        ${AppIcon('clock', 12)} Daily Feed Updated: <b style="color:var(--gold-300)">${lastSyncStr}</b>
      </div>
    </div>

    <div class="search-bar">
      <div class="search-input-wrap">
        <span class="search-icon">${AppIcon('search', 16)}</span>
        <input type="text" id="sq" placeholder="Search title, skills, or companies… (e.g. React, Python, Remote, Staff)" value="${escapeHtml(SearchUI.q)}" />
      </div>
      <select id="scat" aria-label="Job Category Filter"><option value="">All Categories</option></select>
      <label class="checkbox-row"><input type="checkbox" id="sremote" ${SearchUI.remoteOnly ? 'checked' : ''}/> Remote Only</label>
      <label class="checkbox-row"><input type="checkbox" id="snew" ${SearchUI.onlyNew ? 'checked' : ''}/> New Today Only</label>
      <button class="btn btn-primary" id="sbtn">${AppIcon('search', 14)} Search</button>
      <button class="btn" id="sreset" title="Clear cache & refetch live data">${AppIcon('refresh', 14)} Refetch Feed</button>
    </div>
    
    <div class="quick-filter-chips">
      <span class="quick-filter-label">Quick Filters:</span>
      <button class="q-chip ${SearchUI.onlyNew ? 'active' : ''}" data-act="new">🔥 New Today (24h)</button>
      <button class="q-chip ${SearchUI.q === 'React' ? 'active' : ''}" data-q="React">React</button>
      <button class="q-chip ${SearchUI.q === 'TypeScript' ? 'active' : ''}" data-q="TypeScript">TypeScript</button>
      <button class="q-chip ${SearchUI.q === 'Python' ? 'active' : ''}" data-q="Python">Python</button>
      <button class="q-chip ${SearchUI.q === 'Frontend' ? 'active' : ''}" data-q="Frontend">Frontend</button>
      <button class="q-chip ${SearchUI.q === 'Backend' ? 'active' : ''}" data-q="Backend">Backend</button>
      <button class="q-chip ${SearchUI.q === 'DevOps' ? 'active' : ''}" data-q="DevOps">DevOps</button>
      <button class="q-chip ${SearchUI.q === 'AI' ? 'active' : ''}" data-q="AI">AI / LLM</button>
      <button class="q-chip ${SearchUI.q === 'Full Stack' ? 'active' : ''}" data-q="Full Stack">Full Stack</button>
      <button class="q-chip" data-act="reset">Reset All</button>
    </div>

    <div id="search-meta" class="search-meta-bar"></div>
    <div id="search-results"></div>`;

  const q = $('#sq');
  const cat = $('#scat');

  $('#s-create-btn').addEventListener('click', () => openCreateJobModal());
  $('#s-daily-sync').addEventListener('click', async () => {
    Jobs.clearCache();
    await doSearch(true);
    toast('Daily jobs refreshed from live sources!', 'ok');
  });

  q.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  $('#sbtn').addEventListener('click', () => doSearch());
  $('#sreset').addEventListener('click', () => { Jobs.clearCache(); doSearch(true); });
  $('#sremote').addEventListener('change', e => { SearchUI.remoteOnly = e.target.checked; renderSearchResults(); });
  $('#snew').addEventListener('change', e => { SearchUI.onlyNew = e.target.checked; renderSearchResults(); });
  cat.addEventListener('change', e => { SearchUI.category = e.target.value; renderSearchResults(); });
  
  let deb;
  q.addEventListener('input', () => {
    SearchUI.q = q.value;
    clearTimeout(deb);
    deb = setTimeout(renderSearchResults, 220);
  });

  $$('.q-chip').forEach(btn => btn.addEventListener('click', () => {
    if (btn.dataset.act === 'reset') {
      resetFilters();
      return;
    }
    if (btn.dataset.act === 'new') {
      SearchUI.onlyNew = !SearchUI.onlyNew;
      const chk = $('#snew'); if (chk) chk.checked = SearchUI.onlyNew;
      renderSearchResults();
      return;
    }
    SearchUI.q = btn.dataset.q || '';
    $('#sq').value = SearchUI.q;
    doSearch();
  }));

  if (!SearchState.loaded) doSearch();
  else {
    fillCategories();
    renderSearchResults();
  }
};

function fillCategories() {
  const sel = $('#scat');
  if (!sel) return;
  const cats = Jobs.categoriesFrom(SearchState.jobs);
  sel.innerHTML = '<option value="">All Categories</option>' +
    cats.map(c => `<option value="${escapeHtml(c)}" ${c === SearchUI.category ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('');
}

async function doSearch(force = false) {
  const resultsBox = $('#search-results');
  const metaBox = $('#search-meta');
  if (!resultsBox) return;

  resultsBox.innerHTML = '<div class="jobs-grid">' + Array(6).fill('<div class="skeleton"></div>').join('') + '</div>';
  metaBox.innerHTML = `<span class="chip info">${AppIcon('refresh', 13, 'icon-spin')} Fetching live job feeds from Remotive &amp; Arbeitnow…</span>`;

  try {
    SearchState.jobs = await Jobs.fetchAll($('#sq').value.trim(), SearchUI.category, force);
    SearchState.loaded = true;
  } catch (err) {
    SearchState.jobs = [];
    toast('Search query failed: ' + err.message, 'err');
  }

  fillCategories();
  renderSearchResults();
}

function renderSearchResults() {
  const box = $('#search-results');
  if (!box) return;
  const filtered = Jobs.filter(SearchState.jobs, {
    q: SearchUI.q,
    category: SearchUI.category,
    remoteOnly: SearchUI.remoteOnly,
    onlyNew: SearchUI.onlyNew
  });
  const live = Store.state.settings._sourceUsed === 'live';
  
  $('#search-meta').innerHTML = `
    <span>Showing <b style="color:#fff">${filtered.length}</b> verified opportunities</span>
    <span>·</span>
    <span class="chip ${live ? 'info' : ''}">${AppIcon('globe', 12)} ${live ? 'Live Remote Feeds' : 'Curated Verified Feed'}</span>
    <span>·</span>
    ${Store.state.resume.content
      ? `<span class="match-badge-indicator">${AppIcon('zap', 12)} Scored against your resume</span>`
      : `<a href="#/resume" class="add-resume-cta">${AppIcon('resume', 12)} Add resume for match scores ↗</a>`}
  `;

  if (!filtered.length) {
    box.innerHTML = `
      <div class="empty">
        <div class="empty-icon-box">${AppIcon('search', 36)}</div>
        <div class="empty-title">No matching job postings found</div>
        <div class="empty-desc">Try modifying your search keywords, clearing filters, or create a custom job application.</div>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap">
          <button class="btn btn-primary" id="empty-reset-btn">${AppIcon('refresh', 13)} Reset Filters</button>
          <button class="btn btn-gold-soft" id="empty-create-btn">${AppIcon('rocket', 13)} + Create Custom Job</button>
        </div>
      </div>`;
    $('#empty-reset-btn').addEventListener('click', resetFilters);
    $('#empty-create-btn').addEventListener('click', () => openCreateJobModal());
    return;
  }
  box.innerHTML = '<div class="jobs-grid">' + filtered.slice(0, 60).map(j => jobCardHTML(j, 'search')).join('') + '</div>';
  bindJobCards(box);
}

/* ---------- Saved Jobs ---------- */
Routes.saved = function () {
  const list = Store.state.savedJobs;
  $('#view').innerHTML = `
    <div class="section-head">
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
        <h2>Shortlisted Jobs (${list.length})</h2>
        <button class="btn btn-primary" id="saved-create-btn">${AppIcon('rocket', 14)} + Create Custom Job</button>
      </div>
      <div class="line"></div>
    </div>
    <div id="saved-box"></div>`;

  $('#saved-create-btn').addEventListener('click', () => openCreateJobModal());

  const box = $('#saved-box');
  if (!list.length) {
    box.innerHTML = `
      <div class="empty">
        <div class="empty-icon-box">${AppIcon('star', 36)}</div>
        <div class="empty-title">No shortlisted jobs yet</div>
        <div class="empty-desc">Click "Save" on any job card to keep track of roles you want to review or apply to later.</div>
        <button class="btn btn-primary" style="margin-top:16px" id="saved-explore-btn">${AppIcon('search', 14)} Explore Live Feed</button>
      </div>`;
    $('#saved-explore-btn').addEventListener('click', () => navigate('search'));
    return;
  }
  box.innerHTML = '<div class="jobs-grid">' + list.map(j => jobCardHTML(j, 'saved')).join('') + '</div>';
  bindJobCards(box);
};
