/* ============================================================
   DHIA MOKHTARI PORTFOLIO – script.js
   Option C: Tech Lab Shell + Research Editorial Depth
   Features: Scroll progress, Nav, Reveal, Counters,
   Project Filter, Case Study Modals (Distill-style),
   Email Copy, GitHub Live Stats, Keyboard Accessibility
   ============================================================ */

'use strict';

// ── SCROLL PROGRESS BAR ──────────────────────────────────────
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const st = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  if (docH > 0) progressBar.style.width = `${(st / docH) * 100}%`;
}, { passive: true });

// ── NAVBAR & MOBILE MENU ─────────────────────────────────────
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (navbar)    navbar.classList.toggle('scrolled', window.scrollY > 20);
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(s => navObserver.observe(s));

// ── SCROLL REVEAL ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${(i % 4) * 0.06}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -36px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── COUNTER ANIMATIONS ───────────────────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 28));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 42);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

// ── PROJECT FILTER ───────────────────────────────────────────
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) {
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 40);
      }
    });
  });
});

// ── CASE STUDY DATA ──────────────────────────────────────────
// Research editorial structure:
// Each project may contain: title, abstract, sections with
// optional { text, math (KaTeX), bullets, chips, figure }
const caseStudies = {
  'ifpen-pgnn': {
    badge: 'Industrial R&D Case Study · IFPEN',
    title: 'Physics-Guided Neural Networks for Electric Motor Surrogate Modeling',
    meta: 'IFP Energies nouvelles · Rueil-Malmaison, France · Feb 2026 – Jul 2026',
    abstract: 'In electric powertrain optimization, finite element analysis (FEM) simulations of electric motor losses take hours per evaluation. We investigate deep learning surrogate models — including physics-guided neural architectures (PGNNs) with FiLM conditioning — that predict electromagnetic loss maps in milliseconds while preserving physical consistency and generalizing zero-shot to unseen motor geometries.',
    sections: [
      {
        title: 'Problem Formulation',
        text: 'Given a motor design descriptor $\\mathbf{g} \\in \\mathbb{R}^d$ (geometry, pole count, magnet placement) and an operating point $(\\omega, T)$ (angular velocity, torque), the objective is to learn a surrogate $f_\\theta$ such that:',
        math: '$$\\hat{P}_{\\text{loss}}(\\omega, T, \\mathbf{g}) = f_\\theta(\\omega, T, \\mathbf{g}) \\approx P_{\\text{FEM}}(\\omega, T, \\mathbf{g})$$',
        post: 'subject to the physical constraint that losses must be non-negative and monotonically non-decreasing with current density at fixed speed.'
      },
      {
        title: 'Architectural & Engineering Decisions',
        bullets: [
          'Engineered an end-to-end reproducible Python ML pipeline automating dataset cleaning, scaling, cross-validation, and benchmarking on physical test-bench and simulation data.',
          'Formulated baseline non-linear regressors (XGBoost/LightGBM) and deep multi-layer neural networks, followed by hybrid Physics-Guided Neural Networks (PGNNs).',
          'Integrated Feature-wise Linear Modulation (FiLM) conditioning: intermediate feature activations $h_\\ell$ are scaled and shifted as $h_\\ell^\\prime = \\gamma(\\mathbf{g}) \\odot h_\\ell + \\beta(\\mathbf{g})$ using a geometry encoder network, enabling geometry-specific adaptation without retraining.',
          'Incorporated electromagnetic loss constraints directly into custom PyTorch loss functions to penalize unphysical negative losses and boundary anomalies.'
        ]
      },
      {
        title: 'Zero-Shot OOD Generalization & Validation Protocol',
        bullets: [
          'Designed a rigorous leave-one-geometry-out validation protocol to measure model generalizability on previously unseen motor topologies (out-of-distribution evaluation).',
          'Quantitatively analyzed trade-offs between predictive error (MAE, RMSE, $R^2$), inference speed, model parameter count, and physical boundary plausibility.',
          'Achieved near-instantaneous millisecond inference, enabling rapid multi-objective motor optimization iterations.'
        ]
      },
      {
        title: 'Technologies & Frameworks',
        chips: ['Python', 'PyTorch', 'Scientific ML', 'FiLM Conditioning', 'PINNs', 'Surrogate Modeling', 'OOD Generalization', 'Reproducible Pipelines', 'XGBoost']
      }
    ],
    links: [
      { text: 'Confidential IFPEN R&D Project', url: '#', icon: 'fas fa-shield-alt', disabled: true }
    ]
  },

  'ssast': {
    badge: 'Deep Learning & Vision Transformer',
    title: 'Self-Supervised Audio Spectrogram Transformer (SSAST)',
    meta: 'Research Implementation · Nov 2025 – Jan 2026',
    abstract: 'Adapting large Vision Transformer backbones to audio tasks with scarce annotated data typically results in severe overfitting and GPU memory overruns. We investigate transfer learning with AudioSet-pretrained SSAST for GTZAN genre classification, applying SpecAugment, gradient checkpointing, and layer-wise learning rate decay (LLRD) to achieve stable fine-tuning under strict resource constraints.',
    sections: [
      {
        title: 'Challenge & Motivation',
        text: 'GTZAN contains only 1,000 labeled 30-second clips across 10 genres — a regime where ViT-Base (86M parameters) is heavily overparameterized. Standard fine-tuning strategies suffer from catastrophic forgetting of audio representations learned during self-supervised AudioSet pretraining.'
      },
      {
        title: 'Training Optimization Strategy',
        bullets: [
          'Engineered a robust audio preprocessing pipeline extracting 128-band log Mel spectrograms with dynamic 10-second temporal sampling.',
          'Applied SpecAugment with frequency masking up to $f = 24$ Mel bands and time masking up to $t = 96$ frames to strongly regularize representation learning on this small dataset.',
          'Addressed strict GPU VRAM limits by integrating Gradient Checkpointing (trading computation for memory) and Gradient Accumulation (effective batch size scaling).',
          'Applied Layer-wise Learning Rate Decay (LLRD) with rate $\\eta_\\ell = \\eta_0 \\cdot \\alpha^{L - \\ell}$, where $\\alpha \\in (0,1)$, preserving low-level audio representations while adapting higher-level classification heads.',
          'Used Label Smoothing ($\\varepsilon = 0.1$) to reduce overconfident posterior estimates and improve calibration.'
        ]
      },
      {
        title: 'Results',
        bullets: [
          'Outperformed standard CNN baselines in classification accuracy and feature stability under identical training conditions.',
          'Demonstrated reliable transfer learning dynamics from self-supervised spectrogram representations to the target low-resource domain.'
        ]
      },
      {
        title: 'Technologies & Frameworks',
        chips: ['Python', 'PyTorch', 'Hugging Face', 'SSAST', 'SpecAugment', 'Gradient Checkpointing', 'LLRD', 'GTZAN']
      }
    ],
    links: [
      { text: 'View GitHub Repository', url: 'https://github.com/dhiaelhakmokhtari/Self-Supervised-Audio-Spectrogram-Transformer-DL', icon: 'fab fa-github' }
    ]
  },

  'kg-llm': {
    badge: 'Generative AI & Graph-RAG',
    title: 'Aligning LLMs with Structured Knowledge Graphs (Graph-RAG)',
    meta: 'Master 1 Research Project · Paris-Saclay · Jan – May 2025',
    abstract: 'Large Language Models hallucinate factual relations in technical domains where conceptual precision is critical. We investigate how graph databases (Neo4j) can ground generative models with explicit topological knowledge through a hybrid Graph-RAG retrieval pipeline, evaluated on domain-specific pedagogical explanation tasks.',
    sections: [
      {
        title: 'Problem & Research Context',
        text: 'Standard RAG systems retrieve flat text passages, losing the relational structure between domain concepts. By representing knowledge as a labeled property graph $G = (V, E, \\mathcal{L})$, multi-hop reasoning over concept relationships becomes tractable through Cypher graph queries rather than approximate vector nearest-neighbor search alone.'
      },
      {
        title: 'System Architecture',
        bullets: [
          'Designed a hybrid Graph-RAG pipeline combining vector similarity search (ChromaDB embeddings) with structured Cypher graph queries on Neo4j for multi-hop reasoning.',
          'Built reasoning chains with LangChain and LangGraph to traverse semantic relationships and aggregate evidence paths before generation.',
          'Employed Pydantic for rigid schema validation of generated answers, ensuring structured and citation-grounded pedagogical output.',
          'Configured local LLM execution using Ollama to evaluate latency and privacy trade-offs against commercial API endpoints.'
        ]
      },
      {
        title: 'Impact & Evaluation',
        bullets: [
          'Demonstrated drastic reduction in hallucinated conceptual relationships across educational domain benchmarks.',
          'Produced explainable citation paths showing the exact graph entities and edges that justified each LLM response.'
        ]
      },
      {
        title: 'Technologies & Frameworks',
        chips: ['Python', 'LangChain', 'LangGraph', 'Neo4j', 'Cypher', 'ChromaDB', 'Ollama', 'Pydantic', 'Graph-RAG']
      }
    ],
    links: [
      { text: 'View TER-2025 Repo', url: 'https://github.com/dhiaelhakmokhtari/KG-guided-LLM-TER-2025', icon: 'fab fa-github' },
      { text: 'View Final Pipeline Repo', url: 'https://github.com/dhiaelhakmokhtari/KG-guided-LLM-finale', icon: 'fas fa-external-link-alt' }
    ]
  },

  'multiagent': {
    badge: 'Autonomous Systems & Concurrency',
    title: 'Distributed Multi-Agent Coordination Framework (Warbot)',
    meta: 'Concurrent Systems · Dec 2025 – Jan 2026',
    abstract: 'Coordinating autonomous agents in competitive, adversarial, and partially observable environments requires dynamic resource allocation, resilient communication, and decentralized decision-making without a central coordinator. We implement a full distributed multi-agent coordination system in Java/Processing with hierarchical state machines, stigmergic behaviors, and kinematics-based planning.',
    sections: [
      {
        title: 'Context & Challenge',
        text: 'In the Warbot simulation environment, agents must coordinate foraging, defense, and offensive behaviors in real time with limited communication bandwidth, adversarial pressure, and stochastic resource distribution — a setting that closely mirrors real-world multi-robot system challenges.'
      },
      {
        title: 'Architecture & Design Patterns',
        bullets: [
          'Engineered an asynchronous message-passing communication layer with dynamic message priority queues in Java, supporting typed message taxonomies and timeout-based acknowledgment.',
          'Implemented Hierarchical State Machines (HSMs) for agent role switching: scouting → foraging → threat response → defensive posture, with priority-based preemption.',
          'Designed stigmergic perimeter patrolling algorithms inspired by biological swarm intelligence, distributing patrol coverage across the team without centralized coordination.',
          'Implemented kinematics-based predictive aiming: intercepting target $\\mathbf{p}_T$ moving at velocity $\\mathbf{v}_T$ using projectile speed $v_p$ to solve the quadratic intercept equation.'
        ]
      },
      {
        title: 'System Performance',
        bullets: [
          'Achieved robust operational continuity under simulated packet latency and agent attrition scenarios.',
          'Demonstrated superior foraging throughput and tactical win-rates against multiple baseline heuristic strategies in repeated simulation trials.'
        ]
      },
      {
        title: 'Technologies & Frameworks',
        chips: ['Java', 'Processing', 'Hierarchical State Machines', 'Asynchronous Message Passing', 'Distributed AI', 'Multi-Agent Systems', 'Stigmergy']
      }
    ],
    links: [
      { text: 'View GitHub Repository', url: 'https://github.com/dhiaelhakmokhtari/Multi-Agent-Systems-Autonomous-Coordination', icon: 'fab fa-github' }
    ]
  },

  'rl-blackjack': {
    badge: 'Reinforcement Learning Benchmark',
    title: 'SARSA vs Q-Learning: Convergence & Policy Benchmarking',
    meta: 'Gymnasium RL · Dec 2025 – Jan 2026',
    abstract: 'A quantitative benchmark investigating the empirical convergence, stability, and exploration trade-offs between On-Policy TD learning (SARSA) and Off-Policy TD learning (Q-Learning) in the stochastic Gymnasium Blackjack-v1 environment, evaluated against mathematically optimal basic strategy.',
    sections: [
      {
        title: 'Problem & Objective',
        text: 'Both SARSA and Q-Learning learn action-value functions $Q(s, a)$ via temporal difference updates. The key difference lies in the update target: SARSA uses the on-policy estimate $Q(s_{t+1}, a_{t+1})$ while Q-Learning uses the off-policy greedy maximum $\\max_a Q(s_{t+1}, a)$.',
        math: '$$Q(s_t, a_t) \\leftarrow Q(s_t, a_t) + \\alpha \\left[ r_{t+1} + \\gamma \\cdot \\begin{cases} Q(s_{t+1}, a_{t+1}) & \\text{(SARSA)} \\\\ \\max_a Q(s_{t+1}, a) & \\text{(Q-Learning)} \\end{cases} - Q(s_t, a_t) \\right]$$'
      },
      {
        title: 'Methodology & Benchmarking Suite',
        bullets: [
          'Engineered tabular RL implementations with $\\varepsilon$-decay schedules and reward tracking over millions of training episodes.',
          'Developed a "True Skill" evaluation pipeline isolating policy maturity from exploration noise by evaluating the greedy ($\\varepsilon=0$) policy against held-out episodes.',
          'Visualized learned decision boundaries with policy heatmaps over all 1,500+ states (player sum × dealer card × usable ace).',
          'Built a seed-synchronized CLI benchmarking tool comparing policies directly against mathematically optimal human basic strategy tables.'
        ]
      },
      {
        title: 'Findings',
        bullets: [
          'Proved empirical convergence to theoretical game-theoretic optimality under sufficient training.',
          'Quantified that Q-Learning converges to optimal state values faster; SARSA yields smoother learning curves with lower variance during online exploration phases.'
        ]
      },
      {
        title: 'Technologies & Frameworks',
        chips: ['Python', 'Gymnasium', 'SARSA', 'Q-Learning', 'True Skill', 'Policy Heatmaps', 'CLI Benchmarking', 'NumPy']
      }
    ],
    links: [
      { text: 'View GitHub Repository', url: 'https://github.com/dhiaelhakmokhtari/SARSA-vs-QLearning-Blackjack', icon: 'fab fa-github' }
    ]
  },

  'game-theory': {
    badge: 'Vectorized Simulation & Complex Systems',
    title: 'Vectorized Spatial Game Theory Simulation Engine',
    meta: 'Scientific Computing · Apr – May 2025',
    abstract: 'The Spatial Prisoner\'s Dilemma on large 2D toroidal lattices models evolutionary cooperation dynamics, but naive iterative implementations suffer severe CPU bottlenecks. We engineer a high-performance simulation engine using NumPy/SciPy 2D convolutions for fully vectorized neighborhood payoff computation, achieving ~50× speedup over reference loop implementations.',
    sections: [
      {
        title: 'Algorithmic Formulation',
        text: 'For each cell $(i,j)$ on a toroidal grid, the total payoff is computed as the convolution of the strategy matrix $S$ with a payoff kernel $K$ derived from the game matrix $\\mathbf{M}$:',
        math: '$$P_{i,j} = (K * S)_{i,j} = \\sum_{\\Delta i, \\Delta j} K_{\\Delta i, \\Delta j} \\cdot S_{i+\\Delta i,\\, j+\\Delta j}$$',
        post: 'This eliminates all Python-level loops, replacing them with a single call to <code>scipy.signal.convolve2d</code> operating on the full grid simultaneously.'
      },
      {
        title: 'Strategies & Simulation Features',
        bullets: [
          'Implemented canonical and nuanced strategies: Tit-for-Tat, Pavlov (Win-Stay, Lose-Shift), Contrite TFT, Always Defect, Always Cooperate.',
          'Engineered real-time interactive GUI monitoring phase transitions, Lyapunov cluster dynamics, and population survival rates over 20,000+ generations.',
          'Achieved ~50× speedup over iterative reference implementations on 128×128 agent lattices, enabling interactive parameter sweeps.'
        ]
      },
      {
        title: 'Technologies & Frameworks',
        chips: ['Python', 'NumPy', 'SciPy', 'convolve2d', 'Spatial Simulation', 'Evolutionary Game Theory', 'Interactive GUI', 'matplotlib']
      }
    ],
    links: [
      { text: 'View GitHub Repository', url: 'https://github.com/dhiaelhakmokhtari/Idea-Propagation-MultiAgent-Systems', icon: 'fab fa-github' }
    ]
  }
};

