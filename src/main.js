/* =============================================
   MAIN ENTRY POINT — Light Mode Portfolio
   ============================================= */

import './styles/index.css';
import './styles/skills-tooltip.css';
import './styles/jarvis.css';
import { initState, SKILL_DEFINITIONS } from './state.js';
import { renderPortfolio } from './portfolio.js';
import { initDrawer, openDrawer } from './drawer.js';
import { initAnimations } from './animations.js';
import { initJarvis } from './jarvis.js';

// Global contact redirection helper (Desktop: compose in Gmail; Mobile: launch native Mail app)
window.triggerContactRedirect = function() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  const recipient = "sushantshrimal08@gmail.com";
  const subject = encodeURIComponent("Portfolio Connection Request");
  const body = encodeURIComponent("Hello Sushant,\n\nI saw your portfolio and wanted to reach out.\n\nMy Details:\nName: \nContact Email/Phone: \nCompany/Affiliation: \nMessage: ");

  if (isMobile) {
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  } else {
    // Desktop Gmail compose tab using active Google profile composing
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  }
};

// ── Boot Sequence ──
async function init() {
  // 1. Hydrate state from LocalStorage or seed defaults
  await initState();

  // 2. Render the full portfolio
  renderPortfolio();

  // 3. Initialize the management drawer
  initDrawer(() => {
    // On publish: re-render portfolio and re-init visual effects
    renderPortfolio();
    boot();
  });

  // 4. Boot visual effects
  boot();

  // 5. Run visitor tracking and load J.A.R.V.I.S.
  trackVisitor();
}

/**
 * Initialize visual effects and event bindings
 * Called after every render cycle
 */
