/* ============================================================
   TravelGenie Admin — reports.js
   Page-specific behaviour for the Reports page ONLY.
   ============================================================ */
 
(function () {
  "use strict";

  /* ------------------------------------------------------------
     MODAL LOGIC
  ------------------------------------------------------------ */
  function initModal() {
    const modal = document.getElementById("generateReportModal");
    const closeBtn = document.getElementById("closeReportModalBtn");
    const cancelBtn = document.getElementById("cancelReportModalBtn");
    
    const generateReportBtn = document.getElementById("generateReportBtn");
    const filterGenerateBtn = document.getElementById("filterGenerateBtn");
    const emptyGenerateBtn = document.getElementById("emptyGenerateBtn");

    function openModal() {
      if (modal) modal.classList.add("show");
    }

    function closeModal() {
      if (modal) modal.classList.remove("show");
    }

    if (generateReportBtn) generateReportBtn.addEventListener("click", openModal);
    if (filterGenerateBtn) filterGenerateBtn.addEventListener("click", openModal);
    if (emptyGenerateBtn) emptyGenerateBtn.addEventListener("click", openModal);

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
      });
    }
  }
 
  /* ------------------------------------------------------------
     FILTERING (client-side DOM filtering)
  ------------------------------------------------------------ */
  function applyFilters() {
    const reportTypeFilter = document.getElementById("reportTypeFilter");
    const exportFormatFilter = document.getElementById("exportFormatFilter");
    const tableBody = document.getElementById("reportsTableBody");
    const paginationInfo = document.querySelector(".pagination-info");

    const type = reportTypeFilter ? reportTypeFilter.value.toLowerCase() : "";
    const format = exportFormatFilter ? exportFormatFilter.value.toLowerCase() : "";
 
    if (!tableBody) return;
    
    const rows = tableBody.querySelectorAll("tr");
    let visibleCount = 0;

    rows.forEach(function(row) {
      const rowType = row.dataset.type || "";
      const rowFormat = row.dataset.format || "";
      
      const matchesType = !type || rowType === type;
      const matchesFormat = !format || rowFormat === format;
      
      if (matchesType && matchesFormat) {
        row.style.display = "";
        visibleCount++;
      } else {
        row.style.display = "none";
      }
    });

    if (paginationInfo) {
      paginationInfo.textContent = "Showing 1 to " + visibleCount + " of " + visibleCount + " Reports";
    }
  }
 
  function resetFilters() {
    const reportTypeFilter = document.getElementById("reportTypeFilter");
    const dateRangeFilter = document.getElementById("dateRangeFilter");
    const exportFormatFilter = document.getElementById("exportFormatFilter");

    if (reportTypeFilter) reportTypeFilter.value = "";
    if (dateRangeFilter) dateRangeFilter.value = "";
    if (exportFormatFilter) exportFormatFilter.value = "";
    applyFilters();
  }
 
  function initFilters() {
    const reportTypeFilter = document.getElementById("reportTypeFilter");
    const exportFormatFilter = document.getElementById("exportFormatFilter");
    const resetFiltersBtn = document.getElementById("resetFiltersBtn");
    
    if (reportTypeFilter) reportTypeFilter.addEventListener("change", applyFilters);
    if (exportFormatFilter) exportFormatFilter.addEventListener("change", applyFilters);
    if (resetFiltersBtn) resetFiltersBtn.addEventListener("click", resetFilters);
  }

  /* ------------------------------------------------------------
     SCROLL REVEAL
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
    initModal();
    initFilters();
    initScrollReveal();
    applyFilters();
  });
})();