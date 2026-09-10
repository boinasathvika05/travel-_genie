(function () {
  'use strict';
 
  document.addEventListener('DOMContentLoaded', init);
 
  function init() {
    bindAvatarUpload();
    bindEditProfile();
  }
 
  /* ---------------- Avatar upload preview ---------------- */
  function bindAvatarUpload() {
    var editBtn = document.getElementById('avatarEditBtn');
    var fileInput = document.getElementById('avatarFileInput');
    var avatarImg = document.querySelector('.pf-avatar img');
 
    if (!editBtn || !fileInput || !avatarImg) return;
 
    editBtn.addEventListener('click', function () {
      fileInput.click();
    });
 
    fileInput.addEventListener('change', function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
 
      var reader = new FileReader();
      reader.onload = function (e) {
        avatarImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
 
      // Hook point: upload `file` to the backend (e.g. via fetch/FormData)
      // to persist the new profile photo.
    });
  }
 
  /* ---------------- Edit profile ---------------- */
  function bindEditProfile() {
    var editProfileBtn = document.getElementById('editProfileBtn');
    var infoValues = document.querySelectorAll('.pf-info-value');
 
    if (!editProfileBtn) return;
 
    var editing = false;
 
    editProfileBtn.addEventListener('click', function (e) {
      e.preventDefault();
      editing = !editing;
 
      infoValues.forEach(function (valueEl) {
        if (editing) {
          var currentText = valueEl.textContent.trim();
          valueEl.setAttribute('data-original', currentText);
          valueEl.setAttribute('contenteditable', 'true');
          valueEl.classList.add('pf-editable');
        } else {
          valueEl.removeAttribute('contenteditable');
          valueEl.classList.remove('pf-editable');
          // Hook point: persist edited values to the backend here.
        }
      });
 
      var label = editProfileBtn.querySelector('span');
      var icon = editProfileBtn.querySelector('i');
      if (label) label.textContent = editing ? 'Save Changes' : 'Edit Profile';
      if (icon) {
        icon.classList.toggle('fa-pen', !editing);
        icon.classList.toggle('fa-check', editing);
      }
    });
  }
})();
 