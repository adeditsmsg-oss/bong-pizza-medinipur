// INTERACTIVE CONTROLS FOR BONG PIZZA WEBSITE

// CONFIGURATION FOR GOOGLE REVIEWS & REPUTATION MANAGEMENT
const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJJ1ckIYeBHTsRy8VwEnRgTuU";
const OWNER_WHATSAPP_NUMBER = "919876543210"; // Configurable owner WhatsApp
const SAVE_TO_EXTERNAL_API = false;          // Optional storage config
const EXTERNAL_API_URL = "https://api.yourdomain.com/feedback";

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initMobileMenu();
  initScrollReveal();
  initReputationManagement();
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

// 6. Google Review Reputation Management System
function initReputationManagement() {
  const stars = document.querySelectorAll('#interactiveStars .star-btn');
  const submitBtn = document.getElementById('submitRatingBtn');
  const ratingLabel = document.getElementById('ratingValueLabel');
  const ratingInteractive = document.getElementById('ratingInteractive');
  const positiveSuccess = document.getElementById('positiveSuccess');
  const googleReviewBtn = document.getElementById('googleReviewBtn');
  
  const feedbackModal = document.getElementById('feedbackModal');
  const closeFeedbackModal = document.getElementById('closeFeedbackModal');
  const negativeFeedbackForm = document.getElementById('negativeFeedbackForm');

  let selectedRating = 0;

  if (!stars.length || !submitBtn) return;

  // Star Ratings Interactive Logic
  stars.forEach(star => {
    // Hover State
    star.addEventListener('mouseover', () => {
      const val = parseInt(star.getAttribute('data-value'));
      highlightStars(val);
    });

    // Leave Hover State
    star.addEventListener('mouseout', () => {
      highlightStars(selectedRating);
    });

    // Click Selection
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-value'));
      highlightStars(selectedRating);
      
      // Update label text and button status
      ratingLabel.textContent = `You selected: ${selectedRating} Star${selectedRating > 1 ? 's' : ''}`;
      submitBtn.disabled = false;
    });
  });

  function highlightStars(count) {
    stars.forEach(star => {
      const val = parseInt(star.getAttribute('data-value'));
      if (val <= count) {
        star.classList.remove('far');
        star.classList.add('fas', 'selected');
      } else {
        star.classList.remove('fas', 'selected');
        star.classList.add('far');
      }
    });
  }

  // Handle Review Submission
  submitBtn.addEventListener('click', () => {
    if (selectedRating >= 4) {
      // 4 or 5 stars flow: Google Redirect
      ratingInteractive.style.display = 'none';
      positiveSuccess.style.display = 'flex';
      googleReviewBtn.href = GOOGLE_REVIEW_URL;
    } else {
      // 1, 2, or 3 stars flow: Modal feedback Form
      feedbackModal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Lock background scroll
    }
  });

  // Modal Dialog Close handlers
  if (closeFeedbackModal && feedbackModal) {
    closeFeedbackModal.addEventListener('click', () => {
      feedbackModal.style.display = 'none';
      document.body.style.overflow = 'auto'; // Restore scroll
    });

    // Close when clicking modal overlay backdrop
    feedbackModal.addEventListener('click', (e) => {
      if (e.target === feedbackModal) {
        feedbackModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Negative Feedback Form Submission to WhatsApp & API
  if (negativeFeedbackForm) {
    negativeFeedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fbName').value;
      const phone = document.getElementById('fbPhone').value;
      const email = document.getElementById('fbEmail').value || 'Not provided';
      const issue = document.getElementById('fbWrong').value;
      const suggestion = document.getElementById('fbImprove').value;

      // Compile WhatsApp message text
      const rawMsg = `🚨 New Customer Feedback\n\n⭐ Rating: ${selectedRating} Stars\n👤 Name: ${name}\n📞 Phone: ${phone}\n📧 Email: ${email}\n\n📝 Issue:\n${issue}\n\n💡 Suggested Improvement:\n${suggestion}`;
      const encodedMsg = encodeURIComponent(rawMsg);
      const waUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodedMsg}`;

      // Optional External Storage Endpoint API
      if (SAVE_TO_EXTERNAL_API && EXTERNAL_API_URL) {
        fetch(EXTERNAL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rating: selectedRating,
            name,
            phone,
            email,
            issue,
            suggestion
          })
        }).catch(err => console.error("Optional storage failed:", err));
      }

      // Open WhatsApp Redirect link
      window.open(waUrl, '_blank');

      // Reset form and close modal
      negativeFeedbackForm.reset();
      feedbackModal.style.display = 'none';
      document.body.style.overflow = 'auto';

      // Reset selected rating state
      selectedRating = 0;
      highlightStars(0);
      ratingLabel.textContent = 'Tap a star to rate';
      submitBtn.disabled = true;

      alert('Thank you for your feedback! We will get in touch with you shortly.');
    });
  }
}
