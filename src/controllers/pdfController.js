const fs = require('fs');
const path = require('path');
const utils = require('util');
const puppeteer = require('puppeteer');
const hb = require('handlebars');
const readFile = utils.promisify(fs.readFile);
import db from '../models/index';
const { QueryTypes } = require('sequelize');

let getTemplateHtml = async () => {
    console.log('Loading template file in memory');
    try {
        const invoicePath = path.resolve('./src/resources/views/pdfTemplate/template.html');
        return await readFile(invoicePath, 'utf8');
    } catch (err) {
        return Promise.reject('Could not load html template');
    }
};

let generatePdf = async (MaHoaDon, MaHangGhe) => {
    let data = {};
    getTemplateHtml()
        .then(async (call) => {
            // Now we have the html code of our template in res object
            // you can check by logging it on console
            // console.log(res)
            const template = hb.compile(call, { strict: true });
            // we have compile our code with handlebars
            const result = template(data);
            // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
            const html = result;
            // we are using headless mode
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            // We set the page content as the generated html by handlebars
            await page.setContent(html);
            // We use pdf function to generate the pdf in the same folder as this file.
            let date = new Date(Date.now());
            const filename = `[${date.toDateString()}].[${MaHangGhe}-${MaHoaDon}].pdf`;
            await page.pdf({ path: `./src/public/temp/${filename}.pdf`, format: 'A3' });
            await browser.close();
            console.log('PDF Generated');
            return res.send('ok');
        })
        .catch((err) => {
            console.error(err);
            return res.send('fail');
        });
};

module.exports = {
    generatePdf: generatePdf,
};
