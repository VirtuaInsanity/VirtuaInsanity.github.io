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
const worksSection = document.querySelector('#works');
const main = document.querySelector('main');

if (isMobileViewport && worksSection && main) {
  main.appendChild(worksSection);
}

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
        if (entry.isIntersecting) {
          entry.target.style.setProperty('--reveal-delay', '0ms');
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    },
    { threshold: 0.01, rootMargin: '0px 0px -2% 0px' }
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

const workImages = document.querySelectorAll('.works-grid picture img');
workImages.forEach((img) => {
  img.loading = 'eager';
  img.decoding = 'async';
  img.fetchPriority = 'high';

  const forceFallback = () => {
    const picture = img.closest('picture');
    if (picture) {
      picture.querySelectorAll('source').forEach((source) => source.remove());
    }
    const fallback = img.getAttribute('src');
    if (fallback && img.src !== fallback) {
      img.src = fallback;
    }
  };

  img.addEventListener('error', forceFallback, { once: true });

  if (img.complete && img.naturalWidth === 0) {
    forceFallback();
  }
});
