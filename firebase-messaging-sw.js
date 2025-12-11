// firebase-messaging-sw.js (compat version)
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

// ファイル名: firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// あなたのFirebase設定
const firebaseConfig = {
  apiKey: "AIzaSyDpfbjezbYxrW3XMDegBSC5iFPEQEyD0Ls",
  authDomain: "funlearningjapanese-b8e08.firebaseapp.com",
  projectId: "funlearningjapanese-b8e08",
  storageBucket: "funlearningjapanese-b8e08.appspot.com",
  messagingSenderId: "1055688629268",
  appId: "1:1055688629268:web:248183b62f15c34a2d5b01",
  measurementId: "G-LCMXVLPS81"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// バックグラウンド通知の受信設定
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] バックグラウンド通知を受信:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png' // アイコン画像がない場合は適宜変更してください
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
