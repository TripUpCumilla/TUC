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


<script>
function sendToWhatsApp(event) {
    event.preventDefault();

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var message = document.getElementById("message").value;

    var whatsappNumber = "8801990060538"; 
    

    var url = "https://wa.me/" + whatsappNumber + "?text="
        + encodeURIComponent(
            "New Message from Website:\n\n"
            + "Name: " + name + "\n"
            + "Email: " + email + "\n"
            + "Phone: " + phone + "\n"
            + "Message: " + message
        );

    window.open(url, "_blank");
}
</script>
