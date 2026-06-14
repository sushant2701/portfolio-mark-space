/* =============================================
   PORTFOLIO — Light Mode Professional Renderer
   ============================================= */

import { getState } from './state.js';

// ── SVG Icons ──
const icons = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  database: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
  brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
  cube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
};

const SKILL_CATEGORY_META = {
  generativeAI: { label: 'Generative AI & LLMs', icon: icons.brain },
  machineLearning: { label: 'Machine Learning', icon: icons.cube },
  programmingQuery: { label: 'Programming & Query', icon: icons.code },
  dataAnalysis: { label: 'Data Analysis & Stats', icon: icons.chart },
  visualizationDeployment: { label: 'Visualization & Deployment', icon: icons.cloud }
};

/**
 * Render the full portfolio
 */
export function renderPortfolio() {
  const state = getState();
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="blob-container">
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>
      <div class="bg-blob blob-3"></div>
      <div class="bg-blob blob-4"></div>
    </div>
    <div class="mouse-follower" id="mouse-follower"></div>
    ${renderNavbar()}
    ${renderHero()}
    ${renderStats()}
    ${renderAbout(state)}
    ${renderEducation()}
    ${renderSkills(state)}
    ${renderProjects(state)}
    ${renderFooter()}
    <div id="drawer-root"></div>
  `;
}

// ── Navbar ──
function renderNavbar() {
  return `
    <nav class="navbar" id="navbar">
      <div class="nav-container">
        <a href="#" class="nav-logo">
          <span class="nav-logo-text">MARK_SPACE</span>
        </a>
        <div class="nav-links">
          <a href="#about" class="nav-link">About</a>
          <a href="#education" class="nav-link">Education</a>
          <a href="#skills" class="nav-link">Skills</a>
          <div class="nav-dropdown-wrapper">
            <a href="#projects" class="nav-link nav-dropdown-trigger">Projects <span class="chevron-down">▼</span></a>
            <div class="nav-dropdown-menu">
              <a href="#projects-ai-machine-learning" class="nav-dropdown-item">AI &amp; ML</a>
              <a href="#projects-data-analytics-bi" class="nav-dropdown-item">Data Analytics</a>
              <a href="#projects-web-development-security" class="nav-dropdown-item">Web Dev</a>
              <a href="#projects-iot-embedded-systems" class="nav-dropdown-item">IoT &amp; Systems</a>
            </div>
          </div>
        </div>
        <div class="nav-actions" style="position: relative; display: flex; align-items: center; gap: 8px;">
          <button class="nav-navigator-btn" id="nav-navigator-btn" title="Enable Voice Command Screen Control">
            <span class="nav-mic-pulse"></span>
            <span style="display:inline-flex; align-items:center; width:13px; height:13px; margin-right:4px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v11a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
            </span>
            <span class="nav-btn-text">Voice Command: <span id="nav-navigator-status">OFF</span></span>
          </button>
          <button class="nav-navigator-speaker-btn" id="nav-navigator-speaker-btn" title="Mute/Unmute Voice Assistant Speaker Feedback" style="padding: 0 8px; height: 32px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.02); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s ease;">🔇</button>
          <button class="nav-navigator-help-btn" id="nav-navigator-help-btn" title="Show Voice Command Guide" style="padding: 0 8px; height: 32px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.02); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s ease;">❓</button>
          <button class="nav-navigator-refresh-btn" id="nav-navigator-refresh-btn" title="Refresh Voice Assistant Recognition" style="padding: 0; width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.02); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; pointer-events: none;"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          </button>
          <div class="nav-voice-instr" id="nav-voice-instr">
            <div style="font-weight: 700; margin-bottom: 4px; color: var(--accent);">🎙️ Alexa "Mark" Voice Guide</div>
            <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 6px;">Say <b>"Mark"</b> or <b>"Hey Mark"</b> followed by:</div>
            <ul style="margin: 0; padding-left: 12px; line-height: 1.4; font-size: 10px;">
              <li>"...show skills" (Scrolls to Skills)</li>
              <li>"...tell me about projects"</li>
              <li>"...tell about grahak project"</li>
              <li>"...tell about otp auth"</li>
              <li>"...explain disease prediction"</li>
              <li>"...go to education"</li>
              <li>"...open linkedin" / "github"</li>
              <li>"...open control space"</li>
            </ul>
            <div style="font-size: 9px; margin-top: 6px; color: var(--text-muted); font-style: italic;">* Plays double-beep confirmation tone on activation. Turn on speaker (🔊) for voice guide narration.</div>
          </div>
          <a href="#" id="nav-contact-btn"
             class="nav-cta">
            Contact Me!
          </a>
        </div>
        <button class="nav-toggle" id="nav-toggle" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `;
}

// ── Hero ──
function renderHero() {
  return `
    <section class="hero" id="hero">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content" data-animate>
            <div class="hero-badge">
              Hello there <span class="wave">👋</span>
            </div>
            <h1 class="hero-heading" data-animate data-delay="1">
              I'm <span class="reveal-wrapper"><span class="reveal-content" id="reveal-name">Sushant Shrimal</span><span class="reveal-box"></span></span>
            </h1>
            <h2 class="hero-subtitle-typing" data-animate data-delay="2">
              --<span id="typewriter" data-words='["AI Engineer", "Data Scientist", "Prompt Engineer", "ML Developer"]'></span><span class="typewriter-cursor">|</span>
            </h2>
            <p class="hero-description" data-animate data-delay="3">
              Final-year B.Tech student and aspiring Data Scientist and AI Engineer with hands-on experience building predictive models, prompt workflows, and automated data pipelines.
            </p>
            <div class="hero-cta-group" data-animate data-delay="4">
              <a href="#projects" class="btn btn-accent">
                View Work
              </a>
            </div>
          </div>
          <div class="hero-visual" data-animate data-delay="2">
            <div class="hero-portrait-container">
              <div class="hero-portrait-wrapper">
                <img src="/sushant-portrait.jpg" alt="Sushant Shrimal" class="hero-portrait" />
              </div>
              <div class="rainbow-ring"></div>
            </div>
            <a href="#" id="hero-available-btn" class="float-card float-available">
              <span class="float-dot"></span>
              Available for projects
            </a>
            <a href="https://www.linkedin.com/in/sushant-shrimal-017128251/" target="_blank" rel="noopener noreferrer" class="float-card float-linkedin">
              <div class="float-avatar" style="color:#0077b5;background:rgba(0,119,181,0.08);">${icons.linkedin}</div>
              LinkedIn
            </a>
            <a href="https://github.com/sushant2701" target="_blank" rel="noopener noreferrer" class="float-card float-github">
              <div class="float-avatar" style="color:#24292f;background:rgba(36,41,47,0.08);">${icons.github}</div>
              GitHub
            </a>
            <a href="#footer" class="float-card float-location">
              <span class="float-emoji">📍</span>
              Solapur, India
            </a>
            <a href="#projects-ai-machine-learning" class="float-card float-key-project">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <div class="float-avatar">AI</div>
                <div>
                  <div class="float-name">Key Project</div>
                  <div class="float-role">GenAI Assistant</div>
                </div>
              </div>
              <div class="float-quote">"GenAI-powered Streamlit app for natural language queries."</div>
            </a>
            <a href="#education" class="float-card float-credential">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <div class="float-avatar">GDG</div>
                <div>
                  <div class="float-name">GDG on Campus</div>
                  <div class="float-role">Former Cloud Lead</div>
                </div>
              </div>
              <div class="float-quote">"Completed tenure directing cloud computing workshops."</div>
            </a>
            <a href="#about" class="float-card float-testimonial">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <div class="float-avatar">AI</div>
                <div>
                  <div class="float-name">AICTE Intern</div>
                  <div class="float-role">AI / ML Intern</div>
                </div>
              </div>
              <div class="float-quote">"Building machine learning models and pipelines."</div>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ── Stats ──
function renderStats() {
  return `
    <section class="stats-bar" data-animate>
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item" data-animate data-delay="1">
            <div class="stat-value">4+</div>
            <div class="stat-label">Featured engineering projects delivered</div>
          </div>
          <div class="stat-item" data-animate data-delay="2">
            <div class="stat-value">3+</div>
            <div class="stat-label">Technical domains of specialized expertise</div>
          </div>
          <div class="stat-item" data-animate data-delay="3">
            <div class="stat-value">2024</div>
            <div class="stat-label">Year of professional journey kickoff</div>
          </div>
          <div class="stat-item" data-animate data-delay="4">
            <div class="stat-value">10+</div>
            <div class="stat-label">Technical skills across Cloud, AI & Data</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ── About ──
function renderAbout(state) {
  const timelineItems = state.milestones
    .map((m, i) => `
      <div class="timeline-item" data-animate data-delay="${i + 1}">
        <span class="timeline-date">${m.date}</span>
        <h4 class="timeline-title">${m.title}</h4>
        <p class="timeline-desc">${m.description}</p>
      </div>
    `)
    .join('');

  return `
    <section class="section about" id="about">
      <div class="container">
        <div class="about-header" data-animate>
          <div class="about-icons">
            <a href="#skills" class="about-icon-box" title="View Skills">${icons.cloud}</a>
            <a href="#projects" class="about-icon-box" title="View Projects">${icons.chart}</a>
            <a href="#education" class="about-icon-box" title="View Credentials">${icons.brain}</a>
          </div>
          <div class="about-intro">
            <h2 class="section-title">Blending data intelligence with machine learning capability.</h2>
          </div>
        </div>
        <div class="about-content">
          <div data-animate data-delay="1">
            <p class="about-text">
              I'm <strong>Sushant Shrimal</strong>, a final-year B.Tech student and aspiring <strong>Data Scientist & AI Engineer</strong> at <strong>NK Orchid College of Engineering & Technology</strong>. I have hands-on experience building end-to-end data solutions, including preprocessing, exploratory data analysis (EDA), and predictive modeling.
            </p>
            <p class="about-text">
              My expertise spans developing machine learning pipelines (regression, classification, clustering, ensemble methods) and integrating Generative AI APIs. I am passionate about RAG applications, prompt engineering, and translating data into business insights.
            </p>
            <div class="about-tags">
              <span class="about-tag">🧠 Generative AI</span>
              <span class="about-tag">🤖 Machine Learning</span>
              <span class="about-tag">📊 Data Science</span>
              <span class="about-tag">📈 Statistical Analysis</span>
              <span class="about-tag">⚡ Prompt Engineering</span>
            </div>
          </div>
          <div class="timeline" data-animate data-delay="2">
            ${timelineItems}
          </div>
        </div>
      </div>
    </section>
  `;
}

// ── Education & Experience (NEW) ──
function renderEducation() {
  return `
    <section class="section education" id="education">
      <div class="container">
        <div class="education-header" data-animate>
          <span class="section-eyebrow">Credentials</span>
          <h2 class="section-title">Education & Background</h2>
          <p class="section-subtitle">Academic foundations, professional certifications, and leadership roles.</p>
        </div>
        <div class="edu-grid">
          <a href="#about" class="edu-card" data-animate data-delay="1">
            <div class="edu-card-icon">🎓</div>
            <span class="edu-card-badge education-badge">Education</span>
            <h3 class="edu-card-title">B.Tech — Electronics & Telecommunication Engineering</h3>
            <p class="edu-card-org">NKOCET, Solapur, Maharashtra</p>
            <p class="edu-card-desc">
              Comprehensive engineering program focused on machine learning models, statistical analysis, and programming logic.
            </p>
            <div style="font-weight:600;color:var(--accent);margin-bottom:var(--space-md);font-size:13px;">CGPA: 7.34 / 10</div>
            <div class="edu-card-tags">
              <span class="edu-tag">2022 — 2026</span>
              <span class="edu-tag">Solapur</span>
            </div>
          </a>
          <a href="#skills" class="edu-card" data-animate data-delay="2">
            <div class="edu-card-icon">📜</div>
            <span class="edu-card-badge experience-badge">Certifications</span>
            <h3 class="edu-card-title">Professional Certifications</h3>
            <p class="edu-card-org">Verified Credentials</p>
            <p class="edu-card-desc">
              Industry credentials validating Python programming capability, data analysis, and software workflows.
            </p>
            <div class="edu-card-tags">
              <span class="edu-tag">Cisco Data Analytics</span>
              <span class="edu-tag">HackerRank Python</span>
              <span class="edu-tag">Accenture SWE (Forage)</span>
              <span class="edu-tag">Postman API Fundamentals</span>
            </div>
          </a>
          <a href="#about" class="edu-card" data-animate data-delay="3">
            <div class="edu-card-icon">🏆</div>
            <span class="edu-card-badge corporate-badge">Honors & Roles</span>
            <h3 class="edu-card-title">Leadership & Achievements</h3>
            <p class="edu-card-org">Extracurricular Impact</p>
            <p class="edu-card-desc">
              Recognized for cloud leadership, best research award, and leadership in student committees.
            </p>
            <div class="edu-card-tags">
              <span class="edu-tag">Best Research Paper Award (ICCSS 2025)</span>
              <span class="edu-tag">GDG On-Campus Cloud Lead</span>
              <span class="edu-tag">Vice President — AEXS</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  `;
}

// ── Skills ──
const SKILL_CATEGORY_ANCHORS = {
  generativeAI: '#projects-ai-machine-learning',
  machineLearning: '#projects-ai-machine-learning',
  programmingQuery: '#projects',
  dataAnalysis: '#projects-data-analytics-bi',
  visualizationDeployment: '#projects-data-analytics-bi'
};

function renderSkills(state) {
  const categories = Object.entries(state.skills);

  const cards = categories
    .map(([key, skills], i) => {
      const meta = SKILL_CATEGORY_META[key] || { label: key, icon: icons.code };
      const pills = skills
        .map(s => `<span class="skill-pill" data-skill="${s}">${s}</span>`)
        .join('');

      return `
        <div class="bento-card" data-animate data-delay="${i + 1}">
          <div class="bento-card-icon">${meta.icon}</div>
          <h3 class="bento-card-title">${meta.label}</h3>
          <div class="bento-skills">${pills}</div>
        </div>
      `;
    })
    .join('');

  return `
    <section class="section skills" id="skills">
      <div class="container">
        <div class="skills-header" data-animate>
          <span class="section-eyebrow">Expertise</span>
          <h2 class="section-title">Technical Skills Matrix</h2>
          <p class="section-subtitle">A comprehensive toolkit spanning programming, data analytics, and AI-powered cloud automation.</p>
        </div>
        <div class="bento-grid">
          ${cards}
        </div>
      </div>
    </section>
  `;
}

// ── Projects ──
function renderProjects(state) {
  // Group projects by domain
  const domains = {};
  state.projects.forEach(p => {
    if (!domains[p.domain]) {
      domains[p.domain] = [];
    }
    domains[p.domain].push(p);
  });

  const sectionsHtml = Object.entries(domains)
    .map(([domainName, projects], domainIdx) => {
      const domainSlug = 'projects-' + domainName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const projectCards = projects
        .map((p, i) => {
          const tags = p.tags
            .map(t => `<span class="project-tag">${t}</span>`)
            .join('');

          const isKey = p.isKey || p.id === 'p1';
          const cardClass = isKey ? 'project-card key-project' : 'project-card';
          const badgeHtml = isKey ? `<span class="key-project-badge">⭐ Key Project</span>` : '';

          return `
            <div class="${cardClass}" data-animate data-delay="${(i % 3) + 1}">
              <div class="project-card-header">
                <div style="display:flex;align-items:center;gap:12px;">
                  <span class="project-number">0${i + 1}</span>
                  ${badgeHtml}
                </div>
                ${p.github ? `
                <a href="${p.github}" target="_blank" rel="noopener noreferrer"
                   class="project-link" title="View on GitHub">
                  ${icons.github}
                </a>
                ` : ''}
              </div>
              <h3 class="project-title">${p.title}</h3>
              <p class="project-desc">${p.description}</p>
              <div class="project-tags">${tags}</div>
              <div style="margin-top:var(--space-lg);display:flex;gap:var(--space-sm);flex-wrap:wrap;">
                ${p.github ? `
                <a href="${p.github}" target="_blank" rel="noopener noreferrer"
                   class="btn btn-source">
                  ${icons.code} Source Code
                </a>
                ` : ''}
                ${p.live ? `
                <a href="${p.live}" target="_blank" rel="noopener noreferrer"
                   class="btn btn-accent" style="padding:0.6rem 1.25rem;font-size:var(--text-xs);box-shadow:none;">
                  ${icons.externalLink} Live Demo
                </a>
                ` : ''}
                ${p.video ? `
                <a href="${p.video}" target="_blank" rel="noopener noreferrer"
                   class="btn btn-outline" style="padding:0.6rem 1.25rem;font-size:var(--text-xs);background:rgba(255,255,255,0.45);backdrop-filter:blur(5px);display:inline-flex;align-items:center;gap:4px;">
                  <span style="display:inline-flex;align-items:center;width:12px;height:12px;color:var(--accent);">${icons.play}</span> Watch Demo
                </a>
                ` : ''}
              </div>
            </div>
          `;
        })
        .join('');

      return `
        <div class="project-domain-section" id="${domainSlug}" data-animate data-delay="${domainIdx + 1}">
          <h3 class="project-domain-title">${domainName}</h3>
          <div class="projects-grid">
            ${projectCards}
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <section class="section projects" id="projects">
      <div class="container">
        <div class="projects-header" data-animate>
          <div class="projects-header-text">
            <span class="section-eyebrow">Portfolio</span>
            <h2 class="section-title">Featured Projects</h2>
            <p class="section-subtitle">Structured by domains spanning AI/ML engineering, data intelligence, and core development.</p>
          </div>
          <a href="https://github.com/sushant2701" target="_blank"
             rel="noopener noreferrer" class="btn btn-outline" id="projects-view-all-btn">
            View All on GitHub ${icons.arrow}
          </a>
        </div>
        
        <div class="projects-tabs-container" data-animate data-delay="1">
          <div class="projects-tabs">
            <button class="project-tab-btn active" data-target="projects-ai-machine-learning">AI &amp; ML</button>
            <button class="project-tab-btn" data-target="projects-data-analytics-bi">Data Analytics &amp; BI</button>
            <button class="project-tab-btn" data-target="projects-web-development-security">Web Dev &amp; Security</button>
            <button class="project-tab-btn" data-target="projects-iot-embedded-systems">IoT &amp; Systems</button>
          </div>
        </div>

        <div class="projects-sections-container">
          ${sectionsHtml}
        </div>
      </div>
    </section>
  `;
}

// ── Footer ──
function renderFooter() {
  return `
    <footer class="footer" id="footer">
      <div class="container">
        <div class="footer-top">
          <div>
            <div class="footer-brand-name">Sushant Shrimal</div>
            <p class="footer-brand-desc">
              Cloud Lead & Data Analytics Engineer building scalable systems
              at the intersection of infrastructure and intelligence.
            </p>
          </div>
          <div>
            <div class="footer-col-title">Quick Links</div>
            <div class="footer-links">
              <a href="#about" class="footer-link">About</a>
              <a href="#education" class="footer-link">Education</a>
              <a href="#skills" class="footer-link">Skills</a>
              <a href="#projects" class="footer-link">Projects</a>
            </div>
          </div>
          <div>
            <div class="footer-col-title">Connect</div>
            <div class="footer-links">
              <a href="https://github.com/sushant2701" target="_blank"
                 rel="noopener noreferrer" class="footer-link">GitHub</a>
              <a href="https://www.linkedin.com/in/sushant-shrimal-017128251/"
                 target="_blank" rel="noopener noreferrer" class="footer-link">LinkedIn</a>
              <a href="#" id="footer-contact-btn" class="footer-link">Email</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span class="footer-copy">&copy; ${new Date().getFullYear()} Sushant Shrimal. All rights reserved.</span>
          <div class="footer-socials">
            <a href="https://github.com/sushant2701" target="_blank"
               rel="noopener noreferrer" class="social-link" title="GitHub">
              ${icons.github}
            </a>
            <a href="https://www.linkedin.com/in/sushant-shrimal-017128251/"
               target="_blank" rel="noopener noreferrer"
               class="social-link" title="LinkedIn">
              ${icons.linkedin}
            </a>
            <button class="control-trigger" id="control-trigger" title="Management Panel">
              ${icons.lock}
              <span>Control Space</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  `;
}
