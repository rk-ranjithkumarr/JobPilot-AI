/* ============================================================
   JobPilot AI — Views B: Application Pipeline, Resume, Studio, Settings
   ============================================================ */
'use strict';

/* Sample Resumes for 1-Click Testing */
const SAMPLE_RESUMES = {
  fullstack: {
    name: 'Alex Vance',
    email: 'alex.vance@example.com',
    phone: '+1 (555) 345-6789',
    location: 'San Francisco, CA (Remote)',
    links: 'linkedin.com/in/alexvance · github.com/alexvance',
    content: `ALEX VANCE
Senior Full Stack Engineer | React, TypeScript, Next.js, Python, PostgreSQL, AWS
Email: alex.vance@example.com | Phone: +1 (555) 345-6789 | Location: San Francisco, CA (Remote)
Portfolio: github.com/alexvance | LinkedIn: linkedin.com/in/alexvance

EXECUTIVE SUMMARY
Full Stack Engineer with 7+ years of experience engineering high-throughput SaaS platforms, distributed cloud microservices, and reactive user interfaces. Proven track record scaling systems from prototype to 2M+ monthly active users, improving core p99 latency by 45%, and establishing production CI/CD automation.

TECHNICAL SKILLS
- Frontend: TypeScript, JavaScript (ES2022+), React, Next.js, Redux Toolkit, Tailwind CSS, HTML5, CSS3/Sass, WebSockets, WCAG Accessibility
- Backend & Systems: Node.js, Python (FastAPI, Django), Go, RESTful APIs, GraphQL, Kafka, gRPC
- Databases & Storage: PostgreSQL, Redis, DynamoDB, Supabase, MongoDB
- Cloud & DevOps: Docker, Kubernetes, Terraform, AWS (ECS, Lambda, S3, CloudFront), GitHub Actions, CI/CD, Datadog

PROFESSIONAL EXPERIENCE

Senior Full Stack Engineer | Nimbus Cloud Systems | 2022 – Present
- Architected and delivered a multi-tenant creator marketplace using Next.js, TypeScript, and FastAPI, boosting transaction volume by 85% year-over-year.
- Led migration of legacy monolithic endpoints to asynchronous event-driven services using Kafka and PostgreSQL, cutting API response times from 340ms to 75ms.
- Spearheaded company-wide frontend design system in React/Tailwind, reducing engineering feature lead time by 30% across 5 product squads.
- Implemented robust automated testing suite (Jest, Playwright) achieving 88% test coverage and zero critical production regressions over 18 months.

Full Stack Software Engineer | PixelGrid Labs | 2019 – 2022
- Engineered high-traffic analytics dashboard processing 15M daily event telemetry points using React, Node.js, and Redis caching.
- Optimized relational database queries and PostgreSQL indexing strategies, cutting cloud database hosting costs by $42,000 annually.
- Mentored 4 junior and mid-level engineers, conducted 60+ technical code reviews, and authored comprehensive API developer documentation.

EDUCATION & CERTIFICATIONS
- B.S. in Computer Science | University of California, Berkeley
- AWS Certified Solutions Architect – Associate`
  },
  ai: {
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 789-0123',
    location: 'New York, NY (Remote)',
    links: 'linkedin.com/in/elenarostova · github.com/elenarostova',
    content: `DR. ELENA ROSTOVA
Machine Learning & Generative AI Systems Engineer | PyTorch, LLMs, RAG, Python, AWS
Email: elena.rostova@example.com | Phone: +1 (555) 789-0123 | Location: New York, NY (Remote)
GitHub: github.com/elenarostova | HuggingFace: huggingface.co/elenarostova

EXECUTIVE SUMMARY
AI & Machine Learning Engineer with 6+ years specializing in retrieval-augmented generation (RAG) pipelines, open-weights large language model fine-tuning (LoRA/QLoRA), and low-latency inference serving. Led deployment of production enterprise AI search processing 500k queries daily with 99.9% uptime.

TECHNICAL EXPERTISE
- Generative AI & ML: PyTorch, Hugging Face Transformers, vLLM, LangChain, LlamaIndex, DeepSpeed, Triton
- Vector Search: Pinecone, Qdrant, pgvector, Milvus, ChromaDB
- Backend & Cloud: Python (FastAPI), Docker, Kubernetes, Ray, AWS (SageMaker, EC2 GPU clusters, S3), MLflow
- Data Stack: Pandas, NumPy, Scikit-learn, SQL, Spark

WORK EXPERIENCE

Lead AI Engineer | VectorForge AI | 2022 – Present
- Architected end-to-end multi-modal RAG search platform utilizing hybrid dense-sparse vector indexing, improving query recall from 68% to 94%.
- Fine-tuned 8B and 70B parameter open-source models using QLoRA for domain-specific contract analysis, cutting token costs by 70% compared to proprietary API endpoints.
- Deployed distributed inference engine with vLLM and TensorRT-LLM, cutting p95 response latency from 1.8s to 320ms under high concurrency.

Machine Learning Engineer | Apex Data Labs | 2019 – 2022
- Engineered neural ranking recommendation pipelines serving 4M personalized recommendations daily using PyTorch and Scikit-learn.
- Built automated model evaluation harnesses tracking perplexity, BLEU, and human feedback alignment (RLHF).

EDUCATION
- Ph.D. in Computer Science (Machine Learning focus) | Columbia University
- B.S. in Applied Mathematics | MIT`
  }
};

