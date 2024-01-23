
const fs = require('fs');
const puppeteer = require('puppeteer');

var browser
var page 
var autoclose

async function htmlToImage(html, outputPath) {

  try {
    

    const browser = await puppeteer.launch({headless: "new",args: ['--no-sandbox']}); // cache browser and win 2 sec to generator
    const page = await browser.newPage();
    
    console.log("Генерируем изображение",outputPath)
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: outputPath, fullPage: true });
    await browser.close()


  } catch (error) {
    console.log("Ошибка внутри генератора изображений")
    console.error(error)
  }

}
module.exports = htmlToImage
  
