async function createPdf(outputPath, htmlContent) {
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

function renderTemplate(data, templateName) {
    const html = fs.readFileSync(path.join(__dirname, `../resources/views/pdfTemplate/${templateName}.hbs`), {
        encoding: 'utf-8',
    });

    // creates the handlebars template object
    const template = hbs.template(html);

    // renders the html template with the given data
    const rendered = template(data);

    return rendered;
}
