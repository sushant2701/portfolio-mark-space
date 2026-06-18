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

// Background Ambient Music Manager
function initBackgroundMusic() {
  const sources = [
    '/audio/ambient.mp3',
    '/audio/ambient.mp4',
    '/audio/music.mp3',
    '/audio/music.mp4'
  ];
  
  let currentSourceIndex = typeof window.musicTrackIndex === 'number' ? window.musicTrackIndex : 0;
  let music = null;
  let hasStarted = false;

  const tryPlaySource = () => {
    if (currentSourceIndex >= sources.length) {
      console.warn("No background music sources loaded successfully.");
      return;
    }
    
    const src = sources[currentSourceIndex];
    music = new Audio(src);
    music.loop = true;
    music.volume = typeof window.musicVolume === 'number' ? window.musicVolume : 0.2;
    
    music.play().then(() => {
      console.log(`Background ambient music started playing from: ${src} at volume ${music.volume}`);
    }).catch(err => {
      console.warn(`Failed to play music source: ${src}, trying next...`, err);
      currentSourceIndex++;
      tryPlaySource();
    });
  };

  const startMusic = () => {
    if (hasStarted) return;
    hasStarted = true;
    tryPlaySource();
    
    // Clean up events
    ['click', 'touchstart', 'keydown'].forEach(evt => {
      document.removeEventListener(evt, startMusic);
    });
  };
  
  // Expose global hooks to stop/start the background music when speaking
  window.notifySpeechStart = () => {
    if (music && !music.paused) {
      music.pause();
      music.wasPlayingBeforeSpeech = true;
      console.log("Speech started: paused background music.");
    }
  };

  window.notifySpeechEnd = () => {
    if (music && music.wasPlayingBeforeSpeech) {
      music.wasPlayingBeforeSpeech = false;
      music.play().then(() => {
        console.log("Speech ended: resumed background music.");
      }).catch(err => console.warn("Failed to resume background music:", err));
    }
  };

  // Expose global hooks to adjust volume and tracks from Control Space on the fly
  window.updateBgMusicVolume = (vol) => {
    if (music) {
      music.volume = vol;
      console.log("Updated background music volume to:", vol);
    }
  };

  window.changeBgMusicTrack = (index) => {
    currentSourceIndex = index;
    if (music) {
      const wasPlaying = !music.paused;
      music.pause();
      
      const src = sources[currentSourceIndex];
      music = new Audio(src);
      music.loop = true;
      music.volume = typeof window.musicVolume === 'number' ? window.musicVolume : 0.2;
      
      if (wasPlaying || hasStarted) {
        music.play().then(() => {
          console.log(`Switched background music to source: ${src}`);
        }).catch(err => {
          console.warn(`Failed to play switched music source: ${src}, trying fallback...`, err);
          currentSourceIndex++;
          tryPlaySource();
        });
      }
    }
  };

  ['click', 'touchstart', 'keydown'].forEach(evt => {
    document.addEventListener(evt, startMusic, { once: true, passive: true });
  });

  // ── Page Visibility: pause when user leaves tab, resume when they come back ──
  document.addEventListener('visibilitychange', () => {
    if (!music || !hasStarted) return;

    if (document.hidden) {
      // User switched away — pause only if currently playing
      if (!music.paused) {
        music.pause();
        music._pausedByVisibility = true;
        console.log('Page hidden: paused background music.');
      }
    } else {
      // User returned — resume only if we paused it AND speech isn't playing
      if (music._pausedByVisibility && !music.wasPlayingBeforeSpeech) {
        music._pausedByVisibility = false;
        music.play().then(() => {
          console.log('Page visible: resumed background music.');
        }).catch(err => console.warn('Failed to resume music on visibility change:', err));
      } else {
        music._pausedByVisibility = false;
      }
    }
  });
}

// Dynamically Synthesized Ping Sound Pluck
function playPingSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.06);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.warn("Failed to play synthesized ping sound:", e);
  }
}

// Global click event catcher to play ping sound on interactive elements
if (typeof window !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;
    const isInteractive = target.closest('button') || 
                          target.closest('a') || 
                          target.closest('.skill-pill') || 
                          target.closest('.project-card') || 
                          target.closest('.reactor-core') || 
                          target.closest('.voice-mic-orb') ||
                          target.closest('.help-guide-btn') ||
                          target.closest('.nav-btn') ||
                          target.closest('#control-trigger');
    if (isInteractive) {
      playPingSound();
    }
  }, { capture: true, passive: true });
}

