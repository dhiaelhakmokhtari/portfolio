/* ============================================================
   DHIA MOKHTARI PORTFOLIO – script.js
   All interactivity: preloader, particles, cursor, nav,
   typewriter, counters, scroll reveal, project filters,
   contact form (Formspree), GitHub API
   ============================================================ */

'use strict';

// ── PRELOADER ────────────────────────────────────────────────
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('done');
  }, 1800);
});

// ── SCROLL PROGRESS BAR ──────────────────────────────────────
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const st = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(st / docH) * 100}%`;
}, { passive: true });

// ── HERO PARTICLES ───────────────────────────────────────────
const canvas = document.getElementById('heroParticles');
if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;
  let mouse = { x: -1000, y: -1000 };

  function resizeCanvas() {
    const hero = canvas.parentElement;
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
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
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interaction — gentle repulsion
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 0.3;
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
        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.12;
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
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Grow on interactive elements
  const interactives = 'a, button, input, textarea, .project-card, .skill-group';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorFollower.style.width = '56px';
      cursorFollower.style.height = '56px';
    });
    el.addEventListener('mouseleave', () => {
      cursorFollower.style.width = '32px';
      cursorFollower.style.height = '32px';
    });
  });
}

// ── NAVBAR ───────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  // Back to top
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

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

// Close mobile menu on link click
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => observer.observe(s));

// ── TYPEWRITER ───────────────────────────────────────────────
const phrases = [
  'R&D ML Engineer @ IFPEN',
  'Deep Learning Researcher',
  'LLM & Knowledge Graph Explorer',
  'Multi-Agent Systems Builder',
  'Master\'s @ Paris-Saclay',
];
let pIdx = 0, cIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typewrite() {
  const phrase = phrases[pIdx];
  if (deleting) {
    cIdx--;
    typeEl.textContent = phrase.slice(0, cIdx);
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(typewrite, 500); return; }
    setTimeout(typewrite, 40);
  } else {
    cIdx++;
    typeEl.textContent = phrase.slice(0, cIdx);
    if (cIdx === phrase.length) { deleting = true; setTimeout(typewrite, 2500); return; }
    setTimeout(typewrite, 75);
  }
}
setTimeout(typewrite, 800);

// ── SCROLL REVEAL ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${(i % 4) * 0.08}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── COUNTER ANIMATION ────────────────────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ── LANGUAGE BAR ANIMATION ───────────────────────────────────
const langObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.lang-fill').forEach(fill => {
        fill.style.animation = 'none';
        fill.offsetHeight; // reflow
        fill.style.animation = '';
      });
      langObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const langSection = document.querySelector('.github-langs');
if (langSection) langObserver.observe(langSection);

// ── PROJECT FILTER ───────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) {
        // Re-trigger reveal
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      }
    });
  });
});

// ── GITHUB AVATAR & LIVE STATS ───────────────────────────────
const ghAvatar = document.getElementById('ghAvatar');
if (ghAvatar) {
  fetch('https://api.github.com/users/dhiaelhakmokhtari')
    .then(r => r.json())
    .then(data => {
      if (data.avatar_url) ghAvatar.src = data.avatar_url;
      // Update live stats if available
      if (data.public_repos) {
        const reposEl = document.querySelector('#stat-repos .stat-number');
        if (reposEl) reposEl.dataset.target = data.public_repos;
        // Also update the GitHub section text
        const ghRepoSpan = document.querySelector('.gh-stats');
        if (ghRepoSpan) {
          const repoText = ghRepoSpan.querySelector('span:first-child');
          if (repoText) repoText.innerHTML = `<i class="fas fa-code-branch"></i> ${data.public_repos} repos`;
        }
      }
      if (data.followers) {
        const ghRepoSpan = document.querySelector('.gh-stats');
        if (ghRepoSpan) {
          const followerText = ghRepoSpan.querySelector('span:nth-child(2)');
          if (followerText) followerText.innerHTML = `<i class="fas fa-users"></i> ${data.followers} followers`;
        }
      }
    })
    .catch(() => {});
}

// ── CONTACT FORM (EmailJS with mailto fallback) ──────────────
// ⚠️  REPLACE THESE 3 VALUES with your EmailJS credentials:
//     1. Go to https://www.emailjs.com/ → sign up (free)
//     2. Add an Email Service (Gmail) → copy the SERVICE_ID
//     3. Create an Email Template → copy the TEMPLATE_ID
//     4. Go to Account → copy your PUBLIC_KEY
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';   // ← replace
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';   // ← replace
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // ← replace

// Initialize EmailJS
if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const submitBtn = document.getElementById('submitContactBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    // Simple validation
    if (!name || !email || !message) {
      formNote.textContent = '⚠ Please fill in all required fields.';
      formNote.className = 'form-note error';
      return;
    }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      formNote.textContent = '⚠ Please enter a valid email address.';
      formNote.className = 'form-note error';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    try {
      // EmailJS template variables: from_name, from_email, subject, message
      const templateParams = {
        from_name: name,
        from_email: email,
        subject: contactForm.subject.value.trim() || 'Portfolio Contact',
        message: message,
        to_name: 'Dhia',
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

      formNote.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
      formNote.className = 'form-note success';
      contactForm.reset();
    } catch (err) {
      console.warn('EmailJS failed, falling back to mailto:', err);
      // Fallback to mailto
      const subject = contactForm.subject.value.trim() || 'Portfolio Contact';
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      const mailtoUrl = `mailto:dhiaelhakmokhtari@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
      formNote.textContent = '↗ Opening your email client — or email me directly at dhiaelhakmokhtari@gmail.com';
      formNote.className = 'form-note success';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
  });
}

// ── BACK TO TOP ──────────────────────────────────────────────
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── SMOOTH ANCHOR SCROLL ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── KEYBOARD ACCESSIBILITY ───────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});
