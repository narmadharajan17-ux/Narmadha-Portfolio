const contactForm = document.getElementById('contactForm');
const navToggle = document.getElementById('navToggle');
const siteNav = document.querySelector('.site-nav');
const particleCanvas = document.getElementById('particleCanvas');
const themeToggle = document.getElementById('themeToggle');
let particleColor = '255,255,255';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  updateParticleColorForTheme(theme);
  if (themeToggle) themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function loadTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) applyTheme(saved);
  else applyTheme('dark');
}

function toggleNavigation() {
  if (!siteNav || !navToggle) return;
  const isOpen = siteNav.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
}

function closeNavigation() {
  if (!navToggle || !siteNav) return;
  siteNav.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

function resizeCanvas() {
  if (!particleCanvas) return;
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}

function createParticles(count = 80) {
  const particles = [];
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 1 + Math.random() * 2,
      velocityX: (Math.random() - 0.5) * 0.5,
      velocityY: (Math.random() - 0.5) * 0.5,
      alpha: 0.2 + Math.random() * 0.25,
    });
  }
  return particles;
}

function updateParticleColorForTheme(theme) {
  // Use white-ish particles for dark mode, and a subtle primary-blue for light mode
  if (theme === 'dark') particleColor = '255,255,255';
  else particleColor = '37,99,235';
}

function drawParticles(ctx, particles) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  particles.forEach((particle) => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${particleColor}, ${particle.alpha})`;
    ctx.fill();
  });
}

function updateParticles(particles) {
  particles.forEach((particle) => {
    particle.x += particle.velocityX;
    particle.y += particle.velocityY;

    if (particle.x < -50) particle.x = window.innerWidth + 50;
    if (particle.x > window.innerWidth + 50) particle.x = -50;
    if (particle.y < -50) particle.y = window.innerHeight + 50;
    if (particle.y > window.innerHeight + 50) particle.y = -50;
  });
}

function animateParticles(particles, ctx) {
  if (!ctx) return;
  drawParticles(ctx, particles);
  updateParticles(particles);
  requestAnimationFrame(() => animateParticles(particles, ctx));
}

function initParticles() {
  if (!particleCanvas) return;
  const ctx = particleCanvas.getContext('2d');
  if (!ctx) return;
  const particles = createParticles(90);
  resizeCanvas();
  animateParticles(particles, ctx);
}

function applyGlowSetting(enabled) {
  if (enabled) {
    document.documentElement.classList.remove('no-glow');
    localStorage.setItem('portfolio-glow', 'on');
  } else {
    document.documentElement.classList.add('no-glow');
    localStorage.setItem('portfolio-glow', 'off');
  }
}

function loadGlowSetting() {
  const saved = localStorage.getItem('portfolio-glow');
  if (saved === 'off') applyGlowSetting(false);
  else applyGlowSetting(true);
}

if (navToggle) {
  navToggle.addEventListener('click', toggleNavigation);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });
}

if (siteNav) {
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNavigation);
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !message) {
      alert('Please complete all fields before sending your message.');
      return;
    }

    alert(`Thanks for reaching out, ${name}! I will review your message and be in touch soon.`);
    contactForm.reset();
  });
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  loadGlowSetting();
  initParticles();
});
