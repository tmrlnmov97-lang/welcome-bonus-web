// Bonuses page interactions: FAQ accordion, reminders, product tabs, promo code states, carousel dots.

// FAQ accordion
document.querySelectorAll('.faq__question').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq');
    const open = !item.classList.contains('is-open');
    item.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
  });
});

// Upcoming: Remind me ↔ Reminder set
document.querySelectorAll('[data-remind]').forEach((button) => {
  button.addEventListener('click', () => {
    const on = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(on));
    button.querySelector('span').textContent = on ? 'Reminder set' : 'Remind me';
  });
});

// Product tabs filter cards by category; empty sections hide, counters follow
const tabs = document.querySelectorAll('.tab');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    const filter = tab.dataset.filter;
    document.querySelectorAll('[data-category]').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
    document.querySelectorAll('[data-section]').forEach((section) => {
      const visible = section.querySelectorAll('[data-category]:not([hidden])').length;
      section.hidden = visible === 0;
      const count = section.querySelector('[data-count]');
      if (count) count.textContent = String(visible);
    });
  });
});

// Promo code: default → filled → loading → applied | error
const VALID_CODES = ['WELCOME50'];
const promo = document.querySelector('.promo');
const input = promo.querySelector('.promo__input');
const apply = promo.querySelector('.promo__apply');
const clear = promo.querySelector('.promo__clear');
const icon = promo.querySelector('.promo__icon');
const message = promo.querySelector('.promo__message');

function setPromoState(state) {
  promo.dataset.state = state;
  const busy = state === 'loading' || state === 'applied';
  input.readOnly = busy;
  apply.disabled = state === 'default' || state === 'loading';
  apply.innerHTML = state === 'loading' ? '<span class="spinner" aria-label="Checking"></span>' : 'Apply';
  icon.src = state === 'applied' ? 'assets/check-green.svg' : 'assets/promo-tag.svg';
  message.textContent =
    state === 'error' ? 'Code not found or expired' : state === 'applied' ? 'Bonus added to Available' : '';
}

input.addEventListener('input', () => {
  input.value = input.value.toUpperCase();
  setPromoState(input.value.trim() ? 'filled' : 'default');
});

function submitPromo() {
  if (apply.disabled) return;
  setPromoState('loading');
  setTimeout(() => {
    setPromoState(VALID_CODES.includes(input.value.trim()) ? 'applied' : 'error');
  }, 900);
}

apply.addEventListener('click', submitPromo);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') submitPromo();
});
clear.addEventListener('click', () => {
  input.value = '';
  setPromoState('default');
  input.focus();
});

// Welcome carousel dots (mobile)
document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const dots = document.querySelectorAll(`[data-dots="${carousel.dataset.carousel}"] .dot`);
  if (!dots.length) return;
  carousel.addEventListener(
    'scroll',
    () => {
      const card = carousel.firstElementChild;
      const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(carousel).columnGap || 12);
      const index = Math.min(dots.length - 1, Math.round(carousel.scrollLeft / step));
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    },
    { passive: true },
  );
});
