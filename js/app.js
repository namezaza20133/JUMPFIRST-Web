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
const root = document.documentElement;
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const darkLogoSrc = 'assets/logos/jumpfirst-logo.svg';
const lightLogoSrc = 'assets/logos/jumpfirst-logo-lightmode.svg';
let currentLanguage = 'th';

const translations = {
  th: {
    navAbout: 'เกี่ยวกับ',
    navCourses: 'คอร์สเรียน',
    navRegister: 'ลงทะเบียน',
    navMembers: 'สมาชิก',
    navContact: 'ติดต่อ',
    login: 'เข้าสู่ระบบ',
    register: 'สมัครสมาชิก',
    heroEyebrow: 'ระบบคอร์สเรียนที่ตอบโจทย์ทุกขั้นตอน',
    heroTitle: 'เรียนรู้ได้อย่างง่ายดาย พร้อมระบบสมาชิกที่ครบครัน',
    heroDesc: 'JumpFirst Academy ออกแบบให้คุณลงทะเบียนเรียน จัดการตารางเรียน และติดตามสถานะคอร์สได้ในพื้นที่เดียว',
    heroCtaRegister: 'ลงทะเบียนเรียน',
    heroCtaLogin: 'เข้าสู่ระบบ',
    heroHighlight1: 'ระบบสมาชิกปลอดภัย',
    heroHighlight2: 'ลงทะเบียนเรียนง่าย',
    heroHighlight3: 'จัดการตารางเรียนได้เอง',
    dashboardPreview: 'ตัวอย่างแดชบอร์ด',
    dashboardTitle: 'ภาพรวมแดชบอร์ด',
    statCourses: 'คอร์สที่เข้าร่วม',
    statSchedule: 'ตารางเรียนใหม่',
    statSuccess: 'ความสำเร็จ',
    aboutEyebrow: 'เกี่ยวกับเรา',
    aboutTitle: 'สร้างประสบการณ์การเรียนรู้ที่ราบรื่นและสบายตา',
    aboutDesc: 'เราออกแบบเว็บไซต์ด้วยความตั้งใจให้ทุกคนใช้งานง่าย ทั้งนักเรียน ผู้ปกครอง และทีมงานด้านการศึกษา ที่สำคัญคือเน้นให้ทุกฟีเจอร์เข้าถึงได้ง่ายจากทุกอุปกรณ์',
    aboutCardTitle: 'สิ่งที่ผู้ใช้จะได้รับ',
    aboutItem1: 'ระบบสมาชิกที่ใช้งานง่าย',
    aboutItem2: 'การลงทะเบียนเรียนแบบไม่ซับซ้อน',
    aboutItem3: 'ระบบติดต่อและคำถามที่รวดเร็ว',
    coursesEyebrow: 'ข้อมูลคอร์สเรียน',
    coursesTitle: 'คอร์สที่น่าสนใจสำหรับการเติบโตของคุณ',
    course1Title: 'พื้นฐาน Frontend',
    course1Desc: 'เรียนรู้ HTML, CSS และ JavaScript สำหรับสร้างเว็บที่สวยงามและใช้งานง่าย',
    course1Level: 'ระดับพื้นฐาน',
    course2Title: 'ออกแบบ UX/UI',
    course2Desc: 'ฝึกออกแบบหน้าตาเว็บให้สอดคล้องกับผู้ใช้งานและสร้างประสบการณ์ที่ดี',
    course2Level: 'ระดับกลาง',
    course3Title: 'เติบโตสายอาชีพ',
    course3Desc: 'เตรียมตัวสำหรับงานด้านเทคโนโลยีด้วยทักษะที่จำเป็นในยุคปัจจุบัน',
    course3Level: 'ระดับเชิงลึก',
    registerEyebrow: 'ลงทะเบียนเรียน',
    registerTitle: 'เริ่มต้นการเรียนรู้ด้วยขั้นตอนที่ชัดเจน',
    registerDesc: 'เลือกคอร์สที่คุณสนใจ กรอกข้อมูลให้ครบ แล้วรอรับคำแนะนำจากทีมงาน',
    registerStep1: 'เลือกคอร์สที่ต้องการ',
    registerStep2: 'กรอกข้อมูลและยืนยันการสมัคร',
    registerStep3: 'รับตารางเรียนและเริ่มเรียนทันที',
    registerAction: 'สนใจลงทะเบียน',
    memberEyebrow: 'ข้อมูลสมาชิก',
    memberTitle: 'บริหารข้อมูลและติดตามสถานะคอร์สในแดชบอร์ดเดียว',
    memberDesc: 'สมาชิกสามารถดูข้อมูลส่วนตัว แก้ไขข้อมูล และจัดการตารางเรียนจากหน้าจอเดียวกัน',
    memberNameLabel: 'ชื่อสมาชิก',
    memberNameValue: 'นภัสสรณ์ แสงศรี',
    memberStatusLabel: 'สถานะคอร์ส',
    memberStatusValue: 'กำลังเรียน',
    memberScheduleLabel: 'ตารางเรียน',
    memberScheduleValue: 'จัดการแล้ว 3 รายการ',
    memberManageBtn: 'จัดการตารางเรียน',
    contactEyebrow: 'ติดต่อ',
    contactTitle: 'ติดต่อเราได้ทันที',
    contactDesc: 'หากมีคำถามหรืออยากขอคำแนะนำ สามารถส่งข้อความถึงเราได้เลย',
    contactNamePlaceholder: 'ชื่อของคุณ',
    contactEmailPlaceholder: 'อีเมล',
    contactMessagePlaceholder: 'ข้อความของคุณ',
    contactSubmit: 'ส่งข้อความ',
    footerTagline: 'ออกแบบเพื่อประสบการณ์การเรียนรู้ที่ลื่นไหล',
    close: 'ปิด',
    loginTitle: 'เข้าสู่ระบบ',
    loginIdentifierPlaceholder: 'Username / Email / เบอร์โทรศัพท์',
    loginPasswordPlaceholder: 'รหัสผ่าน',
    loginSubmit: 'เข้าสู่ระบบ',
    registerTitleModal: 'สร้างบัญชีใหม่',
    registerFullNamePlaceholder: 'ชื่อ-สกุล',
    registerPhonePlaceholder: 'เบอร์โทรศัพท์',
    registerEmailPlaceholder: 'อีเมล',
    registerUsernamePlaceholder: 'ชื่อผู้ใช้',
    registerPasswordPlaceholder: 'รหัสผ่าน',
    registerSubmit: 'สมัครสมาชิก',
    contactSent: 'ข้อความของคุณถูกส่งเรียบร้อยแล้ว จะติดต่อกลับโดยเร็วที่สุด',
    backToTop: 'กลับขึ้นด้านบน',
    themeLight: 'สว่าง',
    themeDark: 'มืด',
    switchToDark: 'สลับเป็นโหมดมืด',
    switchToLight: 'สลับเป็นโหมดสว่าง',
    switchLanguage: 'สลับภาษา'
  },
  en: {
    navAbout: 'About',
    navCourses: 'Courses',
    navRegister: 'Register',
    navMembers: 'Members',
    navContact: 'Contact',
    login: 'Login',
    register: 'Register',
    heroEyebrow: 'Course platform for every learning step',
    heroTitle: 'Learn with ease through a complete member experience',
    heroDesc: 'JumpFirst Academy lets you register courses, manage schedules, and track learning progress in one place.',
    heroCtaRegister: 'Join a Course',
    heroCtaLogin: 'Sign In',
    heroHighlight1: 'Secure member system',
    heroHighlight2: 'Simple enrollment flow',
    heroHighlight3: 'Self-managed schedules',
    dashboardPreview: 'Dashboard preview',
    dashboardTitle: 'Dashboard Overview',
    statCourses: 'Courses joined',
    statSchedule: 'New schedules',
    statSuccess: 'Success rate',
    aboutEyebrow: 'About Us',
    aboutTitle: 'A smooth and comfortable learning experience',
    aboutDesc: 'We design this platform for easy access across students, parents, and education teams, with clear flows on every device.',
    aboutCardTitle: 'What users get',
    aboutItem1: 'Easy-to-use member tools',
    aboutItem2: 'Simple enrollment process',
    aboutItem3: 'Fast communication support',
    coursesEyebrow: 'Course Catalog',
    coursesTitle: 'Programs built for your growth',
    course1Title: 'Frontend Essentials',
    course1Desc: 'Learn HTML, CSS, and JavaScript to build beautiful, usable websites.',
    course1Level: 'Beginner level',
    course2Title: 'UX/UI Design',
    course2Desc: 'Design interfaces that match user needs and deliver better experiences.',
    course2Level: 'Intermediate level',
    course3Title: 'Career Growth',
    course3Desc: 'Prepare for tech careers with skills that matter in today\'s market.',
    course3Level: 'Advanced level',
    registerEyebrow: 'Enrollment',
    registerTitle: 'Start learning with clear steps',
    registerDesc: 'Pick your course, complete your details, and get guided by our team.',
    registerStep1: 'Choose your preferred course',
    registerStep2: 'Fill in details and confirm',
    registerStep3: 'Receive schedule and start learning',
    registerAction: 'I want to enroll',
    memberEyebrow: 'Member Area',
    memberTitle: 'Manage profile and course status in one dashboard',
    memberDesc: 'Members can view profile details, edit information, and handle schedules in one place.',
    memberNameLabel: 'Member Name',
    memberNameValue: 'Napatsorn Saengsri',
    memberStatusLabel: 'Course Status',
    memberStatusValue: 'In progress',
    memberScheduleLabel: 'Schedule',
    memberScheduleValue: '3 items managed',
    memberManageBtn: 'Manage Schedule',
    contactEyebrow: 'Contact',
    contactTitle: 'Contact us anytime',
    contactDesc: 'If you have questions or need guidance, send us a message anytime.',
    contactNamePlaceholder: 'Your name',
    contactEmailPlaceholder: 'Your email',
    contactMessagePlaceholder: 'Your message',
    contactSubmit: 'Send Message',
    footerTagline: 'Designed for a smooth learning experience.',
    close: 'Close',
    loginTitle: 'Login',
    loginIdentifierPlaceholder: 'Username / Email / Phone number',
    loginPasswordPlaceholder: 'Password',
    loginSubmit: 'Login',
    registerTitleModal: 'Create a new account',
    registerFullNamePlaceholder: 'Full name',
    registerPhonePlaceholder: 'Phone number',
    registerEmailPlaceholder: 'Email',
    registerUsernamePlaceholder: 'Username',
    registerPasswordPlaceholder: 'Password',
    registerSubmit: 'Register',
    contactSent: 'Your message was sent successfully. We will contact you soon.',
    backToTop: 'Back to top',
    themeLight: 'Light',
    themeDark: 'Dark',
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
    switchLanguage: 'Switch language'
  }
};

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
  const t = translations[currentLanguage];
  const isLight = root.getAttribute('data-theme') === 'light';
  themeToggle.setAttribute('data-theme-mode', isLight ? 'light' : 'dark');
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeToggle.setAttribute('aria-label', isLight ? t.switchToDark : t.switchToLight);
  if (themeToggleLabel) {
    themeToggleLabel.textContent = isLight ? t.themeLight : t.themeDark;
  }
}

