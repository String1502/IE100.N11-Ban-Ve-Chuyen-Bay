const nodeMailer = require('nodemailer');
import mailConfig from '../config/mail.config';
const path = require('path');
require('dotenv/config');

let sendMailWithAttach = async (to, subject, htmlContent, filename) => {
    let transporter = nodeMailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: mailConfig.USERNAME, // generated ethereal user
            pass: mailConfig.PASSWORD, // generated ethereal password
        },
    });

    let pathAttach = path.join(__dirname, '../public/temp/' + filename);

    let options = {
        from: mailConfig.FROM_ADDRESS,
        to: to,
        subject: subject,
        html: htmlContent,
        attachments: [{ filename: filename, path: pathAttach }],
    };

    return transporter.sendMail(options);
};

let sendMail = async (to, subject, htmlContent) => {
    let transporter = nodeMailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: mailConfig.USERNAME, // generated ethereal user
            pass: mailConfig.PASSWORD, // generated ethereal password
        },
    });

    let options = {
        from: mailConfig.FROM_ADDRESS,
        to: to,
        subject: subject,
        html: htmlContent,
    };

    return transporter.sendMail(options);
};

module.exports = {
    sendMailWithAttach: sendMailWithAttach,
    sendMail: sendMail,
};
