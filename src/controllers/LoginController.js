import db from '../models/index';
const { QueryTypes } = require('sequelize');

class LoginController {
    // "/login"
    async login(req, res) {
        try {
            return res.render('login/DangNhap', {
                layout: 'client.handlebars',
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new LoginController();
