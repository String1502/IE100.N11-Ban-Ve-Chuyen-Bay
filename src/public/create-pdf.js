const puppeteer = require('puppeteer');
const fs = require('fs');

export default async function createPdf(outputPath, htmlContent) {
    // launches a puppeteer browser instance and opens a new page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // sets the html of the page to htmlContent argument
    await page.setContent(htmlContent);

    // prints the html page to pdf document and saves it to given outputPath
    await page.emulateMediaType('print');
    await page.pdf({ path: outputPath, format: 'A4' });

    // closing the puppeteer browser instance
    await browser.close();
}
