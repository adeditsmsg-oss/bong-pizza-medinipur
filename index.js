// BESPOKE JS INTERACTIONS FOR MOM'S KITCHEN

const GOOGLE_REVIEW_URL = "https://reviewflowai.in/index.php?route=review/ChIJqS7gNgBbHToRzB52JkJE4Ug";
const OWNER_WHATSAPP_NUMBER = "918250569116"; // Mom's Kitchen WhatsApp
const SAVE_TO_EXTERNAL_API = false;
const EXTERNAL_API_URL = "https://api.yourdomain.com/feedback";

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initMobileMenu();
  initScrollReveal();
  initLightbox();
  initTestimonialSlider();
  initReputationManagement();
  initPreorderForm();
});

// 1. Sticky Navigation on Scroll
function initStickyNavbar() {
  const headerNav = document.querySelector('.header-nav');
  if (!headerNav) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
  });
}

// 2. Mobile Drawer Navigation
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-item');
  
  if (!mobileToggle || !mobileDrawer) return;

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileDrawer.classList.toggle('open');
    mobileToggle.classList.toggle('active');
  });

  // Close drawer when clicking a link
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      mobileToggle.classList.remove('active');
    });
  });

  // Close drawer when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
      mobileDrawer.classList.remove('open');
      mobileToggle.classList.remove('active');
    }
  });
}

// 3. Lightbox Zoom System
function initLightbox() {
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
}

// 4. Staggered Scroll Reveal Animations
function initScrollReveal() {
  const revealElements = [
    ...document.querySelectorAll('.timeline-step'),
    ...document.querySelectorAll('.menu-item-row'),
    ...document.querySelectorAll('.masonry-item'),
    ...document.querySelectorAll('.specialty-card-wrap'),
    ...document.querySelectorAll('.visit-info-card'),
    ...document.querySelectorAll('.visit-map-wrapper')
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

// 5. Custom Testimonial Slider
function initTestimonialSlider() {
  const cards = document.querySelectorAll('.slider-card');
  const prevBtn = document.getElementById('prevReview');
  const nextBtn = document.getElementById('nextReview');
  
  if (!cards.length) return;
  
  let currentIndex = 0;

  function showReview(index) {
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % cards.length;
      showReview(currentIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      showReview(currentIndex);
    });
  }

  // Auto slide every 8 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % cards.length;
    showReview(currentIndex);
  }, 8000);
}

// 6. Google Review Reputation Management System (Timed Floating Widget)
function initReputationManagement() {
  const stars = document.querySelectorAll('#interactiveStars .star-btn');
  const submitBtn = document.getElementById('submitRatingBtn');
  const ratingLabel = document.getElementById('ratingValueLabel');
  const widgetInteractive = document.getElementById('widgetInteractive');
  const positiveSuccess = document.getElementById('positiveSuccess');
  const googleReviewBtn = document.getElementById('googleReviewBtn');
  
  const ratingModal = document.getElementById('ratingModal');
  const closeRatingWidget = document.getElementById('closeRatingWidget');
  
  const feedbackModal = document.getElementById('feedbackModal');
  const closeFeedbackModal = document.getElementById('closeFeedbackModal');
  const negativeFeedbackForm = document.getElementById('negativeFeedbackForm');

  let selectedRating = 0;
  let popupInterval = null;

  if (!stars.length || !submitBtn) return;

  // Timer popup logic (always pops up every 15 seconds if closed/not completed)
  function showRatingPopup() {
    if (ratingModal && ratingModal.style.display === 'none' && feedbackModal.style.display === 'none') {
      ratingModal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Lock background scroll
      
      // Make sure interactive elements are restored (not showing success panel yet)
      widgetInteractive.style.display = 'block';
      positiveSuccess.style.display = 'none';
      submitBtn.style.display = 'none';
    }
  }

  function startPopupTimer() {
    if (popupInterval) clearInterval(popupInterval);
    popupInterval = setInterval(showRatingPopup, 15000);
  }

  function stopPopupTimer() {
    if (popupInterval) {
      clearInterval(popupInterval);
      popupInterval = null;
    }
  }

  // Trigger initial popup after 15 seconds of page load
  setTimeout(showRatingPopup, 15000);
  startPopupTimer();

  // Widget Close Logic (resumes interval loop)
  if (closeRatingWidget && ratingModal) {
    closeRatingWidget.addEventListener('click', () => {
      ratingModal.style.display = 'none';
      document.body.style.overflow = 'auto'; // Restore scroll
      startPopupTimer(); // Resume popup cycle in 15s
    });

    ratingModal.addEventListener('click', (e) => {
      if (e.target === ratingModal) {
        ratingModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        startPopupTimer();
      }
    });
  }

  // Star Ratings Interactive Logic
  stars.forEach(star => {
    star.addEventListener('mouseover', () => {
      const val = parseInt(star.getAttribute('data-value'));
      highlightStars(val);
    });

    star.addEventListener('mouseout', () => {
      highlightStars(selectedRating);
    });

    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-value'));
      highlightStars(selectedRating);
      
      ratingLabel.textContent = `You selected: ${selectedRating} Star${selectedRating > 1 ? 's' : ''}`;
      
      if (selectedRating >= 4) {
        // Direct redirect for 4-5 stars (no submit button shown)
        submitBtn.style.display = 'none';
        widgetInteractive.style.display = 'none';
        positiveSuccess.style.display = 'flex';
        googleReviewBtn.href = GOOGLE_REVIEW_URL;
        
        // Stop the popup timer permanently
        stopPopupTimer();
        
        // Open Google review URL immediately
        window.open(GOOGLE_REVIEW_URL, '_blank');
      } else {
        // Show submit button only for negative reviews (< 4 stars)
        submitBtn.style.display = 'inline-flex';
        submitBtn.textContent = 'Submit Feedback';
      }
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
    if (selectedRating < 4 && selectedRating > 0) {
      // Hide rating modal completely
      if (ratingModal) ratingModal.style.display = 'none';
      
      // Stop popup timer
      stopPopupTimer();

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
      submitBtn.style.display = 'none';

      alert('Thank you for your feedback! We will get in touch with you shortly.');
    });
  }
}

// 7. WhatsApp Preorder Form Submission Handler
function initPreorderForm() {
  const preorderForm = document.getElementById('whatsappPreorderForm');
  if (!preorderForm) return;

  preorderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('pName').value;
    const phone = document.getElementById('pPhone').value;
    const details = document.getElementById('pDetails').value;
    const type = document.getElementById('pType').value;
    const notes = document.getElementById('pNotes').value || 'None';

    // Compile WhatsApp preorder text
    const rawMsg = `💬 New Momo Order / Inquiry - Mom's Kitchen\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n📦 Service Type: ${type}\n\n🍽️ Order Details:\n${details}\n\n📝 Special Notes:\n${notes}`;
    const encodedMsg = encodeURIComponent(rawMsg);
    const waUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodedMsg}`;

    // Open WhatsApp Redirect
    window.open(waUrl, '_blank');

    // Reset preorder form
    preorderForm.reset();
    alert('Your order details have been compiled! Redirecting you to WhatsApp to complete your order.');
  });
}
