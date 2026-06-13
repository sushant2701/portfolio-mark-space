/* =============================================
   STATE MANAGEMENT — Centralized + LocalStorage
   ============================================= */

const STORAGE_KEY = 'portfolio_data_v14';

export const SKILL_DEFINITIONS = {
  'Large Language Models (LLMs)': 'Deep learning algorithms trained on massive datasets to understand and generate human-like text.',
  'Prompt Engineering': 'Designing and refining inputs to guide Generative AI models to produce optimal, high-quality responses.',
  'RAG': 'Retrieval-Augmented Generation—combining LLMs with external knowledge sources to provide highly accurate, context-aware answers.',
  'OpenAI API': 'Cloud-based developer API providing programmatic access to state-of-the-art models like GPT-4o and text embeddings.',
  'Anthropic API': 'Developer interface for Claude models, specialized in deep reasoning, safety, coding, and large context windows.',
  'Scikit-Learn': 'The premier Python library for classical machine learning, offering tools for classification, regression, and clustering.',
  'TensorFlow': 'Google\'s open-source deep learning framework used for building, training, and deploying neural networks.',
  'Logistic Regression': 'A fundamental classification algorithm used to predict binary outcomes based on probability scoring.',
  'Random Forest': 'An ensemble machine learning method using decision tree models to increase accuracy and prevent overfitting.',
  'Feature Engineering': 'The process of selecting, transforming, and creating input variables from raw data to improve model results.',
  'Model Evaluation': 'Assessing model predictive power using metrics like accuracy, precision, recall, F-score, and ROC-AUC curves.',
  'Predictive Modeling': 'Developing statistical or machine learning models to forecast future events or uncover hidden trends.',
  'Python': 'The leading programming language for data science, artificial intelligence, and automation scripts.',
  'SQL': 'Structured Query Language, the industry standard for managing, querying, and updating relational databases.',
  'R (basics)': 'Programming language and environment used for statistical computations, graphic representations, and analysis.',
  'Pandas': 'High-performance Python library used for structured data manipulation, analysis, and cleanup workflows.',
  'NumPy': 'Fundamental scientific computing library in Python, supporting large, multi-dimensional arrays and mathematical operations.',
  'Data Cleaning': 'The process of identifying, filtering, and correcting errors, missing records, or duplicates in raw datasets.',
  'Data Wrangling': 'Transforming raw, messy datasets into structured, clean formats optimized for analytics and modeling.',
  'Exploratory Data Analysis (EDA)': 'Analyzing datasets to summarize main statistical characteristics, detect anomalies, and form hypotheses.',
  'Statistical Analysis': 'Applying mathematical models and statistical methods to identify trends, correlations, and confidence intervals.',
  'A/B Testing': 'Controlled experiments comparing two versions of a webpage or product feature to measure performance differences.',
  'Hypothesis Testing': 'Determining whether experimental findings have statistical significance or if they happened by random chance.',
  'Power BI': 'Microsoft\'s business intelligence tool for creating interactive visualizations, data models, and dashboards.',
  'Matplotlib': 'Python\'s foundational plotting library for generating static, animated, and interactive visualizations.',
  'Seaborn': 'A statistical data visualization library built on top of Matplotlib, providing beautiful default styling.',
  'Streamlit': 'An open-source Python framework for building and sharing interactive data web applications in minutes.',
  'Git': 'Distributed version control system for tracking source code history and coordinating developer tasks.',
  'GitHub': 'Cloud-based platform for hosting repositories, managing pull requests, and running CI/CD automation.',
  'Google Cloud': 'A suite of cloud infrastructure services for deploying models, hosting applications, and data storage.',
  'Jupyter Notebook': 'Interactive computing dashboard for writing code, documenting notes, and plotting visualizations.',
  'Google Colab': 'A cloud-based Jupyter Notebook environment with free access to GPUs for training machine learning models.'
};

