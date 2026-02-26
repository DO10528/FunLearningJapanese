import { auth, db } from "./firebase-config.js";
import {
    doc, setDoc, updateDoc, getDoc, onSnapshot, query, collection, orderBy, limit, getDocs, where
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {
    onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const SESS_KEY = 'fun_japanese_user_v2';
let currentUserDocUnsubscribe = null;

window.loginWithLine = () => {
    alert("LINE連携は準備中です。");
};

window.submitAuth = async () => {
    const email = document.getElementById('auth-email').value.trim();
    const pass = document.getElementById('auth-pass').value.trim();
    const displayName = document.getElementById('auth-display-name').value.trim();
    const msg = document.getElementById('modal-msg');
    const errs = window.i18nData[window.currentLang];

    if (!email || !pass) { msg.textContent = errs.err_input_req; return; }
    if (pass.length < 6) { msg.textContent = errs.err_pass_len; return; }

    try {
        if (window.authMode === 'signup') {
            if (!displayName || displayName.length < 2) { msg.textContent = errs.err_name_req; return; }
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("displayName", "==", displayName), limit(1));
            const snap = await getDocs(q);
            if (!snap.empty) { msg.textContent = errs.err_name_taken; return; }

            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                email: email, displayName: displayName, points: 0, streak: 1,
                lastLogin: new Date().toISOString(), dailyTracker: {},
                isPremium: false
            });
            sessionStorage.setItem(SESS_KEY, 'authenticated');
            window.closeAuthModal();
        } else {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: email, displayName: email.split('@')[0], points: 0, streak: 1,
                    lastLogin: new Date().toISOString(), dailyTracker: {},
                    isPremium: false
                });
            } else {
                await updateDoc(userRef, { lastLogin: new Date().toISOString() });
            }
            sessionStorage.setItem(SESS_KEY, 'authenticated');
            window.closeAuthModal();
        }
    } catch (error) {
        console.error(error);
        let errorMsg = errs.err_generic;
        if (error.code === 'auth/email-already-in-use') errorMsg = errs.err_email_taken;
        else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') errorMsg = errs.err_auth_fail;
        msg.textContent = errorMsg;
    }
};

window.logout = async () => {
    if (currentUserDocUnsubscribe) currentUserDocUnsubscribe();
    sessionStorage.removeItem(SESS_KEY);
    await signOut(auth);
    updateUI(null);
};

window.loginAsGuest = () => {
    if (currentUserDocUnsubscribe) currentUserDocUnsubscribe();
    sessionStorage.setItem(SESS_KEY, 'guest');
    updateUI('guest');
};

const checkMonthlyReset = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
        const data = snapshot.data();
        const now = new Date();
        const lastDate = data.lastLogin ? new Date(data.lastLogin) : new Date(0);
        if (now.getFullYear() !== lastDate.getFullYear() || now.getMonth() !== lastDate.getMonth()) {
            await updateDoc(userRef, { points: 0, lastLogin: now.toISOString(), dailyTracker: {} });
        } else {
            await updateDoc(userRef, { lastLogin: now.toISOString() });
        }
    }
};

window.updateStaticCards = (isPremium) => {
    const staticSengoku = document.getElementById('static-sengoku-btn');
    if (staticSengoku) {
        if (!isPremium) {
            staticSengoku.classList.add('locked');
            staticSengoku.href = "javascript:void(0)";
            staticSengoku.onclick = (e) => {
                e.preventDefault();
                window.openPremiumModal();
            };
        } else {
            staticSengoku.classList.remove('locked');
            staticSengoku.href = "culture_map.html";
            staticSengoku.onclick = null;
        }
    }
};

window.updateUI = function (userState) {
    const dash = document.getElementById('user-dashboard');
    const welcome = document.getElementById('guest-welcome');
    if (currentUserDocUnsubscribe) currentUserDocUnsubscribe();

    if (userState === 'guest') {
        window.isUserPremium = false;
        window.updateStaticCards(false);

        welcome.classList.add('hidden');
        dash.classList.remove('hidden');
        document.getElementById('user-name').textContent = 'ゲスト';
        document.getElementById('user-lvl').textContent = 1;
        document.getElementById('level-fill').style.width = '0%';
        document.getElementById('streak-val').textContent = 0;
        document.getElementById('point-val').textContent = 0;
    } else if (userState && userState.uid) {
        welcome.classList.add('hidden');
        dash.classList.remove('hidden');
        const userId = userState.uid;
        currentUserDocUnsubscribe = onSnapshot(doc(db, "users", userId), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                window.isUserPremium = data.isPremium || false;

                window.updateStaticCards(window.isUserPremium);

                document.getElementById('user-name').textContent = data.displayName || 'ユーザー';
                document.getElementById('streak-val').textContent = data.streak || 0;
                document.getElementById('point-val').textContent = data.points || 0;
                const pts = data.points || 0;
                const level = Math.floor(pts / 100) + 1;
                document.getElementById('user-lvl').textContent = level;
                document.getElementById('level-fill').style.width = `${(pts % 100)}%`;
            }
        });
    } else {
        window.isUserPremium = false;
        window.updateStaticCards(false);

        welcome.classList.remove('hidden');
        dash.classList.add('hidden');
    }
};

window.toggleRanking = async () => {
    const modal = document.getElementById('ranking-modal');
    const list = document.getElementById('ranking-list');
    const loading = document.getElementById('ranking-loading');

    modal.style.display = 'flex';
    list.innerHTML = '';
    loading.style.display = 'block';

    try {
        const q = query(collection(db, "users"), orderBy("points", "desc"), limit(5));
        const querySnapshot = await getDocs(q);

        loading.style.display = 'none';

        let rank = 1;
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const name = data.displayName || docSnap.id;
            const pt = data.points || 0;

            const icon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;

            const li = document.createElement('li');
            li.style.cssText = "padding:10px; border-bottom:1px dashed #ccc; font-weight:bold; display:flex; justify-content:space-between;";

            // Text node is safer here instead of innerHTML if data.displayName has HTML tags (XSS protection)
            const span1 = document.createElement('span');
            span1.textContent = `${icon} ${name}`;
            const span2 = document.createElement('span');
            span2.style.color = '#f0ad4e';
            span2.textContent = `${pt}pt`;

            li.appendChild(span1);
            li.appendChild(span2);

            list.appendChild(li);
            rank++;
        });

        if (rank === 1) {
            list.innerHTML = '<li style="padding:10px; text-align:center; color:#999;">まだデータがありません</li>';
        }

    } catch (e) {
        console.error(e);
        loading.innerText = '読み込みエラー';
    }
};

onAuthStateChanged(auth, async (user) => {
    if (sessionStorage.getItem(SESS_KEY) === 'guest') {
        updateUI('guest');
    } else if (user) {
        await checkMonthlyReset(user);
        updateUI(user);
    } else {
        updateUI(null);
    }
});
