# 🌐 Live AI & Data Engineering Portfolio Hub

Welcome to my personal portfolio repository. This project is hosted live as a interactive showcase of my engineering work spanning **Generative AI applications, Machine Learning, Data Analytics, and IoT systems**. 

This hub features a glassmorphic user interface integrated with an Alexa-style voice navigator (**"Hey Mark"**) and a Jaccard NLP-powered chatbot (**"MARK27"**).

---

## 🚀 Key Showcase Modules

### 🎙️ Alexa-Style Voice Navigator ("Mark")
* **Voice-Activated Controls**: Wakes up immediately when saying *"Mark"*, *"Hey Mark"*, *"Okay Mark"*, or *"Ok Mark"*.
* **Real-time Live Transcript**: Floating visual mic orb status overlay in the bottom-left of the viewport showing live transcript feedback (*"Hearing: ..."*) and pulse states:
  * 🟣 **Purple (Pulsing)**: Listening state
  * 🔵 **Cyan (Pulsing)**: Hearing active voice input
  * 💗 **Pink (Pulsing)**: Responding via synthesized voice
* **Speech Feedback Loop Muting**: Automatically pauses mic recognition while the browser is speaking to prevent Mark from hearing himself. Includes a watchdog auto-reset safeguard in case browser speech synthesis hangs.
* **Auto-Scroller & Oral Guides**: Automatically scrolls to and dictates descriptions for sections (About, Skills, Projects, Education) and specific projects (Grahak, OTP Auth, GenAI Assistant, etc.).
* **Dynamic Tooltips**: Say *"explain LLM"* or *"show Prompt Engineering"* -> Scrolls to the Skills matrix, animates a pill click, and explains the skill orally.

### 💬 MARK27 Chatbot Panel
* **Semantic NLP**: Powered by a Jaccard Vector Similarity token mapping algorithm for highly accurate matched intent responses.
* **Direct Connect Redirection**: Features an connection form which redirects desktop users to a prefilled Gmail compose tab using Chrome's active profile, and mobile users to their default native mail client (`mailto:`) for ready-made connection requests targeting `sushantshrimal08@gmail.com`.

### 🛡️ Admin Control Space Panel
* **Live In-App Editing**: Lock-protected administrative dashboard allowing you to add, edit, or delete projects, credentials, milestones, and skills on the fly.
* **Persistent State**: Changes are stored in LocalStorage with optional cloud database syncing hooks.

### 🌐 Visitor Geolocation & Geofencing alerts
* **Visitor Tracking**: Tracks anonymous visitor approximate city locations using ipapi / ipwhois fallbacks.
* **Email Alerts**: Dispatches visitor geolocation metadata alerts to your mailbox via `formsubmit.co`.

---

## 📁 Projects Showcased & Hosted Live

Here is the list of core engineering projects built and integrated within this portfolio:

### 🤖 AI & Machine Learning