// ── Default Data ──
const DEFAULT_STATE = {
  projects: [
    {
      id: 'p1',
      title: 'GenAI-Powered Data Analysis Assistant',
      domain: 'AI & Machine Learning',
      description: 'Developed and deployed a Generative AI application enabling users to analyze CSV datasets through natural language queries via a Streamlit interface. Integrated LLM APIs to convert user questions into executable Pandas and SQL operations, implementing prompt engineering workflows to improve response accuracy and reduce hallucinations.',
      tags: ['Python', 'LLM API', 'Streamlit', 'Pandas', 'SQL', 'Prompt Engineering', 'RAG'],
      github: 'https://github.com/sushant2701/Gen-Ai-Powered-Data-Analysis-Assistant.git',
      live: 'https://gen-ai-powered-data-analysis-assistant-dgjgbhxbw6hliwhcorymc7.streamlit.app/',
      image: '',
      isKey: true
    },
    {
      id: 'p2',
      title: 'Disease Prediction & Risk Scoring System',
      domain: 'AI & Machine Learning',
      description: 'Processed healthcare datasets containing 10,000+ records; performed EDA, feature engineering, missing-value treatment, and class balancing to prepare data for modeling. Developed and compared Logistic Regression, Random Forest, and Neural Network classification models, achieving 85% prediction accuracy. Conducted A/B testing and statistical experiments to evaluate model variants and optimize outcomes.',
      tags: ['Python', 'Scikit-Learn', 'TensorFlow', 'Pandas', 'SQL', 'A/B Testing', 'Statistical Experiments'],
      github: 'https://github.com/sushant2701/AI-in-the-Health-Care.git',
      image: ''
    },
    {
      id: 'p3',
      title: 'Customer Churn Prediction & Segmentation Dashboard',
      domain: 'AI & Machine Learning',
      description: 'Built a customer churn prediction model using supervised machine learning (Logistic Regression, Random Forest, Ensemble Methods). Performed customer segmentation using clustering to identify distinct behavioral groups and high-risk cohorts. Developed Power BI dashboards to visualize customer behavior, retention KPIs, and segmentation insights.',
      tags: ['Python', 'SQL', 'Scikit-Learn', 'Power BI', 'Customer Segmentation'],
      github: 'https://github.com/sushant2701/customer-churn-risk-analytics.git',
      image: ''
    },
    {
      id: 'p4',
      title: 'Customer Support SLA & Operations Dashboard',
      domain: 'Data Analytics & BI',
      description: 'Designed and implemented an ETL pipeline to extract and clean 40,000+ support ticket records, standardizing SLA fields and resolving timestamp gaps. Built an interactive Power BI dashboard with DAX measures for real-time compliance tracking, and delivered Excel reports to improve routing efficiency.',
      tags: ['Python', 'SQL', 'Power BI', 'DAX', 'Advanced Excel', 'ETL', 'Data Pipeline'],
      github: 'https://github.com/sushant2701/sla-operations-dashboard.git',
      image: ''
    },
    {
      id: 'p5',
      title: 'Automated Sales Revenue MIS Dashboard',
      domain: 'Data Analytics & BI',
      description: 'Created an automated sales revenue Management Information System (MIS) dashboard in Power BI, integrating monthly revenue KPIs, sales pipeline analytics, monthly performance targets, and historical sales trends.',
      tags: ['Power BI', 'Advanced Excel', 'MIS Reporting', 'Data Analytics', 'KPI Dashboards'],
      github: 'https://github.com/sushant2701/Automated-Sales-Revenue-MIS-Dashboard.git',
      image: ''
    },
    {
      id: 'p7',
      title: 'OTP Auth System (Student Problem Solver)',
      domain: 'Web Development & Security',
      description: 'Developed a secure and lightweight OTP authentication system designed to solve student login friction. Features a simplified verification process and clean dashboard frontend built using standard web technologies.',
      tags: ['HTML', 'CSS', 'JavaScript', 'Security', 'Authentication', 'UI Design'],
      github: 'https://github.com/sushant2701/otp-auth-system.git',
      live: 'https://otp-auth-system.onrender.com/',
      video: 'https://drive.google.com/file/d/1vF8jhGc3LQl41uj79TgXnClE37_jp_Ay/view',
      image: ''
    },
    {
      id: 'p9',
      title: 'Portfolio Website',
      domain: 'Web Development & Security',
      description: 'Designed and built this responsive, high-performance portfolio website to showcase machine learning, cloud engineering, and data analytics work. Implemented a glassmorphic user interface using vanilla HTML/CSS and JavaScript, featuring dynamic mouse-parallax trails, typing animations, bento grid configurations, and smooth section routing.',
      tags: ['HTML', 'CSS', 'JavaScript', 'Vite', 'Animations', 'Responsive Design'],
      github: 'https://github.com/sushant2701/Portfolio.git',
      image: ''
    },
    {
      id: 'p10',
      title: 'Branded Shoes E-Commerce Website',
      domain: 'Web Development & Security',
      description: 'Developed a fully responsive e-commerce web portal for branded shoes. Features a clean product catalog interface, cart management functionality, and dynamic search/filter features built using standard web technologies.',
      tags: ['HTML', 'CSS', 'JavaScript', 'E-Commerce', 'Responsive UI'],
      github: 'https://github.com/sushant2701/Branded-Shoes-ECommerce-Website.git',
      image: ''
    },
    {
      id: 'p6',
      title: 'GPS-Enabled SOS Band: A User-Friendly Approach to Real-Time Emergency Communication',
      domain: 'IoT & Embedded Systems',
      description: 'Designed and developed a wearable SOS distress communication band integrating a GPS tracking module and GSM technology. Upon single-button activation, the system satellite-locks the user\'s location and dispatches real-time coordinates via emergency SMS alerts. Employs a low-power hardware cycle design to optimize battery performance, providing a highly reliable safety communication channel resilient to cellular data network outages.',
      tags: ['GPS', 'SMS', 'IoT', 'Wearable Devices', 'Emergency Communication', 'Low-Power Design'],
      github: '',
      image: ''
    },
    {
      id: 'p8',
      title: 'Design and Implementation of a Dual-Controller Closed-Loop Smart Ingredient Dispensing System with Conveyor-Assisted Positioning',
      domain: 'IoT & Embedded Systems',
      description: 'Developed an automated kitchen dispensing system leveraging a Raspberry Pi for high-level script execution/GUI and an ESP32 microcontroller for closed-loop container positioning and hardware actuation. Features an IR-triggered conveyor belt positioning mechanism, load cell weight feedback, and servo/stepper-driven dispensing units achieving high gram-level measurement precision.',
      tags: ['Raspberry Pi', 'ESP32', 'Load Cell Feedback', 'Conveyor Positioning', 'Kitchen Automation', 'Embedded Systems'],
      github: '',
      image: ''
    }
  ],

  skills: {
    generativeAI: [
      'Large Language Models (LLMs)', 'Prompt Engineering', 'RAG', 'OpenAI API', 'Anthropic API'
    ],
    machineLearning: [
      'Scikit-Learn', 'TensorFlow', 'Logistic Regression', 'Random Forest', 'Feature Engineering', 'Model Evaluation', 'Predictive Modeling'
    ],
    programmingQuery: [
      'Python', 'SQL', 'R (basics)'
    ],
    dataAnalysis: [
      'Pandas', 'NumPy', 'Data Cleaning', 'Data Wrangling', 'Exploratory Data Analysis (EDA)', 'Statistical Analysis', 'A/B Testing', 'Hypothesis Testing'
    ],
    visualizationDeployment: [
      'Power BI', 'Matplotlib', 'Seaborn', 'Streamlit', 'Git', 'GitHub', 'Google Cloud', 'Jupyter Notebook', 'Google Colab'
    ]
  },

  milestones: [
    {
      id: 'm1',
      date: 'Feb 2026 – Present',
      title: 'Python Full Stack Developer — Data Analytics at QSpiders',
      description: 'Building end-to-end data pipelines integrating SQL backends with Power BI dashboards for real-time KPI and SLA reporting. Developing ETL workflows and implementing CI/CD-aligned deployment for Python data processes in Agile sprint cycles.'
    },
    {
      id: 'm2',
      date: 'Jan 2025 – Mar 2025',
      title: 'Frontend Web Development Intern — Web Portal Development Internship',
      description: 'Developed and tested responsive web modules using HTML, CSS, and JavaScript in an Agile development environment. Collaborated with cross-functional teams in code reviews and sprint cycles to improve platform functionality.'
    },
    {
      id: 'm3',
      date: 'Jul 2024 – Sep 2024',
      title: 'AI & Machine Learning Intern — Government of India (AICTE)',
      description: 'Performed data preprocessing, cleaning, and exploratory data analysis (EDA) on real-world large datasets to extract trends. Built/evaluated ML models (regression, classification, ensemble) using Scikit-Learn and TensorFlow; assessed accuracy, precision, recall, and ROC-AUC.'
    }
  ]
};

