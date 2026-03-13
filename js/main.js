/* ═══════════════════════════════════════════════
   Techmania – Main JavaScript
   All 8 upgrade phases included
   ═══════════════════════════════════════════════ */

/* ─── WHATSAPP PLACEHOLDER ───
   Replace +1234567890 with your real WhatsApp number */
const WHATSAPP_NUMBER = '+1234567890';
const WHATSAPP_MESSAGE = encodeURIComponent('Hi! I\'m interested in hiring an Insurance VA for my agency.');

/* ─── FORMSPREE ENDPOINT PLACEHOLDER ───
   Sign up at formspree.io, create a form, and replace YOUR_FORM_ID */
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';

/* ─── UPWORK PROFILE PLACEHOLDER ───
   Replace with your real Upwork profile URL */
const UPWORK_URL = 'https://www.upwork.com/freelancers/YOUR_PROFILE_ID';

/* ═══════════════════════════════════════════════
   INTERACTIVE HERO BACKGROUND SYSTEM
   ═══════════════════════════════════════════════ */
function initInteractiveHero() {
  const heroButtons = document.querySelectorAll('.hero-interactive-btn');
  const bgLayers = document.querySelectorAll('.hero-bg-layer');

  heroButtons.forEach(btn => {
    const hoverType = btn.dataset.hover;

    btn.addEventListener('mouseenter', () => {
      // Activate corresponding background
      bgLayers.forEach(layer => {
        if (layer.dataset.bg === hoverType) {
          layer.classList.add('active');
        } else {
          layer.classList.remove('active');
        }
      });
      // Highlight button
      heroButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });

    btn.addEventListener('mouseleave', () => {
      // Optional: keep the last hovered state or reset
      // Uncomment below to reset on mouse leave:
      // bgLayers.forEach(layer => layer.classList.remove('active'));
      // btn.classList.remove('active');
    });
  });
}

/* ═══════════════════════════════════════════════
   PAGE NAVIGATION
   ═══════════════════════════════════════════════ */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  updateActiveNav(id);
  // Re-run scroll observer for new page content
  setTimeout(observeAnimations, 100);
}

/* ═══════════════════════════════════════════════
   ACTIVE NAV HIGHLIGHTING
   ═══════════════════════════════════════════════ */
function updateActiveNav(pageId) {
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('nav-active');
  });

  /* Map service detail pages to 'services' nav item */
  const servicePages = [
    'service-personal', 'service-commercial', 'service-trucking',
    'service-admin', 'service-certificates', 'service-agency-ops'
  ];
  let navPageId = pageId;
  if (servicePages.includes(pageId)) {
    navPageId = 'services';
  }

  const navMap = {
    home: 0, services: 1, about: 2, experts: 3, pricing: 4, how: 5
  };
  const idx = navMap[navPageId];
  if (idx !== undefined) {
    const links = document.querySelectorAll('.nav-links a:not(.nav-cta)');
    if (links[idx]) links[idx].classList.add('nav-active');
  }
}

/* ═══════════════════════════════════════════════
   SCROLL ANIMATIONS (IntersectionObserver)
   ═══════════════════════════════════════════════ */