function boot() {
  // Scroll animations
  initAnimations();

  // Skills interactive tooltips
  initSkillTooltips();

  // Control Space trigger → opens drawer
  const trigger = document.getElementById('control-trigger');
  if (trigger) {
    trigger.addEventListener('click', openDrawer);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Navbar background on scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Voice Screen Navigator control (Assistant 1: operates portfolio silently)
  const navBtn = document.getElementById('nav-navigator-btn');
  const navStatus = document.getElementById('nav-navigator-status');
  let isNavigating = false;
  let isVoiceNavigatorEnabled = false; // Persistent flag to keep voice assistant active
  let isVoiceNavigatorSpeakerEnabled = false;
  let isAwaitingCommand = false;
  let commandTimeoutId = null;
  let navRecognition = null;
  let isAssistantSpeaking = false;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  // Inject voice status overlay widget in body
  let overlay = document.getElementById('voice-status-overlay');
  if (!overlay && SpeechRecognition && navBtn) {
    overlay = document.createElement('div');
    overlay.id = 'voice-status-overlay';
    overlay.className = 'voice-status-overlay';
    overlay.innerHTML = `
      <div class="voice-mic-orb">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mic-svg"><path d="M12 1v11a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
      </div>
      <div class="voice-status-text" id="voice-status-text">Mark is listening...</div>
    `;
    document.body.appendChild(overlay);
  }

  function updateOverlayStatus(status) {
    const overlayEl = document.getElementById('voice-status-overlay');
    const statusText = document.getElementById('voice-status-text');
    if (!overlayEl || !statusText) return;

    overlayEl.className = 'voice-status-overlay'; // Reset
    if (status === 'listening') {
      overlayEl.classList.add('active', 'listening');
      statusText.textContent = "Mark: Listening...";
    } else if (status === 'speaking') {
      overlayEl.classList.add('active', 'speaking');
      statusText.textContent = "Mark: Hearing voice...";
    } else if (status === 'responding') {
      overlayEl.classList.add('active', 'responding');
      statusText.textContent = "Mark: Responding...";
    } else {
      overlayEl.classList.remove('active');
    }
  }

  function playBeep() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // First beep: C5 (523.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
      gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.08);

      // Second beep: E5 (659.25 Hz) starting at 0.09s
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.09);
      gain2.gain.setValueAtTime(0, ctx.currentTime + 0.09);
      gain2.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.10);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.17);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.09);
      osc2.stop(ctx.currentTime + 0.17);
    } catch (err) {
      console.warn("Failed to play synthesized beep:", err);
    }
  }

  function speakNavigator(text) {
    if (!isVoiceNavigatorSpeakerEnabled) {
      if (isVoiceNavigatorEnabled) {
        updateOverlayStatus('listening');
      }
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    let speechTimeoutId = null;

    utterance.onstart = () => {
      isAssistantSpeaking = true;
      updateOverlayStatus('responding');
      // Stop recognition temporarily while speaking to prevent feedback loops
      if (navRecognition) {
        try {
          navRecognition.stop();
        } catch (e) {
          console.warn("Failed to stop recognition on speech start:", e);
        }
      }
    };

    const onSpeechEnd = () => {
      if (speechTimeoutId) clearTimeout(speechTimeoutId);
      if (!isAssistantSpeaking) return; // Already cleaned up
      isAssistantSpeaking = false;
      if (isVoiceNavigatorEnabled) {
        updateOverlayStatus('listening');
        setTimeout(() => {
          try {
            navRecognition.start();
          } catch (err) {
            console.warn("Failed to restart voice navigator after speaking:", err);
          }
        }, 200);
      } else {
        updateOverlayStatus('inactive');
      }
    };

    utterance.onend = onSpeechEnd;
    utterance.onerror = onSpeechEnd;

    // Watchdog safeguard: force restart if speech engine hangs
    const wordCount = text.split(/\s+/).length;
    const estimatedMs = Math.max(3000, (wordCount / 2.5) * 1000 + 2000);
    speechTimeoutId = setTimeout(() => {
      console.warn("Speech synthesis took too long or got stuck. Forcing reset.");
      window.speechSynthesis.cancel();
      onSpeechEnd();
    }, estimatedMs);

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural')));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }

  if (SpeechRecognition && navBtn) {
    navRecognition = new SpeechRecognition();
    navRecognition.continuous = true;
    navRecognition.lang = 'en-US';
    navRecognition.interimResults = true;

    navRecognition.onstart = () => {
      isNavigating = true;
      navBtn.classList.add('active');
      if (navStatus) navStatus.textContent = "ON";
      updateOverlayStatus('listening');
    };

    navRecognition.onresult = (e) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript;
        } else {
          interimTranscript += e.results[i][0].transcript;
        }
      }

      // Display live transcription feedback in overlay
      const statusText = document.getElementById('voice-status-text');
      if (interimTranscript.trim() && statusText) {
        updateOverlayStatus('speaking');
        statusText.textContent = `Hearing: "${interimTranscript.trim()}"`;
      }

      // Do not process commands unless we have a final transcript
      if (!finalTranscript.trim()) return;

      const transcript = finalTranscript.toLowerCase().trim();
      console.log("Navigator voice command:", transcript);

      let clean = transcript;

      // If we were awaiting a command, we got it now!
      let wasAwaiting = isAwaitingCommand;
      if (isAwaitingCommand) {
        isAwaitingCommand = false;
        if (commandTimeoutId) clearTimeout(commandTimeoutId);
      }

      // Replace multi-word phonetic phrases
      const multiWordCorrections = {
        'git hub': 'github',
        'got hub': 'github',
        'gut hub': 'github',
        'get hub': 'github',
        'linked in': 'linkedin',
        'link in': 'linkedin',
        'limked in': 'linkedin',
        'limk in': 'linkedin',
        'control space': 'controlspace',
        'admin panel': 'admin',
        'admin drawer': 'admin'
      };
      
      Object.keys(multiWordCorrections).forEach(phrase => {
        clean = clean.replace(phrase, multiWordCorrections[phrase]);
      });

      // Spelling correction map for navigator
      const corrections = {
        'skils': 'skills', 'skil': 'skills', 'sills': 'skills', 'sklls': 'skills',
        'projcts': 'projects', 'pjct': 'projects', 'projets': 'projects', 'projec': 'projects',
        'educaton': 'education', 'educatn': 'education', 'eduation': 'education',
        'contect': 'contact', 'contac': 'contact', 'githb': 'github', 'gitb': 'github',
        'guthub': 'github', 'gut': 'github', 'limked': 'linkedin', 'limkedin': 'linkedin',
        'grahk': 'grahak', 'abt': 'about', 'abot': 'about',
        'likendin': 'linkedin', 'likendina': 'linkedin', 'linkdin': 'linkedin', 'linked': 'linkedin'
      };

      clean.split(/\s+/).forEach(w => {
        if (corrections[w]) clean = clean.replace(w, corrections[w]);
      });

      // Alexa Wake Word Verification
      const wakeWords = ["okay mark", "hey mark", "ok mark", "mark"];
      let hasWakeWord = false;
      let wakeWordMatched = "";
      
      for (const w of wakeWords) {
        if (clean.includes(w)) {
          hasWakeWord = true;
          wakeWordMatched = w;
          break;
        }
      }

      if (hasWakeWord) {
        playBeep();
        showToast("Mark: Active");
        
        isAwaitingCommand = true;
        if (commandTimeoutId) clearTimeout(commandTimeoutId);
        commandTimeoutId = setTimeout(() => {
          if (isAwaitingCommand) {
            isAwaitingCommand = false;
            speakNavigator("Sorry, I didn't hear a command. Please speak again.");
          }
        }, 5000);

        const idx = clean.indexOf(wakeWordMatched);
        clean = clean.substring(idx + wakeWordMatched.length).trim();

        if (clean.length > 0) {
          if (commandTimeoutId) clearTimeout(commandTimeoutId);
          isAwaitingCommand = false;
        } else {
          // Reset status overlay so it doesn't get stuck on the wake word text
          if (isVoiceNavigatorEnabled && !window.speechSynthesis.speaking) {
            updateOverlayStatus('listening');
            const statusText = document.getElementById('voice-status-text');
            if (statusText) statusText.textContent = "Mark: Active - Listening...";
          }
        }
      } else {
        const knownKeywords = ['go to', 'show', 'open', 'view', 'explain', 'click', 'tell', 'introduce', 'who is', 'what', 'grahak', 'otp', 'disease', 'churn', 'gps', 'sla', 'sales', 'experience', 'education', 'skills', 'projects'];
        const hasKeyword = knownKeywords.some(kw => clean.includes(kw));
        if (!hasKeyword && !wasAwaiting) {
          console.log("Ignoring ambient conversation:", transcript);
          if (isVoiceNavigatorEnabled && !window.speechSynthesis.speaking) {
            updateOverlayStatus('listening');
          }
          return;
        }
      }

      // Specific Project: Grahak
      if (clean.includes('grahak')) {
        const targetEl = document.querySelector('#projects-web-development-security') || document.querySelector('#projects');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        speakNavigator("Grahak is a WhatsApp integrated customer relationship management and ticketing system with automatic SLA escalations.");
        showToast("Navigated to Grahak Project");
        return;
      }

      // Specific Project: OTP Auth
      if (clean.includes('otp') || clean.includes('one time password')) {
        const targetEl = document.querySelector('#projects-web-development-security') || document.querySelector('#projects');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        speakNavigator("The OTP Authentication System is a secure, lightweight student login verification system built using standard web technologies.");
        showToast("Navigated to OTP Auth Project");
        return;
      }

      // Specific Project: GenAI Assistant
      if (clean.includes('genai') || clean.includes('csv') || clean.includes('data analysis assistant')) {
        const targetEl = document.querySelector('#projects-ai-machine-learning') || document.querySelector('#projects');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        speakNavigator("The GenAI Data Analysis Assistant enables querying CSV datasets in natural language using OpenAI APIs and Streamlit.");
        showToast("Navigated to GenAI Assistant");
        return;
      }

      // Specific Project: Disease Prediction
      if (clean.includes('disease') || clean.includes('healthcare prediction') || clean.includes('risk scoring')) {
        const targetEl = document.querySelector('#projects-ai-machine-learning') || document.querySelector('#projects');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        speakNavigator("The Disease Risk Scoring System uses machine learning classification algorithms to predict student health risks.");
        showToast("Navigated to Disease Prediction Project");
        return;
      }

      // Specific Project: Churn Prediction
      if (clean.includes('churn') || clean.includes('retention') || clean.includes('customer churn')) {
        const targetEl = document.querySelector('#projects-ai-machine-learning') || document.querySelector('#projects');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        speakNavigator("The Customer Churn Prediction dashboard uses machine learning to segment customers and improve retention strategy.");
        showToast("Navigated to Churn Prediction Project");
        return;
      }

      // Specific Project: GPS SOS Band
      if (clean.includes('gps') || clean.includes('sos') || clean.includes('wearable distress')) {
        const targetEl = document.querySelector('#projects-iot-embedded-systems') || document.querySelector('#projects');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        speakNavigator("The GPS enabled SOS Band is an IoT distress wearable utilizing GPS and GSM modules for real-time tracking.");
        showToast("Navigated to GPS SOS Band Project");
        return;
      }

      // Specific Project: SLA Operations Dashboard
      if (clean.includes('sla') || clean.includes('service level agreement')) {
        const targetEl = document.querySelector('#projects-data-analytics-bi') || document.querySelector('#projects');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        speakNavigator("The SLA Operations Dashboard automates ticket ETL pipelines for compliance and KPI performance tracking.");
        showToast("Navigated to SLA Dashboard");
        return;
      }

      // Specific Project: Sales MIS Dashboard
      if (clean.includes('sales') || clean.includes('revenue mis')) {
        const targetEl = document.querySelector('#projects-data-analytics-bi') || document.querySelector('#projects');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        speakNavigator("The Sales Revenue MIS Dashboard provides interactive analytics and automated reporting for sales pipelines.");
        showToast("Navigated to Sales MIS Dashboard");
        return;
      }

      // Education & CGPA Details
      if (clean.includes('education') || clean.includes('college') || clean.includes('study') || clean.includes('grades') || clean.includes('cgpa') || clean.includes('gpa')) {
        const targetEl = document.querySelector('#education');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        speakNavigator("Sushant is pursuing B.Tech in Electronics and Telecommunication Engineering at NK Orchid College, Solapur, with a CGPA of 7.34.");
        showToast("Navigated to Education");
        return;
      }

      // Experience Details
      if (clean.includes('experience') || clean.includes('work') || clean.includes('internship') || clean.includes('qspiders')) {
        const targetEl = document.querySelector('#about');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        speakNavigator("Sushant is a Python Full Stack and Data Analytics Intern at QSpiders, building ETL pipelines and dashboards.");
        showToast("Navigated to Experience");
        return;
      }

      if (clean.includes('what skills') || clean.includes('sushant skills') || clean.includes('what are his skills') || clean.includes('what are sushant skills') || clean.includes('show skills')) {
        const targetEl = document.querySelector('#skills');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        speakNavigator("Sushant has advanced skills in Python, SQL, Generative AI engineering, Machine Learning, exploratory data analysis, and Power BI dashboards.");
        showToast("Navigated to Skills");
        return;
      }

      if (clean.includes('what projects') || clean.includes('sushant projects') || clean.includes('tell about projects') || clean.includes('tell me about projects') || clean.includes('show projects')) {
        const targetEl = document.querySelector('#projects');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        speakNavigator("Sushant has built several key engineering projects, including a GenAI-Powered Data Analysis Assistant, a Disease Risk Scoring System, a customer churn prediction model, and a GPS-enabled emergency SOS band.");
        showToast("Navigated to Projects");
        return;
      }

      // 1. Spoken introductions & direct queries (about me, projects, skills)
      if (clean.includes('tell about sushant') || clean.includes('who is sushant') || clean.includes('tell me about sushant') || clean.includes('introduce sushant') || clean.includes('tell about yourself')) {
        const targetEl = document.querySelector('#about');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        speakNavigator("Sushant Shrimal is an AI Engineer and Data Scientist, and Former GDG Cloud Lead. He is currently an intern at QSpiders.");
        showToast("Navigated to About");
        return;
      }

      let targetSelector = null;
      let targetName = "";
      let speakMessage = "";

      // 2. Git/Github checking
      if (clean.includes('git') || clean.includes('github') || clean.includes('repo')) {
        if (clean.includes('this project') || clean.includes('this portfolio') || clean.includes('of this') || clean.includes('source code')) {
          const url = 'https://github.com/sushant2701/Portfolio.git';
          speakNavigator("Opening repository of this portfolio website.");
          showToast("Opening GitHub Repository for this portfolio...");
          try {
            const win = window.open(url, '_blank');
            if (!win || win.closed || typeof win.closed === 'undefined') {
              window.location.href = url;
            }
          } catch (e) {
            window.location.href = url;
          }
        } else {
          const url = 'https://github.com/sushant2701';
          speakNavigator("Opening Sushant's GitHub profile.");
          showToast("Opening Sushant's GitHub profile...");
          try {
            const win = window.open(url, '_blank');
            if (!win || win.closed || typeof win.closed === 'undefined') {
              window.location.href = url;
            }
          } catch (e) {
            window.location.href = url;
          }
        }
        return;
      }

      // 3. LinkedIn checking
      if (clean.includes('linkedin')) {
        const url = 'https://www.linkedin.com/in/sushant-shrimal-017128251/';
        speakNavigator("Opening Sushant's LinkedIn profile.");
        showToast("Opening LinkedIn profile...");
        try {
          const win = window.open(url, '_blank');
          if (!win || win.closed || typeof win.closed === 'undefined') {
            window.location.href = url;
          }
        } catch (e) {
          window.location.href = url;
        }
        return;
      }

      // 4. Control Space checking
      if (clean.includes('control space') || clean.includes('admin') || clean.includes('drawer') || clean.includes('login') || clean.includes('management')) {
        const trigger = document.getElementById('control-trigger');
        if (trigger) {
          trigger.click();
          speakNavigator("Opening Control Space management console.");
          showToast("Opening Control Space...");
        }
        return;
      }

      // 5. Skill tooltip trigger checking
      const skillsList = [
        'Large Language Models (LLMs)', 'Prompt Engineering', 'RAG', 'OpenAI API', 'Anthropic API',
        'Scikit-Learn', 'TensorFlow', 'Logistic Regression', 'Random Forest', 'Feature Engineering',
        'Model Evaluation', 'Predictive Modeling', 'Python', 'SQL', 'R (basics)', 'Pandas', 'NumPy',
        'Data Cleaning', 'Data Wrangling', 'Exploratory Data Analysis (EDA)', 'Statistical Analysis',
        'A/B Testing', 'Hypothesis Testing', 'Power BI', 'Matplotlib', 'Seaborn', 'Streamlit',
        'Git', 'GitHub', 'Google Cloud', 'Jupyter Notebook', 'Google Colab'
      ];
      
      let matchedSkill = null;
      for (const skill of skillsList) {
        const skillLower = skill.toLowerCase();
        if (clean.includes(skillLower) || (skillLower.includes('llm') && clean.includes('llm')) || (skillLower.includes('scikit') && clean.includes('scikit'))) {
          matchedSkill = skill;
          break;
        }
      }

      if (matchedSkill) {
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
          skillsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTimeout(() => {
          const pills = document.querySelectorAll('.skill-pill');
          let foundPill = null;
          pills.forEach(pill => {
            const skillAttr = pill.getAttribute('data-skill') || '';
            if (skillAttr.toLowerCase() === matchedSkill.toLowerCase() || pill.textContent.trim().toLowerCase() === matchedSkill.toLowerCase()) {
              foundPill = pill;
            }
          });
          if (foundPill) {
            foundPill.click();
            const tooltipContent = SKILL_DEFINITIONS[matchedSkill] || `Sushant's skill in ${matchedSkill}`;
            speakNavigator(`${matchedSkill}: ${tooltipContent}`);
            showToast(`Showing details for ${matchedSkill}`);
          }
        }, 600);
        return;
      }

      // 6. Section Scrolling & Email Client triggers
      if (clean.includes('skill')) {
        targetSelector = '#skills';
        targetName = 'Skills';
        speakMessage = "Showing Technical Skills matrix.";
      } else if (clean.includes('project') || clean.includes('work') || clean.includes('portfolio') || clean.includes('creations')) {
        targetSelector = '#projects';
        targetName = 'Projects';
        speakMessage = "Showing Featured Projects.";
      } else if (clean.includes('educat') || clean.includes('credential') || clean.includes('college') || clean.includes('study')) {
        targetSelector = '#education';
        targetName = 'Education';
        speakMessage = "Showing Education details.";
      } else if (clean.includes('contact') || clean.includes('email') || clean.includes('reach') || clean.includes('hire') || clean.includes('send mail') || clean.includes('send email')) {
        speakNavigator("Opening email compose window.");
        showToast("Opening email...");
        if (typeof window.triggerContactRedirect === 'function') {
          window.triggerContactRedirect();
        }
        return;
      } else if (clean.includes('footer') || clean.includes('connect')) {
        targetSelector = '#footer';
        targetName = 'Contact';
        speakMessage = "Showing Contact section and email connections.";
      } else if (clean.includes('about') || clean.includes('sushant') || clean.includes('introduce')) {
        targetSelector = '#about';
        targetName = 'About';
        speakMessage = "Showing About section.";
      }

      if (targetSelector) {
        const targetEl = document.querySelector(targetSelector);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          speakNavigator(speakMessage);
          showToast(`Navigated to ${targetName}`);
        }
      } else if (hasWakeWord || wasAwaiting) {
        speakNavigator("Sorry, command not recognized. Try saying 'go to projects' or 'tell about sushant'.");
        showToast("Command unrecognized. Try: 'go to projects' or 'tell about sushant'");
      } else {
        if (isVoiceNavigatorEnabled && !window.speechSynthesis.speaking) {
          updateOverlayStatus('listening');
        }
      }
    };

    navRecognition.onsoundstart = () => {
      if (isVoiceNavigatorEnabled) {
        updateOverlayStatus('speaking');
      }
    };

    navRecognition.onsoundend = () => {
      if (isVoiceNavigatorEnabled) {
        if (!window.speechSynthesis.speaking) {
          updateOverlayStatus('listening');
        }
      }
    };

    navRecognition.onerror = (err) => {
      console.warn("Navigator voice recognition error:", err);
      if (err.error === 'no-speech' && isAwaitingCommand) {
        if (commandTimeoutId) clearTimeout(commandTimeoutId);
        isAwaitingCommand = false;
        speakNavigator("Sorry, I didn't hear you. Please speak again.");
      }
    };

    navRecognition.onend = () => {
      if (isVoiceNavigatorEnabled && !isAssistantSpeaking) {
        setTimeout(() => {
          try {
            navRecognition.start();
          } catch (err) {
            console.warn("Failed to restart voice navigator:", err);
          }
        }, 100);
      } else {
        if (!isVoiceNavigatorEnabled) {
          isNavigating = false;
          navBtn.classList.remove('active');
          if (navStatus) navStatus.textContent = "OFF";
          updateOverlayStatus('inactive');
        }
      }
    };

    navBtn.addEventListener('click', () => {
      if (isVoiceNavigatorEnabled) {
        isVoiceNavigatorEnabled = false;
        navRecognition.stop();
      } else {
        isVoiceNavigatorEnabled = true;
        navRecognition.start();
      }
    });

    const navSpeakerBtn = document.getElementById('nav-navigator-speaker-btn');
    if (navSpeakerBtn) {
      navSpeakerBtn.style.opacity = '0.5'; // Muted on startup
      navSpeakerBtn.addEventListener('click', () => {
        isVoiceNavigatorSpeakerEnabled = !isVoiceNavigatorSpeakerEnabled;
        navSpeakerBtn.textContent = isVoiceNavigatorSpeakerEnabled ? '🔊' : '🔇';
        navSpeakerBtn.style.opacity = isVoiceNavigatorSpeakerEnabled ? '1' : '0.5';
        if (!isVoiceNavigatorSpeakerEnabled) {
          window.speechSynthesis.cancel();
        }
      });
    }

    const navHelpBtn = document.getElementById('nav-navigator-help-btn');
    const navInstr = document.getElementById('nav-voice-instr');
    if (navHelpBtn && navInstr) {
      navHelpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navInstr.classList.toggle('show');
      });
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#nav-voice-instr') && !e.target.closest('#nav-navigator-help-btn')) {
          navInstr.classList.remove('show');
        }
      });
    }
  } else {
    if (navBtn) navBtn.style.display = "none";
  }

  // Bind Navbar and Footer Contact redirections to compose redirect helper
  const navContact = document.getElementById('nav-contact-btn');
  if (navContact) {
    navContact.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.triggerContactRedirect === 'function') {
        window.triggerContactRedirect();
      }
    });
  }
  const footerContact = document.getElementById('footer-contact-btn');
  if (footerContact) {
    footerContact.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.triggerContactRedirect === 'function') {
        window.triggerContactRedirect();
      }
    });
  }
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast show';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

