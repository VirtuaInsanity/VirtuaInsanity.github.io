const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const header = document.querySelector('.site-header');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
}

document.querySelectorAll('.faq-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    item.classList.toggle('open');
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 720 && nav) {
      nav.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  });
});

const isMobileViewport = window.matchMedia('(max-width: 720px)').matches;


if (header && isMobileViewport) {
  requestAnimationFrame(() => header.classList.add('header-animated'));
  let lastY = window.scrollY;
  let currentY = lastY;
  let ticking = false;
  const revealThreshold = 64;

  const applyHeaderState = () => {
    const y = currentY;
    const navOpen = nav && nav.classList.contains('open');
    const delta = y - lastY;

    if (y <= 8 || navOpen) {
      header.classList.remove('header-hidden');
      lastY = y;
      ticking = false;
      return;
    }

    if (delta > 6 && y > revealThreshold) {
      header.classList.add('header-hidden');
    } else if (delta < -4) {
      header.classList.remove('header-hidden');
    }

    lastY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    currentY = window.scrollY;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(applyHeaderState);
  }, { passive: true });
}
