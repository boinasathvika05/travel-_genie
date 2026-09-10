/* ============================================================
   TravelGenie Admin — contacts.js
   Page-specific behaviour for the Contacts page ONLY.
   Shared layout logic (sidebar, theme, topbar) lives in admin_base.js.
   ============================================================ */
 
(function () {
  "use strict";
 
  const searchInput = document.getElementById("contactSearch");
  const statusFilter = document.getElementById("statusFilter");
  const subjectFilter = document.getElementById("subjectFilter");
  const dateRangeFilter = document.getElementById("dateRangeFilter");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
 
  const tableBody = document.getElementById("contactsTableBody");
  const emptyState = document.getElementById("contactsEmptyState");
  const refreshBtn = document.getElementById("refreshMessagesBtn");
  const markAllReadBtn = document.getElementById("markAllReadBtn");
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
 
  const paginationInfo = document.querySelector(".pagination-info");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
 
  /* ------------------------------------------------------------
     DATA SOURCE
     No contact messages exist yet. Once the backend endpoint is
     wired up, replace `contactsData` with the fetched list.
  ------------------------------------------------------------ */
  let contactsData = [
    { id: 1, name: "Alice Smith", email: "alice@example.com", subject: "Question about Bali", subjectKey: "general", message: "Hi, I was wondering if the Bali tour includes flights?", date: "2023-10-15", dateRange: "today", status: "unread" },
    { id: 2, name: "Bob Johnson", email: "bob@example.com", subject: "Need to change my dates", subjectKey: "booking", message: "Can I move my Paris booking forward by 2 days?", date: "2023-10-14", dateRange: "today", status: "unread" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", subject: "Issue with hotel", subjectKey: "complaint", message: "The AC in my room was broken for the entire stay.", date: "2023-10-10", dateRange: "7days", status: "read" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", subject: "Business Partnership", subjectKey: "partnership", message: "We would love to list our boutique hotels on your platform.", date: "2023-10-08", dateRange: "7days", status: "replied" },
    { id: 5, name: "Evan Wright", email: "evan@example.com", subject: "Group booking discount?", subjectKey: "general", message: "Do you offer discounts for groups of 10 or more?", date: "2023-09-20", dateRange: "30days", status: "replied" }
  ];
 
  /* ------------------------------------------------------------
     RENDER — table rows or empty state
  ------------------------------------------------------------ */
  function renderContacts(list) {
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
 
  function rowTemplate(contact) {
    return (
      '<tr>' +
        '<td class="td-checkbox"><input type="checkbox" class="row-checkbox" data-id="' + contact.id + '"></td>' +
        '<td>' + escapeHtml(contact.name) + '</td>' +
        '<td>' + escapeHtml(contact.email) + '</td>' +
        '<td>' + escapeHtml(contact.subject) + '</td>' +
        '<td><span class="message-preview">' + escapeHtml(contact.message) + '</span></td>' +
        '<td>' + escapeHtml(contact.date) + '</td>' +
        '<td>' + statusBadgeTemplate(contact.status) + '</td>' +
        '<td class="th-actions">' + actionsTemplate() + '</td>' +
      '</tr>'
    );
  }
 
  function statusBadgeTemplate(status) {
    const map = {
      read: ["badge-success", "Read"],
      unread: ["badge-unread", "Unread"],
      replied: ["badge-replied", "Replied"]
    };
    const cfg = map[status] || ["badge-unread", "Unread"];
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
    paginationInfo.textContent = "Showing " + from + " to " + to + " of " + total + " Messages";
    if (prevPageBtn) prevPageBtn.disabled = true;
    if (nextPageBtn) nextPageBtn.disabled = total === 0 || total <= to;
  }
 
  /* ------------------------------------------------------------
     FILTERING (client-side, applies once real data exists)
  ------------------------------------------------------------ */
  function applyFilters() {
    const q = (searchInput && searchInput.value.trim().toLowerCase()) || "";
    const status = statusFilter ? statusFilter.value : "";
    const subject = subjectFilter ? subjectFilter.value : "";
    const dateRange = dateRangeFilter ? dateRangeFilter.value : "";
 
    const filtered = contactsData.filter(function (contact) {
      const matchesQuery =
        !q ||
        contact.name.toLowerCase().includes(q) ||
        contact.email.toLowerCase().includes(q) ||
        contact.subject.toLowerCase().includes(q);
      const matchesStatus = !status || contact.status === status;
      const matchesSubject = !subject || contact.subjectKey === subject;
      const matchesDateRange = !dateRange || contact.dateRange === dateRange;
      return matchesQuery && matchesStatus && matchesSubject && matchesDateRange;
    });
 
    renderContacts(filtered);
  }
 
  function resetFilters() {
    if (searchInput) searchInput.value = "";
    if (statusFilter) statusFilter.value = "";
    if (subjectFilter) subjectFilter.value = "";
    if (dateRangeFilter) dateRangeFilter.value = "";
    applyFilters();
  }
 
  if (searchInput) searchInput.addEventListener("input", debounce(applyFilters, 200));
  if (statusFilter) statusFilter.addEventListener("change", applyFilters);
  if (subjectFilter) subjectFilter.addEventListener("change", applyFilters);
  if (dateRangeFilter) dateRangeFilter.addEventListener("change", applyFilters);
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
     SELECT ALL — header checkbox toggles all row checkboxes
  ------------------------------------------------------------ */
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", function () {
      const rowCheckboxes = tableBody
        ? tableBody.querySelectorAll(".row-checkbox")
        : [];
      rowCheckboxes.forEach(function (cb) {
        cb.checked = selectAllCheckbox.checked;
      });
    });
  }
 
  /* ------------------------------------------------------------
     REFRESH — re-check for newly submitted messages
     Hook this up to a real fetch() call against the contacts API
     once it exists; for now it just re-renders current state.
  ------------------------------------------------------------ */
  function refreshMessages() {
    if (!refreshBtn) return;
    const originalLabel = refreshBtn.innerHTML;
    refreshBtn.disabled = true;
    refreshBtn.style.opacity = "0.7";
 
    setTimeout(function () {
      // TODO: replace with real fetch of latest contact messages from the server
      applyFilters();
      refreshBtn.disabled = false;
      refreshBtn.style.opacity = "1";
      refreshBtn.innerHTML = originalLabel;
    }, 500);
  }
 
  if (refreshBtn) refreshBtn.addEventListener("click", refreshMessages);
 
  /* ------------------------------------------------------------
     MARK ALL AS READ — bulk status update entry point
  ------------------------------------------------------------ */
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", function () {
      // TODO: wire up to a real bulk-update endpoint once available
      contactsData = contactsData.map(function (contact) {
        return Object.assign({}, contact, { status: "read" });
      });
      applyFilters();
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
    renderContacts(contactsData);
    initScrollReveal();
  });
})();
