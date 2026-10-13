/* ============================================================
   DHIA MOKHTARI PORTFOLIO – script.js
   Scientific Machine Learning & AI Engineering Showcase
   Interactivity: Preloader, Particles, Nav, Typewriter,
   Counters, Project Filtering, Case Study Modal, Email Copy,
   GitHub Live Stats, Keyboard Accessibility
   ============================================================ */

'use strict';

// ── PRELOADER ────────────────────────────────────────────────
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('done');
    }, 1200);
  }
});

// ── SCROLL PROGRESS BAR ──────────────────────────────────────
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const st = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  if (docH > 0) {
    progressBar.style.width = `${(st / docH) * 100}%`;
  }
}, { passive: true });

// ── HERO PARTICLES ───────────────────────────────────────────
const canvas = document.getElementById('heroParticles');
if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 55;
  let mouse = { x: -1000, y: -1000 };

  function resizeCanvas() {
    const hero = canvas.parentElement;
    if (hero) {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse repulsion
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = ((120 - dist) / 120) * 0.3;
        this.x -= dx * force * 0.02;
        this.y -= dy * force * 0.02;
      }

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const opacity = (1 - dist / 140) * 0.12;
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ── CUSTOM CURSOR ────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (window.matchMedia('(pointer: fine)').matches && cursor && cursorFollower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const interactives = 'a, button, input, textarea, .project-card, .skill-group, .contact-item-card';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorFollower.style.width = '52px';
      cursorFollower.style.height = '52px';
      cursorFollower.style.borderColor = 'rgba(99, 102, 241, 0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursorFollower.style.width = '32px';
      cursorFollower.style.height = '32px';
      cursorFollower.style.borderColor = 'rgba(255, 255, 255, 0.4)';
    });
  });
}

// ── NAVBAR & MOBILE MENU ─────────────────────────────────────
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
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

// Active link on scroll
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

// ── TYPEWRITER ───────────────────────────────────────────────
const phrases = [
  'Scientific ML & AI Engineer',
  'Physics-Guided AI & Surrogate Modeling',
  'PyTorch · Transformers · Deep Learning',
  'Paris-Saclay M2 (Ranked 2nd)',
  'Open to PhD & R&D Roles (CDI/CDD)'
];
let pIdx = 0, cIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typewrite() {
  if (!typeEl) return;
  const phrase = phrases[pIdx];
  if (deleting) {
    cIdx--;
    typeEl.textContent = phrase.slice(0, cIdx);
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      setTimeout(typewrite, 450);
      return;
    }
    setTimeout(typewrite, 35);
  } else {
    cIdx++;
    typeEl.textContent = phrase.slice(0, cIdx);
    if (cIdx === phrase.length) {
      deleting = true;
      setTimeout(typewrite, 2200);
      return;
    }
    setTimeout(typewrite, 70);
  }
}
setTimeout(typewrite, 700);

// ── SCROLL REVEAL ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${(i % 3) * 0.08}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── COUNTER ANIMATIONS ───────────────────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 45);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

// ── PROJECT FILTER ───────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
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

