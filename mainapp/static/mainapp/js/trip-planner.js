/* ==========================================================================
   TravelGenie — Trip Planner interactions
   ========================================================================== */
 
document.addEventListener('DOMContentLoaded', () => {
 
  /* ---------- Sidebar (mobile) open / close ---------- */
  const sidebar     = document.getElementById('sidebar');
  const overlay     = document.getElementById('sidebarOverlay');
  const menuToggle  = document.getElementById('menuToggle');
  const sidebarClose = document.getElementById('sidebarClose');
 
  function openSidebar(){ sidebar.classList.add('open'); overlay.classList.add('visible'); }
  function closeSidebar(){ sidebar.classList.remove('open'); overlay.classList.remove('visible'); }
 
  menuToggle && menuToggle.addEventListener('click', openSidebar);
  sidebarClose && sidebarClose.addEventListener('click', closeSidebar);
  overlay && overlay.addEventListener('click', closeSidebar);
 
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => { if (window.innerWidth <= 900) closeSidebar(); });
  });
 
  /* ---------- Theme toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  themeToggle && themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    if (icon){ icon.classList.toggle('fa-moon'); icon.classList.toggle('fa-sun'); }
  });
 
  /* ---------- From / To swap ---------- */
  const fromInput = document.getElementById('fromInput');
  const toInput   = document.getElementById('toInput');
  const swapBtn   = document.getElementById('swapBtn');
 
  swapBtn && swapBtn.addEventListener('click', () => {
    const temp = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = temp;
    swapBtn.classList.add('spun');
    setTimeout(() => swapBtn.classList.remove('spun'), 300);
  });
 
  /* ---------- Return date can't be before departure ---------- */
  const departureDate = document.getElementById('departureDate');
  const returnDate     = document.getElementById('returnDate');
  departureDate && departureDate.addEventListener('change', () => {
    returnDate.min = departureDate.value;
    if (returnDate.value && returnDate.value < departureDate.value) {
      returnDate.value = departureDate.value;
    }
  });
 
  /* ---------- Travelers stepper ---------- */
  const decreaseBtn    = document.getElementById('decreaseTravelers');
  const increaseBtn    = document.getElementById('increaseTravelers');
  const travelerCount  = document.getElementById('travelerCount');
  const travelersInput = document.getElementById('travelersInput');
  let travelers = parseInt(travelerCount.textContent, 10) || 2;
 
  function updateTravelers(next){
    travelers = Math.min(20, Math.max(1, next));
    travelerCount.textContent = travelers;
    travelersInput.value = travelers;
  }
  decreaseBtn && decreaseBtn.addEventListener('click', () => updateTravelers(travelers - 1));
  increaseBtn && increaseBtn.addEventListener('click', () => updateTravelers(travelers + 1));
 
  /* ---------- Travel style — single select pills ---------- */
  const travelStyleRow   = document.getElementById('travelStyleRow');
  const travelStyleInput = document.getElementById('travelStyleInput');
 
  travelStyleRow && travelStyleRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill-btn');
    if (!btn) return;
    travelStyleRow.querySelectorAll('.pill-btn').forEach(p => p.classList.remove('selected'));
    btn.classList.add('selected');
    travelStyleInput.value = btn.dataset.value;
  });
 
  /* ---------- Interests — multi select chips ---------- */
  const interestsRow   = document.getElementById('interestsRow');
  const interestsInput = document.getElementById('interestsInput');
  const selectedInterests = new Set();
 
  interestsRow && interestsRow.addEventListener('click', (e) => {
    const chip = e.target.closest('.interest-chip');
    if (!chip) return;
    chip.classList.toggle('selected');
    const value = chip.dataset.value;
    if (chip.classList.contains('selected')) selectedInterests.add(value);
    else selectedInterests.delete(value);
    interestsInput.value = Array.from(selectedInterests).join(',');
  });
 
  /* ---------- Form submit → AI itinerary generation ---------- */
  const tripForm         = document.getElementById('tripForm');
  const generateBtn      = document.getElementById('generateBtn');
  const itineraryResult  = document.getElementById('itineraryResult');
 
  tripForm && tripForm.addEventListener('submit', (e) => {
    e.preventDefault();
 
    const originalContent = generateBtn.innerHTML;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i><span>Generating your itinerary…</span>';
 
    const payload = {
      from: fromInput.value,
      to: toInput.value,
      departure_date: departureDate.value,
      return_date: returnDate.value,
      travelers: travelersInput.value,
      budget: document.getElementById('budgetRange').value,
      travel_style: travelStyleInput.value,
      interests: interestsInput.value,
      prompt: document.getElementById('aiPrompt').value
    };
 
    const previewArt = document.querySelector('.preview-art');
    const previewEmpty = document.getElementById('previewEmpty');

    fetch("/api/itinerary/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(data => {
      generateBtn.disabled = false;
      generateBtn.innerHTML = originalContent;
      
      if (previewArt) previewArt.style.display = 'none';
      if (previewEmpty) previewEmpty.style.display = 'none';
      
      itineraryResult.hidden = false;
      
      if (data.itinerary) {
        itineraryResult.innerHTML = data.itinerary;
      } else {
        itineraryResult.innerHTML = `<p style="color:red">Error: ${data.error || 'Failed to generate itinerary'}</p>`;
      }
    })
    .catch(err => {
      generateBtn.disabled = false;
      generateBtn.innerHTML = originalContent;
      itineraryResult.hidden = false;
      itineraryResult.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
    });
  });
 
});
 
/* Helper for wiring up Django's CSRF-protected POST requests later. */
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