// ── CASE STUDY MODAL ─────────────────────────────────────────
const modal         = document.getElementById('caseStudyModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalBadge    = document.getElementById('modalBadge');
const modalTitle    = document.getElementById('modalTitle');
const modalMeta     = document.getElementById('modalMeta');
const modalBody     = document.getElementById('modalBody');
const modalFooter   = document.getElementById('modalFooter');

function openCaseStudy(projectId) {
  const data = caseStudies[projectId];
  if (!data || !modal) return;

  modalBadge.textContent = data.badge;
  modalTitle.textContent = data.title;
  modalMeta.textContent  = data.meta;

  // Build Distill-style research editorial body
  let html = '';

  // Abstract block
  if (data.abstract) {
    html += `<div class="modal-section">`;
    html += `<h4 class="modal-section-title">Abstract</h4>`;
    html += `<p><em>${data.abstract}</em></p>`;
    html += `</div>`;
  }

  // Sections
  data.sections.forEach(sec => {
    html += `<div class="modal-section">`;
    html += `<h4 class="modal-section-title">${sec.title}</h4>`;

    if (sec.text) {
      html += `<p>${sec.text}</p>`;
    }
    // LaTeX math block — KaTeX will auto-render via auto-render CDN script
    if (sec.math) {
      html += `<div class="math-block">${sec.math}</div>`;
    }
    if (sec.post) {
      html += `<p>${sec.post}</p>`;
    }
    if (sec.bullets) {
      html += `<ul>`;
      sec.bullets.forEach(b => { html += `<li>${b}</li>`; });
      html += `</ul>`;
    }
    if (sec.figure) {
      html += `<figure class="modal-figure">
        <img src="${sec.figure.src}" alt="${sec.figure.alt}" loading="lazy" />
        <figcaption><strong>Figure:</strong> ${sec.figure.caption}</figcaption>
      </figure>`;
    }
    if (sec.chips) {
      html += `<div class="modal-chips">`;
      sec.chips.forEach(c => { html += `<span class="modal-chip">${c}</span>`; });
      html += `</div>`;
    }

    html += `</div>`;
  });

  modalBody.innerHTML = html;

  // Re-render KaTeX math if the library is loaded
  if (window.renderMathInElement) {
    renderMathInElement(modalBody, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$',  right: '$',  display: false }
      ],
      throwOnError: false
    });
  }

  // Footer action links
  let footerHtml = '';
  if (data.links && data.links.length > 0) {
    data.links.forEach(l => {
      if (l.disabled) {
        footerHtml += `<span class="btn btn-ghost" style="opacity:0.6; cursor:default;"><i class="${l.icon}"></i> ${l.text}</span>`;
      } else {
        footerHtml += `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary"><i class="${l.icon}"></i> ${l.text}</a>`;
      }
    });
  }
  footerHtml += `<button class="btn btn-ghost" id="modalCloseFooterBtn">Close</button>`;
  modalFooter.innerHTML = footerHtml;
  document.getElementById('modalCloseFooterBtn')?.addEventListener('click', closeModal);

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Bind modal triggers
document.querySelectorAll('.open-case-study').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openCaseStudy(btn.dataset.project);
  });
});

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modal) {
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
}

