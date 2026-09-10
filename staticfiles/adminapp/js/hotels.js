/* ============================================================
   TravelGenie Admin — hotels.js
   Page-specific behaviour for the Hotels page ONLY.
   Sidebar / navbar / theme logic lives in admin_base.js.
   ============================================================ */
 
(function () {
  "use strict";
 
  const searchInput = document.getElementById("hotelSearch");
  const filterStatus = document.getElementById("filterStatus");
  const filterCity = document.getElementById("filterCity");
  const filterRating = document.getElementById("filterRating");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const tableBody = document.getElementById("hotelsTableBody");
 
  /* ------------------------------------------------------------
     1. RIPPLE EFFECT — applied to any .ripple button on click
  ------------------------------------------------------------ */
  function initRipple() {
    document.querySelectorAll(".ripple").forEach(function (btn) {
      btn.addEventListener("click", function () {
        btn.classList.remove("rippling");
        // force reflow so the animation can restart on rapid clicks
        void btn.offsetWidth;
        btn.classList.add("rippling");
        window.setTimeout(function () {
          btn.classList.remove("rippling");
        }, 600);
      });
    });
  }
 
  /* ------------------------------------------------------------
     2. SEARCH & FILTERS
     No hotel data exists yet, so this simply keeps the empty
     state in sync and is ready to wire up to real data later
     (e.g. filtering rows rendered from the backend / an API call).
  ------------------------------------------------------------ */
  function getActiveFilters() {
    return {
      search: searchInput ? searchInput.value.trim().toLowerCase() : "",
      status: filterStatus ? filterStatus.value : "",
      city: filterCity ? filterCity.value : "",
      rating: filterRating ? filterRating.value : "",
    };
  }
 
  function applyFilters() {
    const filters = getActiveFilters();
 
    // Placeholder hook: once hotel rows are rendered from the backend,
    // this is where each <tr data-hotel-*> would be shown/hidden
    // based on `filters`. With zero hotels there is nothing to filter,
    // so the empty state simply remains visible.
    if (!tableBody) return;
 
    const rows = tableBody.querySelectorAll("tr:not(.empty-row)");
    if (rows.length === 0) return;
 
    rows.forEach(function (row) {
      const matchesSearch =
        !filters.search ||
        row.textContent.toLowerCase().includes(filters.search);
      const matchesStatus =
        !filters.status || row.dataset.status === filters.status;
      const matchesCity =
        !filters.city || row.dataset.city === filters.city;
      const matchesRating =
        !filters.rating || row.dataset.rating === filters.rating;
 
      const visible =
        matchesSearch && matchesStatus && matchesCity && matchesRating;
      row.style.display = visible ? "" : "none";
    });
  }
 
  function initFilters() {
    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }
    [filterStatus, filterCity, filterRating].forEach(function (select) {
      if (select) select.addEventListener("change", applyFilters);
    });
 
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", function () {
        if (searchInput) searchInput.value = "";
        if (filterStatus) filterStatus.value = "";
        if (filterCity) filterCity.value = "";
        if (filterRating) filterRating.value = "";
        applyFilters();
      });
    }
  }
 
  /* ------------------------------------------------------------
     3. SCROLL-REVEAL for elements below the fold
     (page-header/stats/table already animate in on load via CSS;
     this extends the same reveal to anything added further down)
  ------------------------------------------------------------ */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll(".hotels-page .reveal");
    if (!("IntersectionObserver" in window) || revealEls.length === 0) return;
 
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
 
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }
 
  /* ------------------------------------------------------------
     4. ADD HOTEL BUTTONS
  ------------------------------------------------------------ */
  function initAddHotelButtons() {
    const modal = document.getElementById("addHotelModal");
    const addButtons = document.querySelectorAll(".btn-add-hotel");
    const closeBtn = document.getElementById("closeHotelModalBtn");
    const cancelBtn = document.getElementById("cancelHotelModalBtn");

    function openModal() {
      if (modal) modal.classList.add("show");
    }

    function closeModal() {
      if (modal) modal.classList.remove("show");
    }

    addButtons.forEach(function (btn) {
      btn.addEventListener("click", openModal);
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

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
    initRipple();
    initFilters();
    initScrollReveal();
    initAddHotelButtons();
  });
})();
 