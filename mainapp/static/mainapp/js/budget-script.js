/* ==========================================================================
   TravelGenie — Budget Planner interactions
   ========================================================================== */
 
document.addEventListener('DOMContentLoaded', () => {
 
  /* ---------- Sidebar (mobile) open / close ---------- */
  const sidebar      = document.getElementById('sidebar');
  const overlay      = document.getElementById('sidebarOverlay');
  const menuToggle   = document.getElementById('menuToggle');
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
 
  /* ==========================================================================
     TRIP DETAILS — travelers & duration steppers
     ========================================================================== */
  const travelerCount = document.getElementById('travelerCount');
  let travelers = parseInt(travelerCount.textContent, 10) || 1;
 
  function setTravelers(next){
    travelers = Math.min(20, Math.max(1, next));
    travelerCount.textContent = travelers;
    recalculate();
  }
  document.getElementById('decreaseTravelers').addEventListener('click', () => setTravelers(travelers - 1));
  document.getElementById('increaseTravelers').addEventListener('click', () => setTravelers(travelers + 1));
 
  const durationCount = document.getElementById('durationCount');
  const durationUnit  = document.getElementById('durationUnit');
  let duration = parseInt(durationCount.textContent, 10) || 1;
 
  function setDuration(next){
    duration = Math.min(52, Math.max(1, next));
    durationCount.textContent = duration;
    recalculate();
  }
  document.getElementById('decreaseDuration').addEventListener('click', () => setDuration(duration - 1));
  document.getElementById('increaseDuration').addEventListener('click', () => setDuration(duration + 1));
  durationUnit.addEventListener('change', recalculate);
 
  function nightsFromDuration(){
    const map = { day: 1, week: 7, month: 30 };
    return duration * (map[durationUnit.value] || 1);
  }
 
  /* ==========================================================================
     TRANSPORT ROWS
     ========================================================================== */
  const transportRows = document.getElementById('transportRows');
  const transportIcons = { Flight:'fa-plane', Train:'fa-train', Bus:'fa-bus', 'Rental Car':'fa-car', 'Driving / Taxi':'fa-car' };
 
  function wireCostRow(row){
    const slider = row.querySelector('.cost-slider');
    const valueLabel = row.querySelector('.slider-value');
    slider.addEventListener('input', () => {
      valueLabel.textContent = '$' + Number(slider.value).toLocaleString();
      recalculate();
    });
    const typeSelect = row.querySelector('.type-select');
    const iconEl = row.querySelector('.row-select i');
    if (typeSelect && iconEl){
      typeSelect.addEventListener('change', () => {
        iconEl.className = 'fa-solid ' + (transportIcons[typeSelect.value] || 'fa-route');
      });
    }
    row.querySelectorAll('.cost-type-select').forEach(sel => sel.addEventListener('change', recalculate));
    const deleteBtn = row.querySelector('.row-delete');
    deleteBtn && deleteBtn.addEventListener('click', () => { row.remove(); recalculate(); });
  }
 
  transportRows.querySelectorAll('.transport-row').forEach(wireCostRow);
 
  document.getElementById('addTransportBtn').addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'cost-row transport-row';
    row.innerHTML = `
      <div class="row-select">
        <i class="fa-solid fa-route"></i>
        <select class="type-select">
          <option>Flight</option>
          <option>Train</option>
          <option>Bus</option>
          <option>Rental Car</option>
          <option>Driving / Taxi</option>
        </select>
      </div>
      <div class="row-slider">
        <input type="range" class="cost-slider" min="0" max="3000" step="50" value="300">
        <span class="slider-value">$300</span>
      </div>
      <select class="cost-type-select">
        <option>Total</option>
        <option>Per person</option>
      </select>
      <button type="button" class="row-delete" aria-label="Remove row"><i class="fa-regular fa-trash-can"></i></button>`;
    transportRows.appendChild(row);
    wireCostRow(row);
    recalculate();
  });
 
  /* ==========================================================================
     ACCOMMODATION
     ========================================================================== */
  const accommodationSlider = document.getElementById('accommodationSlider');
  const accommodationValue  = document.getElementById('accommodationValue');
  const accommodationType   = document.getElementById('accommodationType');
 
  accommodationSlider.addEventListener('input', () => {
    accommodationValue.textContent = '$' + Number(accommodationSlider.value).toLocaleString();
    recalculate();
  });
  accommodationType.addEventListener('change', recalculate);
 
  /* ==========================================================================
     FOOD & ENTERTAINMENT ROWS
     ========================================================================== */
  const foodRows = document.getElementById('foodRows');
  const foodIcons = { Meal:'fa-utensils', 'Concert Tickets':'fa-ticket', Shopping:'fa-bag-shopping', Museums:'fa-landmark', Adventure:'fa-person-hiking' };
 
  function wireFoodRow(row){
    const input = row.querySelector('.food-cost');
    input.addEventListener('input', recalculate);
    const typeSelect = row.querySelector('.type-select');
    const iconEl = row.querySelector('.row-select i');
    if (typeSelect && iconEl){
      typeSelect.addEventListener('change', () => {
        iconEl.className = 'fa-solid ' + (foodIcons[typeSelect.value] || 'fa-utensils');
        recalculate();
      });
    }
    const deleteBtn = row.querySelector('.row-delete');
    deleteBtn && deleteBtn.addEventListener('click', () => { row.remove(); recalculate(); });
  }
 
  foodRows.querySelectorAll('.food-row').forEach(wireFoodRow);
 
  document.getElementById('addFoodBtn').addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'food-row';
    row.innerHTML = `
      <div class="row-select">
        <i class="fa-solid fa-utensils"></i>
        <select class="type-select">
          <option>Meal</option>
          <option>Concert Tickets</option>
          <option>Shopping</option>
          <option>Museums</option>
          <option>Adventure</option>
        </select>
      </div>
      <label class="cost-label">Total spend:</label>
      <div class="field-control cost-input-wrap">
        <span>$</span>
        <input type="number" class="food-cost" min="0" step="10" value="100">
      </div>
      <button type="button" class="row-delete" aria-label="Remove row"><i class="fa-regular fa-trash-can"></i></button>`;
    foodRows.appendChild(row);
    wireFoodRow(row);
    recalculate();
  });
 
  document.getElementById('destination').addEventListener('input', recalculate);
 
  /* ==========================================================================
     LIVE CALCULATION + DONUT CHART
     ========================================================================== */
  const ACTIVITY_TYPES = ['Concert Tickets', 'Museums', 'Adventure'];
 
  const totalCostValue = document.getElementById('totalCostValue');
  const perPersonValue = document.getElementById('perPersonValue');
  const donutChart      = document.getElementById('donutChart');
  const donutCenterLabel = document.getElementById('donutCenterLabel');
 
  const legend = {
    transport:     document.getElementById('legendTransport'),
    accommodation: document.getElementById('legendAccommodation'),
    food:          document.getElementById('legendFood'),
    activities:    document.getElementById('legendActivities'),
    other:         document.getElementById('legendOther')
  };
  const COLORS = { transport:'#2F80ED', accommodation:'#56CCF2', food:'#9AD8FF', activities:'#E0554B', other:'#B7C4D6' };
 
  function formatCurrency(value){
    return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
 
  function calculateBudget(){
    // Transport
    let transportTotal = 0;
    transportRows.querySelectorAll('.transport-row').forEach(row => {
      const amount = Number(row.querySelector('.cost-slider').value) || 0;
      const isPerPerson = row.querySelector('.cost-type-select').value === 'Per person';
      transportTotal += isPerPerson ? amount * travelers : amount;
    });
 
    // Accommodation
    const accAmount = Number(accommodationSlider.value) || 0;
    const accIsPerNight = accommodationType.value === 'Per night';
    const accommodationTotal = accIsPerNight ? accAmount * nightsFromDuration() : accAmount;
 
    // Food & Activities
    let foodTotal = 0;
    let activitiesTotal = 0;
    foodRows.querySelectorAll('.food-row').forEach(row => {
      const amount = Number(row.querySelector('.food-cost').value) || 0;
      const type = row.querySelector('.type-select').value;
      if (ACTIVITY_TYPES.includes(type)) activitiesTotal += amount;
      else foodTotal += amount;
    });
 
    const subtotal = transportTotal + accommodationTotal + foodTotal + activitiesTotal;
    const otherTotal = subtotal * 0.05; // small misc/service buffer, mirrors the "Other" slice
    const grandTotal = subtotal + otherTotal;
 
    return {
      transport: transportTotal,
      accommodation: accommodationTotal,
      food: foodTotal,
      activities: activitiesTotal,
      other: otherTotal,
      total: grandTotal
    };
  }
 
  function renderDonut(breakdown){
    const segments = [
      { key:'transport', value: breakdown.transport },
      { key:'accommodation', value: breakdown.accommodation },
      { key:'food', value: breakdown.food },
      { key:'activities', value: breakdown.activities },
      { key:'other', value: breakdown.other }
    ];
 
    const total = breakdown.total || 1;
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;
 
    donutChart.innerHTML = `<circle cx="80" cy="80" r="${radius}" fill="none" stroke="#EAF1FB" stroke-width="20"></circle>`;
 
    segments.forEach(seg => {
      const pct = total > 0 ? seg.value / total : 0;
      const dash = pct * circumference;
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '80');
      circle.setAttribute('cy', '80');
      circle.setAttribute('r', String(radius));
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', COLORS[seg.key]);
      circle.setAttribute('stroke-width', '20');
      circle.setAttribute('stroke-dasharray', `${dash} ${circumference - dash}`);
      circle.setAttribute('stroke-dashoffset', String(-offset));
      circle.setAttribute('stroke-linecap', dash > 0 && dash < circumference ? 'butt' : 'round');
      circle.style.transition = 'stroke-dasharray .5s ease, stroke-dashoffset .5s ease';
      donutChart.appendChild(circle);
      offset += dash;
 
      const pctLabel = Math.round(pct * 100) + '%';
      if (legend[seg.key]) legend[seg.key].textContent = pctLabel;
    });
 
    donutCenterLabel.textContent = total >= 1000
      ? '$' + (total / 1000).toFixed(1) + 'k'
      : '$' + Math.round(total);
  }
 
  function recalculate(){
    const breakdown = calculateBudget();
    totalCostValue.textContent = formatCurrency(breakdown.total);
    perPersonValue.textContent = formatCurrency(breakdown.total / travelers);
    renderDonut(breakdown);
  }
 
  /* ---------- Form submit ---------- */
  const budgetForm  = document.getElementById('budgetForm');
  const calculateBtn = document.getElementById('calculateBtn');
 
  budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateBtn.classList.add('calculating');
    const original = calculateBtn.innerHTML;
    calculateBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i><span>Analyzing with AI…</span>';

    recalculate();
    const breakdown = calculateBudget();
    const payload = {
      destination: document.getElementById('destination').value,
      total: breakdown.total,
      travelers: travelers,
      duration: duration,
      duration_unit: durationUnit.value
    };

    fetch("/api/budget_insights/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(data => {
      calculateBtn.classList.remove('calculating');
      calculateBtn.innerHTML = original;
      
      const aiInsights = document.getElementById('aiBudgetInsights');
      if (aiInsights) {
        aiInsights.style.display = 'block';
        if (data.insights) {
          aiInsights.innerHTML = `<h4 style="color:var(--primary); margin-bottom:10px;"><i class="fa-solid fa-robot"></i> AI Budget Insights</h4>` + data.insights;
        } else {
          aiInsights.innerHTML = `<p style="color:red">Error: ${data.error}</p>`;
        }
      }

      // Scroll to the summary card so the user sees the solution
      const summaryCard = document.querySelector('.summary-card');
      if (summaryCard) {
        summaryCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Flash effect to show update
        summaryCard.style.transition = 'box-shadow 0.3s ease';
        summaryCard.style.boxShadow = '0 0 0 3px rgba(47,128,237,0.45)';
        setTimeout(() => { summaryCard.style.boxShadow = ''; }, 900);
      }
    })
    .catch(err => {
      calculateBtn.classList.remove('calculating');
      calculateBtn.innerHTML = original;
      console.error(err);
    });
  });
 
  /* ==========================================================================
     REPORT / SHARE BUTTONS (placeholder feedback — wire to your backend)
     ========================================================================== */
  document.querySelector('.report-btn').addEventListener('click', function(){
    const original = this.innerHTML;
    this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Generating...</span>';
    
    setTimeout(() => { 
        this.innerHTML = '<i class="fa-solid fa-check"></i><span>Downloaded</span>';
        
        const b = calculateBudget();
        const csvContent = "data:text/csv;charset=utf-8,Category,Estimated Cost\n" +
            "Transport,$" + b.transport.toFixed(2) + "\n" +
            "Accommodation,$" + b.accommodation.toFixed(2) + "\n" +
            "Food/Entertainment,$" + b.food.toFixed(2) + "\n" +
            "Activities,$" + b.activities.toFixed(2) + "\n" +
            "Other,$" + b.other.toFixed(2) + "\n" +
            "Total Estimated Budget,$" + b.total.toFixed(2) + "\n";
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "travel_budget_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => { this.innerHTML = original; }, 1600);
    }, 800);
  });
 
  document.querySelector('.share-btn').addEventListener('click', function(){
    const original = this.innerHTML;
    this.innerHTML = '<i class="fa-solid fa-check"></i><span>Link Copied</span>';
    setTimeout(() => { this.innerHTML = original; }, 1600);
  });
 
  /* ==========================================================================
     ROTATING SMART TIPS
     ========================================================================== */
  const tips = [
    'Book flights 2 months in advance and stay in hostels to save up to 30% on your total trip cost!',
    'Travel during weekdays — flights and hotels are often 15–20% cheaper than weekends.',
    'Use local public transport instead of taxis to stretch your daily budget further.',
    'Set price alerts for your route so you never miss a flash flight sale.',
    'Eat where the locals eat — markets and street food are usually cheaper and better.',
    'Book accommodation with free cancellation so you can grab better deals later.'
  ];
  let tipIndex = 0;
  const tipText = document.getElementById('tipText');
  const tipNext = document.getElementById('tipNext');
 
  function showTip(index){
    tipText.style.opacity = 0;
    setTimeout(() => {
      tipText.textContent = tips[index];
      tipText.style.opacity = 1;
    }, 200);
  }
  tipText.style.transition = 'opacity .2s ease';
 
  tipNext.addEventListener('click', () => {
    tipIndex = (tipIndex + 1) % tips.length;
    showTip(tipIndex);
  });
 
  setInterval(() => {
    tipIndex = (tipIndex + 1) % tips.length;
    showTip(tipIndex);
  }, 6000);
 
  /* ---------- Initial render ---------- */
  recalculate();
});
 