document.addEventListener('DOMContentLoaded', () => {
 
  /* =========================================================
     EXPLORE MORE -> SCROLL TO FEATURES
  ========================================================= */
  const exploreBtn = document.querySelector('.ab-explore-btn');
  const featuresSection = document.querySelector('.ab-features');
 
  if (exploreBtn && featuresSection) {
    exploreBtn.addEventListener('click', () => {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
 
});
 