// ── TOAST & COPY EMAIL ───────────────────────────────────────
const toast = document.getElementById('toast');

function showToast(message) {
  if (!toast) return;
  toast.innerHTML = `<i class="fas fa-check-circle" style="color:#10b981;"></i> ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

function copyEmailAddress() {
  const email = 'dhiaelhakmokhtari@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    showToast('Email address copied: ' + email);
    const copyText = document.getElementById('copyEmailText');
    if (copyText) {
      const orig = copyText.textContent;
      copyText.textContent = 'Copied!';
      setTimeout(() => { copyText.textContent = orig; }, 2200);
    }
  }).catch(() => {
    window.location.href = `mailto:${email}`;
  });
}

document.getElementById('copyEmailBtn')?.addEventListener('click', copyEmailAddress);
document.getElementById('emailContactCard')?.addEventListener('click', copyEmailAddress);

// ── GITHUB AVATAR & LIVE STATS ───────────────────────────────
const ghAvatar = document.getElementById('ghAvatar');
if (ghAvatar) {
  fetch('https://api.github.com/users/dhiaelhakmokhtari')
    .then(r => r.json())
    .then(data => {
      if (data.avatar_url) ghAvatar.src = data.avatar_url;
      if (data.public_repos) {
        const reposEl = document.querySelector('#stat-repos .stat-number');
        if (reposEl) reposEl.dataset.target = data.public_repos;
        const ghRepoSpan = document.querySelector('.gh-stats span:first-child');
        if (ghRepoSpan) ghRepoSpan.innerHTML = `<i class="fas fa-code-branch"></i> ${data.public_repos} repos`;
      }
      if (data.followers !== undefined) {
        const followerSpan = document.querySelector('.gh-stats span:nth-child(2)');
        if (followerSpan) followerSpan.innerHTML = `<i class="fas fa-users"></i> ${data.followers} followers`;
      }
    })
    .catch(() => {});
}

// ── BACK TO TOP ──────────────────────────────────────────────
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const targetId = a.getAttribute('href');
    if (targetId && targetId !== '#') {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ── KEYBOARD ACCESSIBILITY ───────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal && modal.classList.contains('active')) closeModal();
    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  }
});