/* ---------- Application Pipeline (Kanban) ---------- */
Routes.tracker = function () {
  const apps = Store.state.applications;
  $('#view').innerHTML = `
    <div class="section-head">
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%;flex-wrap:wrap;gap:10px">
        <div>
          <h2>Application Pipeline</h2>
          <p class="sub" style="margin:2px 0 0">Drag cards between columns or use stage picker to track career opportunities</p>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <button class="btn btn-primary" id="kb-create-btn">${AppIcon('rocket', 14)} + Create Job Application</button>
        </div>
      </div>
      <div class="line"></div>
    </div>
    <div id="kanban" class="kanban"></div>`;

  $('#kb-create-btn').addEventListener('click', () => openCreateJobModal());

  const kb = $('#kanban');
  if (!apps.length) {
    kb.outerHTML = `
      <div class="empty" style="margin-top:14px">
        <div class="empty-icon-box">${AppIcon('pipeline', 40)}</div>
        <div class="empty-title">Your application pipeline is empty</div>
        <div class="empty-desc">Create your own custom job application or track any position directly from the job search feed.</div>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap">
          <button class="btn btn-primary" id="kb-empty-create-btn">${AppIcon('rocket', 14)} + Create Job Application</button>
          <button class="btn btn-gold-soft" id="kb-empty-explore-btn">${AppIcon('search', 14)} Search Live Jobs</button>
        </div>
      </div>`;
    $('#kb-empty-create-btn').addEventListener('click', () => openCreateJobModal());
    $('#kb-empty-explore-btn').addEventListener('click', () => navigate('search'));
    return;
  }

  kb.innerHTML = STATUS_KEYS.map(status => {
    const meta = statusMeta(status);
    const items = apps.filter(a => a.status === status);
    return `
    <div class="kanban-col" data-status="${status}">
      <div class="kanban-head">
        <span class="kanban-head-icon">${AppIcon(meta.icon, 15)}</span>
        <span class="kanban-head-title">${meta.label}</span>
        <span class="kanban-count">${items.length}</span>
      </div>
      <div class="kanban-body" data-status="${status}">
        ${items.map(a => `
          <div class="kcard" draggable="true" data-app="${a.id}">
            <div class="kcard-title">${escapeHtml(a.job.title)}</div>
            <div class="kcard-co">${escapeHtml(a.job.company)} · ${escapeHtml((a.job.location || 'Remote').slice(0, 20))}</div>
            ${a.note ? `<div class="kcard-note" title="${escapeHtml(a.note)}">${AppIcon('chat', 12)} ${escapeHtml(a.note)}</div>` : ''}
            <div class="kcard-foot">
              <select class="kcard-status-select" data-appsel="${a.id}" title="Move Stage">
                ${STATUS_KEYS.map(sk => `<option value="${sk}" ${sk === a.status ? 'selected' : ''}>${statusMeta(sk).label}</option>`).join('')}
              </select>
              <button class="icon-btn" data-appbtn="apply" title="Apply / Prepare Materials">${AppIcon('send', 13)}</button>
              <button class="icon-btn" data-appbtn="note" title="Add Note / Next Steps">${AppIcon('note', 13)}</button>
              <button class="icon-btn" data-appbtn="prep" title="AI Interview Prep">${AppIcon('mic', 13)}</button>
              <button class="icon-btn" data-appbtn="letter" title="AI Cover Letter">${AppIcon('mail', 13)}</button>
              <button class="icon-btn" data-appbtn="open" title="View Details">${AppIcon('external', 13)}</button>
              <button class="icon-btn btn-del" data-appbtn="del" title="Remove Application">${AppIcon('trash', 13)}</button>
              <span class="kcard-date">${timeAgo(a.updatedAt)}</span>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  }).join('');

  /* Stage Change Listener */
  kb.querySelectorAll('.kcard-status-select').forEach(sel => {
    sel.addEventListener('change', e => {
      e.stopPropagation();
      const appId = sel.dataset.appsel;
      const newStatus = sel.value;
      const changed = Store.update(() => Store.setAppStatus(appId, newStatus));
      if (changed) {
        toast(`Moved to ${statusMeta(newStatus).label}`, 'ok');
        refreshNavCounts();
        Routes.tracker();
      }
    });
  });

  /* Card Action Buttons */
  kb.querySelectorAll('.kcard').forEach(card => {
    const app = Store.state.applications.find(a => a.id === card.dataset.app);
    if (!app) return;

    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', app.id);
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));

    card.querySelectorAll('[data-appbtn]').forEach(btn => btn.addEventListener('click', e => {
      e.stopPropagation();
      const act = btn.dataset.appbtn;
      if (act === 'del') {
        appConfirm(
          'Delete Application',
          `Are you sure you want to remove "${app.job.title}" at ${app.job.company} from your pipeline?`,
          'Delete Application',
          true,
          () => {
            Store.update(() => Store.deleteApp(app.id));
            toast('Application removed', '');
            refreshNavCounts();
            Routes.tracker();
          }
        );
        return;
      }
      if (act === 'apply') openApplyModal(app.job);
      if (act === 'open') openJobModal(app.job);
      if (act === 'note') {
        appPrompt(
          `Notes & Next Steps — ${app.job.title}`,
          app.note || '',
          'e.g. Applied via referral; interview with VP on Thursday; follow up next week...',
          newNote => {
            Store.update(() => Store.setAppNote(app.id, newNote));
            toast('Notes saved', 'ok');
            Routes.tracker();
          }
        );
      }
      if (act === 'prep') runToolWithSpinner('interview', app.job, btn);
      if (act === 'letter') runToolWithSpinner('coverLetter', app.job, btn);
    }));
  });

  /* Drag and Drop Columns */
  kb.querySelectorAll('.kanban-col').forEach(col => {
    col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('dragover'); });
    col.addEventListener('dragleave', () => col.classList.remove('dragover'));
    col.addEventListener('drop', e => {
      e.preventDefault();
      col.classList.remove('dragover');
      const appId = e.dataTransfer.getData('text/plain');
      const changed = Store.update(() => Store.setAppStatus(appId, col.dataset.status));
      if (changed) {
        toast(`Moved to ${statusMeta(col.dataset.status).label}`, 'ok');
        refreshNavCounts();
        Routes.tracker();
      }
    });
  });
};

