
const fs = require('fs');
const puppeteer = require('puppeteer');

var browser
var page 
var autoclose

async function htmlToImage(inputpath, outputPath) {
    if(!browser){
      browser = await puppeteer.launch({headless: "new"}); // cache browser and win 2 sec to generator
    }
    if (!page){
      page = await browser.newPage();
    }
    await page.setContent(fs.readFileSync(inputpath, 'utf8'), { waitUntil: 'networkidle0' });
    await page.screenshot({ path: outputPath, fullPage: true });

    clearInterval(autoclose)
    autoclose = setInterval(() => {
      if(browser){
        browser.close();
        console.log("brovser_closed")
      }
      clearInterval(autoclose)
    }, 30000);
}
module.exports = htmlToImage
  
