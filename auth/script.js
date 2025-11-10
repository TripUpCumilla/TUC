// script.js (main - auth / register / login / quick purchase)
// --- Firebase config (use yours) ---
const firebaseConfig = {
  apiKey: "AIzaSyAALMvrFJlIkmw9T2__ZqY_iZe7xDsR-FI",
  authDomain: "trip-up-cumilla.firebaseapp.com",
  projectId: "trip-up-cumilla",
  storageBucket: "trip-up-cumilla.appspot.com",
  messagingSenderId: "119458908788",
  appId: "1:119458908788:web:95cd3aa0aaf25e4226df21",
  measurementId: "G-N5E0ZJXLY4"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Helper: gen unique id (purchase id)
function genId(prefix='id') {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2,8);
  return `${prefix}_${t}_${r}`;
}

/* ===== Register ===== */
function registerUser() {
  const name = document.getElementById('reg_name').value.trim();
  const email = document.getElementById('reg_email').value.trim();
  const pass = document.getElementById('reg_pass').value;

  if(!name || !email || !pass) return alert('সবগুলো ফিল্ড পূরণ করো');

  auth.createUserWithEmailAndPassword(email, pass)
  .then(res => {
    const uid = res.user.uid;
    // create user doc with unique public id (userId)
    const userId = genId('user');
    return db.collection('users').doc(uid).set({
      uid: uid,
      userId: userId,
      name: name,
      email: email,
      phone: '',
      address: '',
      image: '',
      purchases: []
    });
  })
  .then(() => {
    alert('Account created. Redirecting to profile...');
    window.location.href = 'profile.html';
  })
  .catch(err => alert(err.message));
}

/* ===== Login ===== */
function loginUser() {
  const email = document.getElementById('log_email').value.trim();
  const pass = document.getElementById('log_pass').value;
  if(!email || !pass) return alert('Email/Password দেও'); 

  auth.signInWithEmailAndPassword(email, pass)
  .then(() => window.location.href='profile.html')
  .catch(err => alert(err.message));
}

/* ===== Quick Buy Demo =====
 If user logged in, creates a purchase object and stores under user's doc (array union)
*/
function quickBuy() {
  const product = document.getElementById('demoProduct').value;
  const user = auth.currentUser;
  if(!user) return alert('প্রথমে লোগইন করো');

  const purchase = {
    purchaseId: genId('purchase'),
    product: product,
    amount: (product.includes('Sajek')?4200:(product.includes('Bandarban')?2300:1950)),
    date: (new Date()).toISOString(),
    method: 'demo-quickbuy',
    source: 'website'
  };

  const userRef = db.collection('users').doc(user.uid);
  userRef.update({
    purchases: firebase.firestore.FieldValue.arrayUnion(purchase)
  })
  .then(()=> alert('Purchase saved to your profile!'))
  .catch(e => alert('Error saving purchase: '+e.message));
}

/* Optional sign-out function */
function signOut() {
  auth.signOut().then(()=> window.location.href='index.html');
}
