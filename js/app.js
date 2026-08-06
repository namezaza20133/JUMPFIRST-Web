const modalButtons = document.querySelectorAll('[data-open-modal]');
const closeButtons = document.querySelectorAll('[data-close-modal]');
const modalBackdrops = document.querySelectorAll('.modal-backdrop');
const contactForm = document.getElementById('contactForm');
const statusMessage = document.querySelector('.form-status');
const year = document.getElementById('year');
const themeToggle = document.getElementById('themeToggle');
const themeToggleLabel = document.querySelector('.theme-switch-label');
const brandLogo = document.querySelector('.brand-logo');
const root = document.documentElement;
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const darkLogoSrc = 'assets/logos/jumpfirst-logo.svg';
const lightLogoSrc = 'assets/logos/jumpfirst-logo-lightmode.svg';

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
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  if (themeToggleLabel) {
    themeToggleLabel.textContent = isLight ? 'Light' : 'Dark';
  }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
  applyTheme(savedTheme);
} else {
  applyTheme(systemPrefersDark.matches ? 'dark' : 'light');
}
updateThemeButton();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const nextTheme = isLight ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    updateThemeButton();
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
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
      statusMessage.textContent = 'ข้อความของคุณถูกส่งเรียบร้อยแล้ว จะติดต่อกลับโดยเร็วที่สุด';
    }
    contactForm.reset();
  });
}