/**
 * Interactive tooltips for tech skills
 */
function initSkillTooltips() {
  const removeTooltip = () => {
    const existing = document.querySelector('.skills-tooltip');
    if (existing) {
      if (existing._timeoutId) clearTimeout(existing._timeoutId);
      existing.remove();
      document.removeEventListener('click', handleOutsideClick);
    }
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest('.skill-pill') && !e.target.closest('.skills-tooltip')) {
      removeTooltip();
    }
  };

  document.querySelectorAll('.skill-pill').forEach(pill => {
    pill.style.cursor = 'pointer';
    pill.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      removeTooltip();

      const skillName = pill.getAttribute('data-skill');
      if (!skillName) return;

      const definition = SKILL_DEFINITIONS[skillName];
      if (!definition) return;

      const tooltip = document.createElement('div');
      tooltip.className = 'skills-tooltip';
      tooltip.innerHTML = `
        <div class="skills-tooltip-title">${skillName}</div>
        <div class="skills-tooltip-content">${definition}</div>
      `;

      document.body.appendChild(tooltip);

      // Calculate position
      const rect = pill.getBoundingClientRect();
      const tooltipHeight = tooltip.offsetHeight || 60;
      const tooltipWidth = tooltip.offsetWidth || 220;

      let top = rect.top + window.scrollY - tooltipHeight - 12;
      let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);

      // Boundary checks
      if (top < window.scrollY + 10) {
        top = rect.bottom + window.scrollY + 12; // render below
      }
      if (left < 10) left = 10;
      if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10;
      }

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;

      // Set timeout
      tooltip._timeoutId = setTimeout(removeTooltip, 4000);

      document.addEventListener('click', handleOutsideClick);
    });
  });
}

