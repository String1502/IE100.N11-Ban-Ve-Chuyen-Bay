import db from '../models/index';
const { QueryTypes } = require('sequelize');

class LoggedinStaffController {
    // "/staff/"
    async index(req, res) {
        try {
            return res.render('staff/TraCuuChuyenBay', {
                layout: 'logged_in_staff.handlebars',
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new LoggedinStaffController();