// ── Supabase Integration Configuration ──
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// ── State Instance ──
let state = null;

/**
 * Fetch portfolio data from Supabase
 */
async function fetchStateFromSupabase() {
  try {
    const res = await Promise.race([
      fetch(`${supabaseUrl}/rest/v1/portfolio_state?id=eq.1&select=state_data`, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Fetch Timeout')), 4000))
    ]);

    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0 && data[0].state_data) {
        return data[0].state_data;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch state from Supabase:", err.message);
  }
  return null;
}

/**
 * Sync state to Supabase in background
 */
async function saveStateToSupabase(stateData) {
  try {
    const token = sessionStorage.getItem('supabase_access_token');
    const authHeader = token ? `Bearer ${token}` : `Bearer ${supabaseAnonKey}`;

    await fetch(`${supabaseUrl}/rest/v1/portfolio_state?id=eq.1`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        state_data: stateData,
        updated_at: new Date().toISOString()
      })
    });
  } catch (err) {
    console.error("Failed to sync state to Supabase cloud:", err);
  }
}

/**
 * Initialize state from Supabase, LocalStorage or defaults
 */
export async function initState() {
  if (isSupabaseConfigured) {
    const cloudState = await fetchStateFromSupabase();
    if (cloudState) {
      state = cloudState;
      // Backup to LocalStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return;
    }
  }

  // Local Fallback
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      state = JSON.parse(stored);
      // Ensure all keys exist
      if (!state.projects) state.projects = DEFAULT_STATE.projects;
      if (!state.skills) state.skills = DEFAULT_STATE.skills;
      if (!state.milestones) state.milestones = DEFAULT_STATE.milestones;
    } else {
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      syncToStorage();
    }
  } catch {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    syncToStorage();
  }
}

