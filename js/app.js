const modalButtons = document.querySelectorAll('[data-open-modal]');
const closeButtons = document.querySelectorAll('[data-close-modal]');
const modalBackdrops = document.querySelectorAll('.modal-backdrop');
const contactForm = document.getElementById('contactForm');
const statusMessage = document.querySelector('.form-status');
const year = document.getElementById('year');

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
