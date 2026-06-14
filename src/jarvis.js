/* =============================================
   MARK27 VOICE & CHAT ASSISTANT
   ============================================= */

import { SKILL_DEFINITIONS, getState } from './state.js';

// Global state for MARK27
let isVoiceEnabled = false;
let isListening = false;
let recognition = null;
let currentVisitorLocation = null;

// Sushant's detailed portfolio knowledge base (short and direct)
const KNOWLEDGE_BASE = {
  about: "Sushant Shrimal is an AI Engineer and aspiring Data Scientist, and Former GDG on Campus Cloud Lead (completed tenure). He is currently a Python Full Stack Developer & Data Analytics Intern at QSpiders.",
  education: "Sushant is pursuing his B.Tech in Electronics & Telecommunication Engineering at NK Orchid College, Solapur (2022 - 2026) with a CGPA of 7.34.",
  cgpa: "Sushant has a CGPA of 7.34 out of 10 in his B.Tech program.",
  contact: "Reach Sushant via email at sushantshrimal08@gmail.com, LinkedIn (linkedin.com/in/sushant-shrimal-017128251), or GitHub (github.com/sushant2701).",
  experience: "Sushant works as a Python Full Stack & Data Analytics Intern at QSpiders (Feb 2026 – Present). He was previously a Frontend and AI/ML Intern.",
  experience_qspiders: "At QSpiders, Sushant builds automated ETL data pipelines and Power BI dashboards for KPI and SLA compliance reporting.",
  experience_aicte: "At AICTE, Sushant performed data preprocessing and designed machine learning healthcare classification models.",
  certifications: "Sushant is certified in Cisco Data Analytics, HackerRank Python, Accenture Software Engineering, and Postman API.",
  awards: "Sushant won the Best Research Paper Award at ICCSS 2025 and serves as Vice President of the Association of Electronics Students (AEXS).",
  gdg: "Sushant was the GDG on Campus Cloud Lead (tenure completed), directing cloud computing and Generative AI initiatives and developer workshops.",
  skills: "Skills: Python, SQL, Generative AI (LLMs, Prompt Engineering, RAG), Machine Learning, Pandas, Streamlit, and Power BI.",
  skills_ai: "Expertise in LLMs, Prompt Engineering, Retrieval-Augmented Generation (RAG), and OpenAI/Anthropic APIs.",
  skills_ml: "Proficient in Scikit-Learn, TensorFlow, regression, classification models, and model evaluation metrics.",
  skills_python: "Proficient in Python for automation/data scripting and SQL for database querying.",
  skills_data: "Experienced in Pandas, NumPy, data wrangling, exploratory data analysis (EDA), and A/B Testing.",
  skills_viz: "Uses Power BI, Streamlit, Matplotlib, Seaborn, Git, GitHub, and Google Cloud Platform for deployments.",
  projects: "Featured projects: GenAI Analysis Assistant, Disease Prediction, Customer Churn Dashboard, Support SLA Tracker, and GPS SOS Band.",
  grahak: "Grahak is a customer engagement CRM and WhatsApp ticketing server that Sushant consulted on.",
  project_genai: "A Streamlit app querying CSVs using natural language via OpenAI/Anthropic APIs, RAG, and prompt engineering.",
  project_disease: "A healthcare classifier predicting patient risk profiles with 85% accuracy using Random Forest and Neural Networks.",
  project_churn: "A customer churn risk predictive ML model and customer segmentation dashboard in Power BI.",
  project_sla: "A Power BI dashboard tracking ticket SLA compliance trends processed through a Python ETL pipeline.",
  project_sales: "An automated monthly sales revenue MIS analytics dashboard built in Power BI.",
  project_otp: "A secure, lightweight OTP authentication system designed to simplify student logins.",
  project_gps: "An IoT emergency communication wearable tracking real-time coordinates over GPS/GSM SMS.",
  project_dispenser: "A Raspberry Pi and ESP32 conveyor-assisted kitchen food ingredient dispensing automation system.",
  project_shoes: "A responsive shoes online retail prototype featuring product filtering and cart management.",
  project_portfolio: "This glassmorphic personal website showcasing Sushant's work, featuring bento layouts, voice navigation, and the MARK27 chatbot."
};

// Common spelling corrections
const SPELLING_CORRECTIONS = {
  'skils': 'skills',
  'skil': 'skills',
  'sills': 'skills',
  'sklls': 'skills',
  'projcts': 'projects',
  'pjct': 'projects',
  'projets': 'projects',
  'projec': 'projects',
  'educaton': 'education',
  'educatn': 'education',
  'eduation': 'education',
  'contect': 'contact',
  'contac': 'contact',
  'connet': 'connect',
  'grahk': 'grahak',
  'gharak': 'grahak',
  'grahac': 'grahak',
  'githb': 'github',
  'gitb': 'github',
  'gt': 'git',
  'abot': 'about',
  'abt': 'about',
  'resum': 'resume',
  'cv': 'resume',
  'analsis': 'analysis',
  'analys': 'analysis',
  'certificats': 'certifications',
  'certif': 'certifications'
};