/* ---------- Resume & Profile ---------- */
function auditResume(resumeText, profile) {
  const text = (resumeText || '').trim();
  const words = text ? text.split(/\s+/).length : 0;
  
  const sections = [
    { name: 'Contact Information', ok: !!(profile.name && (profile.email || profile.phone)) },
    { name: 'Summary / Profile', ok: /summary|profile|about/i.test(text) },
    { name: 'Work Experience', ok: /experience|employment|work history|career/i.test(text) },
    { name: 'Technical Skills', ok: /skills|technologies|proficiencies|stack/i.test(text) },
    { name: 'Education / Credentials', ok: /education|degree|university|b\.s\.|m\.s\.|ph\.d|certif/i.test(text) }
  ];

  const actionVerbs = ['architected','developed','engineered','spearheaded','optimized','shipped','scaled','managed','implemented','led','designed','increased','reduced','automated'];
  const verbsFound = actionVerbs.filter(v => new RegExp('\\b' + v, 'i').test(text));

  const hasMetrics = /\b(\d+%\b|\$\d+|\d+\+|\d+x\b)/i.test(text);

  let score = 30;
  if (words >= 150) score += 20;
  if (words >= 300) score += 10;
  sections.forEach(s => { if (s.ok) score += 6; });
  if (verbsFound.length >= 3) score += 10;
  if (hasMetrics) score += 10;
  score = Math.min(99, Math.max(20, score));

  return { score, words, sections, verbsFound, hasMetrics };
}

