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
