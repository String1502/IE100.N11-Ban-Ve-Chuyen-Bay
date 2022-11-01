import db from '../models/index';
const { QueryTypes } = require('sequelize');

class NotLoginController {
    // "/"
    async index(req, res) {
        try {
            return res.render('client/TraCuuChuyenBay', {
                layout: 'not_login.handlebars',
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new NotLoginController();