1.  **GenAI-Powered Data Analysis Assistant**
    *   *Description*: A Generative AI application enabling users to analyze CSV datasets through natural language queries. Integrates LLMs to execute Pandas and SQL operations dynamically.
    *   *Tags*: `Python`, `LLM API`, `Streamlit`, `Pandas`, `SQL`, `RAG`
    *   *Links*: [Code Repository](https://github.com/sushant2701/Gen-Ai-Powered-Data-Analysis-Assistant.git) | [Live Demo](https://gen-ai-powered-data-analysis-assistant-dgjgbhxbw6hliwhcorymc7.streamlit.app/)
2.  **Disease Prediction & Risk Scoring System**
    *   *Description*: Logistic Regression, Random Forest, and Neural Network healthcare classification models achieving 85% prediction accuracy.
    *   *Tags*: `Python`, `Scikit-Learn`, `TensorFlow`, `Pandas`, `A/B Testing`
    *   *Links*: [Code Repository](https://github.com/sushant2701/AI-in-the-Health-Care.git)
3.  **Customer Churn Prediction & Segmentation**
    *   *Description*: Customer churn prediction model using clustering behavior groups and behavioral visualizations.
    *   *Tags*: `Python`, `SQL`, `Scikit-Learn`, `Power BI`
    *   *Links*: [Code Repository](https://github.com/sushant2701/customer-churn-risk-analytics.git)

### 📊 Data Analytics & Business Intelligence

4.  **Customer Support SLA & Operations Dashboard**
    *   *Description*: ETL pipeline parsing 40,000+ support ticket records and standardizing SLA fields. Implemented Power BI dashboard with DAX tracking.
    *   *Tags*: `Python`, `SQL`, `Power BI`, `DAX`, `ETL`
    *   *Links*: [Code Repository](https://github.com/sushant2701/sla-operations-dashboard.git)
5.  **Automated Sales Revenue MIS Dashboard**
    *   *Description*: Automated sales revenue Management Information System (MIS) dashboard in Power BI.
    *   *Tags*: `Power BI`, `Advanced Excel`, `MIS Reporting`, `KPI Dashboards`
    *   *Links*: [Code Repository](https://github.com/sushant2701/Automated-Sales-Revenue-MIS-Dashboard.git)

### 💻 Web Development & Security

6.  **OTP Auth System (Student Problem Solver)**
    *   *Description*: Secure, lightweight student login verification system designed to solve academic access friction.
    *   *Tags*: `HTML`, `CSS`, `JavaScript`, `Security`, `Authentication`
    *   *Links*: [Code Repository](https://github.com/sushant2701/otp-auth-system.git) | [Live Demo](https://otp-auth-system.onrender.com/) | [Watch Demo Video](https://drive.google.com/file/d/1vF8jhGc3LQl41uj79TgXnClE37_jp_Ay/view)
7.  **Branded Shoes E-Commerce Website**
    *   *Description*: Fully responsive e-commerce web portal for branded shoes with cart management.
    *   *Tags*: `HTML`, `CSS`, `JavaScript`, `E-Commerce`, `Responsive UI`
    *   *Links*: [Code Repository](https://github.com/sushant2701/Branded-Shoes-ECommerce-Website.git)
8.  **This Glassmorphic Portfolio Hub**
    *   *Description*: Interactive portfolio built using Vite, glassmorphic styles, mouse trails, and browser Web Speech voice control.
    *   *Tags*: `HTML`, `CSS`, `JavaScript`, `Vite`, `Web Speech API`
    *   *Links*: [Code Repository](https://github.com/sushant2701/Portfolio.git)

### 🔌 IoT & Embedded Systems

9.  **GPS-Enabled SOS Distress Band**
    *   *Description*: Wearable SOS communication band utilizing GPS and GSM modules for emergency coordinate broadcasting.
    *   *Tags*: `GPS`, `SMS`, `IoT`, `Embedded Systems`, `Low-Power Design`
10. **Conveyor-Assisted Smart Ingredient Dispensing System**
    *   *Description*: Dispensing hardware positioning conveyor utilizing Raspberry Pi and ESP32 with load cell gram-level feedback.
    *   *Tags*: `Raspberry Pi`, `ESP32`, `Load Cell Feedback`, `Embedded Systems`

---

## 🛠️ Installation & Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# SHA-256 Hash of the Control Space admin password (Default: Aksh@Sush@0527)
VITE_ADMIN_PASSWORD_HASH=714304a416437f8e85819465d108d980de0088b2c6a2deee1fd2de49215bf037

# Supabase Credentials (Optional cloud syncing database storage)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Development Server
```bash
npm run dev
```

---

## 🌐 Live Production Deployment

To deploy this portfolio live on the web:

### 1. Build Production Assets
Compiles and optimizes the project to static assets inside the `dist/` directory:
```bash
npm run build
```

### 2. Choose a Hosting Platform
*   **Vercel / Netlify**: Link your GitHub repository directly to Vercel/Netlify. Configure the build command as `npm run build` and output directory as `dist`.
*   **GitHub Pages**: Push the build outputs to a `gh-pages` branch, or configure GitHub Actions to build and deploy.

### 3. Add Environment Variables
Make sure to add `VITE_ADMIN_PASSWORD_HASH` and any Supabase API credentials inside your hosting provider's Dashboard (Environment Variables tab).
