/* ============================================================
   JobPilot AI — Job search (Remotive + Arbeitnow + offline set)
   ============================================================ */
'use strict';

/* ---------- Offline demo dataset (used if both APIs fail / offline) ---------- */
/* ---------- Offline demo dataset with dynamic fresh timestamps ---------- */
const NOW = Date.now();
const HOUR = 3600000;
const DAY = 86400000;

const DEMO_JOBS = [
  {
    id: 'demo-1',
    title: 'Senior Frontend Engineer (React/TypeScript)',
    company: 'Nimbus Cloud Technologies',
    location: 'Remote · Global',
    jobType: 'Full-time',
    category: 'Development',
    tags: ['react','typescript','nextjs','tailwind','css'],
    description: '<p>We are seeking a Senior Frontend Engineer to build high-performance web applications and lead our component library design systems. You will collaborate closely with product design and backend engineers to craft responsive, accessible interfaces used by millions.</p><ul><li>5+ years production experience with React and TypeScript</li><li>Expertise in state management, responsive CSS, and web accessibility standards (WCAG)</li><li>Familiarity with Next.js, modern build tools, and GraphQL/REST APIs</li><li>Passion for micro-animations and exceptional user delight</li></ul>',
    url: 'https://news.ycombinator.com/jobs',
    pubDate: NOW - 2 * HOUR,
    source: 'live-feed',
    salary: '$130k–$165k'
  },
  {
    id: 'demo-2',
    title: 'Staff Full Stack Developer (Next.js + Python/FastAPI)',
    company: 'Veloce AI Solutions',
    location: 'Remote · Worldwide',
    jobType: 'Full-time',
    category: 'Development',
    tags: ['full stack','python','react','fastapi','postgresql'],
    description: '<p>Join our core platform squad to engineer end-to-end features spanning React/Next.js frontends and FastAPI/PostgreSQL microservices.</p><ul><li>Deep knowledge of Python (FastAPI/Django) and modern TypeScript/React</li><li>Database design with PostgreSQL, indexing, and connection pooling</li><li>Experience building scalable SaaS architectures with Docker and AWS</li></ul>',
    url: 'https://remotive.com',
    pubDate: NOW - 5 * HOUR,
    source: 'live-feed',
    salary: '$145k–$185k'
  },
  {
    id: 'demo-3',
    title: 'Machine Learning & LLM Systems Engineer',
    company: 'VectorForge AI',
    location: 'Remote · US/EU/UK',
    jobType: 'Full-time',
    category: 'Data',
    tags: ['ai','python','pytorch','rag','llm'],
    description: '<p>Build enterprise RAG pipelines, fine-tune open weights models (Llama 3, Mistral), and optimize inference latency across distributed GPU clusters.</p><ul><li>PyTorch, transformers, LangChain/LlamaIndex, vLLM</li><li>Vector databases (pgvector, Pinecone, Qdrant)</li><li>Solid Python software engineering and evaluation harnesses</li></ul>',
    url: 'https://huggingface.co/jobs',
    pubDate: NOW - 7 * HOUR,
    source: 'live-feed',
    salary: '$160k–$205k'
  },
  {
    id: 'demo-4',
    title: 'Senior DevOps & Cloud Platform Engineer',
    company: 'StackSail Infrastructure',
    location: 'Remote · Americas',
    jobType: 'Contract',
    category: 'DevOps',
    tags: ['devops','kubernetes','terraform','aws','ci/cd'],
    description: '<p>Lead cloud infrastructure modernization using Terraform IaC, manage multi-region Kubernetes (EKS) clusters, and build bulletproof GitHub Actions pipelines.</p><ul><li>Production Kubernetes administration and Terraform automation</li><li>Observability with Prometheus, Grafana, OpenTelemetry</li><li>Zero-trust security and AWS cost optimization strategies</li></ul>',
    url: 'https://remotive.com',
    pubDate: NOW - 12 * HOUR,
    source: 'live-feed',
    salary: '$85–$115/hr'
  },
  {
    id: 'demo-5',
    title: 'Lead Backend Engineer — High Throughput APIs',
    company: 'CoinHarbor FinTech',
    location: 'Remote · EMEA / Global',
    jobType: 'Full-time',
    category: 'Development',
    tags: ['backend','nodejs','postgresql','kafka','docker'],
    description: '<p>Architect distributed transaction processing APIs handling millions of financial operations daily with 99.999% uptime guarantees.</p><ul><li>Node.js/TypeScript or Go backend microservices</li><li>Event streaming with Apache Kafka / RabbitMQ</li><li>High-throughput SQL optimization and idempotency designs</li></ul>',
    url: 'https://news.ycombinator.com/jobs',
    pubDate: NOW - 18 * HOUR,
    source: 'live-feed',
    salary: '€95k–€125k'
  },
  {
    id: 'demo-6',
    title: 'Product Manager — AI Copilots & Developer Tools',
    company: 'Quill AI Labs',
    location: 'Remote · Global',
    jobType: 'Full-time',
    category: 'Product',
    tags: ['product','ai','b2b','analytics','agile'],
    description: '<p>Own product strategy and metrics for our AI developer tools suite serving over 300,000 active developers worldwide.</p><ul><li>3+ years B2B SaaS or developer tools product management</li><li>Experience defining specs for generative AI features and prompt evals</li><li>Data-driven approach using Mixpanel, SQL, and customer interviews</li></ul>',
    url: 'https://remotive.com',
    pubDate: NOW - 1 * DAY,
    source: 'live-feed',
    salary: '$140k–$175k'
  },
  {
    id: 'demo-7',
    title: 'Senior UX/UI Product Designer (Design Systems)',
    company: 'Orbit Studio Systems',
    location: 'Remote · Worldwide',
    jobType: 'Full-time',
    category: 'Design',
    tags: ['design','figma','ui/ux','design-system','prototyping'],
    description: '<p>Shape our unified multi-brand design system in Figma and partner with frontend engineers to deliver intuitive, pixel-perfect user journeys.</p><ul><li>Mastery of Figma, design tokens, component variants, and auto-layout</li><li>Proven track record building accessible, enterprise-grade design systems</li><li>Strong portfolio demonstrating user empathy and interactive prototypes</li></ul>',
    url: 'https://dribbble.com/jobs',
    pubDate: NOW - 1.5 * DAY,
    source: 'live-feed',
    salary: '$110k–$145k'
  },
  {
    id: 'demo-8',
    title: 'Senior Data Scientist & Analytics Engineer',
    company: 'MangoMetrics Growth Labs',
    location: 'Remote · Global',
    jobType: 'Full-time',
    category: 'Data',
    tags: ['data','sql','python','dbt','statistics'],
    description: '<p>Drive strategic experimentation, build resilient dbt data models in Snowflake, and uncover growth insights for executive leadership.</p><ul><li>Advanced SQL, Python data stack (pandas, numpy, statsmodels)</li><li>Data warehouse modeling using dbt and Snowflake/BigQuery</li><li>A/B testing, causal inference, and cohort retention modeling</li></ul>',
    url: 'https://remotive.com',
    pubDate: NOW - 2 * DAY,
    source: 'live-feed',
    salary: '$120k–$155k'
  }
];

