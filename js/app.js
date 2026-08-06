// ---------- DOM References ----------
const modalButtons = document.querySelectorAll('[data-open-modal]');
const closeButtons = document.querySelectorAll('[data-close-modal]');
const modalBackdrops = document.querySelectorAll('.modal-backdrop');
const contactForm = document.getElementById('contactForm');
const statusMessage = document.querySelector('.form-status');
const year = document.getElementById('year');
const backToTopButton = document.getElementById('backToTop');
const themeToggle = document.getElementById('themeToggle');
const themeToggleLabel = document.querySelector('.theme-switch-label');
const langTHButton = document.getElementById('langTH');
const langENButton = document.getElementById('langEN');
const brandLogo = document.querySelector('.brand-logo');
const heroCard = document.querySelector('.hero-card');
const root = document.documentElement;

// ---------- Content Store ----------
const contentStore = window.JUMPFIRST_CONTENT || {};
const translations = contentStore.translations || { th: {}, en: {} };
const textBindings = contentStore.textBindings || [];
const placeholderBindings = contentStore.placeholderBindings || [];

// ---------- Theme / Language State ----------
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const darkLogoSrc = 'assets/logos/jumpfirst-logo.svg';
const lightLogoSrc = 'assets/logos/jumpfirst-logo-lightmode.svg';
let currentLanguage = 'th';

function getText(locale, key) {
  return translations[locale]?.[key] || '';
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
}

function setPlaceholder(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute('placeholder', value);
  }
}

function applyTextBindings(locale) {
  textBindings.forEach(([selector, key]) => {
    setText(selector, getText(locale, key));
  });
}

function applyPlaceholderBindings(locale) {
  placeholderBindings.forEach(([selector, key]) => {
    setPlaceholder(selector, getText(locale, key));
  });
}

function updateBrandLogo(theme) {
  if (!brandLogo) {
    return;
  }
  brandLogo.src = theme === 'light' ? lightLogoSrc : darkLogoSrc;
}

function applyTheme(theme) {
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
  } else {
    root.removeAttribute('data-theme');
  }
  updateBrandLogo(theme);
}

function updateThemeButton() {
  if (!themeToggle) {
    return;
  }

  const isLight = root.getAttribute('data-theme') === 'light';
  themeToggle.setAttribute('data-theme-mode', isLight ? 'light' : 'dark');
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeToggle.setAttribute('aria-label', isLight ? getText(currentLanguage, 'switchToDark') : getText(currentLanguage, 'switchToLight'));

  if (themeToggleLabel) {
    themeToggleLabel.textContent = isLight ? getText(currentLanguage, 'themeLight') : getText(currentLanguage, 'themeDark');
  }
}

function updateLanguageButtons() {
  const isThai = currentLanguage === 'th';
  if (langTHButton) {
    langTHButton.classList.toggle('active', isThai);
    langTHButton.setAttribute('aria-pressed', String(isThai));
    langTHButton.setAttribute('aria-label', `${getText(currentLanguage, 'switchLanguage')} Thai`);
  }
  if (langENButton) {
    langENButton.classList.toggle('active', !isThai);
    langENButton.setAttribute('aria-pressed', String(!isThai));
    langENButton.setAttribute('aria-label', `${getText(currentLanguage, 'switchLanguage')} English`);
  }
}

function updateBackToTopVisibility() {
  if (!backToTopButton) {
    return;
  }
  backToTopButton.classList.toggle('visible', window.scrollY > 260);
}

function applyLanguage(language) {
  currentLanguage = language === 'en' ? 'en' : 'th';
  root.setAttribute('lang', currentLanguage);

  applyTextBindings(currentLanguage);
  applyPlaceholderBindings(currentLanguage);

  if (heroCard) {
    heroCard.setAttribute('aria-label', getText(currentLanguage, 'dashboardPreview'));
  }

  document.querySelectorAll('.modal-close').forEach((closeButton) => {
    closeButton.setAttribute('aria-label', getText(currentLanguage, 'close'));
  });

  if (backToTopButton) {
    const backToTopText = getText(currentLanguage, 'backToTop');
    backToTopButton.setAttribute('aria-label', backToTopText);
    backToTopButton.setAttribute('title', backToTopText);
  }

  updateLanguageButtons();
  updateThemeButton();
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
}

// ---------- App Bootstrap ----------
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
  applyTheme(savedTheme);
} else {
  applyTheme(systemPrefersDark.matches ? 'dark' : 'light');
}

const savedLanguage = localStorage.getItem('language');
const preferredLanguage = navigator.language.toLowerCase().startsWith('th') ? 'th' : 'en';
applyLanguage(savedLanguage === 'th' || savedLanguage === 'en' ? savedLanguage : preferredLanguage);

if (year) {
  year.textContent = new Date().getFullYear();
}

// ---------- Event Handlers ----------
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const nextTheme = isLight ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    updateThemeButton();
  });
}

if (langTHButton) {
  langTHButton.addEventListener('click', () => {
    if (currentLanguage !== 'th') {
      applyLanguage('th');
      localStorage.setItem('language', 'th');
    }
  });
}

if (langENButton) {
  langENButton.addEventListener('click', () => {
    if (currentLanguage !== 'en') {
      applyLanguage('en');
      localStorage.setItem('language', 'en');
    }
  });
}

modalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-open-modal');
    openModal(modalId);
  });
});

closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-close-modal');
    closeModal(modalId);
  });
});

modalBackdrops.forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal(modal.id);
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    modalBackdrops.forEach((modal) => closeModal(modal.id));
  }
});

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (statusMessage) {
      statusMessage.textContent = getText(currentLanguage, 'contactSent');
    }
    contactForm.reset();
  });
}

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
  updateBackToTopVisibility();
}
