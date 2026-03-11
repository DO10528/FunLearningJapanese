const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
    // 1. Setup browser and page
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // We will use the file system directly since local http-server might be failing/blocked
    const url = 'file://' + __dirname + '/index.html';
    await page.goto(url);
    
    // 3. Verify ranking button is gone
    const rankingBtn = await page.$('.ranking-fab');
    if (rankingBtn) {
        console.error("FAIL: Ranking button is still visible");
        process.exit(1);
    } else {
        console.log("PASS: Ranking button removed");
    }

    // 4. Create a test user
    const testUsername = "TestPlayer" + Date.now();
    
    // Wait until the dashboard/guest area is loaded
    await page.waitForSelector('#login-btn', { state: 'visible' });
    
    // Click register button
    await page.click('#signup-btn');
    
    // Fill out the modal
    await page.fill('#auth-email', testUsername + '@test.com');
    await page.fill('#auth-pass', 'password123');
    await page.fill('#auth-display-name', testUsername);
    
    // Submit register form
    await page.click('#modal-submit');
    
    // Wait for login to complete and dashboard to show
    await page.waitForSelector('#user-dashboard', { state: 'visible', timeout: 5000 });
    console.log("PASS: Logged in successfully");
    
    // Ensure initial point is 0
    let points = await page.innerText('#point-val');
    console.log(`Initial Points: ${points}`);
    
    await browser.close();
})();