function correctSpelling(text) {
  if (!text) return '';
  let clean = text.toLowerCase();
  
  // Replace multi-word phonetic phrases
  const multiWordCorrections = {
    'git hub': 'github',
    'got hub': 'github',
    'it hub': 'github',
    'linked in': 'linkedin',
    'link in': 'linkedin',
    'control space': 'controlspace',
    'admin panel': 'admin',
    'admin drawer': 'admin'
  };
  
  Object.keys(multiWordCorrections).forEach(phrase => {
    clean = clean.replace(phrase, multiWordCorrections[phrase]);
  });
  
  const corrections = {
    'skils': 'skills', 'skil': 'skills', 'sills': 'skills', 'sklls': 'skills',
    'projcts': 'projects', 'pjct': 'projects', 'projets': 'projects', 'projec': 'projects',
    'educaton': 'education', 'educatn': 'education', 'eduation': 'education',
    'contect': 'contact', 'contac': 'contact', 'conatnt': 'contact', 'conatct': 'contact', 'contat': 'contact',
    'githb': 'github', 'gitb': 'github', 'ithub': 'github',
    'grahk': 'grahak', 'abt': 'about', 'abot': 'about',
    'likendin': 'linkedin', 'likendina': 'linkedin', 'linkdin': 'linkedin',
    'certificats': 'certifications', 'certif': 'certifications',
    'sushamnt': 'sushant'
  };

  return clean.split(/\s+/).map(w => corrections[w] || w).join(' ');
}

// Autocomplete prediction queries
const PREDICTION_QUESTIONS = [
  "Who is Sushant?",
  "What is Sushant's education?",
  "What are Sushant's skills?",
  "Tell me about Sushant's projects.",
  "Tell me about Grahak project.",
  "How can I contact Sushant?",
  "Connect with Sushant on LinkedIn.",
  "Show me your AI and ML skills.",
  "What is the Disease Prediction System?",
  "Show the GitHub repository."
];

/**
 * Initialize MARK27 Assistant
 */
export function initJarvis(visitorLocation = null) {
  currentVisitorLocation = visitorLocation;

  // 1. Inject MARK27 HTML elements
  injectJarvisDOM();

  // 2. Setup Web Speech Recognition API if supported
  setupSpeechRecognition();

  // 3. Bind UI event listeners
  bindJarvisEvents();

  // 4. Print initial greeting
  setTimeout(() => {
    addSystemMessage(getGreetingText());
  }, 1000);
}

/**
 * Render floating Arch Reactor widget with new announcement banner
 */
