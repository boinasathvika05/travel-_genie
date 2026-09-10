document.addEventListener('DOMContentLoaded', () => {
 
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('contactSubmit');
  const status = document.getElementById('formStatus');
 
  if (!form) return;
 
  form.addEventListener('submit', () => {
    // Lightweight UX feedback while the request goes through.
    // Server-side handling (Django view) still processes the actual POST.
    if (submitBtn) {
      submitBtn.style.pointerEvents = 'none';
      submitBtn.style.opacity = '0.75';
    }
    if (status) {
      status.textContent = 'Sending your message...';
    }
  });
 
});