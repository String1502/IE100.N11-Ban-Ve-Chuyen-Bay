const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');

export default function renderTemplate(data, templateName) {
    const html = fs.readFileSync(path.join(__dirname, `../resources/views/pdfTemplate/${templateName}.hbs`), {
        encoding: 'utf-8',
    });

    // creates the handlebars template object
    const template = hbs.template(html);

    // renders the html template with the given data
    const rendered = template(data);

    return rendered;
}

module.exports = renderTemplate;