function injectJarvisDOM() {
  const existing = document.getElementById('jarvis-widget');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.id = 'jarvis-widget';
  container.className = 'jarvis-widget';

  const showAnn = localStorage.getItem('assistant_announcement_seen') !== 'true';
  const announcementHtml = showAnn ? `
    <div class="jarvis-announcement" id="jarvis-announcement">
      <button class="announcement-close" id="announcement-close" title="Dismiss">×</button>
      <div style="font-weight:700; color:var(--accent); font-size:10.5px; margin-bottom:2px;">🎙️ MARK27 CHATBOT</div>
      Hi! I'm Sushant's virtual assistant. Click me to chat! I can predict your words and talk back.
    </div>
  ` : '';

  container.innerHTML = `
    ${announcementHtml}
    
    <!-- Glowing Arch Reactor Floating Button -->
    <button class="jarvis-trigger" id="jarvis-trigger" title="Query MARK27 System">
      <div class="reactor-ring-outer"></div>
      <div class="reactor-ring-middle"></div>
      <div class="reactor-ring-inner"></div>
      <div class="reactor-core"></div>
    </button>

    <!-- MARK27 Chat Panel -->
    <div class="jarvis-panel" id="jarvis-panel">
      <div class="jarvis-header">
        <div class="jarvis-brand">
          <div class="reactor-mini">
            <div class="reactor-mini-core"></div>
          </div>
          <div>
            <div class="jarvis-name">MARK27</div>
            <div class="jarvis-status" id="jarvis-status">SYSTEM ONLINE</div>
          </div>
        </div>
        <div class="jarvis-controls">
          <button class="jarvis-ctrl-btn" id="jarvis-voice-toggle" title="Mute/Unmute Voice" style="opacity: 0.5;">🔇</button>
          <button class="jarvis-ctrl-btn" id="jarvis-minimize" title="Minimize Panel">×</button>
        </div>
      </div>
      <div class="jarvis-body" id="jarvis-body"></div>
      <div class="jarvis-input-row">
        <input type="text" class="jarvis-input" id="jarvis-input" placeholder="Ask about skills, projects..." autocomplete="off" />
        <button class="jarvis-action-btn" id="jarvis-send" title="Send message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
        <button class="jarvis-action-btn mic-btn" id="jarvis-mic" title="Voice Input Mode">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v11a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
        </button>
        <button class="jarvis-action-btn" id="jarvis-voice-refresh" title="Refresh Voice Recognition" style="margin-left: 4px; background: rgba(122, 0, 255, 0.08); color: var(--accent); border: 1px solid rgba(122, 0, 255, 0.2); display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 12px; cursor: pointer;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(container);
}

/**
 * Voice setup using standard webkitSpeechRecognition API
 */
function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn("MARK27 Voice Recognition not supported on this browser.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening = true;
    updateMicStatus(true);
  };

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    addUserMessage(transcript);
    processQuery(transcript);
  };

  recognition.onerror = (e) => {
    console.error("Speech Recognition error:", e);
    updateMicStatus(false);
  };

  recognition.onend = () => {
    isListening = false;
    updateMicStatus(false);
  };
}

/**
 * Synthesize speech in a smooth, calm 21-year-old human male voice tone
 */
function speakVoice(text) {
  if (!isVoiceEnabled) return;
  const panel = document.getElementById('jarvis-panel');
  if (!panel || !panel.classList.contains('open')) return;

  const cleanSpeechText = text
    .replace(/https?:\/\/\S+/g, 'link')
    .replace(/[❌⭐🎉💬🎓📍🏆⚙️🚀🧠🤖📊📈⚡🔊]/g, '')
    .substring(0, 250);

  window.speechSynthesis.cancel(); // Stop any pending speech

  const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
  
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find(v => 
    v.name.includes('Google US English Male') ||
    v.name.includes('David') ||
    v.name.includes('Mark') ||
    (v.name.includes('Male') && v.lang.startsWith('en'))
  ) || voices.find(v => v.lang.startsWith('en'));

  if (selectedVoice) utterance.voice = selectedVoice;

  // Speak with natural speech speed (rate = 1.0) and dynamically set volume
  utterance.pitch = 0.98; 
  utterance.rate = 1.0;  
  utterance.volume = typeof window.speechVolume === 'number' ? window.speechVolume : 0.8;

  utterance.onstart = () => {
    if (typeof window.notifySpeechStart === 'function') {
      window.notifySpeechStart();
    }
  };

  const endSpeech = () => {
    if (typeof window.notifySpeechEnd === 'function') {
      window.notifySpeechEnd();
    }
  };

  utterance.onend = endSpeech;
  utterance.onerror = endSpeech;

  window.speechSynthesis.speak(utterance);
}

/**
 * Get customized MARK27 greeting text
 */
function getGreetingText() {
  const hour = new Date().getHours();
  let greeting = "Hello";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";
  else greeting = "Good evening";

  let locationStr = "";
  if (currentVisitorLocation && currentVisitorLocation.city) {
    locationStr = ` from ${currentVisitorLocation.city}, ${currentVisitorLocation.country_name || currentVisitorLocation.country}`;
  }
  return `${greeting}${locationStr}! I am MARK27, Sushant's virtual assistant. Ask me anything, or type to see predicted search questions.`;
}

function hideAnnouncement() {
  const ann = document.getElementById('jarvis-announcement');
  if (ann) {
    ann.style.opacity = '0';
    ann.style.transform = 'translateY(10px) scale(0.95)';
    setTimeout(() => ann.remove(), 300);
    localStorage.setItem('assistant_announcement_seen', 'true');
  }
}

/**
 * Bind UI controls
 */
