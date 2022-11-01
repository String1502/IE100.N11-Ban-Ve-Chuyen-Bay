import db from '../models/index';
const { QueryTypes } = require('sequelize');

class LoggedinClientController {
    // "/client/"
    async index(req, res) {
        try {
            return res.render('client/TraCuuChuyenBay', {
                layout: 'logged_in_client.handlebars',
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new LoggedinClientController();
