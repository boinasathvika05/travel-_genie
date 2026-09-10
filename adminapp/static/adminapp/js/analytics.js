/* ============================================================
   TravelGenie Admin — analytics.js
   Page-specific behaviour for the Analytics page ONLY.
   Shared layout logic (sidebar, theme, topbar) lives in admin_base.js.
   ============================================================ */
 
(function () {
  "use strict";
 
  const dateRangeFilter = document.getElementById("dateRangeFilter");
  const chartTypeFilter = document.getElementById("chartTypeFilter");
  const metricFilter = document.getElementById("metricFilter");
 
  const applyFiltersBtn = document.getElementById("applyFiltersBtn");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const exportAnalyticsBtn = document.getElementById("exportAnalyticsBtn");
 
  const recordsInfo = document.querySelector(".records-info strong");
 
  /* ------------------------------------------------------------
     DATA SOURCE
     No analytics data exists yet. Once the backend endpoint is
     wired up, fetch real metrics here and update the DOM
     (summary card values, chart placeholders, insights, records).
  ------------------------------------------------------------ */
  let analyticsData = {
    recordCount: 0
  };
 
  /* ------------------------------------------------------------
     APPLY / RESET FILTERS
     Client-side only for now — re-fetch and re-render once a
     real analytics endpoint exists.
  ------------------------------------------------------------ */
  function applyFilters() {
    const filters = {
      dateRange: dateRangeFilter ? dateRangeFilter.value : "",
      chartType: chartTypeFilter ? chartTypeFilter.value : "",
      metric: metricFilter ? metricFilter.value : ""
    };
 
    const hasFilters = filters.dateRange || filters.chartType || filters.metric;
    
    // Simulate updating summary cards with mock data
    const values = document.querySelectorAll(".summary-value");
    if (values.length >= 4) {
      if (hasFilters) {
        values[0].textContent = Math.floor(Math.random() * 5000) + 1000;
        values[1].textContent = Math.floor(Math.random() * 500) + 50;
        values[2].textContent = "$" + (Math.floor(Math.random() * 50000) + 10000).toLocaleString();
        values[3].textContent = Math.floor(Math.random() * 2000) + 500;
        updateRecordsCount(Math.floor(Math.random() * 500) + 50);
      } else {
        values[0].textContent = "0";
        values[1].textContent = "0";
        values[2].textContent = "$0";
        values[3].textContent = "0";
        updateRecordsCount(0);
      }
    }
  }
 
  function resetFilters() {
    if (dateRangeFilter) dateRangeFilter.value = "";
    if (chartTypeFilter) chartTypeFilter.value = "";
    if (metricFilter) metricFilter.value = "";
    applyFilters();
  }
 
  function updateRecordsCount(count) {
    if (recordsInfo) recordsInfo.textContent = count + " records";
  }
 
  if (applyFiltersBtn) applyFiltersBtn.addEventListener("click", applyFilters);
  if (resetFiltersBtn) resetFiltersBtn.addEventListener("click", resetFilters);
 
  /* ------------------------------------------------------------
     EXPORT ANALYTICS — entry point for export flow
  ------------------------------------------------------------ */
  if (exportAnalyticsBtn) {
    exportAnalyticsBtn.addEventListener("click", function () {
      const originalLabel = exportAnalyticsBtn.innerHTML;
      exportAnalyticsBtn.disabled = true;
      exportAnalyticsBtn.style.opacity = "0.7";
      exportAnalyticsBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Exporting...';
 
      setTimeout(function () {
        exportAnalyticsBtn.disabled = false;
        exportAnalyticsBtn.style.opacity = "1";
        exportAnalyticsBtn.innerHTML = originalLabel;
        
        const csvContent = "data:text/csv;charset=utf-8,Date,Total Visitors,Active Bookings,Revenue\n2026-08-01,142,12,$1250\n2026-08-02,185,18,$1890\n2026-08-03,164,15,$1420\n2026-08-04,210,22,$2100\n";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "travelgenie_analytics.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 800);
    });
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
    updateRecordsCount(analyticsData.recordCount);
    initScrollReveal();
  });
})();
 