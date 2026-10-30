/* ============================================================
   JobPilot AI — AI engine
   Mode 1: LLM (OpenAI / Groq / OpenRouter / Ollama / Custom)
   Mode 2: Deterministic Template Engine (offline fallback)
   ============================================================ */
'use strict';

const AI = (() => {

  const PROVIDERS = {
    openai:     { name: 'OpenAI',        baseUrl: 'https://api.openai.com/v1',        model: 'gpt-4o-mini', keyUrl: 'https://platform.openai.com/api-keys' },
    groq:       { name: 'Groq (Free Tier)', baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile', keyUrl: 'https://console.groq.com/keys' },
    openrouter: { name: 'OpenRouter',    baseUrl: 'https://openrouter.ai/api/v1',     model: 'openai/gpt-4o-mini', keyUrl: 'https://openrouter.ai/keys' },
    ollama:     { name: 'Ollama (Local)',baseUrl: 'http://localhost:11434/v1',        model: 'llama3.1', keyUrl: 'https://ollama.com' },
    custom:     { name: 'Custom OpenAI-Compatible', baseUrl: '', model: '', keyUrl: '' }
  };

  function mode() {
    const s = Store.state.settings;
    return (s.provider !== 'template' && s.apiKey.trim()) || (s.provider === 'ollama' && s.baseUrl.trim()) ? 'llm' : 'template';
  }

  function providerInfo() {
    return PROVIDERS[Store.state.settings.provider] || PROVIDERS.custom;
  }

  async function chat(messages, { maxTokens = 1400, temperature = null } = {}) {
    const s = Store.state.settings;
    const p = providerInfo();
    const base = (s.baseUrl || p.baseUrl || '').replace(/\/+$/, '');
    if (!base) throw new Error('No base URL configured');

    const headers = { 'Content-Type': 'application/json' };
    if (s.apiKey.trim()) headers['Authorization'] = 'Bearer ' + s.apiKey.trim();
    if (s.provider === 'openrouter') headers['HTTP-Referer'] = location.origin;
    if (s.provider === 'openrouter') headers['X-Title'] = 'JobPilot AI';

    const res = await fetch(base + '/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: s.model || p.model,
        messages,
        temperature: temperature == null ? Number(s.temperature) : temperature,
        max_tokens: maxTokens
      })
    });
    if (!res.ok) {
      let detail = '';
      try { const j = await res.json(); detail = (j.error && (j.error.message || j.error.type)) || JSON.stringify(j).slice(0, 180); }
      catch (_) { detail = res.status + ' ' + res.statusText; }
      throw new Error(detail || ('HTTP ' + res.status));
    }
    const data = await res.json();
    const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!text) throw new Error('Empty response from model');
    return text.trim();
  }

  /* ================= Shared context ================= */

  function stripHtml(html) {
    const el = document.createElement('div');
    el.innerHTML = html || '';
    return (el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function resumeText() { return (Store.state.resume.content || '').trim(); }
  function profileLine() {
    const r = Store.state.resume;
    const bits = [r.name, r.title, r.location, r.links].filter(Boolean);
    return bits.join(' · ');
  }

  const SYSTEM = 'You are JobPilot AI, an executive career strategist and technical recruiter copilot. ' +
    'You write concise, confident, high-impact English tailored directly to the candidate resume and target posting. ' +
    'Never invent false qualifications. Use markdown headings and crisp bullet points.';

  function jobBlock(job) {
    const desc = stripHtml(job.description).slice(0, 3500);
    return `TARGET JOB\n- Title: ${job.title}\n- Company: ${job.company}\n- Location: ${job.location}\n- Type: ${job.jobType || 'n/a'}\n- Tags: ${(job.tags || []).join(', ')}\n- Salary: ${job.salary || 'n/a'}\n- Description: ${desc}`;
  }

  function resumeBlock() {
    const r = resumeText();
    return r ? `CANDIDATE PROFILE & RESUME\n${r.slice(0, 4000)}` : 'CANDIDATE PROFILE & RESUME\n(No resume provided — provide general framework and suggest adding resume)';
  }

  /* ================= Prompts per tool ================= */

  const TOOLS = {
    coverLetter: {
      icon: 'mail', name: 'Cover Letter',
      desc: 'High-conversion cover letter tailored specifically to this job posting.',
      prompt: job => `Write a compelling, tailored cover letter for this job opening.\nKeep it under 280 words, warm but professional, no clichés ("I am writing to apply"), no placeholders except [Hiring Manager]. Reference the candidate's strongest matching skills and impact. End with a clear call to action.\n\n${jobBlock(job)}\n\n${resumeBlock()}`
    },
    coldEmail: {
      icon: 'send', name: 'Outreach Email',
      desc: 'Concise intro email to a recruiter or hiring manager with clear CTA.',
      prompt: job => `Write a high-converting cold outreach email (max 120 words) to the hiring manager for this job. Include a subject line. Friendly, specific, zero fluff, one clear request (a 15-minute intro chat).\n\n${jobBlock(job)}\n\n${resumeBlock()}`
    },
    tailor: {
      icon: 'target', name: 'Tailor Resume',
      desc: 'ATS keyword gaps, rewritten high-impact bullet points, and screening checklist.',
      prompt: job => `Act as an executive ATS and hiring manager. Compare the candidate resume against the job description and output:\n## Top Keyword Gaps\n- 5-8 key technical skills/keywords from the job missing from the resume\n## Rewritten High-Impact Bullets\n- 4 rewritten experience bullet points aligned to this job in XYZ format (Accomplished [X], measured by [Y], by doing [Z])\n## ATS Optimization Checklist\n- 4 concrete recommendations to pass automated screening\n\n${jobBlock(job)}\n\n${resumeBlock()}`
    },
    interview: {
      icon: 'mic', name: 'Interview Prep',
      desc: 'Likely technical/behavioral questions + STAR model responses + questions to ask.',
      prompt: job => `Prepare the candidate for an interview for this job. Output:\n## 8 Likely Interview Questions\n(Mix of technical architecture, behavioral, and company-specific)\n## Model Answers for Top 3 Questions\n(Use STAR format: Situation, Task, Action, Result grounded in their background)\n## 3 Strategic Questions to Ask the Interviewer\n\n${jobBlock(job)}\n\n${resumeBlock()}`
    },
    match: {
      icon: 'target', name: 'Deep Match Analysis',
      desc: 'Unbiased compatibility assessment: strengths, gaps, risks, and verdict.',
      prompt: job => `Analyze candidate fit for this job. Output:\n## Match Fit Score\n- A percentage score (0-100%) with concise justification\n## Key Strengths\n- 4 bullet points highlighting candidate alignment\n## Critical Gaps & Risks\n- 4 honest bullet points on missing requirements\n## Strategic Verdict\n- 2 sentences: Apply Immediately, Apply with Prep, or Pass — and rationale.\n\n${jobBlock(job)}\n\n${resumeBlock()}`
    },
    plan: {
      icon: 'compass', name: 'Career Roadmap',
      desc: 'A structured 90-day actionable roadmap to become fully qualified for this role.',
      prompt: job => `Create a practical 90-day execution plan for someone targeting this position. Output:\n## Skills to Master\n- 4 specific areas with recommended free learning resources\n## Portfolio Project Ideas\n- 2 concrete project specs that prove competence in this role\n## Outreach & Networking Strategy\n- 3 actionable weekly networking steps\n## Weekly Study Schedule\n- Clear weekly cadence\n\n${jobBlock(job)}\n\n${resumeBlock()}`
    },
    ask: {
      icon: 'chat', name: 'Ask JobPilot Copilot',
      desc: 'Ask any career question — answered with your profile and resume context.',
      custom: true
    }
  };

  /* ================= Template (offline) generators ================= */

  function topKeywords(job, n = 6) {
    const text = stripHtml(job.title + ' ' + job.tags.join(' ') + ' ' + job.description).toLowerCase();
    const words = text.split(/[^a-z0-9+#]+/).filter(w => w.length > 2);
    const freq = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, n).map(e => e[0]);
  }

  function today() { return new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }); }

  const TPL = {
    coverLetter(job) {
      const r = Store.state.resume;
      const kws = topKeywords(job, 5);
      const matched = (Jobs.matchScore(job, resumeText()) || {}).matched || kws;
      const hits = matched.slice(0, 4).join(', ');
      return `Dear [Hiring Manager],

I am writing to express my strong interest in the ${job.title} position at ${job.company}. Having followed ${job.company}'s trajectory in ${job.category || 'the technology sector'}, I am impressed by your team's mission and technical rigor.

My technical background aligns directly with the core requirements of this role, particularly around ${hits || kws.join(', ')}. In my recent work, I have consistently driven initiatives from architecture through deployment, with an emphasis on high performance, maintainability, and measurable user impact.

Key strengths I bring to this position include:
- Hands-on expertise in ${hits || 'modern software engineering and distributed systems'}
- Proven track record of shipping production features on schedule with high reliability
- Clear cross-functional collaboration across engineering, product, and design

I would welcome the opportunity to discuss how my background can support ${job.company}'s immediate engineering goals for the ${job.title} role. Thank you for your time and consideration.

Sincerely,
${r.name || '[Your Name]'}
${r.email || '[your.email@example.com]'}${r.phone ? ' · ' + r.phone : ''}${r.links ? '\n' + r.links : ''}
${today()}

— Generated via Deterministic Template Engine. Connect an AI key in Settings for fully customized, dynamic letters.`;
    },

    coldEmail(job) {
      const r = Store.state.resume;
      return `Subject: ${job.title} at ${job.company} — quick introduction

Hi [First Name],

I noticed the ${job.title} opening at ${job.company} and wanted to reach out directly. Given my experience with ${(Jobs.matchScore(job, resumeText()) || {}).matched ? (Jobs.matchScore(job, resumeText()).matched.slice(0, 3).join(', ')) : topKeywords(job, 3).join(', ')}, I believe I could make an immediate contribution to your team.

I would love to schedule a brief 15-minute chat this week to share how my background aligns with your current priorities for the role.

Best regards,
${r.name || '[Your Name]'}${r.links ? '\n' + r.links : ''}

— Generated via Template Engine. Connect an API key in Settings for live LLM personalization.`;
    },

    tailor(job) {
      const ms = Jobs.matchScore(job, resumeText()) || { score: null, matched: [] };
      const jobText = stripHtml(job.description).toLowerCase();
      const COMMON = ['react','typescript','javascript','python','node','node.js','sql','aws','docker','kubernetes','terraform','figma','css','html','git','rest','graphql','agile','testing','ci/cd','java','go','golang','php','ruby','rust','c++','c#','.net','vue','angular','next.js','tailwind','postgresql','mongodb','redis','kafka','spark','airflow','dbt','looker','tableau','power bi','excel','machine learning','deep learning','pytorch','tensorflow','nlp','llm','prompt','data analysis','a/b testing','seo','figma','jira','linux','bash'];
      const found = COMMON.filter(k => jobText.includes(k));
      const resumeLower = resumeText().toLowerCase();
      const missing = found.filter(k => !resumeLower.includes(k)).slice(0, 8);
      const present = found.filter(k => resumeLower.includes(k)).slice(0, 8);
      return `## Top Keyword Gaps
${missing.length ? missing.map(k => '- **' + k + '** — Featured in job requirements but absent from resume; include if relevant to your experience.').join('\n') : '- Add your resume in "My Resume" for exact keyword gap analysis.'}

## Target Keywords Currently Matched
${present.length ? present.map(k => '- ' + k).join('\n') : '- Paste your resume in "My Resume" to compute matched terms.'}

## Recommended High-Impact Bullet Rewrites
- Architected and delivered core features using **${found[0] || job.tags[0] || 'modern stack'}**, improving throughput by **35%** and reducing latency.
- Collaborated across cross-functional teams to ship key product initiatives aligned with company performance metrics.
- Automated CI/CD pipelines and deployment workflows, cutting cycle time by **40%**.
- Mentored junior engineers and documented engineering standards to accelerate team onboarding.

## ATS Optimization Checklist
- Standardize section headings: Experience, Technical Skills, Education, Projects.
- Explicitly incorporate key phrases from the job posting: "${found.slice(0, 3).join('", "') || 'core skills'}".
- Maintain clean single-column layout formatted in PDF with selectable text.

${ms.score != null ? `Estimated Match Fit: ${ms.score}/100.` : ''}
— Deterministic template output. Connect an API key in Settings for customized deep analysis.`;
    },

    interview(job) {
      const tags = job.tags || [];
      const tech = tags.length ? tags.slice(0, 4) : topKeywords(job, 4);
      return `## 8 Likely Interview Questions
1. Can you walk through a complex system or project you engineered using **${tech[0] || 'your core stack'}** under tight deadlines?
2. How do you handle ambiguous requirements and balance technical debt against speed to market?
3. Describe a technical disagreement you had with a teammate or stakeholder — how did you resolve it?
4. What was the most impactful measurable metric you moved in your recent roles?
5. Why are you interested in joining **${job.company}**, and why this **${job.title}** role specifically?
6. How do you approach observability, testing, and debugging in production environments?
7. Share an example of a technical failure or outage you experienced and the preventive measures you instituted.
8. Where do you see your engineering focus evolving over the next two years?

## Model STAR Answers for Hardest Questions
**Q1 (Technical Depth):**
- **Situation:** High-traffic service encountering scaling bottlenecks during peak demand.
- **Task:** Re-architect data ingestion pipeline using ${tech.join(', ')}.
- **Action:** Implemented caching layers, optimized query execution plans, and decoupled asynchronous worker queues.
- **Result:** Decreased p99 latency by 45% and scaled system to handle 3x load with zero downtime.

**Q3 (Conflict Resolution):**
- Focused objectively on data-driven benchmarks and user requirements rather than personal preferences, leading to an agreed architectural compromise.

## 3 Strategic Questions to Ask the Hiring Team
- "What does high performance and exceptional impact look like for this role in the first 90 days?"
- "How does the team balance architectural refactoring against feature delivery velocity?"
- "What is the biggest technical hurdle the team is solving this quarter?"

— Template mode. Connect an API key in Settings for personalized STAR answers.`;
    },

    match(job) {
      const ms = Jobs.matchScore(job, resumeText()) || { score: null };
      const s = ms.score != null ? ms.score : 65;
      const verdict = s >= 70 ? '**Strong Candidate Alignment** — Target role matches key qualifications; tailor top experience bullets and submit.'
        : s >= 45 ? '**Moderate Alignment** — Solid foundational overlap; address identified keyword gaps before applying.'
        : '**Stretch Opportunity** — Consider targeted upskilling or highlighting relevant adjacent project work.';
      return `## Fit Assessment Score
- **${s}% Match Compatibility** ${ms.score == null ? '(Estimated baseline — add your resume for live score)' : '(Computed from resume keyword overlap)'}

## Core Strengths
- Core domain alignment with ${job.company}'s requirements in ${(job.tags || []).slice(0, 3).join(', ') || 'the industry'}
- Experience in structured engineering execution and project ownership
- Distributed team readiness and modern collaboration workflows

## Potential Skill Gaps & Focus Areas
- Verify specific tooling experience against posted requirements
- Ensure resume features quantified business and performance metrics
- High applicant volume for remote positions — prioritize early submission and outreach

## Strategic Recommendation
${verdict}

— Template mode. Connect an AI key in Settings for customized deep evaluation.`;
    },

    plan(job) {
      const kws = topKeywords(job, 5);
      return `## 90-Day Candidate Success Roadmap

### Month 1: Foundation & Core Stack Mastery
- Deep dive into **${kws[0] || 'Core Stack'}** and modern architecture best practices.
- Build a lightweight prototype demonstrating core competencies and test coverage.
- Conduct audit of resume keywords against top remote job descriptions.

### Month 2: Production-Grade Project & System Design
- Develop an end-to-end open-source project featuring **${kws[1] || 'Framework'}** and CI/CD automation.
- Document architectural decisions, benchmark performance, and publish repository with clear README.
- Begin structured mock interview practice for system design and behavioral rounds.

### Month 3: Targeted Applications & Network Outreach
- Submit tailored applications for positions matching your tech profile.
- Connect with 3-5 engineers and recruiters at target companies weekly.
- Refine STAR interview stories and negotiation strategy.

— Template mode. Connect an AI key in Settings for an individualized roadmap tailored to your experience.`;
    }
  };

  /* ================= Public API ================= */

  async function generate(toolKey, job) {
    const tool = TOOLS[toolKey];
    if (!tool) throw new Error('Unknown tool: ' + toolKey);

    if (mode() === 'llm') {
      try {
        const text = await chat([
          { role: 'system', content: SYSTEM },
          { role: 'user', content: tool.prompt(job) }
        ], { maxTokens: toolKey === 'coldEmail' ? 500 : 1400 });
        Store.logActivity('bot', `AI ${tool.name} generated via live LLM for "${job.title}"`);
        return { text, engine: 'llm' };
      } catch (err) {
        console.warn('LLM call failed, falling back to template engine:', err);
        Store.logActivity('alert', 'LLM error → template fallback: ' + String(err.message).slice(0, 80));
        const text = TPL[toolKey] ? TPL[toolKey](job) : '';
        return { text, engine: 'template (LLM failed: ' + String(err.message).slice(0, 90) + ')' };
      }
    }
    const text = TPL[toolKey](job);
    Store.logActivity('note', `AI ${tool.name} generated (template) for "${job.title}"`);
    return { text, engine: 'template' };
  }

  async function ask(question) {
    const profile = resumeText();
    if (mode() === 'llm') {
      try {
        return await chat([
          { role: 'system', content: SYSTEM },
          { role: 'user', content: (profile ? `Candidate Profile & Resume:\n${profile.slice(0, 3000)}\n\n` : '') + 'Question: ' + question }
        ], { maxTokens: 900 });
      } catch (err) {
        return 'LLM request failed (' + String(err.message).slice(0, 120) + ').\n\nPlease check Settings → verify API key or retry in a moment.';
      }
    }
    const r = Store.state.resume;
    return `**Template Engine Guidance** — Connect an API key in Settings (Groq offers a free tier) to enable dynamic, unconstrained conversational responses.\n\n### Career Strategy Recommendations for "${escapeHtml(question.slice(0, 80))}":\n\n1. **Ground in Quantifiable Impact:** In interviews and resumes, frame accomplishments around metrics (latency reduced, revenue enabled, cycle time saved).\n2. **Align with Market Demand:** Review multiple current postings for your target role and verify your primary keywords match industry terminology.\n3. **Demonstrate Proof of Work:** Deployed repositories and functional demos carry immense weight in technical hiring evaluations.\n4. **Maintain Active Pipeline Tracking:** Use the Application Pipeline board to monitor conversion rates and optimize your outreach strategy.\n\n${profile ? '' : '💡 Tip: Add your full resume in "My Resume" to unlock personalized AI assessments across the entire platform.'}`;
  }

  function testConnection() {
    return chat([{ role: 'user', content: 'Reply with exactly: OK' }], { maxTokens: 8, temperature: 0 });
  }

  return { PROVIDERS, TOOLS, mode, providerInfo, chat, generate, ask, testConnection, stripHtml, topKeywords };
})();
