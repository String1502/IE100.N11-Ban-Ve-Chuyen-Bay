const nodeMailer = require('nodemailer');
import mailConfig from '../config/mail.config';
require('dotenv/config');

let sendMail = (to, subject, htmlContent) => {
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
    sendMail: sendMail,
};
