// admin.js
const firebaseConfig = {
  apiKey: "AIzaSyAALMvrFJlIkmw9T2__ZqY_iZe7xDsR-FI",
  authDomain: "trip-up-cumilla.firebaseapp.com",
  projectId: "trip-up-cumilla",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Add admin UIDs here (only these uids can view admin UI)
const ADMIN_UIDS = [
  // e.g. "abc123uidforYourAccount"
];

// check auth and admin rights
auth.onAuthStateChanged(user=>{
  if(!user) return window.location.href='index.html';
  if(!ADMIN_UIDS.includes(user.uid)) {
    alert('You are not admin.');
    auth.signOut();
    return window.location.href='index.html';
  }
  // if admin, load users
  loadUsers();
});

function adminSignOut(){ auth.signOut().then(()=> location.href='index.html'); }

let allUsers = [];
function loadUsers() {
  db.collection('users').get().then(snap=>{
    allUsers = snap.docs.map(d => d.data());
    renderUsers(allUsers);
  }).catch(e=> console.error(e));
}

function renderUsers(list) {
  const wrap = document.getElementById('usersWrap');
  if(!list || list.length===0) { wrap.innerHTML='<p>No users</p>'; return; }
  // build html
  wrap.innerHTML = list.map(u => `
    <div class="user-line">
      <img src="${u.image || 'images/placeholder.png'}" class="img-circle" style="width:60px;height:60px;">
      <div style="flex:1;">
        <strong>${u.name || '(no name)'}</strong><br>
        <span class="small">${u.email} • ID: ${u.userId || u.uid}</span><br>
        <span class="small">Phone: ${u.phone || 'N/A'}</span><br>
        <div style="margin-top:6px;">
          <button class="btn secondary" onclick='viewUser("${u.uid}")'>View</button>
          <button class="btn" onclick='messageUser("${u.email || ''}")'>Message</button>
        </div>
      </div>
    </div>
    <div style="margin-left:72px; margin-top:8px;">${(u.purchases || []).map(p => `<div class="purchase-item">${p.product} — ৳${p.amount} <span class="small">(${p.purchaseId})</span></div>`).join('')}</div>
  `).join('');
}

function filterList() {
  const q = document.getElementById('adminSearch').value.trim().toLowerCase();
  if(!q) return renderUsers(allUsers);
  const filtered = allUsers.filter(u => {
    const s = `${u.name} ${u.email} ${u.userId} ${u.uid} ${(u.purchases||[]).map(p=>p.purchaseId+' '+(p.product||'')).join(' ')}`.toLowerCase();
    return s.includes(q);
  });
  renderUsers(filtered);
}

// sample view user action (could open detailed modal or redirect)
function viewUser(uid) {
  // simply redirect to profile if same user; or fetch and show more details here
  db.collection('users').doc(uid).get().then(doc=>{
    const u = doc.data();
    alert('User: ' + (u.name || u.email) + '\nPurchases: ' + (u.purchases?.length||0));
  });
}

function messageUser(email) {
  if(!email) return alert('No email');
  window.location.href = `mailto:${email}`;
}