function bindJarvisEvents() {
  const trigger = document.getElementById('jarvis-trigger');
  const panel = document.getElementById('jarvis-panel');
  const minimize = document.getElementById('jarvis-minimize');
  const voiceToggle = document.getElementById('jarvis-voice-toggle');
  const sendBtn = document.getElementById('jarvis-send');
  const micBtn = document.getElementById('jarvis-mic');
  const inputEl = document.getElementById('jarvis-input');
  const annClose = document.getElementById('announcement-close');

  // Inject prediction container above the input field
  const autocompleteContainer = document.createElement('div');
  autocompleteContainer.id = 'jarvis-autocomplete';
  autocompleteContainer.className = 'jarvis-autocomplete';
  panel.querySelector('.jarvis-input-row').before(autocompleteContainer);

  // Predict words / autocomplete listener
  inputEl.addEventListener('input', () => {
    const text = inputEl.value.trim().toLowerCase();
    autocompleteContainer.innerHTML = '';
    
    if (!text) {
      autocompleteContainer.style.display = 'none';
      return;
    }

    const state = getState();
    const allSkills = Object.values(state.skills || {}).flat();
    const projectTitles = (state.projects || []).map(p => p.title);

    const dynamicSuggestions = [
      ...PREDICTION_QUESTIONS,
      ...allSkills.map(s => `Tell me about ${s} skill`),
      ...projectTitles.map(t => `Show project ${t}`)
    ];

    const matches = dynamicSuggestions.filter(q => q.toLowerCase().includes(text));
    if (matches.length === 0) {
      autocompleteContainer.style.display = 'none';
      return;
    }

    autocompleteContainer.style.display = 'flex';
    const uniqueMatches = Array.from(new Set(matches)).slice(0, 4);
    uniqueMatches.forEach(match => {
      const tag = document.createElement('span');
      tag.className = 'autocomplete-tag';
      tag.textContent = match;
      tag.addEventListener('click', () => {
        addUserMessage(match);
        inputEl.value = '';
        autocompleteContainer.style.display = 'none';
        processQuery(match);
      });
      autocompleteContainer.appendChild(tag);
    });
  });

  // Dismiss announcement banner
  annClose?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideAnnouncement();
  });

  // Open/Close toggle
  trigger.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      inputEl.focus();
      hideAnnouncement();
    } else {
      window.speechSynthesis.cancel();
    }
  });

  minimize.addEventListener('click', () => {
    panel.classList.remove('open');
    window.speechSynthesis.cancel();
  });

  // Voice toggle
  voiceToggle.addEventListener('click', () => {
    isVoiceEnabled = !isVoiceEnabled;
    voiceToggle.innerHTML = isVoiceEnabled ? '🔊' : '🔇';
    voiceToggle.style.opacity = isVoiceEnabled ? '1' : '0.5';
    if (!isVoiceEnabled) window.speechSynthesis.cancel();
  });

  // Keyboard query submission
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitTextQuery();
    }
  });

  sendBtn.addEventListener('click', submitTextQuery);

  // Mic Toggle
  micBtn.addEventListener('click', () => {
    if (!recognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });

  // Chatbot voice engine refresh
  const voiceRefreshBtn = document.getElementById('jarvis-voice-refresh');
  if (voiceRefreshBtn) {
    voiceRefreshBtn.addEventListener('click', () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch (e) {}
      }
      setupSpeechRecognition();

      const statusEl = document.getElementById('jarvis-status');
      if (statusEl) {
        const originalText = statusEl.textContent;
        const originalColor = statusEl.style.color;

        statusEl.textContent = "ENGINE REBOOTING...";
        statusEl.style.color = "#00d4ff";
        setTimeout(() => {
          statusEl.textContent = originalText;
          statusEl.style.color = originalColor;
        }, 1200);
      }

      // Pluck audio feedback
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.12);
        }
      } catch (err) {}
    });
  }
}

function submitTextQuery() {
  const inputEl = document.getElementById('jarvis-input');
  const query = inputEl.value.trim();
  if (!query) return;

  const autocompleteContainer = document.getElementById('jarvis-autocomplete');
  if (autocompleteContainer) autocompleteContainer.style.display = 'none';

  addUserMessage(query);
  inputEl.value = '';
  processQuery(query);
}

function updateMicStatus(listening) {
  const micBtn = document.getElementById('jarvis-mic');
  const core = document.querySelector('.reactor-core');
  if (listening) {
    micBtn.classList.add('listening');
    if (core) core.classList.add('pulse-fast');
    document.getElementById('jarvis-status').textContent = "LISTENING SYSTEM...";
    document.getElementById('jarvis-status').style.color = "#ff3b30";
  } else {
    micBtn.classList.remove('listening');
    if (core) core.classList.remove('pulse-fast');
    document.getElementById('jarvis-status').textContent = "SYSTEM ONLINE";
    document.getElementById('jarvis-status').style.color = "var(--accent, #7a00ff)";
  }
}

/**
 * Push user query speech bubble to conversation logs
 */
function addUserMessage(text) {
  const body = document.getElementById('jarvis-body');
  const msg = document.createElement('div');
  msg.className = 'jarvis-msg user';
  msg.innerHTML = `
    <div class="msg-bubble">${text}</div>
  `;
  body.appendChild(msg);
  body.scrollTop = body.scrollHeight;
}

/**
 * Push assistant response to conversation logs
 */
function addSystemMessage(htmlText) {
  const body = document.getElementById('jarvis-body');
  const msg = document.createElement('div');
  msg.className = 'jarvis-msg jarvis';
  msg.innerHTML = `
    <div class="msg-bubble">${htmlText}</div>
  `;
  body.appendChild(msg);
  body.scrollTop = body.scrollHeight;
  speakVoice(msg.innerText);
}

// Synonym expansion map to understand varied phrasing (semantic parser)
const SYNONYMS = {
  'education': ['college', 'study', 'school', 'university', 'academics', 'degree', 'btech', 'grades', 'class', 'learn', 'learned', 'qualification', 'qualifications'],
  'cgpa': ['grades', 'score', 'gpa', 'marks', 'percentage', 'cgpa'],
  'skills': ['expertise', 'know', 'proficient', 'languages', 'frameworks', 'libraries', 'stack', 'technologies', 'tools', 'skills', 'skill', 'programming', 'coding'],
  'projects': ['built', 'made', 'created', 'developed', 'works', 'portfolio', 'creations', 'designs', 'implementations', 'projects', 'project', 'app', 'apps', 'system', 'systems'],
  'contact': ['reach', 'touch', 'email', 'phone', 'linkedin', 'github', 'message', 'connect', 'mail', 'hire', 'socials', 'links', 'contact'],
  'experience': ['internship', 'job', 'work', 'history', 'role', 'position', 'career', 'qspiders', 'aicte', 'experience', 'internships'],
  'about': ['who', 'identity', 'creator', 'person', 'background', 'bio', 'introduce', 'profile', 'about', 'himself'],
  'awards': ['achievements', 'won', 'winner', 'honors', 'paper', 'iccss', 'aexs', 'president', 'awards', 'award', 'prize']
};

