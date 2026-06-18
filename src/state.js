/* =============================================
   STATE MANAGEMENT — Centralized + LocalStorage
   ============================================= */

const STORAGE_KEY = 'portfolio_data_v14';

export const SKILL_DEFINITIONS = {
  'Python': 'High-level programming language used for quantum experiment orchestration, rapid scripting, and scientific computing.',
  'C': 'Procedural language used for high-performance low-level firmware, kernel modules, and hardware drivers.',
  'C++': 'Object-oriented language used for high-frequency instrument communication, low-latency control software, and performance-critical systems.',
  'Linux-based systems development': 'Building system-level software on Linux environments, optimizing multi-threading, IPC, and POSIX compliance.',
  'Bash/Shell Scripting': 'Automation scripting for Linux systems, build pipelines, environment configuration, and task scheduling.',
  'Debugging and performance optimization': 'Profiling execution paths, resolving race conditions, and optimizing CPU/memory allocation for low-latency pipelines.',
  'NumPy': 'Fundamental scientific computing library in Python, supporting large multidimensional arrays, matrices, and linear algebra operations.',
  'SciPy': 'Open-source Python library used for scientific computations, containing modules for optimization, linear algebra, integration, and statistics.',
  'Pandas': 'High-performance Python library for data manipulation, analysis, structured cleaning, and parsing experiment telemetry logs.',
  'Scientific computing and data analysis': 'Applying numerical analysis, model fitting, and statistical processing to extract signals from noisy experiment data.',
  'SQL backend query optimization': 'Designing and tuning relational database schemas to efficiently query large-scale historical calibration datasets.',
  'Power BI': 'Microsoft\'s business intelligence tool for creating interactive visualizations, data models, and dashboards.',
  'ETL pipelines': 'Extracting, transforming, and loading high-volume experiment and system logs into structured analytics data stores.',
  'FPGA Architecture & HW/SW Interfaces': 'Configuring reconfigurable hardware logic gates, memory blocks, and high-speed PCIe/AXI hardware-software communication buses.',
  'Digital Logic Design': 'Designing combinational and sequential logic circuits, clock domain crossings, and hardware state machines.',
  'HDL Concepts': 'Hardware Description Language (Verilog/VHDL) methodologies for describing register-transfer level (RTL) systems and logic simulation.',
  'Qiskit': 'IBM\'s open-source SDK for writing, simulating, and running quantum circuits and algorithms on simulator backends and real devices.',
  'Cirq': 'Google\'s software library for writing, manipulating, and optimizing quantum circuits on NISQ quantum computers.',
  'Pulse scheduling': 'Defining exact microwave and radio-frequency analog waveforms to control physical qubit state operations.',
  'Calibration automation': 'Automating closed-loop measurement feedback cycles to correct drift and optimize qubit control gate fidelities.',
  'Generative AI': 'Utilizing artificial intelligence models to generate novel data, code, or structured responses based on training patterns.',
  'Large Language Models': 'Deep learning neural networks trained on massive textual data to understand and generate natural language.',
  'System Prompt Engineering': 'Designing robust system instructions, multi-turn contexts, and templates to align Generative AI behaviors.',
  'Output Validation': 'Enforcing structural, type-safe schema constraints on LLM responses to ensure integration stability in developer tooling.',
  'Gemini/Claude developer APIs': 'Leveraging state-of-the-art developer APIs for language generation, reasoning, and context window operations.',
  'Git/GitHub': 'Distributed version control and collaboration platform for managing codebases, code review pull requests, and release tracking.',
  'CI/CD pipelines': 'Continuous Integration and Continuous Deployment workflows for automated testing, packaging, and deploying software modules.',
  'Software engineering best practices': 'Writing clean, documented, peer-reviewed, and unit-tested code aligned with style guides and production safety.',
  'REST APIs': 'Designing stateless, resource-oriented HTTP interfaces for remote monitoring, telemetry retrieval, and orchestration commands.',
  'Object-oriented and scalable software design': 'Structuring complex software systems into reusable, decoupled components using OOP design patterns and design principles.'
};

