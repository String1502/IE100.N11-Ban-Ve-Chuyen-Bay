import db from '../models/index';
const { QueryTypes } = require('sequelize');

class NhanLichController {
    // "/staff/nhanlich"
    async addflight(req, res) {
        try {
            return res.render('staff/TraCuuChuyenBay', {
                layout: 'staff.handlebars',
                SanBays: SanBays,
                HangGhes: HangGhes,
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new NhanLichController();
