import { animateCount } from './utils.js';
import { initGitHubSection } from './github.js';
import { initProjectsSection } from './projects.js';
import { initDashboardSection } from './dashboard.js';
import { initGallerySection } from './gallery.js';
import { initContactSection } from './contact.js';
import { initAnimations } from './animations.js';
import { initContentSection } from './content.js';

const STATS_CONFIG = { projects: 5, technologies: 18, dashboards: 4, analyses: 12 };

function initStatsSection() {
  const statsGrid = document.getElementById('statsGrid');
  if (!statsGrid) return;

  const stats = [
    { label: 'Projets réalisés', value: STATS_CONFIG.projects },
    { label: 'Technologies maîtrisées', value: STATS_CONFIG.technologies },
    { label: 'Dashboards livrés', value: STATS_CONFIG.dashboards },
    { label: 'Analyses effectuées', value: STATS_CONFIG.analyses },
  ];

  stats.forEach((stat) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `<div class="stat-num" data-count="${stat.value}">0</div><div class="stat-label">${stat.label}</div>`;
    statsGrid.appendChild(card);
  });

  const statIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach((node) => animateCount(node, Number(node.dataset.count), 1200));
        statIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statIo.observe(statsGrid);
}

function initNavigation() {
  const scrollBar = document.getElementById('scrollBar');
  const backTop = document.getElementById('backTop');
  const navLinks = document.querySelectorAll('#navlinks a');
  const sections = [...navLinks].map((link) => document.getElementById(link.dataset.sec)).filter(Boolean);

  const onScroll = () => {
    const html = document.documentElement;
    const scrolled = (html.scrollTop / (html.scrollHeight - html.clientHeight)) * 100;
    scrollBar.style.width = `${Number.isFinite(scrolled) ? scrolled : 0}%`;
    backTop.classList.toggle('show', html.scrollTop > 600);

    let current = sections[0];
    sections.forEach((section) => {
      if (section && window.scrollY >= section.offsetTop - 140) current = section;
    });

    navLinks.forEach((link) => link.classList.toggle('active', current && link.dataset.sec === current.id));
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  backTop.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  onScroll();
}

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? '' : 'light');
    themeToggle.textContent = isLight ? '◐' : '◑';
  });
}

function initCursor() {
  const cursorDot = document.getElementById('cursorDot');
  if (!cursorDot || !window.matchMedia('(hover:hover)').matches) return;

  document.addEventListener('mousemove', (event) => {
    cursorDot.style.left = `${event.clientX}px`;
    cursorDot.style.top = `${event.clientY}px`;
    cursorDot.classList.add('show');
  });

  document.querySelectorAll('a, button, .proj, .fact, .tl-item, .cert-card, .why-card, .stat-card').forEach((element) => {
    element.addEventListener('mouseenter', () => cursorDot.classList.add('big'));
    element.addEventListener('mouseleave', () => cursorDot.classList.remove('big'));
  });
}

function initHeroRotator() {
  const roles = ['Business Intelligence', 'Reporting & KPI', 'Data Cleaning', 'Machine Learning'];
  const roleEl = document.getElementById('roleRotator');
  if (!roleEl) return;

  let index = 0;
  setInterval(() => {
    index = (index + 1) % roles.length;
    roleEl.style.opacity = '0';
    window.setTimeout(() => {
      roleEl.textContent = roles[index];
      roleEl.style.opacity = '1';
    }, 300);
  }, 2400);
}

function initParticleCanvas() {
  const canvas = document.getElementById('particles');
  const hero = document.querySelector('.hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let particles = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const resize = () => {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  };

  const initParticles = () => {
    particles = [];
    const count = Math.min(60, Math.floor(width / 22));
    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const maxDist = 130;
    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79,179,160,0.55)';
      ctx.fill();

      for (let next = index + 1; next < particles.length; next += 1) {
        const other = particles[next];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(227,169,59,${(1 - dist / maxDist) * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  };

  resize();
  initParticles();
  if (!reduceMotion) draw();
  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
}

async function bootstrap() {
  initStatsSection();
  initNavigation();
  initThemeToggle();
  initCursor();
  initHeroRotator();
  initParticleCanvas();
  initAnimations();
  await initContentSection();
  await initProjectsSection();
  await initDashboardSection();
  await initGallerySection();
  initContactSection();
  await initGitHubSection();
}

bootstrap();
