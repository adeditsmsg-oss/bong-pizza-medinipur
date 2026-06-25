// INTERACTIVE CONTROLS FOR BONG PIZZA WEBSITE

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initMobileMenu();
  initScrollReveal();
});

// 1. Sticky Navigation on Scroll
function initStickyNavbar() {
  const navbarContainer = document.querySelector('.navbar-container');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbarContainer.classList.add('scrolled');
    } else {
      navbarContainer.classList.remove('scrolled');
    }
  });
}

// 2. Mobile Drawer Navigation
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  
  if (!menuToggle || !mobileDrawer) return;

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileDrawer.classList.toggle('open');
    menuToggle.classList.toggle('active');
  });

  // Close drawer when clicking a link
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      menuToggle.classList.remove('active');
    });
  });

  // Close drawer when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!mobileDrawer.contains(e.target) && !menuToggle.contains(e.target)) {
      mobileDrawer.classList.remove('open');
      menuToggle.classList.remove('active');
    }
  });
}

// 3. Menu Category Tab Filter
window.filterMenu = function(category) {
  // Update Active Tab Button styling
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    if (btn.getAttribute('onclick').includes(category)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Filter Menu Items with a smooth fade effect
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    
    if (category === 'all' || itemCategory === category) {
      item.style.display = 'block';
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 50);
    } else {
      item.style.opacity = '0';
      item.style.transform = 'translateY(10px)';
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    }
  });
};

// 4. Lightbox Zoom Gallery System
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

window.openLightbox = function(imageSrc) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = imageSrc;
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Stop background scroll
};

window.closeLightbox = function() {
  if (!lightbox) return;
  lightbox.style.display = 'none';
  document.body.style.overflow = 'auto'; // Restore scroll
};

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

// 5. Staggered Scroll Reveal Animations
function initScrollReveal() {
  const revealElements = [
    ...document.querySelectorAll('.feature-card'),
    ...document.querySelectorAll('.signature-card'),
    ...document.querySelectorAll('.review-card'),
    ...document.querySelectorAll('.about-content-column'),
    ...document.querySelectorAll('.location-grid')
  ];

  // Set initial hidden styles
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
        observer.unobserve(target); // Reveal only once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}
