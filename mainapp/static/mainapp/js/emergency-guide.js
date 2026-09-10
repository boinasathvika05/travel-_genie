(function () {
  'use strict';
 
  function init() {
    bindFindHospital();
    bindEmbassyFinder();
    bindViewAllContacts();
    bindCategoryCards();
    bindDetailedGuidesBtn();
    bindLearnMoreSafety();
    bindViewPolicy();
    bindCallEmergency();
  }

  /* ---------------- Toast Notification Helper ---------------- */
  function showToast(message, type) {
    var existing = document.getElementById('emgToast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'emgToast';
    Object.assign(toast.style, {
      position:     'fixed',
      bottom:       '32px',
      right:        '32px',
      zIndex:       '999999',
      background:   type === 'success' ? '#00C48C' : '#5C7392',
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
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 3000);
  }
 
  /* ---------------- Find Hospital ---------------- */
  function bindFindHospital() {
    var btn = document.querySelector('.emg-btn-blue');
    if (!btn) return;
 
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openNearbyMapSearch('hospitals near me');
    });
  }
 
  /* ---------------- Embassy Finder ---------------- */
  function bindEmbassyFinder() {
    var btn = document.querySelector('.emg-btn-purple');
    if (!btn) return;
 
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openNearbyMapSearch('embassy or consulate near me');
    });
  }
 
  function openNearbyMapSearch(query) {
    var url = 'https://www.google.com/maps/search/' + encodeURIComponent(query);
 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          var lat = pos.coords.latitude;
          var lng = pos.coords.longitude;
          window.open(
            'https://www.google.com/maps/search/' + encodeURIComponent(query) + '/@' + lat + ',' + lng + ',14z',
            '_blank'
          );
        },
        function () {
          window.open(url, '_blank');
        },
        { timeout: 4000 }
      );
    } else {
      window.open(url, '_blank');
    }
  }
 
  /* ---------------- View All Contacts ---------------- */
  function bindViewAllContacts() {
    var btn = document.querySelector('.emg-side-btn-outline');
    if (!btn) return;
 
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      // Since all 6 items are already visible in the HTML, just show feedback
      showToast('📖 All regional emergency contacts are already displayed.', 'info');
    });
  }
 
  /* ---------------- Category cards ---------------- */
  function bindCategoryCards() {
    var cards = document.querySelectorAll('.emg-cat-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        e.preventDefault();
        var title = card.querySelector('h4');
        card.classList.add('emg-cat-active');
        setTimeout(function () {
          card.classList.remove('emg-cat-active');
        }, 350);
        // Hook point: route to a detailed guide page per category.
        if (title) {
          card.setAttribute('data-selected', title.textContent.trim());
        }
      });
    });
  }
 
  /* ---------------- Bottom "View Detailed Emergency Guides" ---------------- */
  function bindDetailedGuidesBtn() {
    var btn = document.querySelector('.emg-outline-btn');
    if (!btn) return;
 
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      showToast('🚧 Detailed guides for specific emergencies are coming soon!', 'info');
    });
  }
 
  /* ---------------- "Learn More Safety Tips" ---------------- */
  function bindLearnMoreSafety() {
    var btn = document.querySelector('.emg-side-btn-green');
    if (!btn) return;
 
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      showToast('🛡️ You have already reviewed all key safety tips for this region.', 'success');
    });
  }

  /* ---------------- View Policy ---------------- */
  function bindViewPolicy() {
    var btn = document.querySelector('.emg-btn-green');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      showToast('Redirecting to your Travel Insurance portal...', 'success');
    });
  }

  /* ---------------- Call Emergency ---------------- */
  function bindCallEmergency() {
    var btn = document.querySelector('.emg-btn-red');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      // Allow default tel: behavior, but also show a toast just in case they are on a PC without a phone dialer configured
      showToast('Calling local emergency (112)...', 'info');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
 