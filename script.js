// Show popup when site loads
window.addEventListener('load', function() {
  document.getElementById('popup').style.display = 'flex';
});

// Close popup
function closePopup() {
  document.getElementById('popup').style.display = 'none';
}