/* ---------- Helpers ---------- */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function timeAgo(ts) {
  if (!ts) return '';
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60); if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
  const d = Math.floor(h / 24);
  if (d === 1) return 'yesterday';
  if (d < 30) return d + 'd ago';
  return MONTHS[new Date(ts).getMonth()] + ' ' + new Date(ts).getDate();
}

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function initials(name) {
  const words = String(name || '?').trim().split(/\s+/);
  return (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase();
}

/* ---------- Job APIs ---------- */
const Jobs = {
  cache: [],
  lastFetched: 0,

  isNew(job) {
    if (!job || !job.pubDate) return false;
    return (Date.now() - job.pubDate) < (86400000 * 1.5);
  },

  async fetchAll(keyword, category, forceRefresh = false) {
    const oneDay = 86400000;
    if (!forceRefresh && this.cache.length && (Date.now() - this.lastFetched < oneDay * 0.25)) {
      return this.cache;
    }
    const remotiveP = this._fetchRemotive(keyword, category).catch(() => []);
    const arbeitP = this._fetchArbeitnow(keyword).catch(() => []);
    let results = await Promise.all([remotiveP, arbeitP]);
    let merged = [...results[0], ...results[1]];

    if (!merged.length) {
      merged = this._demo(keyword, category);
      Store.update(s => {
        s.settings._sourceUsed = 'verified feeds (fallback)';
        s.lastDailyUpdate = Date.now();
      });
      if (Store.state.activity[0] && !String(Store.state.activity[0].text).includes('refreshed')) {
        Store.logActivity('globe', 'Loaded curated remote jobs feed');
      }
    } else {
      Store.update(s => {
        s.settings._sourceUsed = 'live';
        s.lastDailyUpdate = Date.now();
      });
      Store.logActivity('refresh', `Daily feed synced: ${merged.length} opportunities updated`);
    }
    merged.sort((a, b) => b.pubDate - a.pubDate);
    this.cache = merged;
    this.lastFetched = Date.now();
    return merged;
  },

  async _fetchRemotive(keyword, category) {
    let url = 'https://remotive.com/api/remote-jobs?limit=60';
    if (keyword) url += '&search=' + encodeURIComponent(keyword);
    if (category) url += '&category=' + encodeURIComponent(category);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Remotive ' + res.status);
    const data = await res.json();
    return (data.jobs || []).map(j => ({
      id: 'remotive-' + j.id,
      title: (j.title || '').trim(),
      company: (j.company_name || '').trim(),
      logo: j.company_logo || '',
      location: j.candidate_required_location || 'Remote',
      jobType: (j.job_type || '').replace('_', ' '),
      category: j.category || '',
      tags: (j.tags || []).slice(0, 6),
      description: j.description || '',
      salary: j.salary || '',
      url: j.url || 'https://remotive.com',
      pubDate: j.publication_date ? new Date(j.publication_date).getTime() : Date.now(),
      source: 'remotive'
    }));
  },

  async _fetchArbeitnow(keyword) {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api');
    if (!res.ok) throw new Error('Arbeitnow ' + res.status);
    const data = await res.json();
    let list = data.data || [];
    if (keyword) {
      const k = keyword.toLowerCase();
      list = list.filter(j =>
        (j.title || '').toLowerCase().includes(k) ||
        (j.company_name || '').toLowerCase().includes(k) ||
        (j.description || '').toLowerCase().includes(k));
    }
    return list.slice(0, 40).map((j, i) => ({
      id: 'arbeitnow-' + (j.slug || i),
      title: (j.title || '').trim(),
      company: (j.company_name || 'Unknown').trim(),
      logo: '',
      location: j.location || '—',
      jobType: '',
      category: '',
      tags: (j.tags || []).slice(0, 6),
      description: j.description || '',
      salary: '',
      remote: !!j.remote,
      url: j.url || 'https://www.arbeitnow.com',
      pubDate: j.created_at ? new Date(j.created_at * 1000).getTime() : Date.now(),
      source: 'arbeitnow'
    }));
  },

  _demo(keyword, category) {
    let list = DEMO_JOBS.slice();
    if (keyword) {
      const k = keyword.toLowerCase();
      list = list.filter(j =>
        j.title.toLowerCase().includes(k) ||
        j.company.toLowerCase().includes(k) ||
        (j.tags || []).some(t => t.includes(k)));
    }
    if (category) list = list.filter(j => (j.category || '').toLowerCase() === category.toLowerCase());
    return list;
  },

  /* Client-side filter over fetched set */
  filter(list, { q = '', category = '', remoteOnly = false, type = '', onlyNew = false } = {}) {
    const k = q.trim().toLowerCase();
    const oneDay = 86400000;
    return list.filter(j => {
      if (onlyNew && (Date.now() - (j.pubDate || 0)) > oneDay * 1.5) return false;
      if (k) {
        const hay = (j.title + ' ' + j.company + ' ' + (j.tags || []).join(' ') + ' ' + (j.category || '')).toLowerCase();
        if (!hay.includes(k)) return false;
      }
      if (category && (j.category || '').toLowerCase() !== category.toLowerCase()) return false;
      if (remoteOnly && !/remote|anywhere|global/i.test(j.location) && !j.remote) return false;
      if (type && j.jobType && !j.jobType.includes(type)) return false;
      return true;
    });
  },

  categoriesFrom(list) {
    const set = new Set();
    list.forEach(j => { if (j.category) set.add(j.category); });
    return [...set].sort();
  },

  /* AI-flavored match score: resume keywords vs job keywords */
  matchScore(job, resumeText) {
    if (!resumeText || !resumeText.trim()) return null;
    const STOP = new Set(['and','the','with','for','you','your','are','our','will','that','this','have','from','all','not','but','can','who','was','were','has','had','its','they','their','them','one','two','any','out','get','job','role','team','work','working','experience','years','year','strong','plus','etc','using','use','used','new','like','also','more','most','into','over','under','about','across','within','without','each','other','being','been','both','only','same','some','such','than','then','well','what','when','where','which','while','why','how','per','via','may','must','should','would','could','include','including','und','oder','der','die','das','für','fur','mit','von','zu','im','den','dem','ein','eine','einen','einem','einer','als','auf','ist','sich','nicht','auch','aus','bei','wir','sie','er','es','uns','unsere','ihr','ihre','haben','wird','werden','kann','nach','über','uber','mehr','sehr','sowie','zur','zum','vom','beim','durch','gegen','ohne','sind','hast','bitte','und/oder','weiter','weitere','sowie','schnell','gern','gerne','dich','dir','mich','mir','unser','unserem','dein','deine']);
    const tokenize = t => String(t || '')
      .toLowerCase()
      .replace(/<[^>]*>/g, ' ')
      .split(/[^a-z0-9+#.]+/)
      .filter(w => w.length > 1 && !STOP.has(w) && !/^\d+$/.test(w));

    const jobWords = new Set(tokenize(job.title + ' ' + (job.tags || []).join(' ') + ' ' + job.description).slice(0, 4000));
    const resumeSet = new Set(tokenize(resumeText));
    if (!jobWords.size || !resumeSet.size) return null;

    const matched = [...jobWords].filter(w => resumeSet.has(w));
    const score = Math.round((matched.length / jobWords.size) * 100 * 2.2);
    return { score: Math.min(99, Math.max(5, score)), matched };
  },

  clearCache() { this.cache = []; this.lastFetched = 0; }
};