// ── CASE STUDY DATA & MODAL ──────────────────────────────────
const caseStudies = {
  'ifpen-pgnn': {
    badge: 'Industrial R&D Case Study · IFPEN',
    title: 'Physics-Guided Neural Networks for Electric Motor Surrogate Modeling',
    meta: 'IFP Energies nouvelles · Rueil-Malmaison, France · Feb 2026 – Jul 2026',
    sections: [
      {
        title: 'Industrial Context & Problem Formulation',
        text: 'In electric powertrain optimization, finite element analysis (FEA/FEM) simulations of electric motor losses take hours or days to evaluate over full speed-torque operating regimes. This simulation bottleneck hampers multi-objective design optimization. The goal was to build deep learning surrogate models capable of predicting comprehensive electromagnetic loss maps (stator iron losses, rotor losses, Joule losses) in milliseconds, while preserving physical fidelity.'
      },
      {
        title: 'Architectural & Engineering Decisions',
        bullets: [
          'Engineered an end-to-end reproducible Python ML pipeline automating dataset cleaning, scaling, cross-validation, and performance benchmarking on physical test-bench and simulation data.',
          'Formulated both baseline non-linear regressors (XGBoost/LightGBM) and deep multi-layer neural networks, followed by hybrid Physics-Guided Neural Networks (PGNNs).',
          'Integrated Feature-wise Linear Modulation (FiLM) conditioning to dynamically scale and shift intermediate feature activations based on motor design geometric descriptors (stator/rotor dimensions, magnet placement, pole pair counts).',
          'Incorporated electromagnetic loss constraints directly into custom PyTorch loss functions to penalize unphysical negative losses and boundary anomalies.'
        ]
      },
      {
        title: 'Zero-Shot OOD Generalization & Validation Protocol',
        bullets: [
          'Designed a rigorous leave-one-geometry-out validation protocol to measure model generalizability on previously unseen motor topologies (out-of-distribution evaluation).',
          'Quantitatively analyzed trade-offs between predictive error (MAE, RMSE, R²), inference speed, model parameter count, and physical boundary plausibility.',
          'Achieved near-instantaneous millisecond inference, enabling rapid multi-objective motor optimization.'
        ]
      },
      {
        title: 'Technologies & Frameworks',
        chips: ['Python', 'PyTorch', 'Scientific ML', 'FiLM Conditioning', 'PINNs', 'Surrogate Modeling', 'OOD Generalization', 'Reproducible Pipelines']
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
    sections: [
      {
        title: 'Challenge & Motivation',
        text: 'Adapting large Vision Transformer (ViT) backbones to audio tasks with scarce annotated training data often results in severe overfitting and exorbitant GPU memory footprints. This project investigated transfer learning and optimization stability using SSAST pretrained on AudioSet for the GTZAN music classification benchmark.'
      },
      {
        title: 'Engineering & Training Optimization',
        bullets: [
          'Engineered a robust audio preprocessing pipeline extracting 128-band log Mel spectrograms with dynamic 10-second temporal sampling.',
          'Implemented SpecAugment (frequency masking up to 24 Mel bands and time masking up to 96 frames) to strongly regularize representation learning on small datasets.',
          'Addressed strict GPU VRAM limits by integrating Gradient Checkpointing and Gradient Accumulation.',
          'Applied Layer-wise Learning Rate Decay (LLRD) to preserve low-level audio representation filters while adapting higher-level classification heads.',
          'Utilized Label Smoothing (ε = 0.1) to prevent overconfident posteriors and improve generalization.'
        ]
      },
      {
        title: 'Key Results',
        bullets: [
          'Outperformed standard CNN baselines in classification accuracy and feature stability under identical training conditions.',
          'Demonstrated reliable transfer learning dynamics from self-supervised spectrogram representations.'
        ]
      },
      {
        title: 'Technologies & Frameworks',
        chips: ['Python', 'PyTorch', 'Hugging Face', 'Transformers', 'SpecAugment', 'Gradient Checkpointing', 'LLRD', 'GTZAN']
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
    sections: [
      {
        title: 'Problem & Research Context',
        text: 'Large Language Models are prone to hallucinating factual relations, particularly in dense technical and pedagogical domains where conceptual precision is critical. This Master\'s research investigated how graph databases (Neo4j) can ground generative models with explicit topological knowledge.'
      },
      {
        title: 'System Architecture & Implementation',
        bullets: [
          'Designed a hybrid Graph-RAG pipeline combining vector similarity search (ChromaDB embeddings) with Cypher graph queries on Neo4j.',
          'Built structured multi-hop reasoning chains with LangChain and LangGraph to traverse semantic relationships between concepts.',
          'Employed Pydantic for rigid schema validation of generated answers, ensuring structured pedagogical output.',
          'Configured local LLM execution using Ollama to evaluate latency and privacy trade-offs against commercial API endpoints.'
        ]
      },
      {
        title: 'Impact & Evaluation',
        bullets: [
          'Demonstrated drastic reduction in hallucinated relationships across educational concept benchmarks.',
          'Produced explainable citation paths showing the exact graph entities and edges justifying the LLM response.'
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
    sections: [
      {
        title: 'Context & Challenge',
        text: 'Coordinating autonomous agents in competitive, adversarial, and partially observable environments requires dynamic resource allocation, resilient communication, and decentralized decision-making without a central coordinator.'
      },
      {
        title: 'Architecture & Design Patterns',
        bullets: [
          'Engineered an asynchronous message-passing communication layer with dynamic message priority queues in Java.',
          'Implemented Hierarchical State Machines (HSMs) for agent role switching (scouting, foraging, threat response, defensive posture).',
          'Designed stigmergic perimeter patrolling algorithms mimicking biological swarm intelligence for coverage optimization.',
          'Implemented kinematics-based predictive aiming to intercept moving adversarial targets in real-time simulation.'
        ]
      },
      {
        title: 'System Performance',
        bullets: [
          'Achieved robust operational continuity under packet latency and agent attrition.',
          'Demonstrated superior foraging throughput and tactical win-rates against baseline heuristics.'
        ]
      },
      {
        title: 'Technologies & Frameworks',
        chips: ['Java', 'Processing', 'Hierarchical State Machines', 'Asynchronous Message Passing', 'Distributed AI', 'Multi-Agent Systems']
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
    sections: [
      {
        title: 'Problem & Objective',
        text: 'A quantitative benchmark investigating the empirical convergence, stability, and exploration trade-offs between On-Policy TD learning (SARSA) and Off-Policy TD learning (Q-Learning) in stochastic environments (Gymnasium Blackjack-v1).'
      },
      {
        title: 'Methodology & Benchmarking Suite',
        bullets: [
          'Engineered tabular RL implementations with epsilon-decay schedules and reward tracking over millions of training episodes.',
          'Developed a "True Skill" evaluation pipeline to isolate policy maturity from exploration noise, evaluating greedy action policies.',
          'Visualized decision boundaries with policy heatmaps across 1,500+ states (player sum vs dealer showing card vs usable ace).',
          'Built a seed-synchronized CLI benchmarking tool comparing learned policies directly against mathematically optimal human basic strategy tables under identical RNG seeds.'
        ]
      },
      {
        title: 'Findings',
        bullets: [
          'Proved empirical convergence to theoretical game-theoretic optimality.',
          'Quantified that Q-Learning converges to optimal state values faster, whereas SARSA demonstrates smoother learning curves with lower variance during online exploration.'
        ]
      },
      {
        title: 'Technologies & Frameworks',
        chips: ['Python', 'Gymnasium', 'SARSA', 'Q-Learning', 'True Skill', 'Policy Heatmaps', 'CLI Benchmarking']
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
    sections: [
      {
        title: 'Context & Scientific Modeling',
        text: 'Simulating evolutionary dynamics and emergent cooperation in the Spatial Prisoner\'s Dilemma on large 2D toroidal grids typically suffers from severe CPU bottleneck when implemented via iterative loops.'
      },
      {
        title: 'Algorithmic Optimization & Architecture',
        bullets: [
          'Engineered a high-performance simulation engine utilizing 2D NumPy and SciPy spatial convolutions (`scipy.signal.convolve2d`) for vectorized neighborhood payoff computation across 128x128 agent lattices, achieving a ~50x speedup over iterative implementations.',
          'Implemented classic and nuanced game theory strategies: Tit-for-Tat, Pavlov (Win-Stay, Lose-Shift), Contrite TFT, Always Defect, Always Cooperate.',
          'Engineered real-time interactive GUI monitoring phase transitions, Lyapunov cluster dynamics, and population survival rates over 20,000+ generations.'
        ]
      },
      {
        title: 'Technologies & Frameworks',
        chips: ['Python', 'NumPy', 'SciPy', 'Vectorized Convolutions', 'Spatial Simulation', 'Evolutionary Game Theory', 'Interactive GUI']
      }
    ],
    links: [
      { text: 'View GitHub Repository', url: 'https://github.com/dhiaelhakmokhtari/Idea-Propagation-MultiAgent-Systems', icon: 'fab fa-github' }
    ]
  }
};

const modal = document.getElementById('caseStudyModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalBadge = document.getElementById('modalBadge');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalBody = document.getElementById('modalBody');
const modalFooter = document.getElementById('modalFooter');

function openCaseStudy(projectId) {
  const data = caseStudies[projectId];
  if (!data || !modal) return;

  modalBadge.textContent = data.badge;
  modalTitle.textContent = data.title;
  modalMeta.textContent = data.meta;

  // Render sections
  let html = '';
  data.sections.forEach(sec => {
    html += `<div class="modal-section">`;
    html += `<h4 class="modal-section-title"><i class="fas fa-chevron-right"></i> ${sec.title}</h4>`;
    if (sec.text) {
      html += `<p>${sec.text}</p>`;
    }
    if (sec.bullets) {
      html += `<ul>`;
      sec.bullets.forEach(b => { html += `<li>${b}</li>`; });
      html += `</ul>`;
    }
    if (sec.chips) {
      html += `<div class="modal-chips">`;
      sec.chips.forEach(c => { html += `<span class="modal-chip">${c}</span>`; });
      html += `</div>`;
    }
    html += `</div>`;
  });
  modalBody.innerHTML = html;

  // Render footer links
  let footerHtml = '';
  if (data.links && data.links.length > 0) {
    data.links.forEach(l => {
      if (l.disabled) {
        footerHtml += `<span class="btn btn-ghost" style="opacity:0.65; cursor:default;"><i class="${l.icon}"></i> ${l.text}</span>`;
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

// Bind modal trigger buttons
document.querySelectorAll('.open-case-study').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const pid = btn.dataset.project;
    openCaseStudy(pid);
  });
});

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// ── TOAST & COPY EMAIL ───────────────────────────────────────
const toast = document.getElementById('toast');
function showToast(message) {
  if (!toast) return;
  toast.innerHTML = `<i class="fas fa-check-circle" style="color:#22c55e;"></i> ${message}`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function copyEmailAddress() {
  const email = 'dhiaelhakmokhtari@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    showToast('Email address copied to clipboard: ' + email);
    const copyText = document.getElementById('copyEmailText');
    if (copyText) {
      const orig = copyText.textContent;
      copyText.textContent = 'Copied!';
      setTimeout(() => { copyText.textContent = orig; }, 2000);
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
        if (ghRepoSpan) {
          ghRepoSpan.innerHTML = `<i class="fas fa-code-branch"></i> ${data.public_repos} repos`;
        }
      }
      if (data.followers !== undefined) {
        const followerSpan = document.querySelector('.gh-stats span:nth-child(2)');
        if (followerSpan) {
          followerSpan.innerHTML = `<i class="fas fa-users"></i> ${data.followers} followers`;
        }
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
    if (modal && modal.classList.contains('active')) {
      closeModal();
    }
    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  }
});
