/* ═══════════════════════════════════════════════
   EL PARCHE BAR — app.js
   Interactions, Animations & Conversion Logic
═══════════════════════════════════════════════ */

'use strict';

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initParticles();
  initContactForm();
  initCounters();
  initGalleryZoom();
  initServiceCardHover();
});

/* ══════════════════════════════════════
   NAV — scroll effect + mobile toggle
══════════════════════════════════════ */
function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');

  // Scroll class
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 30);
  }, { passive: true });

  // Mobile toggle
  burger.addEventListener('click', () => {
    const isOpen = mobile.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', isOpen);
    // Animate burger bars
    const bars = burger.querySelectorAll('span');
    if (isOpen) {
      bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
    }
  });

  // Close mobile on link click
  mobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobile.classList.remove('is-open');
      const bars = burger.querySelectorAll('span');
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    });
  });

  // Smooth scroll for nav anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════════════
   REVEAL — Intersection Observer
══════════════════════════════════════ */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════
   PARTICLES — floating neon dots
══════════════════════════════════════ */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const COUNT = 30;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 8;
    const delay = Math.random() * 15;
    const hue = Math.random() > 0.5 ? '195, 100%, 60%' : '210, 100%, 55%';
    Object.assign(p.style, {
      width:  size + 'px',
      height: size + 'px',
      left:   left + '%',
      animationDuration:  duration + 's',
      animationDelay:     delay + 's',
      background: `hsl(${hue})`,
      boxShadow: `0 0 ${size * 4}px hsl(${hue})`
    });
    container.appendChild(p);
  }
}

/* ══════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════ */
function initCounters() {
  const stats = document.querySelectorAll('.hero__stat-num');
  const targets = [200, 5, 50];

  const animate = (el, target, suffix) => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
        return;
      }
      el.textContent = start + suffix;
    }, 40);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stats.forEach((el, i) => {
          const suffixes = ['+', '★', '+'];
          animate(el, targets[i], suffixes[i]);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) observer.observe(heroStats);
}

/* ══════════════════════════════════════
   CONTACT FORM — WhatsApp redirect
══════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('[name="name"]').value.trim();
    const phone   = form.querySelector('[name="phone"]').value.trim();
    const event   = form.querySelector('[name="event"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    // Validate
    if (!name || !phone) {
      showFormError(form, 'Por favor completa nombre y teléfono.');
      return;
    }

    // Build WhatsApp message
    const lines = [
      '🍸 *Nueva Reserva — El Parche Bar*',
      '',
      `👤 *Nombre:* ${name}`,
      `📞 *Teléfono:* ${phone}`,
    ];
    if (event) lines.push(`🎉 *Evento:* ${event}`);
    if (message) lines.push(`📝 *Detalles:* ${message}`);
    lines.push('', '_(Enviado desde elparchebar.com)_');

    const waText = encodeURIComponent(lines.join('\n'));
    const waURL  = `https://wa.me/573001234567?text=${waText}`;

    // Open WhatsApp
    window.open(waURL, '_blank', 'noopener,noreferrer');

    // Feedback
    showFormSuccess(form);
    form.reset();
  });
}

function showFormError(form, msg) {
  removeFormMessages(form);
  const div = document.createElement('div');
  div.className = 'form-msg form-msg--error';
  div.style.cssText = `
    background: rgba(255,60,60,0.1);
    border: 1px solid rgba(255,60,60,0.3);
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 0.875rem;
    color: #ff6b6b;
    margin-top: 4px;
  `;
  div.textContent = msg;
  form.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

function showFormSuccess(form) {
  removeFormMessages(form);
  const div = document.createElement('div');
  div.className = 'form-msg form-msg--success';
  div.style.cssText = `
    background: rgba(0,200,100,0.1);
    border: 1px solid rgba(0,200,100,0.3);
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 0.875rem;
    color: #00e676;
    text-align: center;
  `;
  div.innerHTML = '✅ ¡Redirigiendo a WhatsApp! Responderemos en menos de 1 hora.';
  form.appendChild(div);
  setTimeout(() => div.remove(), 6000);
}

function removeFormMessages(form) {
  form.querySelectorAll('.form-msg').forEach(m => m.remove());
}

/* ══════════════════════════════════════
   GALLERY — keyboard / touch zoom
══════════════════════════════════════ */
function initGalleryZoom() {
  const items = document.querySelectorAll('.gallery__item');
  items.forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Could open lightbox here
      }
    });
  });
}

/* ══════════════════════════════════════
   SERVICE CARDS — neon glow on hover
══════════════════════════════════════ */
function initServiceCardHover() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
}

/* ══════════════════════════════════════
   NAVBAR ACTIVE LINK — highlight section
══════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));

  // Style for active link
  const style = document.createElement('style');
  style.textContent = `.nav__links a.active { color: var(--c-neon); }
  .nav__links a.active::after { width: 100%; }`;
  document.head.appendChild(style);
})();

/* ══════════════════════════════════════
   PERF — lazy load placeholder images
══════════════════════════════════════ */
(function lazyVisuals() {
  // Enhance service card images with subtle animated gradients
  const serviceImgs = document.querySelectorAll('.service-card__img, .gallery__img');
  serviceImgs.forEach((el, i) => {
    el.style.animationDelay = (i * 0.3) + 's';
  });

  // Add shimmer to about image
  const aboutImg = document.querySelector('.about__img');
  if (aboutImg) {
    aboutImg.style.background =
      'linear-gradient(145deg, #0a1628 0%, #0d2a4a 50%, #061020 100%)';
  }
})();

/* ══════════════════════════════════════
   FLOATING CTA — show after scroll
══════════════════════════════════════ */
(function initFloatingCTA() {
  const waFloat = document.querySelector('.wa-float');
  if (!waFloat) return;

  let visible = false;
  window.addEventListener('scroll', () => {
    const shouldShow = window.scrollY > 400;
    if (shouldShow !== visible) {
      visible = shouldShow;
      waFloat.style.opacity = visible ? '1' : '0';
      waFloat.style.transform = visible ? 'scale(1)' : 'scale(0.8)';
      waFloat.style.pointerEvents = visible ? 'auto' : 'none';
    }
  }, { passive: true });

  // Initial state
  waFloat.style.opacity = '0';
  waFloat.style.transform = 'scale(0.8)';
  waFloat.style.pointerEvents = 'none';
  waFloat.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
})();
