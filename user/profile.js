// profile.js
const firebaseConfig = {
  apiKey: "AIzaSyAALMvrFJlIkmw9T2__ZqY_iZe7xDsR-FI",
  authDomain: "trip-up-cumilla.firebaseapp.com",
  projectId: "trip-up-cumilla",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// imgbb key (you provided)
const imgbb_key = "167b3245e3611074712f06423f10d470";

// on auth change — load user profile
auth.onAuthStateChanged(user => {
  if(!user) return window.location.href='index.html';

  // load user doc
  db.collection('users').doc(user.uid).get().then(doc => {
    const data = doc.data();
    document.getElementById('userName').value = data.name || '';
    document.getElementById('userPhone').value = data.phone || '';
    document.getElementById('userAddress').value = data.address || '';
    document.getElementById('userEmail').innerText = data.email || '';
    document.getElementById('userPublicId').innerText = data.userId || data.uid || '';
    if(data.image) document.getElementById('profilePic').src = data.image;
    renderPurchases(data.purchases || []);
  }).catch(e=> console.error(e));
});

// image upload to imgbb
document.getElementById('imgUpload').addEventListener('change', function(e){
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onloadend = function() {
    const base64 = reader.result.split(',')[1];
    fetch(`https://api.imgbb.com/1/upload?key=${imgbb_key}`, {
      method: 'POST',
      body: new URLSearchParams({ image: base64 })
    })
    .then(r => r.json())
    .then(resp => {
      if(resp && resp.data && resp.data.url) {
        const url = resp.data.url;
        // update Firestore
        const uid = auth.currentUser.uid;
        db.collection('users').doc(uid).update({ image: url });
        document.getElementById('profilePic').src = url;
        alert('Profile picture updated!');
      } else throw new Error('Upload failed');
    }).catch(e=> alert('Image upload failed: '+e.message));
  };
  reader.readAsDataURL(file);
});

// save profile info
function saveProfile() {
  const uid = auth.currentUser.uid;
  const name = document.getElementById('userName').value.trim();
  const phone = document.getElementById('userPhone').value.trim();
  const address = document.getElementById('userAddress').value.trim();
  db.collection('users').doc(uid).update({ name, phone, address })
  .then(()=> alert('Profile saved!'))
  .catch(e=> alert('Save failed: '+e.message));
}

// logout
function logout() {
  auth.signOut().then(()=> window.location.href='index.html');
}

// render purchases
function renderPurchases(list) {
  const el = document.getElementById('purchaseList');
  if(!list || list.length===0) {
    el.innerHTML = '<p class="small">কোনো purchase পাওয়া যায়নি।</p>';
    return;
  }
  // sort by date desc
  list.sort((a,b)=> (b.date||'').localeCompare(a.date||''));
  el.innerHTML = list.map(p => `
    <div class="purchase-item">
      <strong>${p.product}</strong> — <span class="small">৳${p.amount}</span><br>
      <span class="small">ID: ${p.purchaseId} • ${new Date(p.date).toLocaleString()}</span><br>
      <span class="small">Method: ${p.method || 'N/A'}</span>
    </div>
  `).join('');
}

// helper copy id
function copyId(){
  const id = document.getElementById('userPublicId').innerText;
  navigator.clipboard?.writeText(id).then(()=> alert('ID copied: '+id));
}
