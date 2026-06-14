/* =============================================
   DRAWER — Slide-out Management Panel
   ============================================= */

import { getState, addProject, addSkill, addMilestone, removeProject, removeSkill, removeMilestone } from './state.js';

let isOpen = false;
let onPublishCallback = null;

// ── SVG Icons ──
const closeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
const plusIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
const trashIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
const publishIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

const CATEGORY_OPTIONS = [
  { value: 'programming', label: 'Programming' },
  { value: 'analytics', label: 'Data Analytics & BI' },
  { value: 'ai', label: 'AI & Automation' },
];

// ── Supabase Configurations ──
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// ── Brute Force Lockout Settings ──
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 60000; // 1 minute security lock

// ── Helper functions for Crypto and Auth ──
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function checkAuth() {
  return sessionStorage.getItem('control_space_auth') === 'true';
}

function getLockoutState() {
  const attempts = parseInt(localStorage.getItem('cs_login_attempts') || '0', 10);
  const lockoutTime = parseInt(localStorage.getItem('cs_lockout_until') || '0', 10);
  const now = Date.now();

  if (lockoutTime > now) {
    return { isLocked: true, timeLeftMs: lockoutTime - now };
  } else if (lockoutTime > 0 && lockoutTime <= now) {
    // Lockout expired
    localStorage.removeItem('cs_login_attempts');
    localStorage.removeItem('cs_lockout_until');
    return { isLocked: false, timeLeftMs: 0 };
  }

  return { isLocked: false, timeLeftMs: 0 };
}

async function notifyFailedLogin() {
  try {
    let loc = null;
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) loc = await res.json();
    } catch {}

    const payload = {
      _subject: '🚨 SECURITY ALERT: 3 Failed Login Attempts on Control Space!',
      alert: 'Warning: An unauthorized access attempt was blocked. A user entered invalid passkeys 3 times.',
      intruder_ip: loc?.ip || 'Unknown IP',
      intruder_location: loc ? `${loc.city || 'Unknown City'}, ${loc.region || ''}, ${loc.country_name || 'Unknown Country'}` : 'Unknown Location',
      network_provider: loc?.org || 'Unknown ISP',
      timestamp: new Date().toLocaleString(),
      user_agent: navigator.userAgent
    };

    await fetch('https://formsubmit.co/ajax/sushantshrimal08@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Failed to transmit security alert:", err);
  }
}

function recordFailedAttempt() {
  let attempts = parseInt(localStorage.getItem('cs_login_attempts') || '0', 10);
  attempts += 1;
  localStorage.setItem('cs_login_attempts', attempts.toString());

  if (attempts >= MAX_ATTEMPTS) {
    const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
    localStorage.setItem('cs_lockout_until', lockoutUntil.toString());
    
    // Notify about failed login attempts
    notifyFailedLogin();
    
    return true; // Lockout active
  }
  return false;
}

function clearLoginAttempts() {
  localStorage.removeItem('cs_login_attempts');
  localStorage.removeItem('cs_lockout_until');
}

/**
 * Initialize the drawer
 */
export function initDrawer(onPublish) {
  onPublishCallback = onPublish;
}

/**
 * Open the drawer
 */
export function openDrawer() {
  const root = document.getElementById('drawer-root');
  if (!root) return;

  if (checkAuth()) {
    root.innerHTML = renderDrawer();
    bindDrawerEvents();
  } else {
    root.innerHTML = renderLoginForm();
    bindLoginEvents();
  }

  // Trigger open animation (next frame)
  requestAnimationFrame(() => {
    document.getElementById('drawer-backdrop').classList.add('open');
    document.getElementById('drawer-panel').classList.add('open');
  });

  isOpen = true;
  document.body.style.overflow = 'hidden';
}

/**
 * Close the drawer
 */
