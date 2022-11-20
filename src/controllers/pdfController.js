const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const options = require('../utils/pdfOptions');

const generateHoaDonPdf = async () => {
    try {
        const html = fs.readFileSync(path.join(__dirname, '../resources/views/pdfTemplate/template.html'), 'utf-8');
        const filename = Math.random() + '_doc' + '.pdf';
        let array = [];

        let data_res = {
            status: 'ok',
            filename: filename,
        };

        for (var i = 0; i < 5; i++) {
            const prod = {
                name: '123123',
                description: 'zlxkj zxlczxlkc',
                unit: 'pack',
                quantity: 2,
                price: 20,
                total: 40,
                imgurl: 'https://micro-cdn.sumo.com/image-resize/sumo-convert?uri=https://media.sumo.com/storyimages/ef624259-6815-44e2-b905-580f927bd608&hash=aa79d9187ddde664f8b3060254f1a5d57655a3340145e011b5b5ad697addb9c0&format=webp',
            };
            array.push(prod);
        }

        const obj = {
            prodlist: array,
        };

        const document = {
            html: html,
            data: {
                products: obj,
            },
            path: './src/public/temp/' + filename,
        };
        await pdf
            .create(document, options)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });

        return {
            status: 'ok',
            filename: filename,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 'error',
        };
    }
};

module.exports = {
    generateHoaDonPdf: generateHoaDonPdf,
};
