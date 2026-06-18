/* =============================================
   STATE MANAGEMENT — Centralized + LocalStorage
   ============================================= */

const STORAGE_KEY = 'portfolio_data_v14';

export const SKILL_DEFINITIONS = {
  'Python': 'High-level programming language used for quantum experiment orchestration, rapid scripting, and scientific computing.',
  'C': 'Procedural language used for high-performance low-level firmware, kernel modules, and hardware drivers.',
  'C++': 'Object-oriented language used for high-frequency instrument communication, low-latency control software, and performance-critical systems.',
  'Linux (Ubuntu/Debian)': 'Operating system platform for deploying systems programming, IPC, socket scripting, and hardware controllers.',
  'Bash/Shell Scripting': 'Automation scripting for Linux systems, build pipelines, environment configuration, and task scheduling.',
  'Command-Line Tools': 'Using CLI scripts, core utilities, and text processing tools to manage environments and compile code.',
  'Debugging and performance optimization': 'Profiling code execution, resolving race conditions, and optimizing CPU/memory usage for real-time systems.',
  'NumPy': 'Fundamental scientific computing library in Python, supporting large multidimensional arrays, matrices, and linear algebra operations.',
  'SciPy': 'Open-source Python library used for scientific computations, containing modules for optimization, linear algebra, integration, and statistics.',
  'Pandas': 'High-performance Python library for data manipulation, analysis, structured cleaning, and parsing experiment telemetry logs.',
  'Matplotlib': 'Primary visualization engine for plotting calibration curves, real-time sensor streams, and signal measurements.',
  'Data Analysis': 'Transforming raw datasets into structured formats to extract insights, patterns, and validation metrics.',
  'Statistical Processing': 'Applying mathematical and statistical metrics (e.g. noise analysis, fitting algorithms) to clean raw instrument readings.',
  'SQL Backend Query Optimization': 'Designing, querying, and indexing relational database schemas to efficiently manage calibration constants and metadata.',
  'ETL Pipelines': 'Extracting, transforming, and loading high-volume system and experiment logs into structured data stores.',
  'Power BI': 'Creating interactive dashboards and reports to track project SLA metrics and analytics KPIs.',
  'FPGA Architecture Fundamentals': 'Basic principles of reconfigurable digital hardware, lookup tables, and clock domain crossings in real-time controllers.',
  'HW/SW Interfaces': 'Configuring PCIe, AXI, and memory bus communication protocols between hardware boards and software control scripts.',
  'Digital Logic Design': 'Constructing combinational and sequential digital systems (gates, flip-flops, state machines) to control signals.',
  'HDL Concepts (Verilog/VHDL basics)': 'Designing RTL logic for digital systems to manage high-speed pulse timing and hardware trigger routing.',
  'Qiskit': 'IBM\'s software development kit for writing quantum circuits, simulating quantum operations, and executing algorithms on hardware backends.',
  'Qiskit (Familiar)': 'IBM\'s software development kit for writing, simulating, and executing quantum circuits on real hardware and simulators.',
  'Quantum Circuit Basics': 'Foundational concepts of quantum gates, superposition, entanglement, and representation of quantum states.',
  'Quantum Computing Fundamentals': 'Core theoretical concepts of quantum information theory, qubits, and quantum algorithm paradigms.',
  'Cirq': 'Google\'s software library for writing, manipulating, and optimizing quantum circuits on NISQ computers.',
  'Pulse scheduling': 'Defining custom microwave and radio-frequency analog waveforms to control physical qubit state operations.',
  'Calibration automation': 'Automating closed-loop measurement feedback cycles to correct drift and optimize qubit control gate fidelities.',
  'Generative AI': 'Building intelligent tools and assistants powered by Generative AI models.',
  'Large Language Models': 'Integrating large-scale neural networks to process natural language queries and generate structured answers.',
  'System Prompt Engineering': 'Designing, testing, and refining system-level prompts to align LLM agent behavior and reduce hallucination.',
  'Output Validation': 'Verifying and formatting LLM outputs using structured schemas to ensure runtime stability in production systems.',
  'Gemini/Claude developer APIs': 'Orchestrating multi-modal calls to state-of-the-art models for code generation and reasoning.',
  'Git': 'Distributed version control system for tracking source code changes and branching histories.',
  'GitHub': 'Hosting platform for collaborative software engineering workflows, pull reviews, and CI/CD actions.',
  'CI/CD Pipelines': 'Automated testing and deployment routines ensuring instrument control drivers meet safety and regression specs.',
  'REST APIs': 'Architecting stateless, resource-oriented HTTP interfaces for remote monitoring, telemetry retrieval, and orchestration commands.',
  'API Design': 'Structuring clean, developer-friendly interfaces for low-level instrument control wrappers and backend systems.',
  'System Design': 'Architecting reliable, low-latency, and distributed systems to coordinate high-speed control logic and telemetry.',
  'Modular Architecture': 'Decoupling system logic into self-contained drivers, APIs, and frontends to maximize reuse and maintainability.',
  'Object-oriented and scalable software design': 'Structuring codebases into clear, modular interfaces using OOP design patterns for production environments.'
};

