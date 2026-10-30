/* ============================================================
   JobPilot AI — State store (localStorage, zero dependencies)
   ============================================================ */
'use strict';

const Store = {
  KEY: 'jobpilot.state.v1',

  defaults() {
    return {
      version: 1,
      firstVisit: true,
      settings: {
        provider: 'template',          // template | openai | groq | openrouter | custom
        baseUrl: '',
        apiKey: '',
        model: '',
        temperature: 0.7
      },
      resume: {
        name: '', email: '', phone: '', location: '', links: '',
        content: '', updatedAt: null
      },
      savedJobs: [],     // normalized job objects
      applications: [],  // { id, job, status, note, createdAt, updatedAt, history:[{status, at}] }
      activity: [],      // { at, icon, text }
      lastDailyUpdate: 0 // timestamp of latest daily job sync
    };
  },

  state: null,
  listeners: [],

  load() {
    let data = null;
    try { data = JSON.parse(localStorage.getItem(this.KEY) || 'null'); } catch (_) { data = null; }
    const base = this.defaults();
    if (data && typeof data === 'object') {
      // shallow-merge top level, deep-merge settings & resume
      this.state = { ...base, ...data, settings: { ...base.settings, ...(data.settings || {}) }, resume: { ...base.resume, ...(data.resume || {}) } };
    } else {
      this.state = base;
    }
    return this.state;
  },

  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.state)); }
    catch (e) { console.warn('Could not persist state', e); }
  },

  update(mutator) {
    const result = mutator(this.state);
    this.save();
    this.emit();
    return result;
  },

  on(fn) { this.listeners.push(fn); },
  emit() { this.listeners.forEach(fn => { try { fn(this.state); } catch (e) { console.error(e); } }); },

  /* ---------- Domain helpers ---------- */

  logActivity(icon, text) {
    this.state.activity.unshift({ at: Date.now(), icon: icon || 'zap', text });
    if (this.state.activity.length > 40) this.state.activity.length = 40;
  },

  isSaved(jobId) { return this.state.savedJobs.some(j => j.id === jobId); },
  isTracked(jobId) { return this.state.applications.some(a => a.job.id === jobId); },

  saveJob(job) {
    if (this.isSaved(job.id)) return false;
    this.state.savedJobs.unshift(job);
    if (this.state.savedJobs.length > 80) this.state.savedJobs.length = 80;
    this.logActivity('star', 'Saved job: ' + job.title + ' @ ' + job.company);
    return true;
  },

  unsaveJob(jobId) {
    this.state.savedJobs = this.state.savedJobs.filter(j => j.id !== jobId);
  },

  trackJob(job, status = 'wishlist', note = '') {
    if (this.isTracked(job.id)) return false;
    const now = Date.now();
    this.state.applications.unshift({
      id: 'app-' + now.toString(36) + Math.random().toString(36).slice(2, 6),
      job,
      status,
      note: note || '',
      createdAt: now,
      updatedAt: now,
      history: [{ status, at: now }]
    });
    this.logActivity('pipeline', 'Tracking: ' + job.title + ' @ ' + job.company + ' (' + status.toUpperCase() + ')');
    return true;
  },

  createCustomJob(jobData, initialStatus = 'wishlist', note = '') {
    const now = Date.now();
    const customJob = {
      id: 'custom-' + now.toString(36) + Math.random().toString(36).slice(2, 6),
      title: (jobData.title || 'Target Role').trim(),
      company: (jobData.company || 'Direct Employer').trim(),
      logo: '',
      location: (jobData.location || 'Remote').trim(),
      jobType: (jobData.jobType || 'Full-time').trim(),
      category: (jobData.category || 'Engineering').trim(),
      tags: Array.isArray(jobData.tags) ? jobData.tags : (jobData.tags || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      description: jobData.description || '<p>Direct application tracked manually.</p>',
      salary: (jobData.salary || '').trim(),
      url: (jobData.url || '').trim() || '#',
      pubDate: now,
      source: 'custom'
    };
    this.trackJob(customJob, initialStatus, note);
    this.logActivity('rocket', 'Created custom job application: ' + customJob.title + ' @ ' + customJob.company);
    return customJob;
  },

  markApplied(job, note = '') {
    const existing = this.state.applications.find(a => a.job.id === job.id);
    const now = Date.now();
    if (existing) {
      existing.status = 'applied';
      existing.updatedAt = now;
      if (note) existing.note = (existing.note ? existing.note + ' | ' : '') + note;
      existing.history.push({ status: 'applied', at: now });
      this.logActivity('send', 'Marked applied: ' + existing.job.title + ' @ ' + existing.job.company);
    } else {
      this.trackJob(job, 'applied', note || 'Applied directly on site');
    }
    this.save();
    this.emit();
    return true;
  },

  setAppStatus(appId, status) {
    const app = this.state.applications.find(a => a.id === appId);
    if (!app || app.status === status) return false;
    app.status = status;
    app.updatedAt = Date.now();
    app.history.push({ status, at: app.updatedAt });
    this.logActivity('refresh', 'Moved "' + app.job.title + '" to ' + status.toUpperCase());
    return true;
  },

  setAppNote(appId, note) {
    const app = this.state.applications.find(a => a.id === appId);
    if (!app) return;
    app.note = note;
    app.updatedAt = Date.now();
    this.save();
  },

  deleteApp(appId) {
    this.state.applications = this.state.applications.filter(a => a.id !== appId);
  },

  exportData() { return JSON.stringify(this.state, null, 2); },

  importData(json) {
    const data = JSON.parse(json);
    if (!data || typeof data !== 'object') throw new Error('Invalid file');
    this.state = { ...this.defaults(), ...data, settings: { ...this.defaults().settings, ...(data.settings || {}) }, resume: { ...this.defaults().resume, ...(data.resume || {}) } };
    this.save();
    this.emit();
  },

  reset() {
    this.state = this.defaults();
    this.save();
    this.emit();
  }
};

Store.load();
