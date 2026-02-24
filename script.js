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

const workItems = document.querySelectorAll('.work-item');
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const isMobileViewport = window.matchMedia('(max-width: 720px)').matches;

const clearFocus = (except) => {
  workItems.forEach((item) => {
    if (item === except) return;
    if (item.classList.contains('is-focus')) {
      item.classList.remove('is-focus');
    }
  });
};

if (isFinePointer) {
  workItems.forEach((item) => {
    item.addEventListener('pointerenter', () => {
      clearFocus(item);
      item.classList.add('is-focus');
    });

    item.addEventListener('pointerleave', () => {
      item.classList.remove('is-focus');
    });

    item.addEventListener('focusin', () => {
      clearFocus(item);
      item.classList.add('is-focus');
    });

    item.addEventListener('focusout', () => {
      item.classList.remove('is-focus');
    });
  });
}

if (isMobileViewport && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const ratio = entry.intersectionRatio || 0;
        const isVisible = entry.target.classList.contains('is-visible');

        if (entry.isIntersecting && (ratio >= 0.32 || !isVisible)) {
          entry.target.style.setProperty('--reveal-delay', '0ms');
          entry.target.classList.add('is-visible');
        } else if (!entry.isIntersecting || ratio <= 0.06) {
          entry.target.classList.remove('is-visible');
        }
      });
    },
    { threshold: [0, 0.06, 0.2, 0.32, 0.5], rootMargin: '0px 0px -10% 0px' }
  );

  workItems.forEach((item) => observer.observe(item));
} else {
  workItems.forEach((item) => item.classList.add('is-visible'));
}

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
