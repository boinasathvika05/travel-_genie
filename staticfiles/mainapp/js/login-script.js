
document.addEventListener('DOMContentLoaded', () => {
 
  /* =========================================================
     ELEMENTS
  ========================================================= */
  const tabsWrap = document.querySelector('.login-tabs');
  const userTab = document.getElementById('userTab');
  const adminTab = document.getElementById('adminTab');
 
  const loginTitle = document.getElementById('loginTitle');
  const loginSubtitle = document.getElementById('loginSubtitle');
  const loginForm = document.getElementById('loginForm');
  const loginMode = document.getElementById('loginMode');
  const submitLabel = document.getElementById('submitLabel');
  const signupLine = document.getElementById('signupLine');
 
  if (!tabsWrap || !userTab || !adminTab) return;
 
  const content = {
    user: {
      title: 'Welcome Back!',
      subtitle: 'Login to continue your journey with TravelGenie.',
      submit: 'Login',
      showSignup: true
    },
    admin: {
      title: 'Administrator Login',
      subtitle: 'Sign in to manage TravelGenie from the admin console.',
      submit: 'Admin Login',
      showSignup: false
    }
  };
 
  /* =========================================================
     TAB SWITCH
  ========================================================= */
  function setMode(mode) {
    if (tabsWrap.dataset.active === mode) return;
 
    tabsWrap.dataset.active = mode;
    userTab.classList.toggle('active', mode === 'user');
    adminTab.classList.toggle('active', mode === 'admin');
    loginMode.value = mode;
 
    // brief fade/slide animation while content swaps
    loginForm.classList.add('switching');
 
    setTimeout(() => {
      loginTitle.textContent = content[mode].title;
      loginSubtitle.textContent = content[mode].subtitle;
      submitLabel.textContent = content[mode].submit;
      signupLine.style.display = content[mode].showSignup ? 'block' : 'none';
    }, 175); // halfway through the 0.35s switching animation
 
    loginForm.addEventListener('animationend', () => {
      loginForm.classList.remove('switching');
    }, { once: true });
  }
 
  const initialMode = loginMode.value || 'user';
  tabsWrap.dataset.active = initialMode;
  userTab.classList.toggle('active', initialMode === 'user');
  adminTab.classList.toggle('active', initialMode === 'admin');
  loginTitle.textContent = content[initialMode].title;
  loginSubtitle.textContent = content[initialMode].subtitle;
  submitLabel.textContent = content[initialMode].submit;
  signupLine.style.display = content[initialMode].showSignup ? 'block' : 'none';

  userTab.addEventListener('click', () => setMode('user'));
  adminTab.addEventListener('click', () => setMode('admin'));
 
  /* =========================================================
     SHOW / HIDE PASSWORD
  ========================================================= */
  const togglePass = document.getElementById('togglePass');
  const passwordInput = document.getElementById('password');
 
  if (togglePass && passwordInput) {
    togglePass.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      togglePass.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
      togglePass.classList.toggle('active', isHidden);
    });
  }
 
});