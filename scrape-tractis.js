const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://tractis.ai', { waitUntil: 'networkidle2' });

  // Extract computed styles from the page
  const colors = await page.evaluate(() => {
    const body = document.body;
    const bodyStyles = window.getComputedStyle(body);

    // Get main elements
    const main = document.querySelector('main') || body;
    const mainStyles = window.getComputedStyle(main);

    const h1 = document.querySelector('h1');
    const h1Styles = h1 ? window.getComputedStyle(h1) : null;

    const p = document.querySelector('p');
    const pStyles = p ? window.getComputedStyle(p) : null;

    const card = document.querySelector('[class*="card"], .card, section');
    const cardStyles = card ? window.getComputedStyle(card) : null;

    const button = document.querySelector('button, a[class*="button"], [class*="btn"]');
    const buttonStyles = button ? window.getComputedStyle(button) : null;

    return {
      body: {
        backgroundColor: bodyStyles.backgroundColor,
        color: bodyStyles.color,
        fontFamily: bodyStyles.fontFamily
      },
      main: {
        backgroundColor: mainStyles.backgroundColor,
        color: mainStyles.color
      },
      heading: h1Styles ? {
        color: h1Styles.color,
        fontSize: h1Styles.fontSize,
        fontWeight: h1Styles.fontWeight
      } : null,
      paragraph: pStyles ? {
        color: pStyles.color,
        fontSize: pStyles.fontSize
      } : null,
      card: cardStyles ? {
        backgroundColor: cardStyles.backgroundColor,
        color: cardStyles.color,
        borderColor: cardStyles.borderColor
      } : null,
      button: buttonStyles ? {
        backgroundColor: buttonStyles.backgroundColor,
        color: buttonStyles.color,
        borderColor: buttonStyles.borderColor
      } : null
    };
  });

  console.log(JSON.stringify(colors, null, 2));

  await browser.close();
})();