// ── Default Data ──
const DEFAULT_STATE = {
  projects: [
    {
      id: 'p1',
      title: 'GenAI-Powered Data Analysis Platform',
      domain: 'AI & Machine Learning',
      description: 'Built a full-stack Python application utilizing Gemini LLM API schema-aware prompt pipelines for natural language queries, demonstrating production-quality developer tooling, structured system prompting, Python API/SDK design, and runtime error handling.',
      tags: ['Python', 'Streamlit', 'Gemini API', 'SQL', 'Prompt Engineering', 'API Design', 'Error Handling'],
      github: 'https://github.com/sushant2701/Gen-Ai-Powered-Data-Analysis-Assistant',
      live: 'https://gen-ai-powered-data-analysis-assistant-dgjgbhxbw6hliwhcorymc7.streamlit.app/',
      image: '',
      isKey: true
    },
    {
      id: 'p2',
      title: 'Real-Time GPS Emergency Communication System',
      domain: 'IoT & Embedded Systems',
      description: 'Designed a Python system to interface GPS/GSM hardware, parsing NMEA coordinate data on a single-button trigger. Built a low-level serial communication layer (UART) in Python to manage hardware I/O and register states, utilizing reliable state-machine logic as a core hardware-software abstraction capability.',
      tags: ['Python', 'Systems Programming', 'IoT Software', 'UART', 'State Machines', 'Hardware I/O'],
      github: '',
      image: ''
    },
    {
      id: 'p3',
      title: 'MARK_SPACE — Interactive Portfolio Hub',
      domain: 'Web Development & Security',
      description: 'Created this framework-free personal developer portfolio utilizing native browser API integration, clean asset delivery pipelines, and live database state synchronization via Supabase. Features native voice commands via the Web Speech API and a hidden Control Space drawer.',
      tags: ['Vanilla JS', 'Vite v8', 'Web Speech API', 'Supabase', 'Secure Analytics', 'Control Space'],
      github: 'https://github.com/sushant2701/Portfolio',
      live: '',
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
    }
  ],

  skills: {
    lowLevelCore: [
      'Python', 'C', 'C++', 'Linux-based systems development', 'Bash/Shell Scripting', 'Debugging and performance optimization'
    ],
    scientificComputing: [
      'NumPy', 'SciPy', 'Pandas', 'Scientific computing and data analysis', 'SQL backend query optimization', 'Power BI', 'ETL pipelines'
    ],
    hardwareQuantum: [
      'FPGA Architecture & HW/SW Interfaces', 'Digital Logic Design', 'HDL Concepts', 'Qiskit', 'Cirq', 'Pulse scheduling', 'Calibration automation'
    ],
    aiPromptEng: [
      'Generative AI', 'Large Language Models', 'System Prompt Engineering', 'Output Validation', 'Gemini/Claude developer APIs'
    ],
    devToolsArch: [
      'Git/GitHub', 'CI/CD pipelines', 'Software engineering best practices', 'REST APIs', 'Object-oriented and scalable software design'
    ]
  },

  milestones: [
    {
      id: 'm1',
      date: '2026',
      title: 'Python Full Stack Developer (Data Analytics Focus) | QSpiders Training Institute',
      description: 'Building data pipelines, SQL backends, Power BI KPI reporting, and implementing CI/CD deployment.'
    },
    {
      id: 'm2',
      date: 'Jul 2024 - Sep 2024',
      title: 'AI/ML Software Intern | AICTE AI Internship',
      description: 'Building end-to-end ML pipelines in Python, preprocessing, feature engineering, and documenting calibration metrics.'
    },
    {
      id: 'm3',
      date: '2024',
      title: 'Robotics & AI Software Intern | PMS RoBoTiCs, Pune',
      description: 'Developing Python control algorithms to interface hardware via software commands and managing abstraction layers.'
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
