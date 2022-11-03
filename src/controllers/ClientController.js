import db from '../models/index';
const { QueryTypes } = require('sequelize');

class ClientController {
    // "/"
    async index(req, res) {
        let mangSanBay = [];
        let Sanbay = [];

        for (let i = 0; i < 10; i++) {
            Sanbay.push({
                masanbay: i.toString(),
                tensanbay: 'Ten' + i,
                matinhthanh: i.toString(),
                tentinhthanh: 'TinhThanh' + i,
            });
            mangSanBay.push({ object: Sanbay[i], stringify: JSON.stringify(Sanbay[i]) });
        }
        try {
            return res.render('client/TraCuuChuyenBay', {
                layout: 'client.handlebars',
                SanBays: mangSanBay,
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