export function closeDrawer() {
  const backdrop = document.getElementById('drawer-backdrop');
  const panel = document.getElementById('drawer-panel');

  if (backdrop) backdrop.classList.remove('open');
  if (panel) panel.classList.remove('open');

  // Wait for animation to finish before removing DOM
  setTimeout(() => {
    const root = document.getElementById('drawer-root');
    if (root) root.innerHTML = '';
  }, 500);

  // Clear authentication token so login is required on next click
  sessionStorage.removeItem('control_space_auth');
  sessionStorage.removeItem('supabase_access_token');

  isOpen = false;
  document.body.style.overflow = '';
}

/**
 * Show toast notification
 */
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

/**
 * Render Lock Screen / Login Form with lockout tracking and cloud DB toggles
 */
function renderLoginForm() {
  const lockout = getLockoutState();
  if (lockout.isLocked) {
    const secondsLeft = Math.ceil(lockout.timeLeftMs / 1000);
    return `
      <div class="drawer-backdrop" id="drawer-backdrop"></div>
      <div class="drawer" id="drawer-panel">
        <div class="drawer-header">
          <h2 class="drawer-title">Console Locked</h2>
          <button class="drawer-close" id="drawer-close" title="Close">
            ${closeIcon}
          </button>
        </div>
        <div class="drawer-body" style="display:flex; flex-direction:column; justify-content:center; align-items:center; padding: 40px var(--space-xl); text-align:center;">
          <div style="font-size: 48px; margin-bottom: var(--space-md); filter: drop-shadow(0 0 10px rgba(255, 59, 48, 0.4));">🚨</div>
          <h3 style="font-size: var(--text-h3); margin-bottom: var(--space-xs); font-family: 'Poppins', sans-serif; font-weight: 700; color: #ff3b30;">Security Lockout Active</h3>
          <p style="font-size: var(--text-small); color: var(--text-muted); margin-bottom: var(--space-lg); max-width:280px; line-height:1.5;">Too many failed credentials matches. Access panel disabled temporarily.</p>
          <div style="font-size: 24px; font-weight: 700; font-family: monospace; color: var(--text-primary);" id="lockout-timer">Retry in ${secondsLeft}s</div>
        </div>
      </div>
    `;
  }

  if (isSupabaseConfigured) {
    return `
      <div class="drawer-backdrop" id="drawer-backdrop"></div>
      <div class="drawer" id="drawer-panel">
        <div class="drawer-header">
          <h2 class="drawer-title">Database Sign In</h2>
          <button class="drawer-close" id="drawer-close" title="Close">
            ${closeIcon}
          </button>
        </div>

        <div class="drawer-body" style="display:flex; flex-direction:column; justify-content:center; align-items:center; padding: 40px var(--space-xl); text-align:center;">
          <div style="font-size: 48px; margin-bottom: var(--space-md); filter: drop-shadow(0 0 10px rgba(0,212,255,0.4));">☁️</div>
          <h3 style="font-size: var(--text-h3); margin-bottom: var(--space-xs); font-family: 'Poppins', sans-serif; font-weight: 700;">Control Space Cloud</h3>
          <p style="font-size: var(--text-small); color: var(--text-muted); margin-bottom: var(--space-lg); max-width:280px; line-height:1.5;">Syncing live updates to Supabase PostgreSQL. Authenticate with your database account.</p>
          
          <div style="width:100%; max-width: 280px; text-align: left;">
            <div class="form-group">
              <label class="form-label">Admin Email</label>
              <input type="email" class="form-input" id="admin-email-input" placeholder="admin@domain.com" style="margin-bottom: var(--space-sm);" />
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" id="admin-pass-input" placeholder="••••••••" style="margin-bottom: var(--space-sm);" />
            </div>
            <button class="btn-publish" id="btn-admin-login" style="width:100%; justify-content:center; display:flex;">Sign In</button>
            <div id="login-error-msg" style="color: #ff3b30; font-size: var(--text-xs); margin-top: 12px; text-align: center; font-weight: 600;"></div>
          </div>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="drawer-backdrop" id="drawer-backdrop"></div>
      <div class="drawer" id="drawer-panel">
        <div class="drawer-header">
          <h2 class="drawer-title">Control Space Lock</h2>
          <button class="drawer-close" id="drawer-close" title="Close">
            ${closeIcon}
          </button>
        </div>

        <div class="drawer-body" style="display:flex; flex-direction:column; justify-content:center; align-items:center; padding: 40px var(--space-xl); text-align:center;">
          <div style="font-size: 48px; margin-bottom: var(--space-md); filter: drop-shadow(0 0 10px rgba(0,212,255,0.4));">🔒</div>
          <h3 style="font-size: var(--text-h3); margin-bottom: var(--space-xs); font-family: 'Poppins', sans-serif; font-weight: 700;">Control Space Secured</h3>
          <p style="font-size: var(--text-small); color: var(--text-muted); margin-bottom: var(--space-lg); max-width:280px; line-height:1.5;">Running in local storage fallback mode. Verify with your local admin passkey.</p>
          
          <div style="width:100%; max-width: 280px; text-align: left;">
            <div class="form-group">
              <label class="form-label">Admin Security Key</label>
              <input type="password" class="form-input" id="admin-pass-input" placeholder="Enter security password..." style="margin-bottom: var(--space-sm);" />
            </div>
            <button class="btn-publish" id="btn-admin-login" style="width:100%; justify-content:center; display:flex;">Verify Credentials</button>
            <div id="login-error-msg" style="color: #ff3b30; font-size: var(--text-xs); margin-top: 12px; text-align: center; font-weight: 600;"></div>
          </div>
        </div>
      </div>
    `;
  }
}

