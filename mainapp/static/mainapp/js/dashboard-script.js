/* ==========================================================================
   TravelGenie — Dashboard interactions
   ========================================================================== */
 
document.addEventListener('DOMContentLoaded', () => {
 
  /* ---------- Sidebar (mobile) open / close ---------- */
  const sidebar        = document.getElementById('sidebar');
  const overlay        = document.getElementById('sidebarOverlay');
  const menuToggle      = document.getElementById('menuToggle');
  const sidebarClose    = document.getElementById('sidebarClose');
 
  function openSidebar(){
    sidebar.classList.add('open');
    overlay.classList.add('visible');
  }
  function closeSidebar(){
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  }
 
  menuToggle && menuToggle.addEventListener('click', openSidebar);
  sidebarClose && sidebarClose.addEventListener('click', closeSidebar);
  overlay && overlay.addEventListener('click', closeSidebar);
 
  // Close the mobile sidebar automatically when a nav link is tapped
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 900) closeSidebar();
    });
  });
 
  /* ---------- Theme toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  themeToggle && themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('travelgenie_theme', isDark ? 'dark' : 'light');
    
    const icon = themeToggle.querySelector('i');
    if (icon) {
      if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    }
  });
 
  /* ---------- Dynamic "Good Morning / Afternoon / Evening" greeting ----------
     Uses the visitor's local time so it's always accurate, then keeps the
     Django-rendered name that already sits next to it in the DOM. */
  const greetingWord = document.getElementById('greetingWord');
  if (greetingWord) {
    const hour = new Date().getHours();
    let greeting = 'Good Evening,';
    if (hour < 12) greeting = 'Good Morning,';
    else if (hour < 18) greeting = 'Good Afternoon,';
    greetingWord.textContent = greeting;
  }
 
  /* ---------- User menu dropdown ---------- */
  const userMenuToggle = document.getElementById('userMenuToggle');
  const userDropdownMenu = document.getElementById('userDropdownMenu');
 
  /* ---------- Quick action + dashboard card ripple-ish feedback ---------- */
  document.querySelectorAll('.qa-card, .dest-chip, .ai-cta, .premium-btn').forEach(el => {
    el.addEventListener('click', () => {
      el.style.transform = 'scale(0.97)';
      setTimeout(() => { el.style.transform = ''; }, 140);
    });
  });

  /* ---------- Notifications & Messages Dropdowns ---------- */
  const notifToggle = document.getElementById('notifToggle');
  const notifMenu = document.getElementById('notifMenu');
  const msgToggle = document.getElementById('msgToggle');
  const msgMenu = document.getElementById('msgMenu');

  function closeDropdowns(exceptMenu) {
    if (notifMenu && notifMenu !== exceptMenu) notifMenu.classList.remove('show');
    if (msgMenu && msgMenu !== exceptMenu) msgMenu.classList.remove('show');
    if (userDropdownMenu && userDropdownMenu !== exceptMenu) userDropdownMenu.classList.remove('show');
  }

  if (notifToggle && notifMenu) {
    notifToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = notifMenu.classList.contains('show');
      closeDropdowns();
      if (!isOpen) notifMenu.classList.add('show');
    });
  }

  if (msgToggle && msgMenu) {
    msgToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = msgMenu.classList.contains('show');
      closeDropdowns();
      if (!isOpen) msgMenu.classList.add('show');
    });
  }

  if (userMenuToggle && userDropdownMenu) {
    userMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = userDropdownMenu.classList.contains('show');
      closeDropdowns();
      if (!isOpen) userDropdownMenu.classList.add('show');
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-wrapper')) {
      closeDropdowns();
    }
  });

});
 
