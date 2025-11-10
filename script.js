// Show popup when site loads
window.addEventListener('load', function() {
  document.getElementById('popup').style.display = 'flex';
});

// Close popup
function closePopup() {
  document.getElementById('popup').style.display = 'none';
}


// Open Popup
function openAuth() {
  document.getElementById("authPopup").style.display = "flex";
}

// Close Popup
function closeAuth() {
  document.getElementById("authPopup").style.display = "none";
}

// Tab Change System
function openTab(tabId) {

  // Hide all forms
  document.querySelectorAll(".auth-form").forEach(form => {
    form.classList.add("hidden");
  });

  // Remove active class from tabs
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  // Show selected tab
  document.getElementById(tabId).classList.remove("hidden");

  // Add active to clicked button
  event.target.classList.add("active");
}
