// Global back button injection logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if we should render the back button on this page
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('old_index.html');

    // Don't inject on home page
    if (isHomePage) return;

    // 2. Prevent duplicate injection
    if (document.getElementById('global-back-btn-element')) return;

    // 3. Create the button element
    const btn = document.createElement('button');
    btn.id = 'global-back-btn-element';
    btn.className = 'global-back-btn';
    btn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    btn.setAttribute('aria-label', '戻る (Back)');

    // 4. Attach routing logic
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Strategy: Attempt to call page-specific single-page-app routing functions first.
        // If none exist, default to simply changing location to index.html.

        if (typeof goBack === 'function') {
            goBack();
        } else if (typeof handleHeaderBack === 'function') {
            handleHeaderBack();
        } else if (typeof showMenu === 'function') {
            showMenu();
        } else if (typeof showLevelSelect === 'function') {
            showLevelSelect();
        } else if (typeof showLevelMenu === 'function') {
            showLevelMenu();
        } else if (typeof showTopicMap === 'function') {
            showTopicMap();
        } else {
            // Default fallback routing for standalone pages
            window.location.href = 'index.html';
        }
    });

    // 5. Append to body
    document.body.appendChild(btn);

    // Give body a class so pages can adjust layout if they want.
    document.body.classList.add('has-global-back-btn');
});
