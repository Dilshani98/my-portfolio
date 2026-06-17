/* ============================================================
   DILSHANI SENANAYAKE — PORTFOLIO
   index.js
   ============================================================ */

'use strict';

/* ── Loader ──────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 500);
});

/* ── Particle canvas background ─────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const particles = [];
  const PARTICLE_COUNT = 60;
  const COLORS = ['#6c63ff', '#00d4aa', '#ff6584'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      r:  Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

/* ── Typed text in hero ─────────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Software Engineer',
    'Full-Stack Developer',
    'Cloud Engineer (AZ-104)',
    'Microservices Architect',
    'React & Node.js Developer',
    'Python / FastAPI Developer',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  const SPEED_TYPE   = 80;
  const SPEED_DELETE = 45;
  const PAUSE_AFTER  = 2000;
  const PAUSE_BEFORE = 400;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        return setTimeout(tick, PAUSE_AFTER);
      }
      return setTimeout(tick, SPEED_TYPE);
    }

    el.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      return setTimeout(tick, PAUSE_BEFORE);
    }
    setTimeout(tick, SPEED_DELETE);
  }

  tick();
})();

/* ── Navbar: scroll shadow + active-section highlight ───────── */
(function initNav() {
  const navbar  = document.getElementById('navbar');
  const links   = document.querySelectorAll('.nav__link[data-section]');
  const sections = Array.from(document.querySelectorAll('section[id], header[id]'));

  function onScroll() {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else                      navbar.classList.remove('scrolled');

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile nav toggle ──────────────────────────────────────── */
(function initMobileNav() {
  const toggle   = document.getElementById('nav-toggle');
  const navItems = document.getElementById('nav-items');
  if (!toggle || !navItems) return;

  toggle.addEventListener('click', () => {
    const open = navItems.classList.toggle('mobile-open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  navItems.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navItems.classList.remove('mobile-open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      navItems.classList.remove('mobile-open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ── Scroll-reveal (Intersection Observer) ──────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => obs.observe(el));
})();

/* ── Counter animation in About stats ───────────────────────── */
(function initCounters() {
  const cards = document.querySelectorAll('.stat-card[data-count]');
  if (!cards.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card   = entry.target;
      const target = parseInt(card.dataset.count, 10);
      const el     = card.querySelector('.counter');
      if (!el) return;

      let start = 0;
      const duration = 1400;
      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - (1 - progress) * (1 - progress);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      obs.unobserve(card);
    });
  }, { threshold: 0.4 });

  cards.forEach(c => obs.observe(c));
})();

/* ── Skills tab filter ──────────────────────────────────────── */
(function initSkillsTabs() {
  const tabs   = document.querySelectorAll('.skills__tab');
  const groups = document.querySelectorAll('.skill-group[data-category]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('skills__tab--active'));
      tab.classList.add('skills__tab--active');

      const filter = tab.dataset.tab;
      groups.forEach(g => {
        if (filter === 'all' || g.dataset.category === filter) {
          g.classList.remove('hidden');
        } else {
          g.classList.add('hidden');
        }
      });
    });
  });
})();

/* ── Projects filter ────────────────────────────────────────── */
(function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card[data-tags]');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const tags = card.dataset.tags || '';
        if (filter === 'all' || tags.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ── Back-to-top button ─────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 480);
  }, { passive: true });
})();

/* ── Smooth hover tilt on project cards ─────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.project-card');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      card.style.transform = `translateY(-8px) rotateX(${-y}deg) rotateY(${x}deg)`;
      card.style.transition = 'transform .1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .35s ease, border-color .28s ease, box-shadow .28s ease';
    });
  });
})();

/* ── Keyboard accessibility ───────────────────────────────────── */
(function initA11y() {
  window.addEventListener('keydown', function onFirstTab(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', onFirstTab);
    }
  });
  window.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
  });
})();