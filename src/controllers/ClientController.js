import db from '../models/index';
const { QueryTypes } = require('sequelize');

class ClientController {
    // "/"
    async index(req, res) {
        try {
            return res.render('client/TraCuuChuyenBay', {
                layout: 'client.handlebars',
            });
        } catch (error) {
            console.log(error);
        }
    }
    // "/choose_flight"
    async choose_flight(req, res) {
        try {
            return res.render('client/ChonChuyenBay', {
                layout: 'client.handlebars',
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new ClientController();