function updateLanguageButtons() {
  const isThai = currentLanguage === 'th';
  if (langTHButton) {
    langTHButton.classList.toggle('active', isThai);
    langTHButton.setAttribute('aria-pressed', String(isThai));
    langTHButton.setAttribute('aria-label', translations[currentLanguage].switchLanguage + ' Thai');
  }
  if (langENButton) {
    langENButton.classList.toggle('active', !isThai);
    langENButton.setAttribute('aria-pressed', String(!isThai));
    langENButton.setAttribute('aria-label', translations[currentLanguage].switchLanguage + ' English');
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
  const t = translations[currentLanguage];

  root.setAttribute('lang', currentLanguage);

  setText('.site-nav a:nth-child(1)', t.navAbout);
  setText('.site-nav a:nth-child(2)', t.navCourses);
  setText('.site-nav a:nth-child(3)', t.navContact);

  setText('.nav-actions .btn.btn-secondary[data-open-modal="loginModal"]', t.login);
  setText('.nav-actions .btn.btn-primary[data-open-modal="registerModal"]', t.register);

  setText('.hero-copy .eyebrow', t.heroEyebrow);
  setText('.hero-copy h1', t.heroTitle);
  setText('.hero-copy > p:not(.eyebrow)', t.heroDesc);
  setText('.hero-actions .btn.btn-primary', t.heroCtaRegister);
  setText('.hero-actions .btn.btn-outline[data-open-modal="loginModal"]', t.heroCtaLogin);
  setText('.hero-highlights li:nth-child(1)', t.heroHighlight1);
  setText('.hero-highlights li:nth-child(2)', t.heroHighlight2);
  setText('.hero-highlights li:nth-child(3)', t.heroHighlight3);
  const heroCard = document.querySelector('.hero-card');
  if (heroCard) {
    heroCard.setAttribute('aria-label', t.dashboardPreview);
  }
  setText('.card-body h3', t.dashboardTitle);
  setText('.stats-grid div:nth-child(1) span', t.statCourses);
  setText('.stats-grid div:nth-child(2) span', t.statSchedule);
  setText('.stats-grid div:nth-child(3) span', t.statSuccess);

  setText('#about .eyebrow', t.aboutEyebrow);
  setText('#about h2', t.aboutTitle);
  setText('#about .section-grid > div:first-child p:not(.eyebrow)', t.aboutDesc);
  setText('#about .info-card h3', t.aboutCardTitle);
  setText('#about .info-card li:nth-child(1)', t.aboutItem1);
  setText('#about .info-card li:nth-child(2)', t.aboutItem2);
  setText('#about .info-card li:nth-child(3)', t.aboutItem3);

  setText('#courses .section-heading .eyebrow', t.coursesEyebrow);
  setText('#courses .section-heading h2', t.coursesTitle);
  setText('#courses .feature-card:nth-child(1) h3', t.course1Title);
  setText('#courses .feature-card:nth-child(1) p', t.course1Desc);
  setText('#courses .feature-card:nth-child(1) span', t.course1Level);
  setText('#courses .feature-card:nth-child(2) h3', t.course2Title);
  setText('#courses .feature-card:nth-child(2) p', t.course2Desc);
  setText('#courses .feature-card:nth-child(2) span', t.course2Level);
  setText('#courses .feature-card:nth-child(3) h3', t.course3Title);
  setText('#courses .feature-card:nth-child(3) p', t.course3Desc);
  setText('#courses .feature-card:nth-child(3) span', t.course3Level);

  setText('#register .eyebrow', t.registerEyebrow);
  setText('#register h2', t.registerTitle);
  setText('#register .section-grid > div:first-child p:not(.eyebrow)', t.registerDesc);
  setText('#register .step:nth-child(1) p', t.registerStep1);
  setText('#register .step:nth-child(2) p', t.registerStep2);
  setText('#register .step:nth-child(3) p', t.registerStep3);
  setText('#register .register-panel .btn.btn-primary', t.registerAction);

  setText('#member .eyebrow', t.memberEyebrow);
  setText('#member h2', t.memberTitle);
  setText('#member .section-grid > div:first-child p:not(.eyebrow)', t.memberDesc);
  setText('#member .member-row:nth-child(1) strong', t.memberNameLabel);
  setText('#member .member-row:nth-child(1) span', t.memberNameValue);
  setText('#member .member-row:nth-child(2) strong', t.memberStatusLabel);
  setText('#member .member-row:nth-child(2) span', t.memberStatusValue);
  setText('#member .member-row:nth-child(3) strong', t.memberScheduleLabel);
  setText('#member .member-row:nth-child(3) span', t.memberScheduleValue);
  setText('#member .member-card .btn.btn-secondary', t.memberManageBtn);

  setText('#contact .eyebrow', t.contactEyebrow);
  setText('#contact h2', t.contactTitle);
  setText('#contact .contact-wrap > div p:not(.eyebrow)', t.contactDesc);
  setPlaceholder('#contactForm input[type="text"]', t.contactNamePlaceholder);
  setPlaceholder('#contactForm input[type="email"]', t.contactEmailPlaceholder);
  setPlaceholder('#contactForm textarea', t.contactMessagePlaceholder);
  setText('#contactForm .btn.btn-primary', t.contactSubmit);

  setText('.footer-wrap p:last-child', t.footerTagline);

  document.querySelectorAll('.modal-close').forEach((closeButton) => {
    closeButton.setAttribute('aria-label', t.close);
  });
  setText('#loginTitle', t.loginTitle);
  setPlaceholder('#loginModal input[type="text"]', t.loginIdentifierPlaceholder);
  setPlaceholder('#loginModal input[type="password"]', t.loginPasswordPlaceholder);
  setText('#loginModal .btn.btn-primary', t.loginSubmit);

  setText('#registerTitle', t.registerTitleModal);
  setPlaceholder('#registerModal input[type="text"]:nth-of-type(1)', t.registerFullNamePlaceholder);
  setPlaceholder('#registerModal input[type="tel"]', t.registerPhonePlaceholder);
  setPlaceholder('#registerModal input[type="email"]', t.registerEmailPlaceholder);
  setPlaceholder('#registerModal input[type="text"]:nth-of-type(2)', t.registerUsernamePlaceholder);
  setPlaceholder('#registerModal input[type="password"]', t.registerPasswordPlaceholder);
  setText('#registerModal .btn.btn-primary', t.registerSubmit);

  if (backToTopButton) {
    backToTopButton.setAttribute('aria-label', t.backToTop);
    backToTopButton.setAttribute('title', t.backToTop);
  }

  updateLanguageButtons();

  updateThemeButton();
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
  applyTheme(savedTheme);
} else {
  applyTheme(systemPrefersDark.matches ? 'dark' : 'light');
}

const savedLanguage = localStorage.getItem('language');
const preferredLanguage = navigator.language.toLowerCase().startsWith('th') ? 'th' : 'en';
applyLanguage(savedLanguage === 'th' || savedLanguage === 'en' ? savedLanguage : preferredLanguage);

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
      statusMessage.textContent = translations[currentLanguage].contactSent;
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
