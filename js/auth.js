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
    const displayNameInput = document.getElementById('auth-display-name');
    const displayName = displayNameInput ? displayNameInput.value.trim() : "";
    const msg = document.getElementById('modal-msg');
    const submitBtn = document.getElementById('modal-submit');
    
    // 翻訳データがない場合の安全装置
    const errs = (window.i18nData && window.i18nData[window.currentLang]) 
        ? window.i18nData[window.currentLang] 
        : {
            err_input_req: "メールアドレスとパスワードを入力してください",
            err_pass_len: "パスワードは6文字以上にしてください",
            err_name_req: "ゲーム名を入力してください",
            err_name_taken: "その名前はすでに使われています",
            err_generic: "エラーが発生しました",
            err_email_taken: "このメールアドレスはすでに登録されています",
            err_auth_fail: "ログインに失敗しました"
        };

    if (!email || !pass) { msg.textContent = errs.err_input_req; return; }
    if (pass.length < 6) { msg.textContent = errs.err_pass_len; return; }

    // ★連打防止：処理中はボタンを押せなくする
    if (submitBtn) submitBtn.disabled = true;
    msg.style.color = "#666";
    msg.textContent = "処理中...";

    try {
        if (window.authMode === 'signup') {
            if (!displayName || displayName.length < 2) { 
                throw new Error("name_req"); 
            }
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("displayName", "==", displayName), limit(1));
            const snap = await getDocs(q);
            if (!snap.empty) { 
                throw new Error("name_taken"); 
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                email: email, 
                displayName: displayName, 
                monthlyPoints: 0, 
                totalPoints: 0,
                streak: 1,
                lastLogin: new Date().toISOString(), 
                dailyTracker: {},
                isPremium: false
            });
            sessionStorage.setItem(SESS_KEY, 'authenticated');
            if(window.closeAuthModal) window.closeAuthModal();

        } else {
            // ログイン処理
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: email, 
                    displayName: email.split('@')[0], 
                    monthlyPoints: 0,
                    totalPoints: 0, 
                    streak: 1,
                    lastLogin: new Date().toISOString(), 
                    dailyTracker: {},
                    isPremium: false
                });
            }
            // ★重要修正：ここで lastLogin を更新してしまうと checkMonthlyReset が正常に機能しないため削除しました
            // （更新は onAuthStateChanged 経由の checkMonthlyReset に任せます）

            sessionStorage.setItem(SESS_KEY, 'authenticated');
            if(window.closeAuthModal) window.closeAuthModal();
        }
    } catch (error) {
        console.error(error);
        msg.style.color = "red";
        let errorMsg = errs.err_generic;
        
        // エラー内容に応じたメッセージの出し分け
        if (error.message === "name_req") errorMsg = errs.err_name_req;
        else if (error.message === "name_taken") errorMsg = errs.err_name_taken;
        else if (error.code === 'auth/email-already-in-use') errorMsg = errs.err_email_taken;
        else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') errorMsg = errs.err_auth_fail;
        
        msg.textContent = errorMsg;
    } finally {
        // ★処理が終わったらボタンを再度押せるようにする
        if (submitBtn) submitBtn.disabled = false;
    }
};

window.logout = async () => {
    if (currentUserDocUnsubscribe) currentUserDocUnsubscribe();
    sessionStorage.removeItem(SESS_KEY);
    await signOut(auth);
    window.updateUI(null);
};

window.loginAsGuest = () => {
    if (currentUserDocUnsubscribe) currentUserDocUnsubscribe();
    sessionStorage.setItem(SESS_KEY, 'guest');
    window.updateUI('guest');
};

const checkMonthlyReset = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
        const data = snapshot.data();
        const now = new Date();
        const lastDate = data.lastLogin ? new Date(data.lastLogin) : new Date(0);
        
        // 月が変わっていたらポイントをリセット
        if (now.getFullYear() !== lastDate.getFullYear() || now.getMonth() !== lastDate.getMonth()) {
            await updateDoc(userRef, { monthlyPoints: 0, lastLogin: now.toISOString(), dailyTracker: {} });
        } else {
            // 月が同じなら最終ログイン日時だけ更新
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
                if(window.openPremiumModal) window.openPremiumModal();
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

        if(welcome) welcome.classList.add('hidden');
        if(dash) dash.classList.remove('hidden');
        document.getElementById('user-name').textContent = 'ゲスト';
        document.getElementById('user-lvl').textContent = 1;
        document.getElementById('level-fill').style.width = '0%';
        document.getElementById('streak-val').textContent = 0;
        document.getElementById('point-val').textContent = 0;
        
    } else if (userState && userState.uid) {
        if(welcome) welcome.classList.add('hidden');
        if(dash) dash.classList.remove('hidden');
        const userId = userState.uid;
        
        currentUserDocUnsubscribe = onSnapshot(doc(db, "users", userId), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                window.isUserPremium = data.isPremium || false;

                window.updateStaticCards(window.isUserPremium);

                document.getElementById('user-name').textContent = data.displayName || 'ユーザー';
                document.getElementById('streak-val').textContent = data.streak || 0;
                
                // 表示用は月間ポイント
                const monthlyPts = data.monthlyPoints !== undefined ? data.monthlyPoints : (data.points || 0);
                document.getElementById('point-val').textContent = monthlyPts;
                
                // レベル計算は累計ポイント
                const totalPts = data.totalPoints !== undefined ? data.totalPoints : (data.points || 0);
                const level = Math.floor(totalPts / 100) + 1;
                document.getElementById('user-lvl').textContent = level;
                document.getElementById('level-fill').style.width = `${(totalPts % 100)}%`;
            }
        });
    } else {
        window.isUserPremium = false;
        window.updateStaticCards(false);

        if(welcome) welcome.classList.remove('hidden');
        if(dash) dash.classList.add('hidden');
    }
};

window.addPointsToUser = async (pointsToAdd, questionId) => {
    // ゲストや未ログインは弾く
    if (!currentUserDocUnsubscribe || sessionStorage.getItem(SESS_KEY) === 'guest') {
        return false;
    }
    
    const user = auth.currentUser;
    if (!user) return false;

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const data = userSnap.data();
            const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"形式
            let tracker = data.dailyTracker || {};
            
            // すでに今日その問題をクリアしている場合はポイント加算せずスキップ
            if (questionId && tracker[questionId] === todayStr) {
                console.log(`Question ${questionId} already cleared today.`);
                return false;
            }

            // ポイント加算とトラッカー更新
            const currentMonthly = data.monthlyPoints !== undefined ? data.monthlyPoints : (data.points || 0);
            const currentTotal = data.totalPoints !== undefined ? data.totalPoints : (data.points || 0);
            
            if (questionId) {
                tracker[questionId] = todayStr;
            }

            await updateDoc(userRef, {
                monthlyPoints: currentMonthly + pointsToAdd,
                totalPoints: currentTotal + pointsToAdd,
                dailyTracker: tracker
            });
            return true;
        }
    } catch (error) {
        console.error("Error adding points:", error);
        return false;
    }
    return false;
};

// Antigravity Protocol Enforcement
window.Antigravity = {
    addPoint: async (categoryStr, questionId) => {
        // Enforce the 1-point and once-a-day rule via addPointsToUser.
        return await window.addPointsToUser(1, questionId);
    }
};

onAuthStateChanged(auth, async (user) => {
    if (sessionStorage.getItem(SESS_KEY) === 'guest') {
        window.updateUI('guest');
    } else if (user) {
        // 月間リセットのチェックを行ってからUIを更新
        await checkMonthlyReset(user);
        window.updateUI(user);
    } else {
        window.updateUI(null);
    }
});