function observeAnimations() {
  const items = document.querySelectorAll('.animate-on-scroll:not(.is-visible), .animate-slide-left:not(.is-visible), .animate-slide-right:not(.is-visible), .animate-scale:not(.is-visible)');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
        // Trigger counter if it has data-count
        if (entry.target.hasAttribute('data-count')) {
          animateCounter(entry.target);
        }
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════
   ANIMATED COUNTERS
   ═══════════════════════════════════════════════ */
function animateCounter(el) {
  if (el.dataset.counted === 'true') return;
  el.dataset.counted = 'true';

  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();
  const isDecimal = (target % 1 !== 0);

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = eased * target;
    el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + (isDecimal ? target.toFixed(1) : target) + suffix;
  }
  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════
   FAQ ACCORDION
   ═══════════════════════════════════════════════ */
function initFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ═══════════════════════════════════════════════
   ROI CALCULATOR
   ═══════════════════════════════════════════════ */
function calcROI() {
  const policies = parseFloat(document.getElementById('roiPolicies')?.value) || 200;
  const hoursPerWeek = parseFloat(document.getElementById('roiHours')?.value) || 20;
  const usRate = parseFloat(document.getElementById('roiUsRate')?.value) || 25;

  // Constants
  const weeksPerYear = 52;
  const vaEffectiveRate = 12; // Techmania average rate

  // Calculations
  const totalHoursPerYear = hoursPerWeek * weeksPerYear;
  const currentAnnualCost = totalHoursPerYear * usRate;
  const vaAnnualCost = totalHoursPerYear * vaEffectiveRate;
  const annualSavings = Math.max(0, currentAnnualCost - vaAnnualCost);
  const monthlySavings = annualSavings / 12;
  const savingsPercent = currentAnnualCost > 0 ? Math.round((annualSavings / currentAnnualCost) * 100) : 0;

  // Update DOM elements with animation
  const resultEl = document.getElementById('roiResult');
  const currentCostEl = document.getElementById('roiCurrentCost');
  const vaCostEl = document.getElementById('roiVaCost');
  const percentEl = document.getElementById('roiPercent');
  const hoursSavedEl = document.getElementById('roiHoursSaved');
  const monthlySavingsEl = document.getElementById('roiMonthlySavings');

  if (resultEl) {
    animateValue(resultEl, '$' + Math.round(annualSavings).toLocaleString());
  }
  if (currentCostEl) {
    currentCostEl.textContent = '$' + Math.round(currentAnnualCost).toLocaleString();
  }
  if (vaCostEl) {
    vaCostEl.textContent = '$' + Math.round(vaAnnualCost).toLocaleString();
  }
  if (percentEl) {
    percentEl.textContent = savingsPercent + '% Cost Reduction';
  }
  if (hoursSavedEl) {
    hoursSavedEl.textContent = Math.round(totalHoursPerYear).toLocaleString();
  }
  if (monthlySavingsEl) {
    monthlySavingsEl.textContent = '$' + Math.round(monthlySavings).toLocaleString();
  }
}

// Animate value change
function animateValue(el, newValue) {
  el.style.transform = 'scale(1.05)';
  el.textContent = newValue;
  setTimeout(() => {
    el.style.transform = 'scale(1)';
  }, 150);
}

// Sync sliders with inputs
function syncSliderInput(sliderId, inputId) {
  const slider = document.getElementById(sliderId);
  const input = document.getElementById(inputId);
  if (!slider || !input) return;

  slider.addEventListener('input', () => {
    input.value = slider.value;
    calcROI();
  });

  input.addEventListener('input', () => {
    const val = parseFloat(input.value) || 0;
    if (val >= parseFloat(slider.min) && val <= parseFloat(slider.max)) {
      slider.value = val;
    }
    calcROI();
  });
}

function initROICalculator() {
  // Sync all slider/input pairs
  syncSliderInput('roiPoliciesSlider', 'roiPolicies');
  syncSliderInput('roiHoursSlider', 'roiHours');
  syncSliderInput('roiUsRateSlider', 'roiUsRate');

  // Initial calculation
  calcROI();
}

/* ═══════════════════════════════════════════════
   CONTACT FORM — FORMSPREE BACKEND
   ═══════════════════════════════════════════════ */
async function handleSubmit(btn) {
  const form = btn.closest('form') || btn.parentElement;

  /* Collect data */
  const data = {
    name: form.querySelector('[name="name"]')?.value || '',
    agency: form.querySelector('[name="agency"]')?.value || '',
    email: form.querySelector('[name="email"]')?.value || '',
    phone: form.querySelector('[name="phone"]')?.value || '',
    service: form.querySelector('[name="service"]')?.value || '',
    message: form.querySelector('[name="message"]')?.value || ''
  };

  /* Loading state */
  btn.textContent = 'Sending…';
  btn.classList.add('loading');
  btn.disabled = true;

  /* If placeholder URL — show demo success */
  if (FORMSPREE_URL.includes('YOUR_FORM_ID')) {
    await new Promise(r => setTimeout(r, 1000));
    btn.classList.remove('loading');
    btn.classList.add('success');
    btn.textContent = '✓ Message Sent! We\'ll be in touch within 24 hours.';
    return;
  }

  try {
    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    btn.classList.remove('loading');
    if (res.ok) {
      btn.classList.add('success');
      btn.textContent = '✓ Message Sent! We\'ll be in touch within 24 hours.';
    } else {
      throw new Error('Server error');
    }
  } catch {
    btn.classList.remove('loading');
    btn.classList.add('error');
    btn.textContent = '✗ Error sending. Please email us directly.';
    btn.disabled = false;
    setTimeout(() => {
      btn.classList.remove('error');
      btn.textContent = 'Try Again';
    }, 4000);
  }
}

/* ═══════════════════════════════════════════════
   MOBILE NAV
   ═══════════════════════════════════════════════ */
function openMobileNav() {
  document.getElementById('mobileNavOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  document.getElementById('mobileNavOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function toggleMobileDropdown(element) {
  const parent = element.parentElement;
  parent.classList.toggle('open');
}

/* ═══════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* Interactive Hero */
  initInteractiveHero();

  /* Mobile nav */
  const hamburger = document.getElementById('navHamburger');
  const closeBtn = document.getElementById('mobileNavClose');
  const overlay = document.getElementById('mobileNavOverlay');
  if (hamburger) hamburger.addEventListener('click', openMobileNav);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeMobileNav(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });

  /* FAQ accordion */
  initFaqAccordion();

  /* Scroll animations */
  observeAnimations();

  /* Active nav — default to home */
  updateActiveNav('home');

  /* WhatsApp button */
  const waBtn = document.getElementById('whatsappFloatBtn');
  if (waBtn) {
    waBtn.href = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${WHATSAPP_MESSAGE}`;
  }

  /* Upwork links */
  document.querySelectorAll('.upwork-link').forEach(el => {
    el.href = UPWORK_URL;
  });

  /* ROI calculator */
  initROICalculator();
});