// ── Default Data ──
const DEFAULT_STATE = {
  projects: [
    {
      id: 'p1',
      title: 'GenAI-Powered Data Analysis Platform',
      domain: 'AI & Machine Learning',
      description: 'Full-stack Python application enabling natural language queries over arbitrary datasets using schema-aware prompt pipelines to translate NL to executable code.',
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
      description: 'Python software system interfacing GPS/GSM hardware modules, managing low-level serial communication layers (UART) for hardware I/O instrument control.',
      tags: ['Python', 'Systems Programming', 'IoT Software', 'UART', 'State Machines', 'Hardware I/O'],
      github: '',
      image: ''
    },
    {
      id: 'p3',
      title: 'MARK_SPACE — Interactive Portfolio Hub',
      domain: 'Web Development & Security',
      description: 'Zero-framework modular developer architecture engineered with native browser APIs, Web Speech voice navigation, and live data backend state tracking.',
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
      'Python', 'C', 'C++', 'Linux (Ubuntu/Debian)', 'Bash/Shell Scripting', 'Command-Line Tools', 'Debugging and performance optimization'
    ],
    scientificComputing: [
      'NumPy', 'SciPy', 'Pandas', 'Matplotlib', 'Data Analysis', 'Statistical Processing', 'SQL Backend Query Optimization', 'ETL Pipelines', 'Power BI'
    ],
    hardwareQuantum: [
      'FPGA Architecture Fundamentals', 'HW/SW Interfaces', 'Digital Logic Design', 'HDL Concepts (Verilog/VHDL basics)', 'Qiskit (Familiar)', 'Quantum Circuit Basics', 'Quantum Computing Fundamentals', 'Cirq', 'Pulse scheduling', 'Calibration automation'
    ],
    aiPromptEng: [
      'Generative AI', 'Large Language Models', 'System Prompt Engineering', 'Output Validation', 'Gemini/Claude developer APIs'
    ],
    devToolsArch: [
      'Git', 'GitHub', 'CI/CD Pipelines', 'REST APIs', 'API Design', 'System Design', 'Modular Architecture', 'Object-oriented and scalable software design'
    ]
  },

  milestones: [
    {
      id: 'm1',
      date: '2026',
      title: 'Python Full Stack Developer (Data Analytics) | QSpiders Training Institute',
      description: 'Building end-to-end data pipelines integrating SQL backends with Power BI dashboards for real-time KPI reporting and implementing ETL workflows in Agile sprint cycles.'
    },
    {
      id: 'm2',
      date: 'Jul 2024 - Sep 2024',
      title: 'AI/ML Software Intern | AICTE AI Internship',
      description: 'Built end-to-end ML pipelines in Python (Pandas, NumPy, Scikit-learn) for data preprocessing, feature engineering, and model evaluation.'
    },
    {
      id: 'm3',
      date: '2024',
      title: 'Robotics & AI Software Intern | PMS RoBoTiCs, Pune',
      description: '• 2 Weeks on-site learning based training (1week in April and 1week in July,2024).<br>• Hands On-session on Robotics and AI and Advanced Robotics Hand Cluster.'
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
  let needsSync = false;
  if (isSupabaseConfigured) {
    const cloudState = await fetchStateFromSupabase();
    if (cloudState) {
      state = cloudState;
      
      // Auto-purge old milestones and ensure all default milestones are present
      if (state.milestones) {
        const originalLen = state.milestones.length;
        state.milestones = state.milestones.filter(m => 
          !m.title.toLowerCase().includes('frontend web') && 
          !m.title.toLowerCase().includes('web portal')
        );
        if (state.milestones.length !== originalLen) {
          needsSync = true;
        }
        
        // Ensure all DEFAULT_STATE milestones are present in the state loaded from DB
        DEFAULT_STATE.milestones.forEach(defMilestone => {
          const exists = state.milestones.some(m => 
            m.id === defMilestone.id || 
            m.title.toLowerCase().replace(/[^a-z0-9]/g, '').includes('pmsrobotics')
          );
          if (!exists) {
            state.milestones.push(JSON.parse(JSON.stringify(defMilestone)));
            needsSync = true;
          }
        });

        // Update PMS Robotics milestone description in cloud state
        const pmsMilestone = state.milestones.find(m => m.title.toLowerCase().includes('pms robotics'));
        const targetDesc = '• 2 Weeks on-site learning based training (1week in April and 1week in July,2024).<br>• Hands On-session on Robotics and AI and Advanced Robotics Hand Cluster.';
        if (pmsMilestone && pmsMilestone.description !== targetDesc) {
          pmsMilestone.description = targetDesc;
          needsSync = true;
        }

        // Sort milestones to maintain newest-first order (m1, m2, m3)
        const idOrder = { 'm1': 1, 'm2': 2, 'm3': 3 };
        state.milestones.sort((a, b) => {
          const orderA = idOrder[a.id] || 99;
          const orderB = idOrder[b.id] || 99;
          return orderA - orderB;
        });
      } else {
        state.milestones = JSON.parse(JSON.stringify(DEFAULT_STATE.milestones));
        needsSync = true;
      }
      
      // Ensure skills match the latest set defined in DEFAULT_STATE
      state.skills = JSON.parse(JSON.stringify(DEFAULT_STATE.skills));
      needsSync = true;
      
      // Backup to LocalStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      
      if (needsSync) {
        saveStateToSupabase(state);
      }
      return;
    }
  }

  // Local Fallback
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      state = JSON.parse(stored);
      if (!state.projects) state.projects = DEFAULT_STATE.projects;
      
      // Auto-purge milestones and restore missing default ones in local fallback
      if (state.milestones) {
        state.milestones = state.milestones.filter(m => 
          !m.title.toLowerCase().includes('frontend web') && 
          !m.title.toLowerCase().includes('web portal')
        );
        
        DEFAULT_STATE.milestones.forEach(defMilestone => {
          const exists = state.milestones.some(m => 
            m.id === defMilestone.id || 
            m.title.toLowerCase().replace(/[^a-z0-9]/g, '').includes('pmsrobotics')
          );
          if (!exists) {
            state.milestones.push(JSON.parse(JSON.stringify(defMilestone)));
          }
        });

        const pmsMilestone = state.milestones.find(m => m.title.toLowerCase().includes('pms robotics'));
        const targetDesc = '• 2 Weeks on-site learning based training (1week in April and 1week in July,2024).<br>• Hands On-session on Robotics and AI and Advanced Robotics Hand Cluster.';
        if (pmsMilestone && pmsMilestone.description !== targetDesc) {
          pmsMilestone.description = targetDesc;
        }

        const idOrder = { 'm1': 1, 'm2': 2, 'm3': 3 };
        state.milestones.sort((a, b) => {
          const orderA = idOrder[a.id] || 99;
          const orderB = idOrder[b.id] || 99;
          return orderA - orderB;
        });
      } else {
        state.milestones = JSON.parse(JSON.stringify(DEFAULT_STATE.milestones));
      }
      
      state.skills = JSON.parse(JSON.stringify(DEFAULT_STATE.skills));
      syncToStorage();
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
