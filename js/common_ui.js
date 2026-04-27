// Global home button injection logic
function injectGlobalHomeButton() {
    // 1. Check if we should render the home button on this page
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('old_index.html');

    // Don't inject on home page
    if (isHomePage) return;

    // 2. Prevent duplicate injection
    if (document.getElementById('global-back-btn-element')) return;

    // 3. Create the button element
    const btn = document.createElement('a');
    btn.id = 'global-back-btn-element';
    btn.className = 'global-back-btn';
    btn.href = 'index.html';
    btn.innerHTML = '<i class="fa-solid fa-house"></i>';
    btn.setAttribute('aria-label', 'ホームに戻る (Home)');

    // 4. Append to body
    document.body.appendChild(btn);

    // Give body a class so pages can adjust layout if they want.
    document.body.classList.add('has-global-back-btn');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectGlobalHomeButton);
} else {
    injectGlobalHomeButton();
}

// --- Antigravity Global Context ---
window.Antigravity = window.Antigravity || {};

window.Antigravity.showResultScreen = function(earnedPoints) {
    let overlay = document.getElementById('ag-result-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'ag-result-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '999999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.backdropFilter = 'blur(5px)';
        document.body.appendChild(overlay);
    }
    
    // Play fanfare if possible
    try {
        const fanfare = new Audio('assets/sounds/fanfare.mp3');
        fanfare.play().catch(e => console.log('Fanfare play prevented:', e));
    } catch(e) {}

    overlay.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 90%; width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
            <h2 style="color: #4caf50; font-size: 2.5rem; margin-top: 0; margin-bottom: 10px;"><i class="fa-solid fa-crown" style="color: gold;"></i> Excellent!</h2>
            <p style="font-size: 1.2rem; color: #555; margin-bottom: 20px; font-weight: bold;">おわりました！</p>
            
            <div style="background: #fff8e1; border: 2px solid #ffc107; border-radius: 15px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 1.1rem; color: #795548; font-weight: bold;">かくとくポイント</p>
                <div style="font-size: 3.5rem; font-weight: 900; color: #ff9800; margin: 10px 0;">
                    ${earnedPoints} <i class="fa-solid fa-star" style="color: #ffc107;"></i>
                </div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <button onclick="location.reload()" style="background: #2196f3; color: white; border: none; padding: 15px; font-size: 1.2rem; font-weight: bold; border-radius: 30px; cursor: pointer; box-shadow: 0 4px 0 #1565c0;" onmousedown="this.style.transform='translateY(4px)'; this.style.boxShadow='none';" onmouseup="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 0 #1565c0';">
                    <i class="fa-solid fa-rotate-right"></i> もういちど
                </button>
                <button onclick="if(window.exitGameToCategory) { window.exitGameToCategory(); } else { window.location.href='index.html'; }" style="background: #e0e0e0; color: #555; border: none; padding: 15px; font-size: 1.2rem; font-weight: bold; border-radius: 30px; cursor: pointer; box-shadow: 0 4px 0 #bdbdbd;" onmousedown="this.style.transform='translateY(4px)'; this.style.boxShadow='none';" onmouseup="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 0 #bdbdbd';">
                    <i class="fa-solid fa-list"></i> メニューにもどる
                </button>
            </div>
        </div>
        <style>
            @keyframes popIn {
                0% { opacity: 0; transform: scale(0.5); }
                70% { transform: scale(1.05); }
                100% { opacity: 1; transform: scale(1); }
            }
        </style>
    `;
    overlay.style.display = 'flex';
};