/**
 * Bind login events supporting lockout counts and database authorization JWTs
 */
function bindLoginEvents() {
  document.getElementById('drawer-close')?.addEventListener('click', closeDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', closeDrawer);

  const lockout = getLockoutState();
  if (lockout.isLocked) {
    const timerEl = document.getElementById('lockout-timer');
    const intervalId = setInterval(() => {
      const lockState = getLockoutState();
      if (lockState.isLocked) {
        if (timerEl) {
          timerEl.textContent = `Retry in ${Math.ceil(lockState.timeLeftMs / 1000)}s`;
        }
      } else {
        clearInterval(intervalId);
        refreshDrawerContent();
      }
    }, 1000);
    return;
  }

  const loginBtn = document.getElementById('btn-admin-login');
  const emailInput = document.getElementById('admin-email-input');
  const passInput = document.getElementById('admin-pass-input');
  const errorEl = document.getElementById('login-error-msg');

  setTimeout(() => {
    if (emailInput) emailInput.focus();
    else if (passInput) passInput.focus();
  }, 100);

  const doLogin = async () => {
    const password = passInput?.value;
    if (!password) return;

    loginBtn.disabled = true;
    loginBtn.textContent = "Verifying...";
    errorEl.textContent = "";

    if (isSupabaseConfigured) {
      const email = emailInput?.value.trim();
      if (!email) {
        errorEl.textContent = "Email address required.";
        loginBtn.disabled = false;
        loginBtn.textContent = "Sign In";
        return;
      }

      try {
        const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'apikey': supabaseAnonKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        if (res.ok) {
          const authData = await res.json();
          if (authData && authData.access_token) {
            sessionStorage.setItem('supabase_access_token', authData.access_token);
            sessionStorage.setItem('control_space_auth', 'true');
            clearLoginAttempts();
            showToast('✓ Cloud authentication successful.');
            refreshDrawerContent();
            return;
          }
        }
        throw new Error('Invalid email or password');
      } catch (err) {
        recordFailedAttempt();
        errorEl.textContent = 'Sign-in failed. Check database credentials.';
        passInput.value = '';
        passInput.focus();
        loginBtn.disabled = false;
        loginBtn.textContent = "Sign In";
        
        if (getLockoutState().isLocked) {
          refreshDrawerContent();
        }
      }
    } else {
      const hashed = await sha256(password);
      const targetHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH || '714304a416437f8e85819465d108d980de0088b2c6a2deee1fd2de49215bf037';

      if (hashed === targetHash) {
        sessionStorage.setItem('control_space_auth', 'true');
        clearLoginAttempts();
        showToast('✓ Authentication successful.');
        refreshDrawerContent();
      } else {
        recordFailedAttempt();
        errorEl.textContent = 'Incorrect key. Authentication failure.';
        passInput.value = '';
        passInput.focus();
        loginBtn.disabled = false;
        loginBtn.textContent = "Verify Credentials";

        if (getLockoutState().isLocked) {
          refreshDrawerContent();
        }
      }
    }
  };

  loginBtn?.addEventListener('click', doLogin);
  passInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') doLogin();
  });
  emailInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') passInput?.focus();
  });
}

