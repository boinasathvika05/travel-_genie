/* ============================================================
   TravelGenie Admin — users.js
   Page-specific behaviour for the Users page ONLY.
   Sidebar, theme, profile dropdown, etc. are handled by
   admin_base.js and are not touched here.
 
   No CRUD logic yet — this only wires up the UI micro-interactions
   requested for the current (empty-state) version of the page.
   ============================================================ */
 
(function () {
  "use strict";
 
  const searchWrap = document.getElementById("usersSearch");
  const searchInput = document.getElementById("usersSearchInput");
  const roleFilter = document.getElementById("roleFilter");
  const statusFilter = document.getElementById("statusFilter");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const rippleButtons = document.querySelectorAll(".btn-ripple");
 
  /* ------------------------------------------------------------
     1. SEARCH INPUT — focus/active animation
  ------------------------------------------------------------ */
  function initSearchAnimation() {
    if (!searchWrap || !searchInput) return;
 
    searchInput.addEventListener("focus", function () {
      searchWrap.classList.add("is-focused");
    });
    searchInput.addEventListener("blur", function () {
      searchWrap.classList.remove("is-focused");
    });
  }
 
  /* ------------------------------------------------------------
     2. FILTER DROPDOWNS — open/close caret animation
  ------------------------------------------------------------ */
  function initFilterDropdownAnimation() {
    [roleFilter, statusFilter].forEach(function (select) {
      if (!select) return;
      const wrap = select.closest(".users-select-wrap");
      if (!wrap) return;
 
      select.addEventListener("focus", function () {
        wrap.classList.add("open");
      });
      select.addEventListener("blur", function () {
        wrap.classList.remove("open");
      });
      select.addEventListener("change", function () {
        wrap.classList.add("has-value");
        wrap.classList.toggle("has-value", select.value !== "");
      });
    });
  }
 
  /* ------------------------------------------------------------
     3. RESET FILTERS
  ------------------------------------------------------------ */
  function initResetFilters() {
    // Reset is now handled directly by the <a> tag href
  }
 
  /* ------------------------------------------------------------
     4. BUTTON RIPPLE EFFECT — used on .btn-ripple elements
        (e.g. "Add new user")
  ------------------------------------------------------------ */
  function attachRipple(button) {
    button.addEventListener("click", function (e) {
      const rect = button.getBoundingClientRect();
      const circle = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
 
      circle.className = "ripple-circle";
      circle.style.width = circle.style.height = size + "px";
      circle.style.left = (e.clientX - rect.left - size / 2) + "px";
      circle.style.top = (e.clientY - rect.top - size / 2) + "px";
 
      button.appendChild(circle);
      window.setTimeout(function () {
        circle.remove();
      }, 550);
    });
  }
 
  function initButtonRipples() {
    rippleButtons.forEach(attachRipple);
  }
 
  /* ------------------------------------------------------------
     5. ADD USER MODAL LOGIC
  ------------------------------------------------------------ */
  function initAddUserModal() {
    const modal = document.getElementById("addUserModal");
    const addBtn = document.getElementById("addUserBtn");
    const emptyAddBtn = document.getElementById("emptyStateAddUserBtn");
    const closeBtn = document.getElementById("closeModalBtn");
    const cancelBtn = document.getElementById("cancelModalBtn");

    function openModal() {
      if (modal) modal.classList.add("show");
    }

    function closeModal() {
      if (modal) modal.classList.remove("show");
    }

    if (addBtn) addBtn.addEventListener("click", openModal);
    if (emptyAddBtn) emptyAddBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    // Close on overlay click
    if (modal) {
      modal.addEventListener("click", function(e) {
        if (e.target === modal) {
          closeModal();
        }
      });
    }
  }

  /* ------------------------------------------------------------
     INIT
  ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initSearchAnimation();
    initFilterDropdownAnimation();
    initResetFilters();
    initButtonRipples();
    initAddUserModal();
    // Fade-in / slide-up entrance and the empty-state fade-in are
    // handled purely in CSS via [data-animate="slide-up"] and
    // .empty-state — no JS needed for those.
  });
})();