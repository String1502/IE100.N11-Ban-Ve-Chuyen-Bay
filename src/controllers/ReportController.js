import db from '../models/index';
const { QueryTypes, where } = require('sequelize');

//operator for sequelize
const { Op } = require('sequelize'); //https://sequelize.org/docs/v6/core-concepts/model-querying-basics/

class ReportController {
    // "/"
    async index(req, res) {
        try {
            return res.render('staff/BaoCaoDoanhThu', {
                layout: 'staff.handlebars',
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new ReportController();