function openResumePreviewModal() {
  const r = Store.state.resume;
  openModal(`
    <div style="padding:10px 0">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;border-bottom:1px solid var(--border);padding-bottom:12px">
        <div>
          <h2 style="margin:0">${escapeHtml(r.name || 'Candidate Name')}</h2>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px">
            ${[r.email, r.phone, r.location, r.links].filter(Boolean).map(escapeHtml).join(' · ')}
          </div>
        </div>
        <button class="btn btn-primary" onclick="window.print()">${AppIcon('download', 14)} Print / Save as PDF</button>
      </div>

      <div style="max-height:60vh;overflow-y:auto;padding-right:6px">
        <pre style="white-space:pre-wrap;font-family:inherit;font-size:13.5px;line-height:1.6;color:var(--text);margin:0">${escapeHtml(r.content || 'No resume content entered yet.')}</pre>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px">
        <button class="btn btn-ghost" onclick="closeModal()">Close Preview</button>
      </div>
    </div>
  `, true);
}

Routes.resume = function () {
  const r = Store.state.resume;
  const words = (r.content || '').trim() ? r.content.trim().split(/\s+/).length : 0;
  const audit = auditResume(r.content, r);
  
  $('#view').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px">
      <div>
        <h2 style="margin:0">Resume &amp; Executive Profile</h2>
        <p class="sub" style="margin:2px 0 0">Powers instant match scores, ATS gap analysis, automated cover letters, and interview coaching</p>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <button class="btn btn-gold-soft" id="r-upload-btn">${AppIcon('upload', 14)} Upload Document (.txt/.md/.json)</button>
        <button class="btn" id="r-preview-btn">${AppIcon('external', 14)} Preview Formatted Resume</button>
        <input type="file" id="r-upload-file" accept=".txt,.md,.json,.pdf,.docx,.doc" hidden/>
      </div>
    </div>

    <!-- Quick Sample Loader -->
    <div class="card" style="margin-bottom:18px;background:rgba(218,165,32,0.05);border-color:rgba(218,165,32,0.25)">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="color:var(--gold-300)">${AppIcon('bulb', 20)}</span>
          <div>
            <div style="font-weight:750;font-size:14px;color:var(--gold-300)">Quick Start: Load Sample Profiles</div>
            <div style="font-size:12px;color:var(--text-muted)">Load ready-to-use sample resumes to instantly test 90%+ match scoring &amp; AI tools.</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-sm btn-gold-soft" id="r-load-fullstack">${AppIcon('zap', 12)} Full Stack Engineer</button>
          <button class="btn btn-sm btn-gold-soft" id="r-load-ai">${AppIcon('zap', 12)} AI / ML Engineer</button>
        </div>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3>Contact &amp; Profile Details</h3>
        <p class="sub">Used to automatically sign cover letters and personalize all AI-generated application materials.</p>
        <label class="field"><span>Full Name</span><input type="text" id="r-name" value="${escapeHtml(r.name)}" placeholder="e.g. Alex Morgan"/></label>
        <div class="form-row">
          <label class="field"><span>Email Address</span><input type="email" id="r-email" value="${escapeHtml(r.email)}" placeholder="alex.morgan@example.com"/></label>
          <label class="field"><span>Phone Number</span><input type="text" id="r-phone" value="${escapeHtml(r.phone)}" placeholder="+1 (555) 234-5678"/></label>
        </div>
        <div class="form-row">
          <label class="field"><span>Location</span><input type="text" id="r-location" value="${escapeHtml(r.location)}" placeholder="San Francisco, CA / Remote"/></label>
          <label class="field"><span>Portfolio / LinkedIn</span><input type="text" id="r-links" value="${escapeHtml(r.links)}" placeholder="linkedin.com/in/alexmorgan"/></label>
        </div>
        <button class="btn btn-primary" id="r-save-profile">${AppIcon('check', 14)} Save Profile Data</button>
      </div>

      <div class="card">
        <div class="card-head-row">
          <div>
            <h3>Resume Content (Plain Text)</h3>
            <p class="sub">Powers real-time match scores against live jobs and ATS screening.</p>
          </div>
          <span class="chip ${audit.score >= 70 ? 'ok' : 'warn'}">${AppIcon('zap', 12)} ATS Score: ${audit.score}%</span>
        </div>
        <textarea id="r-content" rows="13" placeholder="Paste your complete resume text here (work experience, technical skills, achievements, education)...">${escapeHtml(r.content)}</textarea>
        
        <div class="resume-stats">
          <span class="chip info">${words} Words</span>
          <span class="chip ${words >= 150 ? 'ok' : 'warn'}">${AppIcon(words >= 150 ? 'check' : 'alert', 13)} ${words >= 150 ? 'Optimal Length' : 'Add more details for optimal scoring'}</span>
          <span class="chip ${audit.hasMetrics ? 'ok' : 'info'}">${AppIcon('target', 12)} ${audit.hasMetrics ? 'Metrics Detected' : 'Add quantified % / $ metrics'}</span>
        </div>

        <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
          <button class="btn btn-primary" id="r-save-content">${AppIcon('check', 14)} Save Resume Text</button>
          <button class="btn btn-gold-soft" id="r-audit-btn">${AppIcon('target', 14)} View ATS Audit</button>
          <button class="btn btn-ghost" id="r-clear">${AppIcon('trash', 14)} Clear</button>
        </div>
      </div>
    </div>

    <!-- Data Privacy & Backups -->
    <div class="card" style="margin-top:20px">
      <h3>Client-Side Data Privacy &amp; Backups</h3>
      <p class="sub">All your data resides 100% locally in this browser's localStorage. You can export or restore a full snapshot anytime.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-gold-soft" id="r-export">${AppIcon('download', 14)} Export Full Backup (.json)</button>
        <button class="btn" id="r-import-btn">${AppIcon('upload', 14)} Import Backup File</button>
        <button class="btn btn-danger" id="r-reset">${AppIcon('trash', 14)} Reset All Local Data</button>
      </div>
      <input type="file" id="r-import" accept="application/json" hidden/>
    </div>`;

  $('#r-preview-btn').addEventListener('click', openResumePreviewModal);

  /* Sample Loaders */
  $('#r-load-fullstack').addEventListener('click', () => {
    const s = SAMPLE_RESUMES.fullstack;
    Store.update(st => {
      st.resume.name = s.name;
      st.resume.email = s.email;
      st.resume.phone = s.phone;
      st.resume.location = s.location;
      st.resume.links = s.links;
      st.resume.content = s.content;
      st.resume.updatedAt = Date.now();
    });
    toast('Loaded Senior Full Stack sample resume!', 'ok');
    Routes.resume();
  });

  $('#r-load-ai').addEventListener('click', () => {
    const s = SAMPLE_RESUMES.ai;
    Store.update(st => {
      st.resume.name = s.name;
      st.resume.email = s.email;
      st.resume.phone = s.phone;
      st.resume.location = s.location;
      st.resume.links = s.links;
      st.resume.content = s.content;
      st.resume.updatedAt = Date.now();
    });
    toast('Loaded AI / ML Engineer sample resume!', 'ok');
    Routes.resume();
  });

  /* File Upload */
  $('#r-upload-btn').addEventListener('click', () => $('#r-upload-file').click());
  $('#r-upload-file').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '').trim();
      if (file.name.endsWith('.json')) {
        try {
          const j = JSON.parse(text);
          if (j.resume && j.resume.content) {
            Store.update(st => { st.resume = { ...st.resume, ...j.resume }; });
            toast('Imported resume from JSON snapshot!', 'ok');
            Routes.resume();
            return;
          }
        } catch (_) {}
      }
      Store.update(st => {
        st.resume.content = text;
        st.resume.updatedAt = Date.now();
      });
      toast(`Imported "${file.name}" into resume!`, 'ok');
      Routes.resume();
    };
    reader.readAsText(file);
  });

  /* View ATS Audit Modal */
  $('#r-audit-btn').addEventListener('click', () => {
    openModal(`
      <div style="padding:6px 0">
        <div class="job-head" style="margin-bottom:14px">
          <div class="modal-ai-icon">${AppIcon('target', 24)}</div>
          <div style="flex:1;min-width:0">
            <h2>ATS Resume Compatibility Audit</h2>
            <div class="modal-sub">Analysis of formatting, structure, action verbs, and screening readiness</div>
          </div>
          <span class="chip ${audit.score >= 70 ? 'ok' : 'warn'}" style="font-size:14px;padding:6px 12px">
            ${AppIcon('zap', 14)} ${audit.score}% ATS Score
          </span>
        </div>

        <div class="card" style="margin-bottom:16px">
          <h4>Required Sections Verification</h4>
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">
            ${audit.sections.map(s => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg-glass);border-radius:var(--radius-sm)">
                <span>${escapeHtml(s.name)}</span>
                <span class="chip ${s.ok ? 'ok' : 'warn'}">${AppIcon(s.ok ? 'check' : 'alert', 12)} ${s.ok ? 'Detected' : 'Missing'}</span>
              </div>`).join('')}
          </div>
        </div>

        <div class="card" style="margin-bottom:16px">
          <h4>High-Impact Action Verbs</h4>
          <p class="sub">Found ${audit.verbsFound.length} strong leadership &amp; delivery verbs in your text:</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
            ${audit.verbsFound.length ? audit.verbsFound.map(v => `<span class="chip ok">${escapeHtml(v)}</span>`).join('') : '<span style="color:var(--text-muted);font-size:13px">Include verbs like "architected", "engineered", "scaled", "spearheaded".</span>'}
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end">
          <button class="btn btn-primary" onclick="closeModal()">Done</button>
        </div>
      </div>
    `, true);
  });

  $('#r-save-profile').addEventListener('click', () => {
    Store.update(s => {
      s.resume.name = $('#r-name').value.trim();
      s.resume.email = $('#r-email').value.trim();
      s.resume.phone = $('#r-phone').value.trim();
      s.resume.location = $('#r-location').value.trim();
      s.resume.links = $('#r-links').value.trim();
    });
    toast('Profile data saved', 'ok');
  });

  $('#r-save-content').addEventListener('click', () => {
    Store.update(s => {
      s.resume.content = $('#r-content').value;
      s.resume.updatedAt = Date.now();
    });
    toast('Resume saved — Match scores recalculated', 'ok');
    Routes.resume();
  });

  $('#r-clear').addEventListener('click', () => {
    appConfirm(
      'Clear Resume Content',
      'Are you sure you want to clear all plain text from your resume? This action cannot be undone unless you have a backup.',
      'Clear Text',
      true,
      () => {
        $('#r-content').value = '';
        Store.update(s => { s.resume.content = ''; s.resume.updatedAt = Date.now(); });
        toast('Resume content cleared', '');
        Routes.resume();
      }
    );
  });

  $('#r-export').addEventListener('click', downloadBackup);
  $('#r-import-btn').addEventListener('click', () => $('#r-import').click());
  
  $('#r-import').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        Store.importData(reader.result);
        toast('Backup restored successfully', 'ok');
        refreshNavCounts();
        updateAIChip();
        navigate('dashboard');
      } catch (err) {
        toast('Import failed: ' + err.message, 'err');
      }
    };
    reader.readAsText(f);
  });

  $('#r-reset').addEventListener('click', () => {
    appConfirm(
      'Reset All Local Data',
      'Permanently delete all shortlisted jobs, pipeline cards, resume, and settings? This resets JobPilot AI back to initial defaults.',
      'Reset All Data',
      true,
      () => {
        Store.reset();
        refreshNavCounts();
        updateAIChip();
        toast('All data reset to initial defaults', 'warn');
        navigate('dashboard');
      }
    );
  });
};

