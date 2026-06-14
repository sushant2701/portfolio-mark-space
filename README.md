# 🧠 MARK_SPACE — AI-Powered Interactive Portfolio Hub

> **A glassmorphic, voice-navigable, analytically-tracked personal portfolio** — built entirely with Vanilla JavaScript, Vite, and zero UI frameworks.

[![Vite](https://img.shields.io/badge/Built%20with-Vite%20v8-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript%20ES%20Modules-F7DF1E?style=flat&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Web Speech API](https://img.shields.io/badge/Voice-Web%20Speech%20API-34A853?style=flat&logo=google)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat&logo=supabase)](https://supabase.com)

---

## ✨ What Makes This Portfolio Unique

This is not a standard portfolio template. It is a **full-stack interactive web application** where every component — voice control, analytics, content management, and NLP — is engineered from scratch without any external UI libraries.

---

## 🎙️ Mark — Alexa-Style Voice Navigator

An always-listening, wake-word activated voice navigation engine built with the Web Speech API.

### Wake Words
Say any of: **"Mark"**, **"Hey Mark"**, **"Okay Mark"**, **"Ok Mark"**

### Voice Capabilities
| Command | Action |
|:---|:---|
| *"Hey Mark, go to projects"* | Scrolls to Projects section and describes them |
| *"Mark, show skills"* | Navigates to the Skills grid with an oral summary |
| *"Hey Mark, what is RAG"* | Scrolls to skills, animates the RAG pill, speaks its definition |
| *"Mark, tell me about Grahak"* | Navigates to the Grahak CRM project with a spoken description |
| *"Mark, open GitHub"* | Opens Sushant's GitHub profile |
| *"Mark, contact Sushant"* | Opens Gmail compose / mobile mail client |
| *"Mark, open control space"* | Opens the admin management console |
| *"Mark, mute assistant"* | Toggles speaker on/off |
| *"Mark, refresh assistant"* | Reinitializes the SpeechRecognition engine |

### Technical Architecture
- **Continuous Listening Mode** with `maxAlternatives = 3` scanning all speech candidate alternatives for the best intent keyword match.
- **Dynamic Accent Routing**: Automatically switches to `'en-IN'` locale when the visitor is from India, optimizing recognition accuracy for Indian accents.
- **Semantic Jaccard + Keyword Density Scoring**: Every utterance is scored as `(Jaccard × 0.7) + (KeywordDensity × 0.3)`. Direct keyword boosts override scores to `1.0` for instant trigger.
- **Intent Boost Map**: 22 registered voice intents with unique trigger keywords. If a direct trigger is detected in any of the 3 speech alternatives, it fires immediately.
- **Hijack Prevention**: The `about` intent is suppressed if specific topic keywords (`skills`, `projects`, `education`, etc.) are detected.
- **Predictive Fallback**: Low-confidence matches speak *"Did you mean to [action]? Try saying: [phrase]."*
- **Silence Fallback Timer**: 5-second window after wake word — if no command follows, speaks *"Sorry, I didn't hear a command."*

### Floating Status Overlay Widget
- Bottom-left fixed panel shows real-time mic state:
  - 🟣 **Purple Pulse** — Listening
  - 🔵 **Cyan Pulse** — Hearing voice (shows live transcript `Hearing: "..."`)
  - 💗 **Pink Pulse** — Speaking/Responding
- Clicking the orb reboots the recognition engine.

### Reliability Systems
- Mic auto-pauses during speech playback to prevent feedback loops.
- **Watchdog Timer**: Forces synthesis cancel + mic recovery if Chrome's speech engine hangs.
- Auto-reinitializes on every recognition end event (`always-on` mode).
- **Music Integration**: Background music pauses during speech, resumes automatically.

---

## 💬 MARK27 — NLP Chatbot Panel

A conversational AI assistant panel backed by a curated knowledge base and Jaccard vector similarity scoring.

### Knowledge Base Coverage
`about` · `education` · `cgpa` · `contact` · `experience (QSpiders, AICTE)` · `certifications` · `awards` · `gdg` · `skills (5 subcategories)` · `projects (10 individual entries)`

### NLP Engine Features
- **Jaccard Token Similarity**: Tokenizes both query and registered phrases, computing set intersection/union scores.
- **Spelling Auto-Correction**: Corrects common phonetic mismatches (`"skils"→"skills"`, `"limkedin"→"linkedin"`, `"sushants"→"sushant"`, etc.)
- **Multi-Word Phonetic Corrections**: `"git hub"→"github"`, `"control space"→"controlspace"`, `"admin drawer"→"admin"`.
- **Possessive Stripping**: `"Sushant's projects"` resolves correctly.
- **Scope-Specific Keyword Expansion**: All 5 skill subcategories have full lists of technology names so specific queries (`"what is logistic regression"`, `"tell me about RAG"`) always resolve precisely.
- **About Intent Hijack Prevention**: Zeroes the `about` score when any specific topic keyword is detected.

### Chat UI
- **Contextual Time Greeting**: Dynamically says "Good morning/afternoon/evening" based on system clock.
- Animated glassmorphic message bubbles.
- Autocomplete quick-topic tags.
- Direct "Open Mail Application" quick-action button in contact responses.
- **Mic Orb (🎤)** and engine **Reboot Button (🔄)** in the panel header.
- Dynamic locale: uses `'en-IN'` for Indian visitors.

---

## 🔒 Control Space — Admin Dashboard

A password-secured slide-out management console for live content management.

### Authentication
- Password is **SHA-256 hashed** client-side via `crypto.subtle.digest` — never compared in plaintext.
- **Brute Force Protection**: 3 consecutive failures trigger a **1-minute account lockout** + an **automated Security Alert email** to the owner containing the intruder's IP, city, country, ISP, and user agent.
- Auth token scoped to `sessionStorage` — cleared on every drawer close.

### Admin Capabilities
- ✅ Add / Remove **Projects** (title, domain, description, tags, GitHub link, live demo link)
- ✅ Add / Remove **Skills** across 5 categories
- ✅ Add / Remove **Experience Milestones** (work history timeline)
- ✅ Download **Full JSON Backup** of portfolio data
- ✅ **Publish Changes** — triggers full portfolio re-render
- ✅ **Voice Volume Slider** — adjusts speech synthesis volume live
- ✅ **Music Volume Slider** — adjusts background music volume live
- ✅ **Music Track Selector** — switches between background audio sources

### Data Storage (Dual-Layer)
- **Primary**: Supabase cloud (`portfolio_state` table, PATCH on publish with JWT auth)
- **Fallback**: `localStorage` (version key `portfolio_data_v14`)
- **Chain**: Supabase → localStorage → hardcoded defaults

---

## 📊 Visitor Analytics & Tracking

On every **first visit per browser session**, the site silently gathers and emails a full visitor analytics report to `sushantshrimal08@gmail.com` via FormSubmit.

### Location Pipeline (3-Stage Fallback)
1. **GPS** via `navigator.geolocation.getCurrentPosition` (highest accuracy)
2. Reverse-geocoded with **OpenStreetMap Nominatim API** to get exact city name
3. Falls back to **ipapi.co → ipwhois.app** chain if GPS is denied

> **Solapur Override**: Automatically corrects broad regional ISP results (e.g. Pune) and local hostnames to `"Solapur, Maharashtra, India"`.

### Email Payload (20+ Fields)
```
Location:  ip_address · city · region · country · isp_organization
           coordinates · geolocation_method · google_maps_link

Device:    device_type · operating_system · browser · user_agent
           platform · cpu_cores · device_memory

Display:   screen_resolution · viewport_dimensions · device_pixel_ratio · color_depth

Context:   referrer · system_language · timezone
           timestamp_local · timestamp_utc

Network:   network_type · network_speed
```

---

## 🎨 Visual Design System

- **Glassmorphism** throughout — `backdrop-filter: blur`, semi-transparent layering
- **Token-based CSS** — all colors, typography, and spacing as CSS custom properties
- **Dark Mode First** — deep `#0a0a0f` base with `hsl(265°)` violet accent
- **No UI Framework** — 100% Vanilla CSS (12 dedicated stylesheets)

### Hero Section Components
- **Bento Grid Layout** — asymmetric card arrangement
- **Canvas Particle Network** — 65 animated particles with violet proximity lines and mouse-repel force field
- **Typewriter Role Rotator** — smooth type/delete/pause animation loop
- **Spring-Lag Mouse Follower** — `ease = 0.085` factor biomorphic cursor blob
- **Live Clock Card** — real-time second-by-second ticking display
- **Dynamic Location Card** — shows geolocated visitor city

### Scroll & Reveal System
- `IntersectionObserver` fade-ins at 8% viewport threshold on all sections
- Block reveal animation (`reveal-wrapper → reveal-box → reveal-content`) with sliding cover timing

---

## 🔊 Web Audio Synthesizer

Every interactive click fires a synthesized **dual-note pluck tone** via Web Audio API:
- **Note 1**: C5 (523.25 Hz) with linear attack + exponential decay
- **Note 2**: E5 (659.25 Hz) starting 90ms after, same envelope
- Zero dependencies, rendered entirely in the browser audio pipeline.

---

## 🎵 Background Ambient Music

- Loads from `/audio/` folder in priority order: `ambient.mp3` → `ambient.mp4` → `music.mp3` → `music.mp4`
- Auto-plays on first user interaction to comply with browser autoplay policies
- Loops seamlessly at configurable volume
- Globally exposed hooks: `window.notifySpeechStart/End()`, `window.updateBgMusicVolume()`, `window.changeBgMusicTrack()`

---

## 📁 Projects Showcased

### 🤖 AI & Machine Learning
| # | Project | Stack | Links |
|:--|:---|:---|:---|
| 1 | GenAI-Powered Data Analysis Assistant | Python, LLM API, Streamlit, Pandas, RAG | [GitHub](https://github.com/sushant2701/Gen-Ai-Powered-Data-Analysis-Assistant.git) · [Live](https://gen-ai-powered-data-analysis-assistant-dgjgbhxbw6hliwhcorymc7.streamlit.app/) |
| 2 | Disease Prediction & Risk Scoring System | Python, Scikit-Learn, TensorFlow, A/B Testing | [GitHub](https://github.com/sushant2701/AI-in-the-Health-Care.git) |
| 3 | Customer Churn Prediction & Segmentation | Python, SQL, Scikit-Learn, Power BI | [GitHub](https://github.com/sushant2701/customer-churn-risk-analytics.git) |

### 📊 Data Analytics & Business Intelligence
| # | Project | Stack | Links |
|:--|:---|:---|:---|
| 4 | Customer Support SLA & Operations Dashboard | Python, SQL, Power BI, DAX, ETL | [GitHub](https://github.com/sushant2701/sla-operations-dashboard.git) |
| 5 | Automated Sales Revenue MIS Dashboard | Power BI, Advanced Excel, MIS Reporting | [GitHub](https://github.com/sushant2701/Automated-Sales-Revenue-MIS-Dashboard.git) |

### 💻 Web Development & Security
| # | Project | Stack | Links |
|:--|:---|:---|:---|
| 6 | OTP Auth System (Student Problem Solver) | HTML, CSS, JS, Security | [GitHub](https://github.com/sushant2701/otp-auth-system.git) · [Live](https://otp-auth-system.onrender.com/) · [Video](https://drive.google.com/file/d/1vF8jhGc3LQl41uj79TgXnClE37_jp_Ay/view) |
| 7 | Branded Shoes E-Commerce Website | HTML, CSS, JS | [GitHub](https://github.com/sushant2701/Branded-Shoes-ECommerce-Website.git) |
| 8 | This Portfolio Hub | Vite, JS, Web Speech API | [GitHub](https://github.com/sushant2701/Portfolio.git) |

### 🔌 IoT & Embedded Systems
| # | Project | Stack |
|:--|:---|:---|
| 9 | GPS-Enabled SOS Distress Band | GPS, GSM, IoT, Low-Power Design |
| 10 | Conveyor-Assisted Smart Ingredient Dispensing System | Raspberry Pi, ESP32, Load Cell, Embedded Systems |

---

## 🛠️ Local Setup

### Prerequisites
- Node.js 18+
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
# SHA-256 hash of the Control Space admin password
VITE_ADMIN_PASSWORD_HASH=714304a416437f8e85819465d108d980de0088b2c6a2deee1fd2de49215bf037

# Supabase (optional — for cloud data sync)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Default admin password: `Aksh@Sush@0527`

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```
Output will be in the `dist/` directory.

---

## 🌐 Deployment

### Vercel / Netlify
- Connect your GitHub repository.
- Set build command: `npm run build`
- Set output directory: `dist`
- Add environment variables in the hosting dashboard.

### GitHub Pages
- Push `dist/` to a `gh-pages` branch, or configure GitHub Actions for automated deployment.

---

## 📊 Tech Stack Summary

| Category | Technology |
|:---|:---|
| Build Tool | Vite v8 |
| Language | Vanilla JavaScript (ES Modules) |
| Styling | Vanilla CSS (12 stylesheets, zero frameworks) |
| Database | Supabase (PostgreSQL REST API) |
| Voice | Web Speech API (SpeechRecognition + SpeechSynthesis) |
| Audio | Web Audio API |
| Analytics | FormSubmit.co + ipapi.co + OpenStreetMap Nominatim |
| Auth | SHA-256 (crypto.subtle) + SessionStorage |
| Animations | IntersectionObserver + requestAnimationFrame + Canvas |

---

## 📬 Contact

**Sushant Shrimal**
- 📧 [sushantshrimal08@gmail.com](mailto:sushantshrimal08@gmail.com)
- 💼 [LinkedIn](https://www.linkedin.com/in/sushant-shrimal-017128251/)
- 🐙 [GitHub](https://github.com/sushant2701)

---

*Built with zero shortcuts. Every system engineered from scratch.*
