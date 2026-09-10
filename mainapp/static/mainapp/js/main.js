document.addEventListener('DOMContentLoaded', () => {
 
  /* =========================================================
     SIDEBAR TOGGLE
  ========================================================= */
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const hamburgerFab = document.getElementById('hamburgerFab');
  const menuBtn = document.getElementById('menuBtn');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
 
  const isMobile = () => window.innerWidth <= 900;
 
  function openSidebar() {
    if (isMobile()) {
      sidebar.classList.add('open');
      sidebarOverlay.classList.add('visible');
    } else {
      sidebar.classList.remove('closed');
      mainContent.classList.remove('expanded');
      hamburgerFab.classList.remove('visible');
    }
  }
 
  function closeSidebar() {
    if (isMobile()) {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('visible');
    } else {
      sidebar.classList.add('closed');
      mainContent.classList.add('expanded');
      hamburgerFab.classList.add('visible');
    }
  }
 
  menuBtn.addEventListener('click', () => {
    const currentlyOpen = isMobile()
      ? sidebar.classList.contains('open')
      : !sidebar.classList.contains('closed');
    currentlyOpen ? closeSidebar() : openSidebar();
  });
 
  sidebarClose.addEventListener('click', closeSidebar);
  hamburgerFab.addEventListener('click', openSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
 
  // Reset sidebar state cleanly when crossing the mobile/desktop breakpoint
  let lastIsMobile = isMobile();
  window.addEventListener('resize', () => {
    const nowMobile = isMobile();
    if (nowMobile !== lastIsMobile) {
      sidebar.classList.remove('open', 'closed');
      mainContent.classList.remove('expanded');
      sidebarOverlay.classList.remove('visible');
      hamburgerFab.classList.remove('visible');
      lastIsMobile = nowMobile;
    }
  });
 
  /* =========================================================
     THEME TOGGLE
  ========================================================= */
  const themeToggle = document.getElementById('themeToggle');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');
 
  let currentTheme = 'light';
 
  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', currentTheme);
    const isDark = currentTheme === 'dark';
    themeIconSun.style.display = isDark ? 'none' : 'block';
    themeIconMoon.style.display = isDark ? 'block' : 'none';
  });
 
  /* =========================================================
     SCROLL REVEAL
  ========================================================= */
  const revealEls = document.querySelectorAll('.reveal');
 
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
 
  revealEls.forEach((el) => revealObserver.observe(el));
 
  /* =========================================================
     SUGGESTION CHIPS -> FILL PROMPT INPUT
  ========================================================= */
  const promptInput = document.getElementById('promptInput');
  const chips = document.querySelectorAll('.chip');
 
  const chipPrompts = {
    'Family Trip': 'Plan a 5-day family-friendly trip with kid activities',
    'Honeymoon': 'Plan a romantic 7-day honeymoon getaway',
    'Budget Trip': 'Plan a 5-day trip to Japan under $2,000',
    'Adventure': 'Plan an adrenaline-packed 6-day adventure trip'
  };
 
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const label = chip.textContent.trim();
      promptInput.value = chipPrompts[label] || label;
      promptInput.focus();
    });
  });
 
  /* =========================================================
     PROMPT SEND BUTTON
  ========================================================= */
  const promptSend = document.getElementById('promptSend');
 
  function handleSend() {
    const value = promptInput.value.trim();
    if (!value) {
      promptInput.focus();
      return;
    }
    promptSend.style.transform = 'scale(0.9)';
    setTimeout(() => { promptSend.style.transform = ''; }, 180);
    // Placeholder action: in production this would route to the AI planner
    console.log('TravelGenie prompt submitted:', value);
  }
 
  promptSend.addEventListener('click', handleSend);
  promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
 
  /* =========================================================
     SMOOTH SCROLL FOR NAV LINKS
  ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (isMobile()) closeSidebar();
      }
    });
  });
 
});
 