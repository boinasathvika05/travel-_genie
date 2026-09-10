/* ============================================================
   TravelGenie Admin — admin_base.js
   Shared layout behaviour ONLY: sidebar, navbar, theme, dropdowns.
   Page-specific logic belongs in each page's {% block extra_js %}.
   ============================================================ */
 
(function () {
  "use strict";
 
  const STORAGE_THEME = "tg_admin_theme";
  const STORAGE_SIDEBAR = "tg_admin_sidebar_collapsed";
 
  const html = document.documentElement;

  /* ------------------------------------------------------------
     1. THEME (light / dark) — persisted in localStorage
  ------------------------------------------------------------ */
  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    const isDark = theme === "dark";
    const themeIconSun = document.getElementById("themeIconSun");
    const themeIconMoon = document.getElementById("themeIconMoon");
    if (themeIconSun && themeIconMoon) {
      themeIconSun.style.display = isDark ? "block" : "none";
      themeIconMoon.style.display = isDark ? "none" : "block";
    }
  }
 
  function initTheme() {
    const saved = localStorage.getItem(STORAGE_THEME);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));

    // Event listener removed here in favor of inline onclick
  }

  window.toggleTheme = function() {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("tg_admin_theme", next);
  };
 
  /* ------------------------------------------------------------
     2. SIDEBAR — desktop collapse (persisted) + mobile slide-in
  ------------------------------------------------------------ */
  function setSidebarCollapsed(collapsed) {
    const appShell = document.querySelector(".app-shell");
    if (appShell) appShell.classList.toggle("sidebar-collapsed", collapsed);
    localStorage.setItem(STORAGE_SIDEBAR, collapsed ? "1" : "0");
  }
 
  function initSidebarState() {
    const collapsed = localStorage.getItem(STORAGE_SIDEBAR) === "1";
    setSidebarCollapsed(collapsed);
    
    const collapseBtn = document.getElementById("collapseBtn");
    const appShell = document.querySelector(".app-shell");
    if (collapseBtn && appShell) {
      collapseBtn.addEventListener("click", function () {
        const isCollapsed = appShell.classList.contains("sidebar-collapsed");
        setSidebarCollapsed(!isCollapsed);
      });
    }

    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");

    function openMobileSidebar() {
      if(sidebar) sidebar.classList.add("mobile-open");
      if(sidebarOverlay) sidebarOverlay.classList.add("visible");
    }
    function closeMobileSidebar() {
      if(sidebar) sidebar.classList.remove("mobile-open");
      if(sidebarOverlay) sidebarOverlay.classList.remove("visible");
    }
    
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", function () {
        const isOpen = sidebar && sidebar.classList.contains("mobile-open");
        isOpen ? closeMobileSidebar() : openMobileSidebar();
      });
    }
    if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeMobileSidebar);
   
    // Close the mobile sidebar automatically if the viewport grows back to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1180) closeMobileSidebar();
    });
  }
 
  /* ------------------------------------------------------------
     3. ACTIVE NAVIGATION — fallback for when data-page is set
        (server-side `.active` class from url_name always wins;
        this only fills in if that comparison didn't match)
  ------------------------------------------------------------ */
  function markActiveNavFallback() {
    const current = document.body.getAttribute("data-page");
    if (!current) return;
 
    const alreadyActive = document.querySelector(".nav-item.active");
    if (alreadyActive) return;
 
    const match = document.querySelector('.nav-item[data-page="' + current + '"]');
    if (match) match.classList.add("active");
  }
 
  /* ------------------------------------------------------------
     4. TOPBAR — subtle shadow once the page scrolls
  ------------------------------------------------------------ */
  function initTopbarScrollEffect() {
    const content = document.getElementById("pageContent");
    const topbar = document.getElementById("topbar");
    if (!content || !topbar) return;
    window.addEventListener("scroll", function () {
      topbar.classList.toggle("scrolled", window.scrollY > 4);
    });
  }
 
  /* ------------------------------------------------------------
     5. DROPDOWNS (Profile, Notifications, Messages)
  ------------------------------------------------------------ */
  function setupDropdown(menuEl, btnEl) {
    if (!menuEl || !btnEl) return;
    btnEl.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = menuEl.classList.toggle("open");
      btnEl.setAttribute("aria-expanded", isOpen ? "true" : "false");
      
      // Close other dropdowns
      document.querySelectorAll('.profile-menu.open').forEach(m => {
        if (m !== menuEl) {
          m.classList.remove('open');
          const btn = m.querySelector('button');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener("click", function (e) {
      if (!menuEl.contains(e.target)) {
        menuEl.classList.remove("open");
        btnEl.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        menuEl.classList.remove("open");
        btnEl.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initDropdowns() {
    const profileMenu = document.getElementById("profileMenu");
    const profileChipBtn = document.getElementById("profileChipBtn");
    
    setupDropdown(profileMenu, profileChipBtn);
    setupDropdown(document.getElementById("notifMenu"), document.getElementById("notifBtn"));
    setupDropdown(document.getElementById("msgMenu"), document.getElementById("msgBtn"));
  }
 
  /* ------------------------------------------------------------
     6. SEARCH BAR — focus ring + ⌘K / Ctrl+K shortcut
  ------------------------------------------------------------ */
  function initSearchShortcut() {
    const globalSearch = document.getElementById("globalSearch");
    if (!globalSearch) return;
    document.addEventListener("keydown", function (e) {
      const isShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isShortcut) {
        e.preventDefault();
        globalSearch.focus();
      }
      if (e.key === "Escape" && document.activeElement === globalSearch) {
        globalSearch.blur();
      }
    });
  }
 
  /* ------------------------------------------------------------
     7. SMOOTH SCROLL for in-page anchor links (#section)
  ------------------------------------------------------------ */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
 
  /* ------------------------------------------------------------
     INIT
  ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initSidebarState();
    markActiveNavFallback();
    initTopbarScrollEffect();
    initDropdowns();
    initSearchShortcut();
    initSmoothScroll();

    const logoutBtn = document.getElementById("logoutBtn");
    const overlay = document.getElementById("logoutOverlay");
    const cancelBtn = document.getElementById("cancelLogout");

    if (logoutBtn && overlay) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            overlay.classList.add("show");
        });
    }

    if (cancelBtn && overlay) {
        cancelBtn.addEventListener("click", function () {
            overlay.classList.remove("show");
        });
    }

    if (overlay) {
        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) {
                overlay.classList.remove("show");
            }
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && overlay) {
            overlay.classList.remove("show");
        }
    });

    // Mock Action Buttons Logic for MVP Demo
    function showGlobalToast(message, type="success") {
        let container = document.querySelector(".toast-container");
        if (!container) {
            container = document.createElement("div");
            container.className = "toast-container";
            document.body.appendChild(container);
        }
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3300);
    }

    document.addEventListener("click", function(e) {
        const actionBtn = e.target.closest(".action-btn") || e.target.closest(".row-action-btn") || e.target.closest(".pill-btn");
        if (!actionBtn) return;
        
        if (actionBtn.disabled) return; // Users page has some disabled buttons

        if (actionBtn.classList.contains("action-danger") || actionBtn.classList.contains("row-action-danger") || actionBtn.getAttribute("title") === "Delete") {
            if (confirm("Are you sure you want to delete this item?")) {
                const tr = actionBtn.closest("tr");
                if (tr) tr.remove();
                showGlobalToast("Item deleted successfully!", "success");
            }
        } else if (actionBtn.getAttribute("data-action") === "view" || actionBtn.textContent.trim() === "View") {
            showGlobalToast("View details functionality coming soon!", "success");
        } else {
            showGlobalToast("Edit functionality coming soon!", "success");
        }
    });

  });
})();
 
