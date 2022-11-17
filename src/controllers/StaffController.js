import db from '../models/index';
const { QueryTypes } = require('sequelize');

class StaffController {
    // "/staff/"
    async index(req, res) {
        try {
            let SanBays = await db.sequelize.query(
                'select MaSanBay , TenSanBay, TenTinhThanh as TinhThanh from sanbay, tinhthanh where sanbay.matinhthanh = tinhthanh.matinhthanh',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            let HangGhes = await db.sequelize.query(
                `select MaHangGhe , TenHangGhe from hangghe where hangghe.TrangThai = 'apdung' `,
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            return res.render('staff/TraCuuChuyenBay', {
                layout: 'staff.handlebars',
                SanBays: SanBays,
                HangGhes: HangGhes,
            });
        } catch (error) {
            console.log(error);
        }
    }
    // "/staff/flightdetail"
    async flightdetail(req, res) {
        try {
            let Package = JSON.parse(req.body.Package);
            console.log(Package);
            return res.render('staff/ChiTietChuyenBay', {
                layout: 'staff.handlebars',
                Package: Package,
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new StaffController();
