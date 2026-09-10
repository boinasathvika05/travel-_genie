/* =========================================================
   HOTELS PAGE — TravelGenie
   Only page-level interactions. Sidebar/navbar/theme JS
   already lives in the base dashboard script.
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
 
  var hotelsPage = document.querySelector('.hotels-page');
  if (!hotelsPage) return;
 
  /* ---------------- Favourite (heart) toggle ---------------- */
  var favButtons = hotelsPage.querySelectorAll('.fav-btn');
  favButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var icon = btn.querySelector('i');
      var isActive = btn.classList.toggle('active');
      icon.classList.toggle('fa-regular', !isActive);
      icon.classList.toggle('fa-solid', isActive);
      updateSelectedCount();
    });
  });
 
  /* ---------------- Stay Summary selected count ---------------- */
  var summaryCta = hotelsPage.querySelector('.summary-cta');
 
  function updateSelectedCount() {
    if (!summaryCta) return;
    var count = hotelsPage.querySelectorAll('.fav-btn.active').length;
    summaryCta.textContent = 'View Selected Hotels (' + count + ')';
  }
 
  /* ---------------- View Selected Hotels click ---------------- */
  if (summaryCta) {
    summaryCta.addEventListener('click', function () {
      var activeFavs = hotelsPage.querySelectorAll('.fav-btn.active');
      if (activeFavs.length === 0) {
        showToast('❤️ No hotels selected yet! Click the heart icon on any hotel to save it.', 'info');
        return;
      }
      // Collect hotel names
      var names = [];
      activeFavs.forEach(function (btn) {
        var card = btn.closest('.hotel-card');
        if (card) {
          var nameEl = card.querySelector('h3');
          if (nameEl) names.push(nameEl.textContent.trim());
        }
      });
      showToast('🏨 Selected Hotels:\n' + names.join('\n'), 'success');
    });
  }
 
  /* ---------------- Simple toast helper ---------------- */
  function showToast(message, type) {
    var existing = document.getElementById('hotelToast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'hotelToast';
    // Inline every property — nothing inherited from the scroll container
    Object.assign(toast.style, {
      position:     'fixed',
      bottom:       '32px',
      right:        '32px',
      zIndex:       '999999',
      background:   type === 'success' ? '#2F80ED' : '#5C7392',
      color:        '#fff',
      padding:      '16px 22px',
      borderRadius: '16px',
      fontSize:     '13.5px',
      fontFamily:   'Poppins, sans-serif',
      fontWeight:   '500',
      boxShadow:    '0 14px 40px rgba(0,0,0,0.28)',
      maxWidth:     '320px',
      whiteSpace:   'pre-line',
      lineHeight:   '1.6',
      opacity:      '0',
      transform:    'translateY(16px)',
      transition:   'opacity 0.3s ease, transform 0.3s ease',
      pointerEvents:'none'
    });
    toast.textContent = message;

    // Append directly to <body> so it's never clipped by overflow containers
    document.body.appendChild(toast);

    // Force reflow then animate in
    toast.getBoundingClientRect();
    toast.style.opacity   = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(function () {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateY(16px)';
      setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
    }, 3500);
  }
 
  /* ---------------- Pagination ---------------- */
  var pageButtons = hotelsPage.querySelectorAll('.page-btn:not(.page-nav)');
  var prevBtn = hotelsPage.querySelector('.page-nav[aria-label="Previous page"]');
  var nextBtn = hotelsPage.querySelector('.page-nav[aria-label="Next page"]');
  var TOTAL_PAGES = 13;
  var currentPage = 1;

  function goToPage(page) {
    if (page < 1 || page > TOTAL_PAGES) return;
    currentPage = page;

    // Update active class on numbered buttons that exist in DOM
    pageButtons.forEach(function (btn) {
      var num = parseInt(btn.textContent.trim(), 10);
      btn.classList.toggle('active', num === currentPage);
    });

    // Update arrow disabled states
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === TOTAL_PAGES;

    scrollToListingsTop();
    showToast('📄 Page ' + currentPage + ' of ' + TOTAL_PAGES, 'info');
  }

  pageButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var num = parseInt(btn.textContent.trim(), 10);
      if (!isNaN(num)) goToPage(num);
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', function () { goToPage(currentPage - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goToPage(currentPage + 1); });

  // Set initial disabled state
  if (prevBtn) prevBtn.disabled = true;

  function scrollToListingsTop() {
    var mainContent = document.querySelector('.main-content');
    var listings = hotelsPage.querySelector('.hotels-listings');
    if (mainContent && listings) {
      var listingsTop = listings.getBoundingClientRect().top;
      var containerTop = mainContent.getBoundingClientRect().top;
      mainContent.scrollBy({ top: listingsTop - containerTop - 20, behavior: 'smooth' });
    }
  }

  /* ---------------- Filter chips (visual toggle only) ---------------- */
  var filterChips = hotelsPage.querySelectorAll('.filter-chip');
  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var isOpen = chip.classList.toggle('open');
      if (isOpen) {
        showToast('🎯 ' + chip.textContent.trim() + ' filter applied!', 'info');
      }
    });
  });
 
  /* ---------------- Search form ---------------- */
  var searchForm = hotelsPage.querySelector('.search-row-primary');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      var searchBtn = searchForm.querySelector('.search-btn');
      var originalBtnContent = searchBtn.innerHTML;
      searchBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i><span>Searching...</span>';
      searchBtn.style.pointerEvents = 'none';
      
      var destination = searchForm.querySelector('input[name="destination"]').value || 'your destination';
      
      setTimeout(function() {
        searchBtn.innerHTML = originalBtnContent;
        searchBtn.style.pointerEvents = 'auto';
        
        var resultsCount = hotelsPage.querySelector('.results-count');
        if (resultsCount) {
          resultsCount.textContent = 'Found new hotel deals in ' + destination;
        }
        
        scrollToListingsTop();
        showToast('🔍 Found great hotel deals in ' + destination + '!', 'success');
      }, 1200);
    });
  }
 
});
 