// Tokenize and clean text into a set of words
function tokenize(text) {
  if (!text) return new Set();
  return new Set(text.toLowerCase().replace(/[^\w\s]/g, ' ').trim().split(/\s+/).filter(Boolean));
}

// Compute Jaccard Similarity between two token sets
function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

// Expand a token set with synonyms
function expandTokens(tokenSet) {
  const expanded = new Set(tokenSet);
  tokenSet.forEach(word => {
    Object.keys(SYNONYMS).forEach(key => {
      if (key === word || SYNONYMS[key].includes(word)) {
        expanded.add(key);
        SYNONYMS[key].forEach(syn => expanded.add(syn));
      }
    });
  });
  return expanded;
}

// Sushant's detailed portfolio knowledge base (short and direct)
const intentsConfig = [
  {
    key: 'about',
    phrases: ['who are you', 'tell me about yourself', 'introduce yourself', 'about sushant', 'who is sushant', 'your name', 'sushant shrimal', 'background', 'identity', 'creator'],
    keywords: ['about', 'yourself', 'who', 'bio', 'introduce', 'profile', 'name', 'identity', 'creator', 'person', 'background'],
    response: KNOWLEDGE_BASE.about
  },
  {
    key: 'education',
    phrases: ['where did you study', 'your education', 'academic background', 'college details', 'your btech', 'what is your cgpa', 'cgpa score', 'where is your college', 'which college'],
    keywords: ['education', 'college', 'degree', 'qualification', 'btech', 'orchid', 'nkocet', 'university', 'academics', 'study', 'school'],
    response: KNOWLEDGE_BASE.education
  },
  {
    key: 'cgpa',
    phrases: ['what is your cgpa', 'cgpa score', 'gpa score', 'your cgpa', 'how much cgpa', 'cgpa details'],
    keywords: ['cgpa', 'gpa', 'grades', 'score', 'percentage', 'marks'],
    response: KNOWLEDGE_BASE.cgpa
  },
  {
    key: 'contact',
    phrases: ['how to contact sushant', 'send an email', 'your email', 'linkedin profile', 'connect with you', 'how to reach you', 'contact details', 'github url', 'social links', 'reach sushant'],
    keywords: ['contact', 'email', 'linkedin', 'github', 'phone', 'reach', 'message', 'connect', 'mail', 'hire', 'socials', 'links'],
    response: KNOWLEDGE_BASE.contact
  },
  {
    key: 'experience',
    phrases: ['your experience', 'work history', 'your internships', 'where did you work', 'professional experience', 'milestones', 'where are you working'],
    keywords: ['experience', 'work', 'job', 'internship', 'qspiders', 'aicte', 'role', 'milestone', 'career', 'internships', 'working'],
    response: KNOWLEDGE_BASE.experience
  },
  {
    key: 'experience_qspiders',
    phrases: ['about qspiders', 'what did you do at qspiders', 'qspiders internship', 'qspiders experience'],
    keywords: ['qspiders', 'qspider', 'fullstack', 'etl', 'sla'],
    response: KNOWLEDGE_BASE.experience_qspiders
  },
  {
    key: 'experience_aicte',
    phrases: ['about aicte', 'aicte internship', 'aicte experience', 'what did you do at aicte'],
    keywords: ['aicte', 'internship', 'healthcare', 'ml'],
    response: KNOWLEDGE_BASE.experience_aicte
  },
  {
    key: 'certifications',
    phrases: ['your certifications', 'credentials list', 'what certificates do you have', 'show certifications', 'verified credentials'],
    keywords: ['certifications', 'certification', 'certificates', 'certificate', 'credentials', 'hackerrank', 'cisco', 'postman', 'forage'],
    response: KNOWLEDGE_BASE.certifications
  },
  {
    key: 'awards',
    phrases: ['your awards', 'achievements list', 'best research paper', 'iccss 2025', 'what awards did you win', 'vice president aexs'],
    keywords: ['awards', 'award', 'achievements', 'achievement', 'honors', 'honor', 'iccss', 'aexs', 'paper', 'winner', 'won'],
    response: KNOWLEDGE_BASE.awards
  },
  {
    key: 'gdg',
    phrases: ['gdg on campus', 'cloud lead role', 'google developer group', 'gdg lead', 'google developer groups'],
    keywords: ['gdg', 'cloud', 'lead', 'campus', 'google', 'developer', 'groups', 'community'],
    response: KNOWLEDGE_BASE.gdg
  },
  {
    key: 'skills',
    phrases: ['what are your skills', 'show me your skills', 'technical skills', 'skills matrix', 'your expertise', 'what languages', 'programming languages', 'what technologies'],
    keywords: ['skills', 'skill', 'toolkit', 'programming', 'languages', 'python', 'sql', 'ml', 'ai', 'cloud', 'technology', 'expert', 'expertise'],
    response: KNOWLEDGE_BASE.skills
  },
  {
    key: 'skills_ai',
    phrases: ['generative ai skills', 'llm skills', 'large language models', 'large language model', 'prompt engineering expertise', 'rag knowledge', 'openai api experience', 'anthropic api'],
    keywords: ['genai', 'generative', 'llm', 'llms', 'prompt', 'rag', 'openai', 'anthropic', 'claude', 'gpt', 'large', 'language', 'models', 'model'],
    response: KNOWLEDGE_BASE.skills_ai
  },
  {
    key: 'skills_ml',
    phrases: ['machine learning skills', 'scikit learn experience', 'tensorflow projects', 'regression models', 'random forest expertise', 'logistic regression', 'model evaluation', 'predictive modeling', 'feature engineering'],
    keywords: ['ml', 'machine', 'learning', 'tensorflow', 'scikit', 'regression', 'classification', 'clustering', 'ensemble', 'forest', 'logistic', 'evaluation', 'predictive', 'feature'],
    response: KNOWLEDGE_BASE.skills_ml
  },
  {
    key: 'skills_python',
    phrases: ['python programming skills', 'sql database skills', 'coding in python', 'python query', 'r basics'],
    keywords: ['python', 'sql', 'databases', 'programming', 'languages', 'scripting', 'r', 'basics'],
    response: KNOWLEDGE_BASE.skills_python
  },
  {
    key: 'skills_data',
    phrases: ['data analytics skills', 'pandas and numpy', 'data cleaning experience', 'exploratory data analysis', 'ab testing experience', 'data wrangling', 'hypothesis testing', 'statistical analysis'],
    keywords: ['pandas', 'numpy', 'eda', 'wrangling', 'cleaning', 'testing', 'hypothesis', 'stats', 'statistics', 'statistical', 'analysis'],
    response: KNOWLEDGE_BASE.skills_data
  },
  {
    key: 'skills_viz',
    phrases: ['power bi visualization', 'streamlit deployment', 'git and github skills', 'google cloud skills', 'matplotlib and seaborn', 'jupyter notebook', 'google colab'],
    keywords: ['powerbi', 'bi', 'visualization', 'matplotlib', 'seaborn', 'streamlit', 'git', 'github', 'gcp', 'cloud', 'colab', 'jupyter', 'notebook'],
    response: KNOWLEDGE_BASE.skills_viz
  },
  {
    key: 'projects',
    phrases: ['what projects have you built', 'show me your projects', 'show projects', 'view projects', 'projects lists', 'what did you build', 'your works', 'your projects', 'tell me about your projects'],
    keywords: ['project', 'projects', 'built', 'made', 'develop', 'portfolio', 'list', 'works', 'creations'],
    response: KNOWLEDGE_BASE.projects
  },
  {
    key: 'grahak',
    phrases: ['tell me about grahak', 'grahak project', 'what is grahak', 'grahak crm', 'whatsapp ticketing'],
    keywords: ['grahak', 'crm', 'ticketing', 'whatsapp', 'server', 'grahak-server'],
    response: KNOWLEDGE_BASE.grahak
  },
  {
    key: 'project_genai',
    phrases: ['genai data analysis assistant', 'genai assistant project', 'natural language query on csv', 'streamlit analysis app'],
    keywords: ['genai', 'csv', 'analysis', 'assistant', 'streamlit', 'queries', 'openai'],
    response: KNOWLEDGE_BASE.project_genai
  },
  {
    key: 'project_disease',
    phrases: ['disease prediction system', 'healthcare prediction project', 'risk scoring system', 'disease prediction details'],
    keywords: ['disease', 'prediction', 'healthcare', 'risk', 'scoring', 'classification'],
    response: KNOWLEDGE_BASE.project_disease
  },
  {
    key: 'project_churn',
    phrases: ['customer churn prediction', 'churn segmentation dashboard', 'churn prediction details'],
    keywords: ['churn', 'customer', 'segmentation', 'retention', 'dashboard'],
    response: KNOWLEDGE_BASE.project_churn
  },
  {
    key: 'project_sla',
    phrases: ['support sla operations dashboard', 'sla compliance tracking', 'ticket etl pipeline', 'support ticket details'],
    keywords: ['sla', 'compliance', 'ticket', 'tickets', 'etl', 'dax', 'dashboard'],
    response: KNOWLEDGE_BASE.project_sla
  },
  {
    key: 'project_sales',
    phrases: ['sales revenue mis dashboard', 'automated sales reporting', 'sales pipeline analytics'],
    keywords: ['sales', 'revenue', 'mis', 'reporting', 'target', 'targets'],
    response: KNOWLEDGE_BASE.project_sales
  },
  {
    key: 'project_otp',
    phrases: ['otp auth system', 'lightweight student login auth', 'verification frontend'],
    keywords: ['otp', 'auth', 'authentication', 'verification', 'login'],
    response: KNOWLEDGE_BASE.project_otp
  },
  {
    key: 'project_gps',
    phrases: ['gps enabled sos band', 'wearable distress band', 'emergency communication gps gsm'],
    keywords: ['gps', 'sos', 'gsm', 'wearable', 'distress', 'band', 'emergency'],
    response: KNOWLEDGE_BASE.project_gps
  },
  {
    key: 'project_dispenser',
    phrases: ['smart ingredient dispensing system', 'raspberry pi esp32 dispenser', 'conveyor positioning dispenser'],
    keywords: ['dispenser', 'dispensing', 'conveyor', 'loadcell', 'raspberry', 'esp32'],
    response: KNOWLEDGE_BASE.project_dispenser
  },
  {
    key: 'project_shoes',
    phrases: ['branded shoes ecommerce website', 'shoes catalog prototype', 'e-commerce shoes portal'],
    keywords: ['shoes', 'ecommerce', 'retail', 'cart', 'catalog'],
    response: KNOWLEDGE_BASE.project_shoes
  },
  {
    key: 'project_portfolio',
    phrases: ['tell me about this website', 'portfolio website details', 'how was this built', 'glassmorphic portfolio details'],
    keywords: ['portfolio', 'glassmorphic', 'trails', 'typing', 'mark27', 'jarvis'],
    response: KNOWLEDGE_BASE.project_portfolio
  }
];

