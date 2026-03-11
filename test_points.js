const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
    // 1. Setup browser and page
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // 2. Navigate to local site
    await page.goto('http://127.0.0.1:8080/index.html');
    
    // 3. Verify ranking button is gone
    const rankingBtn = await page.$('.ranking-fab');
    if (rankingBtn) {
        console.error("FAIL: Ranking button is still visible");
        process.exit(1);
    } else {
        console.log("PASS: Ranking button removed");
    }

    // 4. Create a test user
    const testUsername = "TestPlayer" + Math.floor(Math.random()*1000);
    
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
