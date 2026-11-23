document.addEventListener('DOMContentLoaded', () => {
  /* 1. Mobile Navigation Toggle */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* 2. Active Nav Highlight on Scroll */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 140;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach((item) => {
          item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* 3. Scroll Reveal Animations */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  /* 4. Animated Stats Counter (50+, 30+, 100%) */
  const statsSection = document.getElementById('statsSection');
  let statsAnimated = false;

  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statsSection.querySelectorAll('.stat-value').forEach((counter) => {
            const target = Number(counter.dataset.target || 0);
            const suffix = counter.dataset.suffix || '';
            let current = 0;
            const step = Math.max(1, Math.ceil(target / 35));

            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              counter.textContent = `${current}${suffix}`;
            }, 28);
          });
        }
      },
      { threshold: 0.4 }
    );
    statsObserver.observe(statsSection);
  }

  /* 5. Hero Slide Switcher (01 / 03) */
  const heroSlideBtn = document.getElementById('heroSlideBtn');
  const heroSlideImg = document.getElementById('heroSlideImg');
  const slideNum = document.getElementById('slideNum');
  const slideFill = document.getElementById('slideFill');

  const heroSlides = [
    { num: '01', src: 'hero.jpg', fill: '33.3%' },
    { num: '02', src: 'project-2.jpg', fill: '66.6%' },
    { num: '03', src: 'p3.jpg', fill: '100%' }
  ];
  let currentSlide = 0;

  if (heroSlideBtn && heroSlideImg) {
    heroSlideBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % heroSlides.length;
      const slide = heroSlides[currentSlide];
      heroSlideImg.style.opacity = '0.35';
      setTimeout(() => {
        heroSlideImg.src = slide.src;
        slideNum.textContent = slide.num;
        slideFill.style.height = slide.fill;
        heroSlideImg.style.opacity = '1';
      }, 180);
    });
  }

  /* 6. Selected Projects Carousel Arrows */
  const projectsGrid = document.getElementById('projectsGrid');
  const prevProjectBtn = document.getElementById('prevProjectBtn');
  const nextProjectBtn = document.getElementById('nextProjectBtn');

  if (projectsGrid && prevProjectBtn && nextProjectBtn) {
    nextProjectBtn.addEventListener('click', () => {
      const firstCard = projectsGrid.firstElementChild;
      if (firstCard) projectsGrid.appendChild(firstCard);
    });

    prevProjectBtn.addEventListener('click', () => {
      const lastCard = projectsGrid.lastElementChild;
      if (lastCard) projectsGrid.prepend(lastCard);
    });
  }

  /* 7. Modals (Showreel, Card Details & Contact Form) */
  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeAllModals = () => {
    document.querySelectorAll('.modal-backdrop').forEach((modal) => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    });
  };

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // Watch Reel button
  const watchReelBtn = document.getElementById('watchReelBtn');
  const reelModal = document.getElementById('reelModal');
  if (watchReelBtn && reelModal) {
    watchReelBtn.addEventListener('click', () => openModal(reelModal));
  }

  // Service & Project card click -> Detail Modal
  const detailModal = document.getElementById('detailModal');
  const detailModalTitle = document.getElementById('detailModalTitle');
  const detailModalDesc = document.getElementById('detailModalDesc');
  const detailInquireBtn = document.getElementById('detailInquireBtn');

  document.querySelectorAll('.service-card, .project-card').forEach((card) => {
    card.addEventListener('click', () => {
      if (detailModalTitle) detailModalTitle.textContent = card.dataset.title || 'Project Overview';
      if (detailModalDesc) detailModalDesc.textContent = card.dataset.desc || '';
      openModal(detailModal);
    });
  });

  // Get in Touch buttons -> Contact Form Modal
  const contactModal = document.getElementById('contactModal');
  const projectTypeSelect = document.getElementById('projectType');

  document.querySelectorAll('.open-contact-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.service && projectTypeSelect) {
        projectTypeSelect.value = btn.dataset.service;
      }
      openModal(contactModal);
    });
  });

  if (detailInquireBtn) {
    detailInquireBtn.addEventListener('click', () => {
      closeAllModals();
      openModal(contactModal);
    });
  }

  // Contact Form Submission Feedback
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value.trim();
      formStatus.textContent = `Thank you, ${name}! Your inquiry has been received.`;
      setTimeout(() => {
        contactForm.reset();
        formStatus.textContent = '';
        closeAllModals();
      }, 1800);
    });
  }
});