/* ---------- AI Studio ---------- */
Routes.studio = function () {
  const tools = Object.entries(AI.TOOLS);
  $('#view').innerHTML = `
    <div class="card">
      <div class="card-head-row">
        <div>
          <h3>AI Career Intelligence Studio</h3>
          <p class="sub">${AI.mode() === 'llm'
            ? `Powered by live <b style="color:var(--gold-300)">${escapeHtml(AI.providerInfo().name)}</b> engine with automatic template fallbacks.`
            : 'Running in offline template engine. Add an API key in Settings for full LLM generative capabilities.'}</p>
        </div>
        <span class="chip ${AI.mode() === 'llm' ? 'ok' : 'info'}">${AppIcon('bot', 13)} ${AI.mode() === 'llm' ? 'Live LLM' : 'Template Engine'}</span>
      </div>

      <div class="tool-grid">
        ${tools.map(([k, t]) => `
          <button class="tool-card" data-tool="${k}">
            <div class="tool-icon-wrap">${AppIcon(t.icon, 24)}</div>
            <div class="tool-name">${t.name}</div>
            <div class="tool-desc">${t.desc}</div>
          </button>`).join('')}
      </div>
    </div>
    
    <div class="card" style="margin-top:20px" id="studio-panel">
      <div class="empty" style="padding:36px">
        <div class="empty-icon-box">${AppIcon('brain', 38)}</div>
        <div class="empty-title">Select a tool above to begin</div>
        <div class="empty-desc">Generate customized cover letters, interview prep, resume tailoring, or career roadmaps.</div>
      </div>
    </div>`;

  $$('#view [data-tool]').forEach(btn => btn.addEventListener('click', () => {
    $$('#view .tool-card').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    const key = btn.dataset.tool;
    const tool = AI.TOOLS[key];
    const panel = $('#studio-panel');

    /* Free-form Q&A Tool */
    if (tool.custom) {
      panel.innerHTML = `
        <div class="card-head-row">
          <div>
            <h3>${AppIcon(tool.icon, 18)} ${tool.name}</h3>
            <p class="sub">Ask any career or interview question — answers automatically factor in your resume and profile context.</p>
          </div>
        </div>
        <textarea id="ask-q" rows="3" placeholder="e.g. How do I position my experience for a transition to Staff Engineer? What salary range should I target for remote roles?"></textarea>
        <div style="display:flex;gap:10px;margin-top:14px">
          <button class="btn btn-primary" id="ask-btn">${AppIcon('bot', 14)} Ask Copilot</button>
        </div>
        <div id="ask-out" style="margin-top:18px"></div>`;

      $('#ask-btn').addEventListener('click', async () => {
        const q = $('#ask-q').value.trim();
        if (!q) return;
        const b = $('#ask-btn');
        b.disabled = true;
        b.innerHTML = `<span class="spinner-inline"></span> Thinking…`;
        try {
          const answer = await AI.ask(q);
          $('#ask-out').innerHTML = `
            <div class="ai-output">${mdLite(answer)}</div>
            <div class="output-head" style="margin-top:12px">
              <button class="btn btn-sm btn-primary" id="ask-copy">${AppIcon('copy', 13)} Copy Response</button>
            </div>`;
          $('#ask-copy').addEventListener('click', () => copyText(answer));
        } catch (err) {
          toast(err.message, 'err');
        }
        b.disabled = false;
        b.innerHTML = `${AppIcon('bot', 14)} Ask Copilot`;
      });
      return;
    }

    /* Job-Targeted AI Tools */
    panel.innerHTML = `
      <div class="card-head-row">
        <div>
          <h3>${AppIcon(tool.icon, 18)} ${tool.name}</h3>
          <p class="sub">${tool.desc}</p>
        </div>
      </div>
      <div class="form-row">
        <label class="field"><span>Target Job Title</span><input type="text" id="st-title" placeholder="e.g. Senior Full Stack Engineer"/></label>
        <label class="field"><span>Target Company</span><input type="text" id="st-company" placeholder="e.g. Stripe, Acme Corp"/></label>
      </div>
      <label class="field">
        <span>Job Description / Key Requirements</span>
        <textarea id="st-extra" rows="5" placeholder="Paste the job requirements, bullet points, or responsibilities here for maximum personalization..."></textarea>
      </label>
      <button class="btn btn-primary" id="st-run">${AppIcon('zap', 14)} Generate Tailored Output</button>
      <p class="sub" style="margin-top:14px;color:var(--text-muted)">Tip: You can also open any job from the <b>Job Search</b> feed to run AI tools instantly with one click.</p>`;

    $('#st-run').addEventListener('click', async e => {
      const title = $('#st-title').value.trim() || 'Software Engineer';
      const company = $('#st-company').value.trim() || 'Target Company';
      const extra = $('#st-extra').value.trim();
      const job = {
        id: 'manual',
        title,
        company,
        location: 'Remote',
        jobType: 'Full-time',
        category: 'Engineering',
        tags: [],
        description: extra ? '<p>' + escapeHtml(extra) + '</p>' : '',
        salary: '',
        url: '#',
        pubDate: Date.now(),
        source: 'manual'
      };
      await runToolWithSpinner(key, job, e.target);
    });
  }));
};