export function getJarvisVoiceResponse(query) {
  const rawClean = query.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
  const clean = correctSpelling(rawClean);
  if (!clean) return null;

  if (clean === 'hello' || clean === 'hi' || clean === 'hey' || clean === 'greetings') {
    return { response: "Hello! How can I assist you today?", key: 'greeting', score: 1.0 };
  }

  const queryTokens = tokenize(clean);
  const expandedQueryTokens = expandTokens(queryTokens);

  let matchedIntent = null;
  let maxScore = 0;

  intentsConfig.forEach(intent => {
    let bestPhraseScore = 0;
    intent.phrases.forEach(phrase => {
      const phraseTokens = tokenize(phrase);
      const simOriginal = jaccardSimilarity(queryTokens, phraseTokens);
      const simExpanded = jaccardSimilarity(expandedQueryTokens, phraseTokens);
      const phraseScore = (simOriginal * 0.7) + (simExpanded * 0.3);
      if (phraseScore > bestPhraseScore) {
        bestPhraseScore = phraseScore;
      }
    });

    let keywordMatches = 0;
    const intentKeywords = new Set(intent.keywords);
    queryTokens.forEach(token => {
      if (intentKeywords.has(token)) {
        keywordMatches += 1.0;
      } else {
        let isSynonym = false;
        Object.keys(SYNONYMS).forEach(key => {
          if ((key === token || SYNONYMS[key].includes(token)) && intentKeywords.has(key)) {
            isSynonym = true;
          }
        });
        if (isSynonym) {
          keywordMatches += 0.5;
        }
      }
    });
    const keywordScore = queryTokens.size > 0 ? (keywordMatches / queryTokens.size) : 0;

    let directSubstringMatch = 0;
    intent.phrases.forEach(phrase => {
      if (clean.includes(phrase)) {
        directSubstringMatch = 1.0;
      }
    });

    let keyMatch = 0;
    const keyString = intent.key.replace(/_/g, ' ');
    if (clean.includes(keyString)) {
      if (intent.key === 'about') {
        // Only trigger direct key match if it refers to Sushant/creator specifically, not general prepositions
        if (clean === 'about' || clean.includes('about you') || clean.includes('about yourself') || clean.includes('about sushant') || clean.includes('about creator')) {
          keyMatch = 1.0;
        }
      } else {
        keyMatch = 1.0;
      }
    }

    const finalScore = (directSubstringMatch * 0.4) + (keyMatch * 0.2) + (bestPhraseScore * 0.3) + (keywordScore * 0.1);

    if (finalScore > maxScore) {
      maxScore = finalScore;
      matchedIntent = intent;
    }
  });

  if (maxScore >= 0.15 && matchedIntent) {
    return { response: matchedIntent.response, key: matchedIntent.key, score: maxScore };
  }
  return null;
}