/**
 * Render the editor drawer HTML
 */
function renderDrawer() {
  const state = getState();

  // Existing projects list
  const existingProjects = state.projects
    .map(p => `
      <div class="existing-item">
        <span class="existing-item-title">${p.title}</span>
        <button class="btn-delete" data-action="delete-project" data-id="${p.id}" title="Remove">
          ${trashIcon}
        </button>
      </div>
    `)
    .join('');

  // Existing skills by category
  const existingSkills = Object.entries(state.skills)
    .map(([cat, skills]) => {
      const label = CATEGORY_OPTIONS.find(c => c.value === cat)?.label || cat;
      const pills = skills
        .map(s => `
          <span class="skill-pill" style="cursor:pointer;" data-action="delete-skill" data-category="${cat}" data-skill="${s}" title="Click to remove">
            ${s} ×
          </span>
        `)
        .join('');
      return `<div style="margin-bottom: var(--space-sm);">
        <span style="font-size: var(--text-xs); color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em;">${label}</span>
        <div class="bento-skills" style="margin-top: var(--space-xs);">${pills}</div>
      </div>`;
    })
    .join('');

  // Existing milestones
  const existingMilestones = state.milestones
    .map(m => `
      <div class="existing-item">
        <span class="existing-item-title">${m.date} — ${m.title}</span>
        <button class="btn-delete" data-action="delete-milestone" data-id="${m.id}" title="Remove">
          ${trashIcon}
        </button>
      </div>
    `)
    .join('');

  // Category select options
  const categoryOptions = CATEGORY_OPTIONS
    .map(c => `<option value="${c.value}">${c.label}</option>`)
    .join('');

  return `
    <div class="drawer-backdrop" id="drawer-backdrop"></div>
    <div class="drawer" id="drawer-panel">
      <div class="drawer-header">
        <h2 class="drawer-title">Control Space</h2>
        <button class="drawer-close" id="drawer-close" title="Close">
          ${closeIcon}
        </button>
      </div>

      <div class="drawer-body">
        <!-- ── Projects ── -->
        <div class="drawer-section">
          <h3 class="drawer-section-title">Projects</h3>
          <div class="existing-items" id="existing-projects">
            ${existingProjects}
          </div>
          <div class="form-group">
            <label class="form-label">Title</label>
            <input type="text" class="form-input" id="project-title" placeholder="Project title..." />
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-input" id="project-desc" placeholder="Brief description..." rows="3"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Tags (comma-separated)</label>
              <input type="text" class="form-input" id="project-tags" placeholder="Python, API, Cloud" />
            </div>
            <div class="form-group">
              <label class="form-label">GitHub URL</label>
              <input type="text" class="form-input" id="project-github" placeholder="https://github.com/..." />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Image URL (optional)</label>
            <input type="text" class="form-input" id="project-image" placeholder="https://..." />
          </div>
          <button class="btn-add" id="btn-add-project">
            ${plusIcon} Add Project
          </button>
        </div>

        <!-- ── Skills ── -->
        <div class="drawer-section">
          <h3 class="drawer-section-title">Skills</h3>
          <div class="existing-items" id="existing-skills">
            ${existingSkills}
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-input" id="skill-category">
                ${categoryOptions}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Skill Name</label>
              <input type="text" class="form-input" id="skill-name" placeholder="e.g. TensorFlow" />
            </div>
          </div>
          <button class="btn-add" id="btn-add-skill">
            ${plusIcon} Add Skill
          </button>
        </div>

        <!-- ── Milestones ── -->
        <div class="drawer-section">
          <h3 class="drawer-section-title">Milestones</h3>
          <div class="existing-items" id="existing-milestones">
            ${existingMilestones}
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Date / Year</label>
              <input type="text" class="form-input" id="milestone-date" placeholder="e.g. March 2025" />
            </div>
            <div class="form-group">
              <label class="form-label">Title</label>
              <input type="text" class="form-input" id="milestone-title" placeholder="Role or Achievement" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-input" id="milestone-desc" placeholder="Brief description..." rows="2"></textarea>
          </div>
          <button class="btn-add" id="btn-add-milestone">
            ${plusIcon} Add Milestone
          </button>
        </div>

        <!-- ── Audio & Voice Controls ── -->
        <div class="drawer-section" style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: var(--space-md); margin-top: var(--space-lg);">
          <h3 class="drawer-section-title">Audio &amp; Voice Controls</h3>
          
          <div class="form-group">
            <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
              <span>Assistant Voice Volume</span>
              <span id="cs-voice-volume-label" style="font-weight:700; color:var(--accent);">80%</span>
            </label>
            <input type="range" id="cs-voice-volume-slider" min="0" max="100" value="80" class="form-input" style="height:6px; cursor:pointer; accent-color:var(--accent); padding:0; background:rgba(255,255,255,0.05);" />
          </div>

          <div class="form-group" style="margin-top: var(--space-md);">
            <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
              <span>Background Music Volume</span>
              <span id="cs-music-volume-label" style="font-weight:700; color:var(--accent);">20%</span>
            </label>
            <input type="range" id="cs-music-volume-slider" min="0" max="100" value="20" class="form-input" style="height:6px; cursor:pointer; accent-color:var(--accent); padding:0; background:rgba(255,255,255,0.05);" />
          </div>

          <div class="form-group" style="margin-top: var(--space-md);">
            <label class="form-label">Background Music Track</label>
            <select class="form-input" id="cs-music-track-select" style="cursor:pointer;">
              <option value="0">Ambient Track (ambient.mp3 / ambient.mp4)</option>
              <option value="2">Music Track (music.mp3 / music.mp4)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="drawer-footer">
        <button class="btn-publish" id="btn-publish">
          ${publishIcon} Save &amp; Update Live Site
        </button>
      </div>
    </div>
  `;
}