/**
 * Get current state
 */
export function getState() {
  return state || DEFAULT_STATE;
}

/**
 * Sync current state to LocalStorage and Supabase
 */
function syncToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (isSupabaseConfigured) {
    saveStateToSupabase(state);
  }
}

/**
 * Add a project
 */
export function addProject(project) {
  project.id = 'p' + Date.now();
  state.projects.push(project);
  syncToStorage();
}

/**
 * Remove a project by ID
 */
export function removeProject(id) {
  state.projects = state.projects.filter(p => p.id !== id);
  syncToStorage();
}

/**
 * Add a skill to a category
 * @param {'programming'|'analytics'|'ai'} category
 * @param {string} skill
 */
export function addSkill(category, skill) {
  if (state.skills[category] && !state.skills[category].includes(skill)) {
    state.skills[category].push(skill);
    syncToStorage();
  }
}

/**
 * Remove a skill from a category
 */
export function removeSkill(category, skill) {
  if (state.skills[category]) {
    state.skills[category] = state.skills[category].filter(s => s !== skill);
    syncToStorage();
  }
}

/**
 * Add a milestone
 */
export function addMilestone(milestone) {
  milestone.id = 'm' + Date.now();
  state.milestones.unshift(milestone); // newest first
  syncToStorage();
}

/**
 * Remove a milestone by ID
 */
export function removeMilestone(id) {
  state.milestones = state.milestones.filter(m => m.id !== id);
  syncToStorage();
}

/**
 * Reset state to defaults (for debugging)
 */
export function resetState() {
  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  syncToStorage();
}