/* ---------- Settings ---------- */
Routes.settings = function () {
  const s = Store.state.settings;
  const provs = Object.entries(AI.PROVIDERS);
  
  $('#view').innerHTML = `
    <div class="card">
      <h3>AI Model &amp; Provider Configuration</h3>
      <p class="sub">JobPilot supports any OpenAI-compatible LLM endpoint. <b style="color:var(--gold-300)">Groq offers an ultrafast free tier</b> — ideal for instant generative results. API keys never leave your browser.</p>
      
      <div class="form-row">
        <label class="field"><span>Provider</span>
          <select id="set-provider" aria-label="AI Provider Selection">
            ${provs.map(([k, p]) => `<option value="${k}" ${s.provider === k ? 'selected' : ''}>${p.name}</option>`).join('')}
            <option value="template" ${s.provider === 'template' ? 'selected' : ''}>Deterministic Template Engine (Offline, Zero Config)</option>
          </select>
        </label>
        <label class="field"><span>Model ID <span style="color:var(--text-muted)">(optional override)</span></span>
          <input type="text" id="set-model" value="${escapeHtml(s.model)}" placeholder="e.g. gpt-4o-mini, llama-3.3-70b-versatile"/>
        </label>
      </div>

      <label class="field"><span>API Key</span>
        <input type="password" id="set-key" value="${escapeHtml(s.apiKey)}" placeholder="sk-... / gsk_... (Stored locally in your browser only)"/>
      </label>

      <label class="field"><span>Custom Base URL <span style="color:var(--text-muted)">(optional; auto-configured for Groq/OpenAI/Ollama)</span></span>
        <input type="url" id="set-baseurl" value="${escapeHtml(s.baseUrl)}" placeholder="https://api.openai.com/v1"/>
      </label>

      <label class="field"><span>Generation Temperature: <b id="set-temp-val" style="color:var(--gold-300)">${s.temperature}</b></span>
        <input type="range" id="set-temp" min="0" max="1.2" step="0.1" value="${s.temperature}"/>
      </label>

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
        <button class="btn btn-primary" id="set-save">${AppIcon('check', 14)} Save Settings</button>
        <button class="btn btn-gold-soft" id="set-test">${AppIcon('zap', 14)} Test Connection</button>
        <a class="btn" id="set-keys-link" href="${AI.providerInfo().keyUrl || '#'}" target="_blank" rel="noopener">${AppIcon('external', 14)} Get API Key ↗</a>
      </div>
      <div id="set-test-out" style="margin-top:16px"></div>
    </div>

    <div class="card" style="margin-top:20px">
      <h3>Data Integrity &amp; Security Architecture</h3>
      <div class="security-grid">
        <div class="security-item">
          <div class="sec-icon">${AppIcon('globe', 18)}</div>
          <div>
            <div class="sec-title">Public Feeds</div>
            <div class="sec-desc">Jobs are queried directly from Remotive and Arbeitnow public APIs without intermediate storage.</div>
          </div>
        </div>
        <div class="security-item">
          <div class="sec-icon">${AppIcon('resume', 18)}</div>
          <div>
            <div class="sec-title">Client-Side Privacy</div>
            <div class="sec-desc">Resume, saved cards, pipeline stages, notes, and API keys are stored only in your local browser storage.</div>
          </div>
        </div>
        <div class="security-item">
          <div class="sec-icon">${AppIcon('bot', 18)}</div>
          <div>
            <div class="sec-title">Direct LLM Calls</div>
            <div class="sec-desc">When configured, requests go straight from your browser to the AI provider endpoint. No intermediary proxy server.</div>
          </div>
        </div>
        <div class="security-item">
          <div class="sec-icon">${AppIcon('refresh', 18)}</div>
          <div>
            <div class="sec-title">Offline Fallback</div>
            <div class="sec-desc">If offline or if API quotas are exhausted, deterministic template generation automatically takes over.</div>
          </div>
        </div>
      </div>
    </div>`;

  $('#set-temp').addEventListener('input', e => { $('#set-temp-val').textContent = e.target.value; });
  
  $('#set-provider').addEventListener('change', e => {
    const p = AI.PROVIDERS[e.target.value];
    if (p) {
      $('#set-baseurl').placeholder = p.baseUrl || 'https://...';
      $('#set-keys-link').href = p.keyUrl || '#';
    }
  });

  const readSettings = () => Store.update(st => {
    st.settings.provider = $('#set-provider').value;
    st.settings.model = $('#set-model').value.trim();
    st.settings.apiKey = $('#set-key').value.trim();
    st.settings.baseUrl = $('#set-baseurl').value.trim();
    st.settings.temperature = parseFloat($('#set-temp').value);
  });

  $('#set-save').addEventListener('click', () => {
    readSettings();
    updateAIChip();
    toast('Settings saved — ' + (AI.mode() === 'llm' ? 'Live LLM mode active' : 'Offline template engine active'), 'ok');
  });

  $('#set-test').addEventListener('click', async () => {
    const out = $('#set-test-out');
    out.innerHTML = `<span class="chip warn">${AppIcon('refresh', 13, 'icon-spin')} Testing endpoint connection…</span>`;
    readSettings();
    updateAIChip();
    
    if (AI.mode() !== 'llm') {
      out.innerHTML = `<span class="chip warn">${AppIcon('alert', 13)} Template Engine Active — Select a provider and add an API key to test live LLMs.</span>`;
      return;
    }
    
    try {
      const reply = await AI.testConnection();
      out.innerHTML = `<span class="chip ok">${AppIcon('check', 13)} Connected successfully — Response: &quot;${escapeHtml(reply.slice(0, 50))}&quot;</span>`;
    } catch (err) {
      out.innerHTML = `<span class="chip" style="color:var(--danger);border-color:rgba(248,113,113,.4)">${AppIcon('close', 13)} Connection error: ${escapeHtml(String(err.message).slice(0, 160))}</span>`;
    }
  });
};