/**
 * Track visitor geolocation and trigger email notification
 */
async function trackVisitor() {
  let locationData = null;

  try {
    // 1. Fetch location from ipapi.co
    const res = await Promise.race([
      fetch('https://ipapi.co/json/'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
    ]);
    if (res.ok) {
      locationData = await res.json();
    } else {
      throw new Error('ipapi failed');
    }
  } catch (e) {
    console.warn("ipapi failed, attempting fallback...", e);
    try {
      // Fallback to ipwhois
      const res = await Promise.race([
        fetch('https://ipwhois.app/json/'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]);
      if (res.ok) {
        const raw = await res.json();
        if (raw && raw.success !== false) {
          locationData = {
            ip: raw.ip,
            city: raw.city,
            region: raw.region,
            country_name: raw.country,
            org: raw.org || raw.isp,
            latitude: raw.latitude,
            longitude: raw.longitude
          };
        }
      }
    } catch (err) {
      console.error("All geolocation APIs failed:", err);
    }
  }

  // Initialize J.A.R.V.I.S. with location data
  initJarvis(locationData);

  // 2. Trigger email notification if not tracked in this session
  if (locationData && !sessionStorage.getItem('portfolio_view_tracked')) {
    sessionStorage.setItem('portfolio_view_tracked', 'true');
    try {
      const city = locationData.city || 'Unknown City';
      const lat = locationData.latitude;
      const lon = locationData.longitude;
      const mapsUrl = (lat && lon) ? `https://www.google.com/maps?q=${lat},${lon}` : 'No Coordinates Available';

      const payload = {
        _subject: `Portfolio View: Visitor in ${city}`,
        city: city,
        coordinates: (lat && lon) ? `${lat}, ${lon}` : 'N/A',
        google_maps_link: mapsUrl
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
      console.error("Failed to transmit visitor notification:", err);
    }
  }
}

// ── Launch ──
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