function processQuery(query) {
  const rawClean = query.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
  const clean = correctSpelling(rawClean);
  
  if (!clean) return;

  // 1. Standard greetings
  if (clean === 'hello' || clean === 'hi' || clean === 'hey' || clean === 'greetings') {
    addSystemMessage("Hello! How can I assist you today?");
    return;
  }



  // 3. Query voice response resolver
  const result = getJarvisVoiceResponse(query);
  if (result) {
    if (result.key === 'contact') {
      renderConnectionPrompt();
    } else {
      addSystemMessage(result.response);
    }
  } else {
    // Advanced fallback answer
    addSystemMessage("I did not find a precise match. Please ask specifically about my 'skills', 'projects', 'education', 'experience' or 'contact' details.");
  }
}

/**
 * Render connection form inside MARK27 response flow
 */
function renderConnectionPrompt() {
  const body = document.getElementById('jarvis-body');
  const msg = document.createElement('div');
  msg.className = 'jarvis-msg jarvis';
  
  // Custom unique id for connection form fields
  const formId = `form-${Date.now()}`;

  msg.innerHTML = `
    <div class="msg-bubble jarvis-form-bubble">
      <div style="font-weight: 600; margin-bottom: 8px;">Let's connect!</div>
      <div style="font-size: 11px; margin-bottom: 8px; color: var(--text-secondary);">Input your details so I can notify Sushant.</div>
      
      <div class="jarvis-form-group">
        <input type="text" id="${formId}-name" placeholder="Your Name" class="jarvis-form-input" required />
      </div>
      <div class="jarvis-form-group">
        <input type="email" id="${formId}-email" placeholder="Your Email" class="jarvis-form-input" required />
      </div>
      <div class="jarvis-form-group">
        <textarea id="${formId}-msg" placeholder="Your Message..." class="jarvis-form-input" rows="2"></textarea>
      </div>
      <button class="jarvis-form-submit-btn" id="${formId}-submit"
         style="display: block; width: 100%; text-align: center; background: linear-gradient(135deg, #00d4ff, var(--accent, #7a00ff)); color: white; border: none; padding: 9px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 8px; transition: opacity 0.2s ease;">
        Transmit Information
      </button>
      <button class="jarvis-form-submit-btn" id="${formId}-direct-email"
         style="display: block; width: 100%; text-align: center; text-decoration: none; background: rgba(122, 0, 255, 0.08); color: var(--accent); border: 1px solid rgba(122, 0, 255, 0.2); transition: all 0.2s ease; cursor: pointer; margin-top: 8px;">
        Open Mail Application
      </button>
      <div class="jarvis-form-status" id="${formId}-status"></div>
    </div>
  `;
  body.appendChild(msg);
  body.scrollTop = body.scrollHeight;
  speakVoice("Please share your contact details below.");

  // Wire form actions
  const nameInput = document.getElementById(`${formId}-name`);
  const emailInput = document.getElementById(`${formId}-email`);
  const msgInput = document.getElementById(`${formId}-msg`);
  const submitBtn = document.getElementById(`${formId}-submit`);
  const directBtn = document.getElementById(`${formId}-direct-email`);
  const statusEl = document.getElementById(`${formId}-status`);

  if (directBtn) {
    directBtn.addEventListener('click', () => {
      if (typeof window.triggerContactRedirect === 'function') {
        window.triggerContactRedirect();
      }
    });
  }

  submitBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = msgInput.value.trim();

    if (!name || !email) {
      statusEl.style.color = "#ff3b30";
      statusEl.textContent = "Error: Name and Email fields are required.";
      speakVoice("Name and Email required.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Transmitting...";
    statusEl.textContent = "";

    try {
      const payload = {
        visitor_name: name,
        visitor_email: email,
        message: message,
        location: currentVisitorLocation ? JSON.stringify(currentVisitorLocation) : "Unknown Location",
        timestamp: new Date().toLocaleString()
      };

      const res = await fetch("https://formsubmit.co/ajax/sushantshrimal08@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        statusEl.style.color = "#00d4ff";
        statusEl.textContent = "Transmission complete. Alert sent to Sushant.";
        speakVoice("Handshake established. Transmission complete.");
        
        // Disable inputs
        nameInput.disabled = true;
        emailInput.disabled = true;
        msgInput.disabled = true;
        submitBtn.style.display = "none";

        // Show outreach buttons
        renderOutreachActions(body, name);
      } else {
        throw new Error("HTTP failure");
      }
    } catch (err) {
      console.error(err);
      statusEl.style.color = "#ff3b30";
      statusEl.textContent = "Failed to connect. Standard SMTP protocol is busy.";
      speakVoice("Connection failed.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Transmit Information";
    }
  });
}

/**
 * Display LinkedIn redirect button and Quick Mail composition button
 */
function renderOutreachActions(container, name) {
  const outreachContainer = document.createElement('div');
  outreachContainer.className = 'jarvis-msg jarvis';
  outreachContainer.innerHTML = `
    <div class="msg-bubble outreach-bubble">
      <div style="font-weight: 500; margin-bottom: 10px;">Hands-on connection links, ${name}:</div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <a href="https://www.linkedin.com/in/sushant-shrimal-017128251/" target="_blank" rel="noopener noreferrer" class="btn btn-accent jarvis-outreach-btn" style="box-shadow:none; font-size:11px; padding:6px 12px;">
          Connect on LinkedIn
        </a>
        <a href="mailto:sushantshrimal08@gmail.com?subject=Handshake%20Intro%20-%20${encodeURIComponent(name)}&body=Hi%20Sushant,%20connecting%20via%20your%20glowing%20portfolio..." class="btn btn-outline jarvis-outreach-btn" style="background:rgba(255,255,255,0.45); font-size:11px; padding:6px 12px;">
          Send Direct Email
        </a>
      </div>
    </div>
  `;
  container.appendChild(outreachContainer);
  container.scrollTop = container.scrollHeight;
}
