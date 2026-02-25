// ページが読み込まれたら、URLから動画ファイル名を取得して再生します
        document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const videoFile = urlParams.get('video'); // ?video= の値
            const videoTitle = urlParams.get('title'); // ?title= の値

            const videoPlayer = document.getElementById('video-player');
            const titleElement = document.getElementById('video-title');

            // ★ 修正: titleElement が見つかるか確認
            if (!titleElement) {
                console.error('エラー: ID "video-title" が見つかりません。');
                return;
            }
            if (!videoPlayer) {
                console.error('エラー: ID "video-player" が見つかりません。');
                return;
            }

            if (videoFile) {
                videoPlayer.src = videoFile;
                // ★ 修正: decodeURIComponentで日本語を正しく読み込む
                titleElement.textContent = decodeURIComponent(videoTitle) || '動画';
            } else {
                titleElement.textContent = 'エラー: 動画が見つかりません。';
            }
        });