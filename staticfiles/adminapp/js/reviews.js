/* ============================================================
   TravelGenie Admin — reviews.js
   Page-specific behaviour for the Reviews page ONLY.
   Shared layout logic (sidebar, theme, topbar) lives in admin_base.js.
   ============================================================ */
 
(function () {
  "use strict";
 
  const searchInput = document.getElementById("reviewSearch");
  const ratingFilter = document.getElementById("ratingFilter");
  const statusFilter = document.getElementById("statusFilter");
  const typeFilter = document.getElementById("typeFilter");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
 
  const tableBody = document.getElementById("reviewsTableBody");
  const emptyState = document.getElementById("reviewsEmptyState");
  const refreshBtn = document.getElementById("refreshReviewsBtn");
  const moderateBtn = document.getElementById("moderateBtn");
 
  const paginationInfo = document.querySelector(".pagination-info");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
 
  /* ------------------------------------------------------------
     DATA SOURCE
     No reviews exist yet. Once the backend endpoint is wired up,
     replace `reviewsData` with the server-rendered / fetched list.
  ------------------------------------------------------------ */
  let reviewsData = [
    { user: "Sarah M.", target: "Grand Hotel Paris", rating: 5, text: "Absolutely loved my stay here. The view of the Eiffel Tower was breathtaking!", date: "2023-10-15", status: "approved", type: "hotel" },
    { user: "John D.", target: "Tokyo Resort", rating: 4, text: "Great amenities but the check-in process was a bit slow.", date: "2023-10-12", status: "approved", type: "hotel" },
    { user: "Emma W.", target: "London Inn", rating: 5, text: "Perfect location and very friendly staff.", date: "2023-10-10", status: "pending", type: "hotel" },
    { user: "Michael T.", target: "Rome Villas", rating: 3, text: "Nice place but quite noisy at night.", date: "2023-10-08", status: "approved", type: "hotel" },
    { user: "Alex B.", target: "Bali Getaway", rating: 1, text: "Terrible experience. Room was not clean and AC was broken.", date: "2023-10-05", status: "reported", type: "destination" },
    { user: "Sophia L.", target: "Swiss Alps", rating: 5, text: "A truly magical winter wonderland experience.", date: "2023-10-01", status: "approved", type: "destination" }
  ];
 
  /* ------------------------------------------------------------
     RENDER — table rows or empty state
  ------------------------------------------------------------ */
  function renderReviews(list) {
    if (!tableBody || !emptyState) return;
 
    if (!list || list.length === 0) {
      tableBody.innerHTML = "";
      emptyState.style.display = "flex";
      updatePagination(0, 0, 0);
      return;
    }
 
    emptyState.style.display = "none";
    tableBody.innerHTML = list.map(rowTemplate).join("");
    updatePagination(1, list.length, list.length);
  }
 
  function rowTemplate(review) {
    return (
      '<tr>' +
        '<td>' + escapeHtml(review.user) + '</td>' +
        '<td>' + escapeHtml(review.target) + '</td>' +
        '<td>' + starRatingTemplate(review.rating) + '</td>' +
        '<td>' + escapeHtml(review.text) + '</td>' +
        '<td>' + escapeHtml(review.date) + '</td>' +
        '<td>' + statusBadgeTemplate(review.status) + '</td>' +
        '<td class="th-actions">' + actionsTemplate() + '</td>' +
      '</tr>'
    );
  }
 
  function starRatingTemplate(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += i <= rating
        ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.9-5 4.8 1.3 6.8L12 17.6l-6.1 3.2 1.3-6.8-5-4.8 6.9-.9L12 2z"/></svg>'
        : '<svg class="star-empty" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.9-5 4.8 1.3 6.8L12 17.6l-6.1 3.2 1.3-6.8-5-4.8 6.9-.9L12 2z"/></svg>';
    }
    return '<span class="star-rating">' + stars + '</span>';
  }
 
  function statusBadgeTemplate(status) {
    const map = {
      approved: ["badge-success", "Approved"],
      pending: ["badge-warning", "Pending"],
      reported: ["badge-reported", "Reported"]
    };
    const cfg = map[status] || ["badge-warning", "Pending"];
    return '<span class="badge ' + cfg[0] + '">' + cfg[1] + '</span>';
  }
 
  function actionsTemplate() {
    return (
      '<button type="button" class="pill-btn" data-action="view">View</button>'
    );
  }
 
  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
 
  /* ------------------------------------------------------------
     PAGINATION LABEL
  ------------------------------------------------------------ */
  function updatePagination(from, to, total) {
    if (!paginationInfo) return;
    paginationInfo.textContent = "Showing " + from + " to " + to + " of " + total + " Reviews";
    const noData = total === 0;
    if (prevPageBtn) prevPageBtn.disabled = true;
    if (nextPageBtn) nextPageBtn.disabled = noData || total <= to;
  }
 
  /* ------------------------------------------------------------
     FILTERING (client-side, applies once real data exists)
  ------------------------------------------------------------ */
  function applyFilters() {
    const q = (searchInput && searchInput.value.trim().toLowerCase()) || "";
    const rating = ratingFilter ? ratingFilter.value : "";
    const status = statusFilter ? statusFilter.value : "";
    const type = typeFilter ? typeFilter.value : "";
 
    const filtered = reviewsData.filter(function (review) {
      const matchesQuery =
        !q ||
        review.user.toLowerCase().includes(q) ||
        review.target.toLowerCase().includes(q);
      const matchesRating = !rating || String(review.rating) === rating;
      const matchesStatus = !status || review.status === status;
      const matchesType = !type || review.type === type;
      return matchesQuery && matchesRating && matchesStatus && matchesType;
    });
 
    renderReviews(filtered);
  }
 
  function resetFilters() {
    if (searchInput) searchInput.value = "";
    if (ratingFilter) ratingFilter.value = "";
    if (statusFilter) statusFilter.value = "";
    if (typeFilter) typeFilter.value = "";
    applyFilters();
  }
 
  if (searchInput) searchInput.addEventListener("input", debounce(applyFilters, 200));
  if (ratingFilter) ratingFilter.addEventListener("change", applyFilters);
  if (statusFilter) statusFilter.addEventListener("change", applyFilters);
  if (typeFilter) typeFilter.addEventListener("change", applyFilters);
  if (resetFiltersBtn) resetFiltersBtn.addEventListener("click", resetFilters);
 
  function debounce(fn, delay) {
    let timer;
    return function () {
      clearTimeout(timer);
      const args = arguments;
      timer = setTimeout(function () { fn.apply(null, args); }, delay);
    };
  }
 
  /* ------------------------------------------------------------
     REFRESH — re-check for newly submitted reviews
     Hook this up to a real fetch() call against the reviews API
     once it exists; for now it just re-renders current state.
  ------------------------------------------------------------ */
  function refreshReviews() {
    if (!refreshBtn) return;
    const originalLabel = refreshBtn.innerHTML;
    refreshBtn.disabled = true;
    refreshBtn.style.opacity = "0.7";
 
    setTimeout(function () {
      // TODO: replace with real fetch of latest reviews from the server
      applyFilters();
      refreshBtn.disabled = false;
      refreshBtn.style.opacity = "1";
      refreshBtn.innerHTML = originalLabel;
    }, 500);
  }
 
  if (refreshBtn) refreshBtn.addEventListener("click", refreshReviews);
 
  /* ------------------------------------------------------------
     MODERATE REVIEWS — entry point for moderation flow
  ------------------------------------------------------------ */
  if (moderateBtn) {
    moderateBtn.addEventListener("click", function () {
      // TODO: wire up to the moderation queue / modal once available
      console.log("Open review moderation panel");
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
    renderReviews(reviewsData);
    initScrollReveal();
  });
})();
 