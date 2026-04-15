/* ============================================
   Anshik Digital Solutions - Main JavaScript
   ============================================
   
   HOW TO CHANGE WHATSAPP NUMBER:
   Update the WHATSAPP_NUMBER variable below.
   Format: country code + number, no + or spaces.
   Example: "918637287899" = +91 8637287899
   
   HOW TO CHANGE MESSAGES:
   Update the WHATSAPP_MESSAGES object below.
   Each key is a context (used in data-wa-context attribute).
   The value is the pre-filled message for that context.
   
   ============================================ */

// ⚠️ REPLACE with your actual WhatsApp number
const WHATSAPP_NUMBER = "918637287899";

// Context-aware pre-filled messages for different CTAs
const WHATSAPP_MESSAGES = {
  general:   "Hi! I'm interested in your digital services for my business.",
  google:    "Hi, I want to set up my business on Google.",
  website:   "Hi, I want a website for my business.",
  complete:  "Hi, I want the complete digital setup for my business.",
  hero:      "Hi, I want to grow my business online.",
  cta:       "Hi, I want to start getting customers online today!"
};

/**
 * Generate a WhatsApp link with a context-aware message
 * @param {string} context - Key from WHATSAPP_MESSAGES (e.g. "google", "website")
 * @returns {string} Full WhatsApp URL with pre-filled message
 */
function getWhatsAppLink(context) {
  const message = WHATSAPP_MESSAGES[context] || WHATSAPP_MESSAGES.general;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Track WhatsApp button clicks (console + basic analytics)
 * @param {string} context - Which button was clicked
 */
function trackClick(context) {
  const timestamp = new Date().toISOString();
  console.log(`[WhatsApp Click] Context: "${context}" | Time: ${timestamp}`);
  
  // If Google Analytics (gtag) is available, send event
  if (typeof gtag === "function") {
    gtag("event", "whatsapp_click", {
      event_category: "engagement",
      event_label: context
    });
  }
}

// ---------- DOM Ready ----------
document.addEventListener("DOMContentLoaded", () => {
  initPageLoader();
  initWhatsAppLinks();
  initNavbar();
  initScrollAnimations();
  initScrollProgress();
  initCounters();
  initBackToTop();
  initFAQ();
  initForm();
});

/* ========== WhatsApp Links (Context-Aware) ========== */
function initWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach(el => {
    // Get context from data attribute, default to "general"
    const context = el.getAttribute("data-wa-context") || "general";

    // Set the correct WhatsApp link
    el.href = getWhatsAppLink(context);
    el.target = "_blank";
    el.rel = "noopener noreferrer";

    // Add click tracking + button animation
    el.addEventListener("click", (e) => {
      trackClick(context);

      // Smooth press animation
      el.style.transform = "scale(0.95)";
      setTimeout(() => {
        el.style.transform = "";
      }, 150);
    });
  });
}

/* ========== Sticky Navbar ========== */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
}

/* ========== Scroll Animations ========== */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".fade-up, .stagger").forEach(el => {
    observer.observe(el);
  });
}

/* ========== FAQ Accordion ========== */
function initFAQ() {
  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach(faq => {
        faq.classList.remove("active");
      });

      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

/* ========== Lead Form ========== */
function initForm() {
  const form = document.getElementById("leadForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const spinner = document.getElementById("spinner");
  const modal = document.getElementById("successModal");
  const modalClose = document.getElementById("modalClose");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const businessType = document.getElementById("businessType").value;

    let isValid = true;

    if (name.length < 2) {
      showError("name", "Please enter your full name");
      isValid = false;
    } else {
      clearError("name");
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      showError("phone", "Please enter a valid 10-digit phone number");
      isValid = false;
    } else {
      clearError("phone");
    }

    if (!businessType) {
      showError("businessType", "Please select your business type");
      isValid = false;
    } else {
      clearError("businessType");
    }

    if (!isValid) return;

    btnText.textContent = "Submitting...";
    spinner.style.display = "block";
    submitBtn.disabled = true;

    try {
      const result = await saveLead({ name, phone, businessType });

      if (result.success) {
        modal.classList.add("active");
        form.reset();
        trackClick("form_submit");
      } else {
        alert("Something went wrong. Please try again or contact us on WhatsApp.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Something went wrong. Please try again or contact us on WhatsApp.");
    } finally {
      btnText.textContent = "Get Free Consultation";
      spinner.style.display = "none";
      submitBtn.disabled = false;
    }
  });

  modalClose.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  document.querySelectorAll("#leadForm input, #leadForm select").forEach(input => {
    input.addEventListener("input", () => clearError(input.id));
    input.addEventListener("change", () => clearError(input.id));
  });
}

/* ========== Validation Helpers ========== */
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = field.parentElement.querySelector(".error-message");
  field.classList.add("error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = field.parentElement.querySelector(".error-message");
  field.classList.remove("error");
  if (errorEl) {
    errorEl.style.display = "none";
  }
}

/* ========== Page Loader ========== */
function initPageLoader() {
  const loader = document.getElementById("pageLoader");
  // Hide loader once page is fully loaded
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 600);
  });
  // Fallback: hide after 3 seconds max
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 3000);
}

/* ========== Scroll Progress Bar ========== */
function initScrollProgress() {
  const progressBar = document.getElementById("scrollProgress");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + "%";
  });
}

/* ========== Animated Counters ========== */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"));
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(el, target) {
  let current = 0;
  const duration = 1500;
  const step = target / (duration / 16);

  function update() {
    current += step;
    if (current >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = Math.floor(current);
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ========== Back to Top Button ========== */
function initBackToTop() {
  const btn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 500);
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