/**
 * Bind drawer event listeners
 */
function bindDrawerEvents() {
  document.getElementById('drawer-close')?.addEventListener('click', closeDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', closeDrawer);

  // Escape key
  const escHandler = (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeDrawer();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  // ── Add Project ──
  document.getElementById('btn-add-project')?.addEventListener('click', () => {
    const title = document.getElementById('project-title')?.value.trim();
    const desc = document.getElementById('project-desc')?.value.trim();
    const tags = document.getElementById('project-tags')?.value.trim();
    const github = document.getElementById('project-github')?.value.trim();
    const image = document.getElementById('project-image')?.value.trim();

    if (!title || !desc) {
      showToast('Please fill in project title and description.');
      return;
    }

    addProject({
      title,
      description: desc,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      github: github || 'https://github.com/sushant2701',
      image: image || ''
    });

    showToast(`Project "${title}" added!`);
    refreshDrawerContent();
  });

  // ── Add Skill ──
  document.getElementById('btn-add-skill')?.addEventListener('click', () => {
    const category = document.getElementById('skill-category')?.value;
    const name = document.getElementById('skill-name')?.value.trim();

    if (!name) {
      showToast('Please enter a skill name.');
      return;
    }

    addSkill(category, name);
    showToast(`Skill "${name}" added!`);
    refreshDrawerContent();
  });

  // ── Add Milestone ──
  document.getElementById('btn-add-milestone')?.addEventListener('click', () => {
    const date = document.getElementById('milestone-date')?.value.trim();
    const title = document.getElementById('milestone-title')?.value.trim();
    const desc = document.getElementById('milestone-desc')?.value.trim();

    if (!date || !title) {
      showToast('Please fill in date and title.');
      return;
    }

    addMilestone({
      date,
      title,
      description: desc || ''
    });

    showToast(`Milestone "${title}" added!`);
    refreshDrawerContent();
  });

  // ── Delete handlers (event delegation) ──
  document.getElementById('drawer-panel')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;

    if (action === 'delete-project') {
      removeProject(btn.dataset.id);
      showToast('Project removed.');
      refreshDrawerContent();
    }

    if (action === 'delete-skill') {
      removeSkill(btn.dataset.category, btn.dataset.skill);
      showToast('Skill removed.');
      refreshDrawerContent();
    }

    if (action === 'delete-milestone') {
      removeMilestone(btn.dataset.id);
      showToast('Milestone removed.');
      refreshDrawerContent();
    }
  });

  // ── Audio & Assistant Controls ──
  const voiceSlider = document.getElementById('cs-voice-volume-slider');
  const voiceLabel = document.getElementById('cs-voice-volume-label');
  const musicSlider = document.getElementById('cs-music-volume-slider');
  const musicLabel = document.getElementById('cs-music-volume-label');
  const trackSelect = document.getElementById('cs-music-track-select');

  // Sync initial values from global state
  if (voiceSlider) {
    voiceSlider.value = Math.round((window.speechVolume || 0.8) * 100);
    if (voiceLabel) voiceLabel.textContent = `${voiceSlider.value}%`;
  }
  if (musicSlider) {
    musicSlider.value = Math.round((window.musicVolume || 0.2) * 100);
    if (musicLabel) musicLabel.textContent = `${musicSlider.value}%`;
  }
  if (trackSelect) {
    const defaultIdx = typeof window.musicTrackIndex === 'number' ? window.musicTrackIndex : 0;
    // Normalize to exact option value: if 0/1 use 0, if 2/3 use 2
    trackSelect.value = defaultIdx >= 2 ? '2' : '0';
  }

  // Bind inputs
  if (voiceSlider) {
    voiceSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value) / 100;
      window.speechVolume = vol;
      if (voiceLabel) voiceLabel.textContent = `${e.target.value}%`;
      localStorage.setItem('cs_speech_volume', vol.toString());
    });
  }

  if (musicSlider) {
    musicSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value) / 100;
      window.musicVolume = vol;
      if (window.updateBgMusicVolume) {
        window.updateBgMusicVolume(vol);
      }
      if (musicLabel) musicLabel.textContent = `${e.target.value}%`;
      localStorage.setItem('cs_music_volume', vol.toString());
    });
  }

  if (trackSelect) {
    trackSelect.addEventListener('change', (e) => {
      const index = parseInt(e.target.value, 10);
      window.musicTrackIndex = index;
      if (window.changeBgMusicTrack) {
        window.changeBgMusicTrack(index);
      }
      localStorage.setItem('cs_music_track_index', index.toString());
    });
  }

  // ── Publish ──
  document.getElementById('btn-publish')?.addEventListener('click', () => {
    closeDrawer();
    showToast('✓ Portfolio updated live!');
    if (onPublishCallback) {
      setTimeout(onPublishCallback, 300);
    }
  });
}

/**
 * Refresh drawer content in-place
 */
function refreshDrawerContent() {
  const root = document.getElementById('drawer-root');
  if (!root) return;

  if (checkAuth()) {
    root.innerHTML = renderDrawer();
    requestAnimationFrame(() => {
      document.getElementById('drawer-backdrop')?.classList.add('open');
      document.getElementById('drawer-panel')?.classList.add('open');
      bindDrawerEvents();
    });
  } else {
    root.innerHTML = renderLoginForm();
    requestAnimationFrame(() => {
      document.getElementById('drawer-backdrop')?.classList.add('open');
      document.getElementById('drawer-panel')?.classList.add('open');
      bindLoginEvents();
    });
  }
}
