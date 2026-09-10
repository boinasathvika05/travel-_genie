/* ============================================================
   TravelGenie Admin — dashboard.js
   Page-specific behaviour for admin_dashboard.html.
   ============================================================ */
 
document.addEventListener('DOMContentLoaded', () => {
    // Booking Overview Chart (mocking trend bars)
    const overviewCanvas = document.querySelector('.chart-card .chart-canvas svg');
    if (overviewCanvas) {
        const mockData = [30, 45, 80, 50, 110, 140, 100, 160, 120, 175, 140, 190]; // mock trend data
        let barsHTML = '';
        const barWidth = 14;
        const spacing = 33;
        
        mockData.forEach((val, index) => {
            const x = 20 + index * spacing;
            const y = 200 - val;
            barsHTML += `
                <rect x="${x}" y="${y}" width="${barWidth}" height="${val}" rx="4" fill="url(#barGrad)" />
                <rect x="${x}" y="${y}" width="${barWidth}" height="4" rx="2" fill="#4F8DFD" />
            `;
        });
        overviewCanvas.innerHTML += barsHTML;
    }

    // Booking Status Donut Chart
    const donutCanvas = document.querySelector('.donut-card .chart-canvas svg');
    if (donutCanvas) {
        // Read data from data attributes if we passed them, or use fallback
        const donutCard = document.querySelector('.donut-card');
        let confirmed = parseFloat(donutCard.getAttribute('data-confirmed')) || 45;
        let pending = parseFloat(donutCard.getAttribute('data-pending')) || 30;
        let cancelled = parseFloat(donutCard.getAttribute('data-cancelled')) || 25;
        
        const total = confirmed + pending + cancelled;
        if (total === 0) return;
        
        const confPct = confirmed / total;
        const pendPct = pending / total;
        const cancPct = cancelled / total;
        
        const C = 2 * Math.PI * 72; // ~452.39
        const confDash = C * confPct;
        const pendDash = C * pendPct;
        const cancDash = C * cancPct;
        
        // We draw them overlapping, rotating the offset
        let html = `<circle cx="100" cy="100" r="72" fill="none" stroke="#EEF3FC" stroke-width="26"/>`;
        
        // Confirmed (Blue)
        html += `<circle cx="100" cy="100" r="72" fill="none" stroke="#2563EB" stroke-width="26" stroke-dasharray="${confDash} ${C}" stroke-dashoffset="0" stroke-linecap="round" transform="rotate(-90 100 100)"/>`;
        
        // Pending (Light Blue)
        const pendOffset = -confDash;
        html += `<circle cx="100" cy="100" r="72" fill="none" stroke="#4F8DFD" stroke-width="26" stroke-dasharray="${pendDash} ${C}" stroke-dashoffset="${pendOffset}" stroke-linecap="round" transform="rotate(-90 100 100)"/>`;
        
        // Cancelled (Faint Blue)
        const cancOffset = -(confDash + pendDash);
        html += `<circle cx="100" cy="100" r="72" fill="none" stroke="#DCE7FB" stroke-width="26" stroke-dasharray="${cancDash} ${C}" stroke-dashoffset="${cancOffset}" stroke-linecap="round" transform="rotate(-90 100 100)"/>`;

        // Inner text
        html += `<text x="100" y="105" text-anchor="middle" font-size="28" font-family="Poppins" font-weight="700" fill="#152A4A">${total}</text>`;
        html += `<text x="100" y="125" text-anchor="middle" font-size="12" font-family="Poppins" font-weight="500" fill="#5C7392">Total</text>`;
        
        donutCanvas.innerHTML = html;
    }
}); 