/* ============================================================
   TravelGenie Admin — settings.js
   Page-specific behaviour for the Settings page ONLY.
   Shared layout logic (sidebar, theme, topbar) lives in admin_base.js.
   ============================================================ */
 
(function () {
  "use strict";
 
  const STORAGE_THEME = "tg_admin_theme";
  const STORAGE_SIDEBAR = "tg_admin_sidebar_collapsed";
 
  const html = document.documentElement;
  const appShell = document.querySelector(".app-shell");
 
  const darkModeToggle = document.getElementById("darkModeToggle");
  const lightModeToggle = document.getElementById("lightModeToggle");
  const sidebarCollapseToggle = document.getElementById("sidebarCollapseToggle");
  const themePreview = document.getElementById("themePreview");
 
  const editProfileBtn = document.getElementById("editProfileBtn");
  const changePasswordBtn = document.getElementById("changePasswordBtn");
  const loginActivityBtn = document.getElementById("loginActivityBtn");
  const createBackupBtn = document.getElementById("createBackupBtn");
  const restoreBackupBtn = document.getElementById("restoreBackupBtn");
 
  const saveChangesTopBtn = document.getElementById("saveChangesTopBtn");
  const saveChangesBottomBtn = document.getElementById("saveChangesBottomBtn");
  const resetSettingsBtn = document.getElementById("resetSettingsBtn");
 
  /* ------------------------------------------------------------
     APPEARANCE — Dark / Light toggles stay in sync with each
     other and with the theme already applied by admin_base.js
  ------------------------------------------------------------ */
  function syncAppearanceToggles() {
    const isDark = html.getAttribute("data-theme") === "dark";
    if (darkModeToggle) darkModeToggle.checked = isDark;
    if (lightModeToggle) lightModeToggle.checked = !isDark;
  }
 
  function setTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_THEME, theme);
    syncAppearanceToggles();
  }
 
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", function () {
      setTheme(darkModeToggle.checked ? "dark" : "light");
    });
  }
  if (lightModeToggle) {
    lightModeToggle.addEventListener("change", function () {
      setTheme(lightModeToggle.checked ? "light" : "dark");
    });
  }
 
  /* ------------------------------------------------------------
     SIDEBAR COLLAPSE PREFERENCE
  ------------------------------------------------------------ */
  function syncSidebarToggle() {
    const collapsed = localStorage.getItem(STORAGE_SIDEBAR) === "1";
    if (sidebarCollapseToggle) sidebarCollapseToggle.checked = collapsed;
  }
 
  if (sidebarCollapseToggle) {
    sidebarCollapseToggle.addEventListener("change", function () {
      const collapsed = sidebarCollapseToggle.checked;
      if (appShell) appShell.classList.toggle("sidebar-collapsed", collapsed);
      localStorage.setItem(STORAGE_SIDEBAR, collapsed ? "1" : "0");
    });
  }
 
  /* ------------------------------------------------------------
     THEME PREVIEW — mirrors the current theme choice visually
  ------------------------------------------------------------ */
  function updateThemePreview() {
    if (!themePreview) return;
    const isDark = html.getAttribute("data-theme") === "dark";
    themePreview.classList.toggle("is-dark", isDark);
  }
 
  if (darkModeToggle) darkModeToggle.addEventListener("change", updateThemePreview);
  if (lightModeToggle) lightModeToggle.addEventListener("change", updateThemePreview);
 
  /* ------------------------------------------------------------
     ACTION BUTTONS — placeholders wired for future backend hookup
  ------------------------------------------------------------ */
  function bindActionButton(btn, label) {
    if (!btn) return;
    btn.addEventListener("click", function () {
      // TODO: replace with real navigation / modal / API call
      console.log(label + " clicked");
    });
  }
 
  bindActionButton(editProfileBtn, "Edit Profile");
  bindActionButton(changePasswordBtn, "Change Password");
  bindActionButton(loginActivityBtn, "View Login Activity");
 
  function bindBackupButton(btn, label) {
    if (!btn) return;
    btn.addEventListener("click", function () {
      const originalLabel = btn.innerHTML;
      btn.disabled = true;
      btn.style.opacity = "0.7";
      setTimeout(function () {
        // TODO: replace with a real backup/restore endpoint call
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.innerHTML = originalLabel;
        console.log(label + " completed");
      }, 600);
    });
  }
 
  bindBackupButton(createBackupBtn, "Create Backup");
  bindBackupButton(restoreBackupBtn, "Restore Backup");
 
  /* ------------------------------------------------------------
     SAVE / RESET
  ------------------------------------------------------------ */
  function collectSettings() {
    return {
      darkMode: darkModeToggle ? darkModeToggle.checked : false,
      sidebarCollapsed: sidebarCollapseToggle ? sidebarCollapseToggle.checked : false,
      emailNotifications: document.getElementById("emailNotifToggle")?.checked,
      browserNotifications: document.getElementById("browserNotifToggle")?.checked,
      bookingAlerts: document.getElementById("bookingAlertsToggle")?.checked,
      contactAlerts: document.getElementById("contactAlertsToggle")?.checked,
      twoFactor: document.getElementById("twoFactorToggle")?.checked,
      sessionTimeout: document.getElementById("sessionTimeoutSelect")?.value,
      language: document.getElementById("languageSelect")?.value,
      timezone: document.getElementById("timezoneSelect")?.value,
      currency: document.getElementById("currencySelect")?.value,
      dateFormat: document.getElementById("dateFormatSelect")?.value
    };
  }
 
  function saveSettings(triggerBtn) {
    if (!triggerBtn) return;
    const originalLabel = triggerBtn.innerHTML;
    triggerBtn.disabled = true;
    triggerBtn.style.opacity = "0.7";
 
    const payload = collectSettings();
 
    setTimeout(function () {
      // TODO: replace with a real POST to the settings endpoint using `payload`
      console.log("Saving settings", payload);
      triggerBtn.disabled = false;
      triggerBtn.style.opacity = "1";
      triggerBtn.innerHTML = originalLabel;
    }, 500);
  }
 
  if (saveChangesTopBtn) {
    saveChangesTopBtn.addEventListener("click", function () { saveSettings(saveChangesTopBtn); });
  }
  if (saveChangesBottomBtn) {
    saveChangesBottomBtn.addEventListener("click", function () { saveSettings(saveChangesBottomBtn); });
  }
 
  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener("click", function () {
      // Reset toggles/selects to sensible defaults
      if (emailToggleExists("emailNotifToggle")) document.getElementById("emailNotifToggle").checked = true;
      if (emailToggleExists("browserNotifToggle")) document.getElementById("browserNotifToggle").checked = false;
      if (emailToggleExists("bookingAlertsToggle")) document.getElementById("bookingAlertsToggle").checked = true;
      if (emailToggleExists("contactAlertsToggle")) document.getElementById("contactAlertsToggle").checked = true;
      if (emailToggleExists("twoFactorToggle")) document.getElementById("twoFactorToggle").checked = false;
 
      const sessionSelect = document.getElementById("sessionTimeoutSelect");
      if (sessionSelect) sessionSelect.value = "30";
      const langSelect = document.getElementById("languageSelect");
      if (langSelect) langSelect.value = "en";
      const tzSelect = document.getElementById("timezoneSelect");
      if (tzSelect) tzSelect.value = "UTC";
      const currSelect = document.getElementById("currencySelect");
      if (currSelect) currSelect.value = "USD";
      const dateSelect = document.getElementById("dateFormatSelect");
      if (dateSelect) dateSelect.value = "mdy";
    });
  }
 
  function emailToggleExists(id) {
    return !!document.getElementById(id);
  }
 
  /* ------------------------------------------------------------
     SCROLL REVEAL — retrigger fade-in for elements entering view
  ------------------------------------------------------------ */
  function initScrollReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length || !("IntersectionObserver" in window)) return;
 
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
 
    items.forEach(function (item) { observer.observe(item); });
  }
 
  /* ------------------------------------------------------------
     INIT
  ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    syncAppearanceToggles();
    syncSidebarToggle();
    updateThemePreview();
    initScrollReveal();
  });
})();
 