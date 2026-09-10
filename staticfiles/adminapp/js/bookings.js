/* ============================================================
   TravelGenie Admin — bookings.js
   Page-specific behaviour for the Bookings page ONLY.
   Sidebar / navbar / theme logic lives in admin_base.js.
   ============================================================ */
 
(function () {
  "use strict";
 
  const searchInput = document.getElementById("bookingSearch");
  const filterStatus = document.getElementById("filterStatus");
  const filterHotel = document.getElementById("filterHotel");
  const filterCheckin = document.getElementById("filterCheckin");
  const filterCheckout = document.getElementById("filterCheckout");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const refreshBtn = document.getElementById("refreshBookingsBtn");
  const tableBody = document.getElementById("bookingsTableBody");
 
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
     No booking data exists yet, so this simply keeps the empty
     state in sync and is ready to wire up to real data later
     (e.g. filtering rows rendered from the backend / an API call).
  ------------------------------------------------------------ */
  function getActiveFilters() {
    return {
      search: searchInput ? searchInput.value.trim().toLowerCase() : "",
      status: filterStatus ? filterStatus.value : "",
      hotel: filterHotel ? filterHotel.value : "",
      checkin: filterCheckin ? filterCheckin.value : "",
      checkout: filterCheckout ? filterCheckout.value : "",
    };
  }
 
  function applyFilters() {
    const filters = getActiveFilters();
 
    // Placeholder hook: once booking rows are rendered from the
    // backend, this is where each <tr data-booking-*> would be
    // shown/hidden based on `filters`. With zero bookings there
    // is nothing to filter, so the empty state simply remains visible.
    if (!tableBody) return;
 
    const rows = tableBody.querySelectorAll("tr:not(.empty-row)");
    if (rows.length === 0) return;
 
    rows.forEach(function (row) {
      const matchesSearch =
        !filters.search ||
        row.textContent.toLowerCase().includes(filters.search);
      const matchesStatus =
        !filters.status || row.dataset.status === filters.status;
      const matchesHotel =
        !filters.hotel || row.dataset.hotel === filters.hotel;
      const matchesCheckin =
        !filters.checkin || row.dataset.checkin === filters.checkin;
      const matchesCheckout =
        !filters.checkout || row.dataset.checkout === filters.checkout;
 
      const visible =
        matchesSearch &&
        matchesStatus &&
        matchesHotel &&
        matchesCheckin &&
        matchesCheckout;
      row.style.display = visible ? "" : "none";
    });
  }
 
  function initFilters() {
    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }
    [filterStatus, filterHotel, filterCheckin, filterCheckout].forEach(
      function (field) {
        if (field) field.addEventListener("change", applyFilters);
      }
    );
 
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", function () {
        if (searchInput) searchInput.value = "";
        if (filterStatus) filterStatus.value = "";
        if (filterHotel) filterHotel.value = "";
        if (filterCheckin) filterCheckin.value = "";
        if (filterCheckout) filterCheckout.value = "";
        applyFilters();
      });
    }
  }
 
  /* ------------------------------------------------------------
     3. REFRESH BUTTON — placeholder for re-fetching booking data
  ------------------------------------------------------------ */
  function initRefreshButton() {
    if (!refreshBtn) return;
    refreshBtn.addEventListener("click", function () {
      refreshBtn.classList.remove("spinning");
      void refreshBtn.offsetWidth;
      refreshBtn.classList.add("spinning");
      // Hook up to the real bookings fetch/reload when ready.
      console.log("Refresh clicked — connect this to your bookings fetch/reload.");
      window.setTimeout(function () {
        refreshBtn.classList.remove("spinning");
      }, 650);
    });
  }
 
  /* ------------------------------------------------------------
     4. SCROLL-REVEAL for elements below the fold
     (page-header/stats/table already animate in on load via CSS;
     this extends the same reveal to anything added further down)
  ------------------------------------------------------------ */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll(".bookings-page .reveal");
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
     5. ADD BOOKING BUTTONS — placeholder action
     Wire both the header button and the empty-state button to
     the same handler so they stay in sync with future routing.
  ------------------------------------------------------------ */
  function initAddBookingButtons() {
    const addButtons = document.querySelectorAll(
      ".btn-add-booking, .empty-state .btn-primary"
    );
    const modal = document.getElementById("addBookingModal");
    const closeBtn = document.getElementById("closeBookingModalBtn");
    const cancelBtn = document.getElementById("cancelBookingModalBtn");

    if (!modal) return;

    addButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        modal.classList.add("show");
      });
    });

    function closeModal() {
      modal.classList.remove("show");
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    // Close on overlay click
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
 
  /* ------------------------------------------------------------
     INIT
  ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initRipple();
    initFilters();
    initRefreshButton();
    initScrollReveal();
    initAddBookingButtons();
  });
})();
 