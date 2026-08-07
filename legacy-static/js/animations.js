const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

const animateItems = document.querySelectorAll('.hero-copy, .hero-card, .feature-card, .info-card, .register-panel, .member-card, .contact-form');
animateItems.forEach((item) => {
  item.classList.add('reveal');
  observer.observe(item);
});
