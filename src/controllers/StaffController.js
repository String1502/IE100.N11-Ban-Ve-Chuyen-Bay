import db from '../models/index';
const { QueryTypes } = require('sequelize');

class StaffController {
    // "/staff/"
    async index(req, res) {
        try {
            return res.render('staff/TraCuuChuyenBay', {
                layout: 'staff.handlebars',
            });
        } catch (error) {
            console.log(error);
        }
    }
    // "/staff/flightdetail"
    async flightdetail(req, res) {
        try {
            return res.render('staff/ChiTietChuyenBay', {
                layout: 'staff.handlebars',
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new StaffController();
