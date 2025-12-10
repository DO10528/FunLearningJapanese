// --- Web Push通知の許可リクエスト（修正版） ---
    window.requestNotificationPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                // ★修正ここから: Service Workerを明示的に登録して場所を教える
                let swReg;
                try {
                    // 同じフォルダにあるファイルを指定して登録
                    swReg = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
                    console.log("Service Worker登録成功:", swReg);
                } catch (err) {
                    console.error("Service Worker登録失敗:", err);
                    alert("Service Workerファイルの読み込みに失敗しました。\nファイルの場所を確認してください。");
                    return;
                }

                // 登録したService Workerを使ってトークンを取得
                // ※本来はここに { vapidKey: 'YOUR_PUBLIC_KEY' } が必要ですが、まずは接続確認
                const token = await getToken(messaging, { serviceWorkerRegistration: swReg });
                // ★修正ここまで

                if (token) {
                    console.log("FCM Token:", token);
                    alert("通知が許可されました！\n(コンソールにトークンが表示されました)");
                } else {
                    alert("トークンの取得に失敗しました。");
                }
            } else {
                alert("通知がブロックされています。ブラウザの設定から許可してください。");
            }
        } catch (error) {
            console.error(error);
            alert("エラーが発生しました: " + error.message);
        }
    };