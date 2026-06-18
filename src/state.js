/* =============================================
   STATE MANAGEMENT — Centralized + LocalStorage
   ============================================= */

const STORAGE_KEY = 'portfolio_data_v14';

export const SKILL_DEFINITIONS = {
  'Python': 'High-level programming language used for quantum experiment orchestration, rapid scripting, and scientific computing.',
  'C': 'Procedural language used for high-performance low-level firmware, kernel modules, and hardware drivers.',
  'C++': 'Object-oriented language used for high-frequency instrument communication, low-latency control software, and performance-critical systems.',
  'Bash/Shell Scripting': 'Automation scripting for Linux systems, build pipelines, environment configuration, and task scheduling.',
  'Linux (Ubuntu/Debian) Systems Programming': 'System-level software development using POSIX APIs, multi-threading, socket programming, and inter-process communication.',
  'NumPy': 'Fundamental scientific computing library in Python, supporting large multidimensional arrays, matrices, and linear algebra operations.',
  'Pandas': 'High-performance Python library for data manipulation, analysis, structured cleaning, and parsing experiment telemetry logs.',
  'Matplotlib': 'Foundational visualization library in Python for generating static, animated, and interactive signal plots.',
  'Statistical Processing': 'Applying mathematical and statistical methods to filter noise, fit calibration curves, and analyze instrument output datasets.',
  'SQL/Query Optimization': 'Designing, querying, and indexing relational database schemas to efficiently manage calibration constants and metadata.',
  'FPGA Architecture Fundamentals': 'Basic principles of reconfigurable digital hardware, lookup tables (LUTs), flip-flops, block RAM, and clock domain crossing.',
  'Digital Logic Design': 'Designing combination and sequential logic circuits, registers, multiplexers, and hardware state machines.',
  'HDL Concepts (Verilog/VHDL basics)': 'Hardware Description Language concepts for modeling digital system behavior, register-transfer level (RTL) logic, and timing checks.',
  'Qiskit': 'IBM\'s open-source SDK for writing, simulating, and running quantum circuits and algorithms on simulator backends and real devices.',
  'Quantum Circuit Basics': 'Foundations of qubits, quantum logic gates, superposition, entanglement, measurement operations, and circuit depth.',
  'Git/GitHub': 'Distributed version control and collaboration platform for managing codebases, code review pull requests, and release tracking.',
  'CI/CD Pipelines': 'Continuous Integration and Continuous Deployment workflows for automated testing, packaging, and deploying software modules.',
  'REST APIs': 'Designing stateless, resource-oriented HTTP interfaces for remote monitoring, telemetry retrieval, and orchestration commands.',
  'API Design': 'Structuring clean, developer-friendly interfaces for low-level instrument wrappers, libraries, and web services.',
  'System Design': 'Architecting scalable, reliable, and low-latency systems coordinating high-speed control logic and distributed data processing.',
  'Modular Architecture': 'Decoupling software systems into independent, reusable modules to minimize technical debt and maximize extensibility.'
};

// ── Default Data ──
const DEFAULT_STATE = {
  projects: [
    {
      id: 'p1',
      title: 'GenAI-Powered Data Analysis Platform',
      domain: 'AI & Machine Learning',
      description: 'Built a full-stack Python application enabling natural language queries over arbitrary CSV datasets using schema-aware prompt pipelines. Integrated Gemini LLM API with structured system prompting, output validation, and error handling demonstrating production-quality developer tooling.',
      tags: ['Python', 'Streamlit', 'LLM API', 'SQL', 'Prompt Engineering', 'Error Handling'],
      github: 'https://github.com/sushant2701/Gen-Ai-Powered-Data-Analysis-Assistant',
      live: 'https://gen-ai-powered-data-analysis-assistant-dgjgbhxbw6hliwhcorymc7.streamlit.app/',
      image: '',
      isKey: true
    },
    {
      id: 'p2',
      title: 'Real-Time GPS Emergency Communication System',
      domain: 'IoT & Embedded Systems',
      description: 'Designed a Python system to interface GPS/GSM hardware, parsing NMEA data on a single-button trigger. Built a low-level serial communication layer (UART) in Python to manage hardware I/O comparable to quantum instrument control API design, utilizing a reliable state machine.',
      tags: ['Python', 'Systems Programming', 'IoT Software', 'UART', 'State Machines', 'Hardware I/O'],
      github: '',
      image: ''
    },
    {
      id: 'p3',
      title: 'MARK_SPACE — Interactive Portfolio Hub',
      domain: 'Web Development & Security',
      description: 'Designed and deployed this framework-free personal developer portfolio. Features native voice commands via the Web Speech API, a live real-time interaction analytics database layer using Supabase, and a hidden "Control Space" dashboard drawer for seamless local updates.',
      tags: ['Vanilla JS', 'Vite v8', 'Web Speech API', 'Supabase', 'Secure Analytics', 'Control Space'],
      github: 'https://github.com/sushant2701/Portfolio',
      live: '',
      image: ''
    }
  ],

  skills: {
    lowLevelCore: [
      'Python', 'C', 'C++', 'Bash/Shell Scripting', 'Linux (Ubuntu/Debian) Systems Programming'
    ],
    scientificComputing: [
      'NumPy', 'Pandas', 'Matplotlib', 'Statistical Processing', 'SQL/Query Optimization'
    ],
    hardwareQuantum: [
      'FPGA Architecture Fundamentals', 'Digital Logic Design', 'HDL Concepts (Verilog/VHDL basics)', 'Qiskit', 'Quantum Circuit Basics'
    ],
    devToolsArch: [
      'Git/GitHub', 'CI/CD Pipelines', 'REST APIs', 'API Design', 'System Design', 'Modular Architecture'
    ]
  },

  milestones: [
    {
      id: 'm1',
      date: '2026',
      title: 'Python Full Stack Developer & Data Analytics | QSpiders Training Institute',
      description: 'Developed end-to-end data pipelines integrating SQL backends with Power BI; focused on ETL workflows and CI/CD-aligned deployment in Agile sprint cycles applicable to experiment data pipelines.'
    },
    {
      id: 'm2',
      date: 'Jul 2024 - Sep 2024',
      title: 'AI/ML Software Intern | AICTE AI Internship',
      description: 'Built end-to-end ML pipelines in Python for preprocessing and feature engineering; benchmarked classification models; produced structured technical documentation for calibration reporting.'
    },
    {
      id: 'm3',
      date: 'Apr 2024 & Jul 2024',
      title: 'Robotics & AI Software Intern | PMS RoBoTiCs, Pune',
      description: 'Developed Python-based control scripts for real-time sensor data acquisition; engineered software-hardware abstraction layers translating high-level Python commands into low-level device actions.'
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