// Global contact redirection helper (Desktop: compose in Gmail; Mobile: launch native Mail app)
window.triggerContactRedirect = function(type = 'default', isVoiceTrigger = false) {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  const recipient = "sushantshrimal08@gmail.com";
  
  let subjectText = "Portfolio Connection Request";
  let bodyText = "Hello Sushant,\n\nI saw your portfolio and wanted to reach out.\n\nMy Details:\nName: \nContact Email/Phone: \nCompany/Affiliation: \nMessage: ";
  
  if (type === 'project') {
    subjectText = "Project Collaboration Proposal — Sushant Shrimal";
    bodyText = "Hello Sushant,\n\nI saw that you are available for projects on your portfolio and would love to discuss a potential collaboration / contract role.\n\nProject / Opportunity Details:\n- Project Title / Scope: \n- Organization / Client: \n- Estimated Duration / Timeline: \n- Key Skills Needed: \n- Compensation / Budget (Optional): \n\nLooking forward to discussing further!\n\nBest regards,\n";
  }
  
  const subject = encodeURIComponent(subjectText);
  const body = encodeURIComponent(bodyText);

  if (isMobile) {
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  } else {
    // Desktop Gmail compose tab using active Google profile composing
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
    if (isVoiceTrigger) {
      window.location.href = gmailUrl;
    } else {
      let win = null;
      try {
        win = window.open(gmailUrl, '_blank');
      } catch (e) {
        console.warn("Popup blocked or failed:", e);
      }
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = gmailUrl;
      }
    }
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

  // 6. Initialize background ambient music
  initBackgroundMusic();
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

  // Mobile Hamburger Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navbarEl = document.getElementById('navbar');
  if (navToggle && navbarEl) {
    const newNavToggle = navToggle.cloneNode(true);
    navToggle.parentNode.replaceChild(newNavToggle, navToggle);
    
    newNavToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navbarEl.classList.toggle('mobile-open');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link, .nav-dropdown-item').forEach(link => {
      link.addEventListener('click', () => {
        navbarEl.classList.remove('mobile-open');
      });
    });

    // Close menu when clicking outside
    const closeMobileMenu = (e) => {
      if (!e.target.closest('#navbar')) {
        navbarEl.classList.remove('mobile-open');
      }
    };
    document.removeEventListener('click', window.closeMobileMenuHandler);
    window.closeMobileMenuHandler = closeMobileMenu;
    document.addEventListener('click', closeMobileMenu);
  }

  // Projects domain switcher tabs
  const tabButtons = document.querySelectorAll('.project-tab-btn');
  const domainSections = document.querySelectorAll('.project-domain-section');

  const switchTab = (targetId, forceShow = false) => {
    let alreadyActive = false;

    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-target') === targetId) {
        if (btn.classList.contains('active') && !forceShow) {
          alreadyActive = true;
          btn.classList.remove('active');
        } else {
          btn.classList.add('active');
        }
      } else {
        btn.classList.remove('active');
      }
    });

    domainSections.forEach(section => {
      if (section.id === targetId && !alreadyActive) {
        section.classList.remove('hidden-domain');
        section.style.display = 'block';
      } else {
        section.classList.add('hidden-domain');
        section.style.display = 'none';
      }
    });
  };

  if (tabButtons.length > 0) {
    // Hide all sections initially (no tab active)
    domainSections.forEach(section => {
      section.classList.add('hidden-domain');
      section.style.display = 'none';
    });

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        switchTab(targetId);
      });
    });
  }

  // Handle navbar dropdown clicks to switch domain tabs
  document.querySelectorAll('.nav-dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');
      if (href && href.startsWith('#projects-')) {
        const targetId = href.substring(1);
        const tabBtn = document.querySelector(`.project-tab-btn[data-target="${targetId}"]`);
        if (tabBtn) {
          e.preventDefault();
          e.stopPropagation();
          switchTab(targetId, true); // Force show when clicked from navbar dropdown
          const projectsSection = document.getElementById('projects');
          if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    });
  });

  // Control Space trigger → opens drawer
  const trigger = document.getElementById('control-trigger');
  if (trigger) {
    trigger.addEventListener('click', openDrawer);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.length > 1) {
        try {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } catch (err) {
          console.warn("Invalid anchor selector:", href, err);
        }
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
  let initNavigatorRecognition = null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  // Inject voice status overlay widget in body
  let overlay = document.getElementById('voice-status-overlay');
  if (!overlay && SpeechRecognition && navBtn) {
    overlay = document.createElement('div');
    overlay.id = 'voice-status-overlay';
    overlay.className = 'voice-status-overlay';
    overlay.title = "Click mic orb to refresh Voice Assistant";
    overlay.innerHTML = `
      <div class="voice-mic-orb">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mic-svg"><path d="M12 1v11a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
      </div>
      <div class="voice-status-text" id="voice-status-text">Mark is listening...</div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      const refreshBtn = document.getElementById('nav-navigator-refresh-btn');
      if (refreshBtn) {
        refreshBtn.click();
      }
    });
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
      if (typeof window.notifySpeechStart === 'function') {
        window.notifySpeechStart();
      }
    };

    const onSpeechEnd = () => {
      if (speechTimeoutId) clearTimeout(speechTimeoutId);
      if (!isAssistantSpeaking) return; // Already cleaned up
      isAssistantSpeaking = false;
      if (typeof window.notifySpeechEnd === 'function') {
        window.notifySpeechEnd();
      }
      if (isVoiceNavigatorEnabled) {
        updateOverlayStatus('listening');
        setTimeout(() => {
          try {
            if (typeof initNavigatorRecognition === 'function') {
              initNavigatorRecognition();
            }
            try {
              navRecognition.start();
            } catch (err) {
              console.warn("Failed to start voice navigator in onSpeechEnd:", err);
            }
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

    // Expanded watchdog safeguard: give generous minimum (20s) and buffer to prevent premature cuts
    const wordCount = text.split(/\s+/).length;
    const estimatedMs = Math.max(20000, (wordCount / 1.5) * 1000 + 10000);
    speechTimeoutId = setTimeout(() => {
      console.warn("Speech synthesis took too long or got stuck. Forcing reset.");
      window.speechSynthesis.cancel();
      onSpeechEnd();
    }, estimatedMs);

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural')));
    if (voice) utterance.voice = voice;
    utterance.volume = typeof window.speechVolume === 'number' ? window.speechVolume : 0.8;
    window.speechSynthesis.speak(utterance);
  }

  if (SpeechRecognition && navBtn) {
    initNavigatorRecognition = () => {
      if (navRecognition) {
        try {
          navRecognition.abort();
        } catch (e) {}
      }
      navRecognition = new SpeechRecognition();
      navRecognition.continuous = true;
      
      // Dynamic accent optimization based on geolocated country
      const visitorCountry = sessionStorage.getItem('visitor_country') || '';
      navRecognition.lang = (visitorCountry.toLowerCase() === 'india') ? 'en-IN' : 'en-US';
      
      navRecognition.interimResults = true;
      navRecognition.maxAlternatives = 3;

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
          let selectedTranscript = e.results[i][0].transcript;
          
          // Multi-alternative keyword scanning to match voice intents accurately
          const boostWordList = [
            'otp', 'genai', 'gps', 'uart', 'serial', 'quantum', 'qiskit', 'fpga', 'hdl', 'verilog',
            'linkedin', 'github', 'guthub', 'source code', 'repository', 'repo',
            'control space', 'controlspace', 'guide', 'instructions', 'commands',
            'mute', 'unmute', 'refresh', 'restart', 'reboot', 'education', 'cgpa', 'gpa',
            'college', 'experience', 'internship', 'qspiders', 'aicte', 'skills', 'skill',
            'projects', 'project', 'about sushant', 'who is sushant', 'yourself',
            'contact', 'hire', 'send email', 'send mail'
          ];
          
          for (let j = 0; j < e.results[i].length; ++j) {
            const altText = e.results[i][j].transcript.toLowerCase();
            const hasBoost = boostWordList.some(kw => altText.includes(kw));
            if (hasBoost) {
              selectedTranscript = e.results[i][j].transcript;
              break;
            }
          }
          
          finalTranscript += (finalTranscript ? ' ' : '') + selectedTranscript;
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

      const transcript = finalTranscript.toLowerCase().replace(/'s\b/g, '').trim();
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
        'it hub': 'github',
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
        'contect': 'contact', 'contac': 'contact', 'conatnt': 'contact', 'conatct': 'contact', 'contat': 'contact',
        'githb': 'github', 'gitb': 'github', 'ithub': 'github',
        'guthub': 'github', 'gut': 'github', 'limked': 'linkedin', 'limkedin': 'linkedin',
        'abt': 'about', 'abot': 'about',
        'likendin': 'linkedin', 'likendina': 'linkedin', 'linkdin': 'linkedin', 'linked': 'linkedin',
        'sushamnt': 'sushant', 'sushants': 'sushant'
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
        const knownKeywords = [
          'go to', 'show', 'open', 'view', 'explain', 'click', 'tell', 'introduce', 'who is', 'what', 
          'quantum', 'qiskit', 'fpga', 'hdl', 'genai', 'gps', 'uart', 'serial', 'experience', 'education', 'skills', 'projects',
          'github', 'git', 'linkedin', 'contact', 'email', 'mail', 'connect', 'controlspace', 'control space',
          'chatbot', 'chat', 'mark27', 'jarvis', 'help', 'guide'
        ];
        const hasKeyword = knownKeywords.some(kw => clean.includes(kw));
        if (!hasKeyword && !wasAwaiting) {
          console.log("Ignoring ambient conversation:", transcript);
          if (isVoiceNavigatorEnabled && !window.speechSynthesis.speaking) {
            updateOverlayStatus('listening');
          }
          return;
        }
      }

      // Let's implement semantic vector scoring
      const tokens = clean.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim().split(/\s+/).filter(Boolean);
      const tokenSet = new Set(tokens);

      const voiceIntents = [
        {
          key: 'genai',
          label: 'see the GenAI Data Analysis Platform',
          samplePhrase: 'genai platform',
          keywords: ['genai', 'csv', 'analysis', 'platform', 'streamlit', 'natural language query'],
          phrases: ['genai analysis assistant', 'data analysis platform', 'query csv in natural language', 'streamlit platform'],
          action: () => {
            const el = document.querySelector('#projects-ai-machine-learning') || document.querySelector('#projects');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            speakNavigator("The GenAI-Powered Data Analysis Platform enables querying CSV datasets in natural language using the Gemini LLM API and Streamlit with structured output validation.");
            showToast("Navigated to GenAI Platform");
          }
        },
        {
          key: 'gps',
          label: 'check the Real-Time GPS Emergency Communication System',
          samplePhrase: 'emergency gps',
          keywords: ['gps', 'emergency', 'communication', 'system', 'uart', 'serial', 'iot', 'hardware', 'states'],
          phrases: ['gps emergency system', 'real-time gps emergency communication', 'serial communication layer uart', 'emergency gps band'],
          action: () => {
            const el = document.querySelector('#projects-iot-embedded-systems') || document.querySelector('#projects');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            speakNavigator("The GPS Emergency Communication System interfaces GPS and GSM hardware over UART using a robust Python state machine to manage serial I/O.");
            showToast("Navigated to GPS Emergency System");
          }
        },
        {
          key: 'mark_space',
          label: 'explain the MARK_SPACE Interactive Portfolio Hub',
          samplePhrase: 'explain mark space',
          keywords: ['mark_space', 'mark space', 'portfolio', 'voice command', 'assistant', 'supabase'],
          phrases: ['explain mark space', 'tell me about mark space portfolio', 'voice command personal portfolio', 'mark space hub'],
          action: () => {
            const el = document.querySelector('#projects-web-development-security') || document.querySelector('#projects');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            speakNavigator("MARK_SPACE is this framework-free personal developer portfolio, featuring native voice commands via the Web Speech API and Supabase database tracking.");
            showToast("Navigated to MARK_SPACE Project");
          }
        },
        {
          key: 'education',
          label: 'view my education details',
          samplePhrase: 'education',
          keywords: ['education', 'college', 'study', 'grades', 'cgpa', 'gpa', 'academic', 'degree', 'qualification', 'engineering', 'nkocet', 'orchid'],
          phrases: ['education details', 'where did sushant study', 'what is sushants cgpa', 'orchid college solapur', 'academic credentials'],
          action: () => {
            const el = document.querySelector('#education');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            speakNavigator("Sushant is pursuing B.Tech in Electronics and Telecommunication Engineering at NK Orchid College, Solapur, with a CGPA of 7.34.");
            showToast("Navigated to Education");
          }
        },
        {
          key: 'experience',
          label: 'view my professional experience',
          samplePhrase: 'experience',
          keywords: ['experience', 'work', 'job', 'internship', 'qspiders', 'aicte', 'internships', 'working', 'career', 'role'],
          phrases: ['work experience', 'professional experience', 'where does sushant work', 'qspiders internship details', 'aicte internship details'],
          action: () => {
            const el = document.querySelector('#about');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            speakNavigator("Sushant has interned at QSpiders as a Python developer, at AICTE in AI and Machine Learning, and at PMS Robotics engineering real-time sensor control scripts.");
            showToast("Navigated to Experience");
          }
        },
        {
          key: 'skills',
          label: 'see my programming languages and skills',
          samplePhrase: 'skills',
          keywords: ['skills', 'skill', 'expertise', 'know', 'toolkit', 'programming', 'languages', 'python', 'sql', 'stack', 'technologies', 'tools', 'quantum', 'qiskit', 'fpga', 'hdl'],
          phrases: ['what are sushants skills', 'show technical skills matrix', 'programming languages sushant knows', 'technical expertise toolkits'],
          action: () => {
            const el = document.querySelector('#skills');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            speakNavigator("Sushant has advanced skills in Python, C, C++, systems programming, scientific data pipelines, FPGA concepts, and Qiskit quantum circuit design.");
            showToast("Navigated to Skills");
          }
        },
        {
          key: 'projects',
          label: 'show my engineering projects list',
          samplePhrase: 'projects',
          keywords: ['projects', 'project', 'works', 'creations', 'built', 'made', 'developed', 'portfolio list', 'list projects', 'all projects'],
          phrases: ['what projects has sushant built', 'show all featured projects list', 'tell about projects', 'projects portfolio show', 'creations and implementations'],
          action: () => {
            const el = document.querySelector('#projects');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            speakNavigator("Sushant has built a GenAI-Powered Data Analysis Platform, a Real-Time GPS Emergency Communication System, and the MARK_SPACE voice-navigated portfolio hub.");
            showToast("Navigated to Projects");
          }
        },
        {
          key: 'about',
          label: 'learn about my background',
          samplePhrase: 'about sushant',
          keywords: ['about', 'who is sushant', 'introduce sushant', 'bio', 'yourself', 'background', 'identity', 'creator', 'person', 'sushant shrimal'],
          phrases: ['tell about sushant', 'who is sushant shrimal', 'introduce sushant shrimal', 'creator bio details', 'background profile summary'],
          action: () => {
            const el = document.querySelector('#about');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            speakNavigator("Sushant Shrimal is a Full-Stack Quantum Control Software Engineer and final-year Electronics & Telecommunication Engineering student specializing in experiment orchestration pipelines, low-level hardware control, and modular system design.");
            showToast("Navigated to About");
          }
        },
        {
          key: 'contact',
          label: 'contact me or email sushant',
          samplePhrase: 'contact',
          keywords: ['contact', 'email', 'reach', 'hire', 'send mail', 'send email', 'message', 'connect', 'mail', 'write email', 'email sushant'],
          phrases: ['how to contact sushant', 'send an email to sushant', 'connect with sushant email', 'reach out message hire', 'send mail options'],
          action: () => {
            if (typeof window.triggerContactRedirect === 'function') {
              window.triggerContactRedirect('default', true);
            }
            speakNavigator("Opening email compose window.");
            showToast("Opening email compose...");
          }
        },
        {
          key: 'github_portfolio',
          label: 'open the source code for this site',
          samplePhrase: 'source code',
          keywords: ['source code', 'repository', 'repo', 'of this', 'this project', 'this portfolio', 'source code portfolio'],
          phrases: ['show source code of this website', 'open repository of this project', 'this portfolio repository git', 'where is the code for this'],
          action: () => {
            const url = 'https://github.com/sushant2701/Portfolio.git';
            speakNavigator("Opening repository of this portfolio website.");
            showToast("Opening GitHub Repository for this portfolio...");
            window.location.href = url;
          }
        },
        {
          key: 'github_profile',
          label: 'visit my GitHub profile',
          samplePhrase: 'open github',
          keywords: ['github', 'git', 'repo', 'guthub', 'gut hub'],
          phrases: ['open sushants github profile', 'show github projects list', 'sushant git repository url', 'github page link'],
          action: () => {
            const url = 'https://github.com/sushant2701';
            speakNavigator("Opening Sushant's GitHub profile.");
            showToast("Opening Sushant's GitHub profile...");
            window.location.href = url;
          }
        },
        {
          key: 'linkedin',
          label: 'visit my LinkedIn profile',
          samplePhrase: 'open linkedin',
          keywords: ['linkedin', 'linked in', 'limked', 'limkedin'],
          phrases: ['open sushants linkedin profile', 'connect on linkedin url', 'linkedin network page', 'show linkedin info'],
          action: () => {
            const url = 'https://www.linkedin.com/in/sushant-shrimal-017128251/';
            speakNavigator("Opening Sushant's LinkedIn profile.");
            showToast("Opening LinkedIn profile...");
            window.location.href = url;
          }
        },
        {
          key: 'control_space',
          label: 'open the Control Space admin drawer',
          samplePhrase: 'open control space',
          keywords: ['control space', 'controlspace', 'admin', 'drawer', 'login', 'management'],
          phrases: ['open control space login drawer', 'admin panel credentials screen', 'admin drawer database credentials', 'open management dashboard'],
          action: () => {
            const trigger = document.getElementById('control-trigger');
            if (trigger) {
              trigger.click();
              speakNavigator("Opening Control Space management console.");
              showToast("Opening Control Space...");
            }
          }
        },
        {
          key: 'toggle_guide',
          label: 'show the voice navigator help guide instructions',
          samplePhrase: 'show help guide',
          keywords: ['guide', 'help', 'instructions', 'commands', 'voice guide'],
          phrases: ['show help guide instructions', 'open voice command guide', 'toggle voice guide window', 'show guide commands'],
          action: () => {
            const helpBtn = document.getElementById('nav-navigator-help-btn');
            if (helpBtn) {
              helpBtn.click();
              speakNavigator("Toggling voice guide instructions.");
              showToast("Toggled help guide.");
            }
          }
        },
        {
          key: 'toggle_speaker',
          label: 'mute or unmute the voice speaker feedback',
          samplePhrase: 'mute voice assistant',
          keywords: ['mute', 'unmute', 'speaker', 'sound', 'feedback', 'voice feedback'],
          phrases: ['mute voice assistant feedback', 'unmute voice speaker feedback', 'toggle assistant speaker sound', 'turn off speaker sound', 'turn on assistant feedback'],
          action: () => {
            const speakerBtn = document.getElementById('nav-navigator-speaker-btn');
            if (speakerBtn) {
              speakerBtn.click();
              const stateText = isVoiceNavigatorSpeakerEnabled ? "Speaker feedback unmuted." : "Speaker feedback muted.";
              if (isVoiceNavigatorSpeakerEnabled) {
                speakNavigator(stateText);
              }
              showToast(stateText);
            }
          }
        },
        {
          key: 'refresh_assistant',
          label: 'refresh and restart the voice assistant recognition engine',
          samplePhrase: 'refresh voice assistant',
          keywords: ['refresh', 'restart', 'reboot', 'reinitialize', 'fix assistant'],
          phrases: ['refresh voice assistant engine', 'restart voice recognition', 'reboot speech recognition module', 'fix voice command listener'],
          action: () => {
            const refreshBtn = document.getElementById('nav-navigator-refresh-btn');
            if (refreshBtn) {
              refreshBtn.click();
            }
          }
        }
      ];

      // 1. Resolve Skill Tooltip directly if query specifically targets a skill details
      const skillsList = [
        'Python', 'C', 'C++', 'Bash/Shell Scripting', 'Linux (Ubuntu/Debian) Systems Programming',
        'NumPy', 'Pandas', 'Matplotlib', 'Statistical Processing', 'SQL/Query Optimization',
        'FPGA Architecture Fundamentals', 'Digital Logic Design', 'HDL Concepts (Verilog/VHDL basics)',
        'Qiskit', 'Quantum Circuit Basics', 'Git/GitHub', 'CI/CD Pipelines', 'REST APIs',
        'API Design', 'System Design', 'Modular Architecture'
      ];
      
      let matchedSkill = null;
      for (const skill of skillsList) {
        const skillLower = skill.toLowerCase();
        if (clean.includes(skillLower) || 
            (skillLower.includes('llm') && clean.includes('llm')) || 
            (skillLower.includes('scikit') && clean.includes('scikit'))) {
          matchedSkill = skill;
          break;
        }
      }

      // Check if this is a direct skill explanation query
      const isSkillQuery = matchedSkill && 
        !clean.includes('open') && 
        !clean.includes('go to') && 
        !clean.includes('visit') && 
        !clean.includes('link') && (
          clean.includes('explain') || 
          clean.includes('what is') || 
          clean.includes('tell about') || 
          clean.includes('definition') || 
          clean.includes('info') || 
          tokens.length <= 3
        );

      if (isSkillQuery) {
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

      // 2. Score General voice intents using Jaccard Similarity and Keyword Density
      let bestIntent = null;
      let highestScore = 0;

      const intentBoostMap = {
        'genai': ['genai'],
        'gps': ['gps', 'uart', 'serial'],
        'mark_space': ['mark_space', 'mark space', 'portfolio hub'],
        'linkedin': ['linkedin'],
        'github_portfolio': ['source code', 'repository', 'repo'],
        'github_profile': ['github', 'guthub'],
        'control_space': ['control space', 'controlspace'],
        'toggle_guide': ['guide', 'instructions', 'commands', 'voice guide'],
        'toggle_speaker': ['mute', 'unmute'],
        'refresh_assistant': ['refresh', 'restart', 'reboot', 'reinitialize'],
        'education': ['education', 'cgpa', 'gpa', 'college'],
        'experience': ['experience', 'internship', 'qspiders', 'aicte'],
        'skills': ['skills', 'skill', 'quantum', 'qiskit', 'fpga', 'hdl'],
        'projects': ['projects', 'project'],
        'about': ['about sushant', 'who is sushant', 'introduce sushant', 'yourself'],
        'contact': ['contact', 'hire', 'reach sushant', 'send email', 'send mail']
      };

      voiceIntents.forEach(intent => {
        let bestPhraseScore = 0;
        intent.phrases.forEach(phrase => {
          const phraseTokens = phrase.toLowerCase().split(/\s+/);
          const phraseSet = new Set(phraseTokens);
          
          const intersection = new Set([...tokenSet].filter(t => phraseSet.has(t)));
          const union = new Set([...tokenSet, ...phraseSet]);
          
          const Jaccard = intersection.size / union.size;
          if (Jaccard > bestPhraseScore) {
            bestPhraseScore = Jaccard;
          }
        });

        let keywordMatches = 0;
        intent.keywords.forEach(kw => {
          if (tokenSet.has(kw) || clean.includes(kw)) {
            keywordMatches++;
          }
        });
        const keywordScore = keywordMatches / intent.keywords.length;

        let finalScore = (bestPhraseScore * 0.7) + (keywordScore * 0.3);

        // Direct Keyword Boosting with score overrides
        const boostKws = intentBoostMap[intent.key];
        if (boostKws) {
          let hasBoostKeyword = boostKws.some(kw => {
            if (kw.includes(' ')) {
              return clean.includes(kw);
            }
            return tokenSet.has(kw) || clean.includes(kw);
          });
          
          // Exclusion rules for general intents to avoid conflicts
          if (hasBoostKeyword) {
            if (intent.key === 'projects') {
              const specificProjectKeywords = ['genai', 'gps', 'mark_space', 'mark space'];
              const hasSpecificProject = specificProjectKeywords.some(sp => clean.includes(sp));
              if (hasSpecificProject) {
                hasBoostKeyword = false;
              }
            } else if (intent.key === 'skills') {
              if (matchedSkill) {
                hasBoostKeyword = false;
              }
            } else if (intent.key === 'github_profile') {
              const hasPortfolioRepo = ['source code', 'repository', 'repo'].some(kw => clean.includes(kw));
              if (hasPortfolioRepo) {
                hasBoostKeyword = false;
              }
            }
          }
          
          if (hasBoostKeyword) {
            finalScore = 1.0;
          }
        }

        // Hijack prevention for 'about' intent
        if (intent.key === 'about') {
          const otherIntentKeywords = [
            'skills', 'skill', 'projects', 'project', 'education', 'college', 'cgpa', 'gpa',
            'contact', 'email', 'linkedin', 'github', 'experience', 'internship',
            'certifications', 'awards', 'gdg'
          ];
          const hasOtherKeyword = otherIntentKeywords.some(kw => tokenSet.has(kw) || clean.includes(kw));
          if (hasOtherKeyword) {
            finalScore = 0;
          }
        }

        if (finalScore > highestScore) {
          highestScore = finalScore;
          bestIntent = intent;
        }
      });

      // Execute matched semantic intent
      if (highestScore >= 0.2 && bestIntent) {
        bestIntent.action();
        return;
      }

      // Fallback: If Jaccard did not pass threshold, but we matched a skill, show tooltip
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

      // (No chatbot fallback)

      // 4. Predictive Overlap Matching Fallback ("Did you mean...?")
      if (highestScore >= 0.05 && bestIntent) {
        speakNavigator(`I didn't quite catch that. Did you mean to ${bestIntent.label}? Try saying: ${bestIntent.samplePhrase}.`);
        showToast(`Did you mean: "${bestIntent.samplePhrase}"?`);
        return;
      }

      // 5. Final Unrecognized Commands Fallback
      if (hasWakeWord || wasAwaiting) {
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
        updateOverlayStatus('listening');
        setTimeout(() => {
          try {
            if (typeof initNavigatorRecognition === 'function') {
              initNavigatorRecognition();
            }
            try {
              navRecognition.start();
            } catch (err) {
              console.warn("Failed to start voice navigator in onend:", err);
            }
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

    };

    initNavigatorRecognition();

    function getTimeGreeting() {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 17) return "Good afternoon";
      return "Good evening";
    }

    navBtn.addEventListener('click', () => {
      if (isVoiceNavigatorEnabled) {
        isVoiceNavigatorEnabled = false;
        navRecognition.stop();
      } else {
        isVoiceNavigatorEnabled = true;
        try {
          navRecognition.start();
        } catch (err) {
          console.warn("Navigator recognition start error in click handler:", err);
        }
        
        // Time-based oral greeting on FIRST activation only per session
        if (!sessionStorage.getItem('voice_navigator_greeted')) {
          sessionStorage.setItem('voice_navigator_greeted', 'true');
          const greeting = `${getTimeGreeting()}! Voice assistant active. How can I help you today?`;
          speakNavigator(greeting);
          showToast(greeting);
        }
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

    const navRefreshBtn = document.getElementById('nav-navigator-refresh-btn');
    if (navRefreshBtn) {
      navRefreshBtn.addEventListener('click', () => {
        playPingSound();
        showToast("Voice Assistant engine refreshed.");
        
        const wasEnabled = isVoiceNavigatorEnabled;
        isVoiceNavigatorEnabled = false;
        
        initNavigatorRecognition();
        
        if (wasEnabled) {
          setTimeout(() => {
            isVoiceNavigatorEnabled = true;
            try {
              navRecognition.start();
            } catch (err) {
              console.warn("Failed to start voice navigator after refresh:", err);
            }
          }, 200);
        }
      });
    }

    // Hydrate audio and assistant settings from localStorage (or set default fallbacks)
    window.speechVolume = parseFloat(localStorage.getItem('cs_speech_volume') || '0.8');
    window.musicVolume = parseFloat(localStorage.getItem('cs_music_volume') || '0.2');
    window.musicTrackIndex = parseInt(localStorage.getItem('cs_music_track_index') || '0', 10);

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

  // REDUNDANT JS MAIL REDIRECTS REMOVED. HTML natively handles standard mailto links.
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

  const getIpLocation = async () => {
    try {
      // 1. Fetch location from ipapi.co
      const res = await Promise.race([
        fetch('https://ipapi.co/json/'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]);
      if (res.ok) {
        return await res.json();
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
            return {
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
    return null;
  };

  const getGpsLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            // Reverse geocode using Nominatim OpenStreetMap API
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`);
            if (res.ok) {
              const data = await res.json();
              if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.village || data.address.suburb || 'Unknown City';
                const country = data.address.country || 'Unknown Country';
                resolve({
                  city: city,
                  country_name: country,
                  latitude: lat,
                  longitude: lon,
                  gps: true
                });
                return;
              }
            }
          } catch (err) {
            console.warn("Reverse geocoding failed, falling back to coordinates:", err);
          }
          resolve({
            city: 'GPS Location',
            latitude: lat,
            longitude: lon,
            gps: true
          });
        },
        (error) => {
          console.warn("GPS Geolocation permission denied or failed:", error);
          resolve(null);
        },
        { timeout: 5000 }
      );
    });
  };

  // Attempt GPS first for high accuracy, fallback to IP location
  try {
    locationData = await getGpsLocation();
  } catch (err) {
    console.warn("GPS geolocation function threw error:", err);
  }

  if (!locationData) {
    locationData = await getIpLocation();
  }

  // Developer helper / ISP routing override: if city is Pune or running on localhost, override to Solapur
  if (locationData) {
    const isLocal = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.startsWith('192.168.') ||
                    window.location.hostname.startsWith('10.') ||
                    window.location.hostname.startsWith('172.') ||
                    window.location.hostname === '::1';
    
    if (isLocal || (locationData.city && locationData.city.toLowerCase() === 'pune')) {
      locationData.city = "Solapur";
      locationData.region = "Maharashtra";
      locationData.country_name = "India";
    }
  } else {
    // Ultimate fallback if geolocation services are offline
    locationData = {
      city: "Solapur",
      region: "Maharashtra",
      country_name: "India",
      latitude: 17.6599,
      longitude: 75.9064
    };
  }
  
  if (locationData && locationData.country_name) {
    sessionStorage.setItem('visitor_country', locationData.country_name);
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

      // Helper to detect device type
      const getDeviceType = () => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
          return "Tablet";
        }
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
          return "Mobile";
        }
        return "Desktop";
      };

      // Helper to parse OS and Browser
      const getBrowserAndOS = () => {
        const ua = navigator.userAgent;
        let browser = "Unknown Browser";
        let os = "Unknown OS";

        // Detect OS
        if (ua.indexOf("Win") !== -1) os = "Windows";
        else if (ua.indexOf("Mac") !== -1) os = "MacOS";
        else if (ua.indexOf("X11") !== -1) os = "UNIX";
        else if (ua.indexOf("Linux") !== -1) os = "Linux";
        else if (/Android/.test(ua)) os = "Android";
        else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";

        // Detect Browser
        if (ua.indexOf("Chrome") !== -1 && ua.indexOf("Chromium") === -1) {
          browser = "Google Chrome";
        } else if (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1) {
          browser = "Safari";
        } else if (ua.indexOf("Firefox") !== -1) {
          browser = "Mozilla Firefox";
        } else if (ua.indexOf("MSIE") !== -1 || !!document.documentMode === true) {
          browser = "Internet Explorer";
        } else if (ua.indexOf("Edge") !== -1) {
          browser = "Microsoft Edge";
        } else if (ua.indexOf("Chromium") !== -1) {
          browser = "Chromium";
        }
        
        return { browser, os };
      };

      const { browser, os } = getBrowserAndOS();
      const deviceType = getDeviceType();

      // Get connection details if supported
      let networkType = 'N/A';
      let networkSpeed = 'N/A';
      if (navigator.connection) {
        networkType = navigator.connection.effectiveType || 'N/A';
        networkSpeed = navigator.connection.downlink ? `${navigator.connection.downlink} Mbps` : 'N/A';
      }

      const payload = {
        _subject: `Portfolio View: Visitor in ${city} (${deviceType})`,
        
        // Location Info
        ip_address: locationData.ip || 'N/A',
        city: city,
        region: locationData.region || 'N/A',
        country: locationData.country_name || 'N/A',
        isp_organization: locationData.org || 'N/A',
        coordinates: (lat && lon) ? `${lat}, ${lon}` : 'N/A',
        geolocation_method: locationData.gps ? 'GPS (High Accuracy)' : 'IP Geolocation',
        google_maps_link: mapsUrl,

        // Device Info
        device_type: deviceType,
        operating_system: os,
        browser: browser,
        user_agent: navigator.userAgent,
        platform: navigator.platform || 'N/A',
        cpu_cores: navigator.hardwareConcurrency || 'N/A',
        device_memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/A',

        // Screen Specs
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        viewport_dimensions: `${window.innerWidth}x${window.innerHeight}`,
        device_pixel_ratio: window.devicePixelRatio || 1,
        color_depth: window.screen.colorDepth ? `${window.screen.colorDepth}-bit` : 'N/A',

        // Browser Context
        referrer: document.referrer || 'Direct Visit / Bookmark',
        system_language: navigator.language || 'N/A',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'N/A',
        timestamp_local: new Date().toString(),
        timestamp_utc: new Date().toUTCString(),

        // Network Profile
        network_type: networkType,
        network_speed: networkSpeed
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

  // 3. Increment CounterAPI visitor count (once per session)
  try {
    if (!sessionStorage.getItem('portfolio_hit_incremented')) {
      sessionStorage.setItem('portfolio_hit_incremented', 'true');
      fetch('https://api.counterapi.dev/v1/sushantshrimal-portfolio/visits/up')
        .then(res => res.json())
        .then(data => {
          console.log("Visitor counter incremented. Current count:", data.count);
        })
        .catch(err => console.warn("Failed to increment CounterAPI:", err));
    }
  } catch (err) {
    console.warn("Failed to trigger counter increment:", err);
  }
}

// ── Launch ──
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
