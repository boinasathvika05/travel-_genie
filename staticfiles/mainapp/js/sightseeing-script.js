/* ==========================================================
   TravelGenie — Sightseeing Page Interactions
   ========================================================== */
function initSightseeing() {
  var page = document.querySelector('.sightseeing-page');
  if (!page) return;


  /* ─────────────────────────────────────────
     TOAST HELPER
  ───────────────────────────────────────── */
  function showToast(message, type) {
    var existing = document.getElementById('sightToast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'sightToast';
    Object.assign(toast.style, {
      position:     'fixed',
      bottom:       '32px',
      right:        '32px',
      zIndex:       '999999',
      background:   type === 'success' ? '#00C48C'
                  : type === 'remove'  ? '#E0554B'
                  :                      '#5C7392',
      color:        '#fff',
      padding:      '14px 20px',
      borderRadius: '14px',
      fontSize:     '13.5px',
      fontFamily:   'Poppins, sans-serif',
      fontWeight:   '500',
      boxShadow:    '0 14px 40px rgba(0,0,0,0.22)',
      maxWidth:     '320px',
      whiteSpace:   'pre-line',
      lineHeight:   '1.6',
      opacity:      '0',
      transform:    'translateY(16px)',
      transition:   'opacity 0.3s ease, transform 0.3s ease',
      pointerEvents:'none'
    });
    toast.textContent = message;
    document.body.appendChild(toast);

    toast.getBoundingClientRect(); // force reflow
    toast.style.opacity   = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(function () {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateY(16px)';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }

  /* ─────────────────────────────────────────
     CAMERA ICON (LANDMARK RECOGNITION)
  ───────────────────────────────────────── */
  var cameraIcon = document.querySelector('.sight-hero-icon');
  if (cameraIcon) {
    cameraIcon.addEventListener('click', function() {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.addEventListener('change', function () {
        if (input.files && input.files[0]) {
          showToast('📸 Scanning landmark image...', 'info');
          
          setTimeout(function () {
            showToast('✅ Landmark Identified: Eiffel Tower, Paris!', 'success');
          }, 1500);
        }
      });
      input.click();
    });
  }

  /* ─────────────────────────────────────────
     ADD TO TRIP BUTTONS
  ───────────────────────────────────────── */
  var tripItems = []; // in-memory list of added attractions

  page.querySelectorAll('.add-trip-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.attraction-card');
      var name = card ? card.querySelector('h3').textContent.trim() : 'Attraction';

      var alreadyAdded = tripItems.indexOf(name) !== -1;

      if (alreadyAdded) {
        // Remove from trip
        tripItems.splice(tripItems.indexOf(name), 1);
        btn.innerHTML = '<i class="fa-solid fa-plus"></i>Add to Trip';
        btn.classList.remove('added');
        showToast('🗑️ Removed: ' + name, 'remove');
      } else {
        // Add to trip
        tripItems.push(name);
        btn.innerHTML = '<i class="fa-solid fa-check"></i>Added!';
        btn.classList.add('added');
        showToast('✅ Added to trip:\n' + name, 'success');
      }

      // Update sidebar summary count
      updateSummaryCount();
    });
  });

  function updateSummaryCount() {
    var placesEl = page.querySelector('.summary-stat-row strong');
    if (placesEl) placesEl.textContent = tripItems.length;
  }

  /* ─────────────────────────────────────────
     FAVOURITE (HEART) BUTTONS
  ───────────────────────────────────────── */
  page.querySelectorAll('.fav-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var icon = btn.querySelector('i');
      var isActive = btn.classList.toggle('active');
      icon.classList.toggle('fa-regular', !isActive);
      icon.classList.toggle('fa-solid',   isActive);
      var card = btn.closest('.attraction-card');
      var name = card ? card.querySelector('h3').textContent.trim() : 'Attraction';
      showToast(isActive ? '❤️ Saved: ' + name : '🤍 Unsaved: ' + name,
                isActive ? 'success' : 'info');
    });
  });

  /* ─────────────────────────────────────────
     CATEGORY FILTER CHIPS
  ───────────────────────────────────────── */
  var chips = page.querySelectorAll('.sight-chip');
  var cards = page.querySelectorAll('.attraction-card');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');

      var selected = chip.getAttribute('data-category');

      cards.forEach(function (card) {
        if (selected === 'all' || card.getAttribute('data-category') === selected) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ─────────────────────────────────────────
     RECOMMENDED TABS
  ───────────────────────────────────────── */
  var recTabs   = page.querySelectorAll('.rec-tab');
  var recPanels = page.querySelectorAll('.recommend-list');

  recTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      recTabs.forEach(function (t)   { t.classList.remove('active'); });
      recPanels.forEach(function (p) { p.hidden = true; });
      tab.classList.add('active');
      var target = page.querySelector('.recommend-list[data-panel="' + tab.getAttribute('data-tab') + '"]');
      if (target) target.hidden = false;
    });
  });

  /* ─────────────────────────────────────────
     VIEW ITINERARY BUTTON
  ───────────────────────────────────────── */
  var itineraryBtn = page.querySelector('.sight-summary-card .btn-primary');
  if (itineraryBtn) {
    itineraryBtn.addEventListener('click', function () {
      if (tripItems.length === 0) {
        showToast('📋 No attractions added yet!\nClick "Add to Trip" on any card.', 'info');
        return;
      }
      showToast('🗺️ Your Itinerary:\n' + tripItems.join('\n'), 'success');
    });
  }

  /* ─────────────────────────────────────────
     ADD TO TRIP BUTTON — CSS for "added" state
  ───────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '.add-trip-btn.added {',
    '  background: #00C48C !important;',
    '  border-color: #00C48C !important;',
    '  color: #fff !important;',
    '  cursor: pointer;',
    '}'
  ].join('');
  document.head.appendChild(style);

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSightseeing);
} else {
  initSightseeing();
}
