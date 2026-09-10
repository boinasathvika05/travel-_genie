document.addEventListener('DOMContentLoaded', () => {
 
  /* =========================================================
     SIDEBAR TOGGLE (Mobile Only)
  ========================================================= */
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menuBtn');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
 
  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('visible');
  }
 
  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('visible');
  }
 
  menuBtn.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
 
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);
 
  // Reset sidebar state cleanly when resizing back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeSidebar();
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