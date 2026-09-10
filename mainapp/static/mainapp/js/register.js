document.addEventListener('DOMContentLoaded', () => {
 
  /* =========================================================
     SHOW / HIDE PASSWORD (both fields)
  ========================================================= */
  document.querySelectorAll('.toggle-pass').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;
 
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
      btn.classList.toggle('active', isHidden);
    });
  });
 
  /* =========================================================
     CONFIRM PASSWORD MATCH CHECK
  ========================================================= */
  const form = document.getElementById('registerForm');
  const password = document.getElementById('regPassword');
  const confirmPassword = document.getElementById('confirmPassword');
 
  function validateMatch() {
    if (!password || !confirmPassword) return true;
    const wrap = confirmPassword.closest('.input-wrap');
    const matches = confirmPassword.value === '' || confirmPassword.value === password.value;
    wrap.classList.toggle('input-error', !matches);
    return matches;
  }
 
  if (confirmPassword) {
    confirmPassword.addEventListener('input', validateMatch);
    password?.addEventListener('input', validateMatch);
  }
 
  if (form) {
    form.addEventListener('submit', (e) => {
      if (!validateMatch()) {
        e.preventDefault();
        confirmPassword.focus();
      }
    });
  }
 
});