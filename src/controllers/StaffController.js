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

            return res.render('staff/TraCuu/TraCuuChuyenBay', {
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
            let ThamSos = await db.sequelize.query(
                `select TenThamSo, GiaTri from thamso where thamso.TenThamSo='ThoiGianChinhSua_Min'`,
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            Package['ThamSos'] = structuredClone(ThamSos[0]);
            console.log(Package);
            return res.render('staff/TraCuu/ChiTietChuyenBay', {
                layout: 'staff.handlebars',
                Package: Package,
            });
        } catch (error) {
            console.log(error);
        }
    }
    // "/staff/flightdetail/editdetail"
    async editdetail(req, res) {
        try {
            let SanBays = await db.sequelize.query(
                'select MaSanBay , TenSanBay, TenTinhThanh as TinhThanh from sanbay, tinhthanh where sanbay.matinhthanh = tinhthanh.matinhthanh',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            let HangGhes = await db.sequelize.query(
                `select MaHangGhe , TenHangGhe, HeSo from hangghe where hangghe.TrangThai = 'apdung' `,
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            HangGhes.map((item) => {
                item.HeSo = parseFloat(item.HeSo);
            });

            let ThamSos = await db.sequelize.query(
                `select TenThamSo, GiaTri, TenHienThi, NgayHieuLuc from thamso where thamso.TenThamSo='ThoiGianBayToiThieu' OR thamso.TenThamSo='ThoiGianDungToiThieu' OR thamso.TenThamSo='SBTG_Max' OR thamso.TenThamSo='GiaVeCoBan_Min'`,
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            let Flight_Edit = JSON.parse(req.body.Flight_Edit);
            Flight_Edit['SanBays'] = structuredClone(SanBays);
            Flight_Edit['HangGhes'] = structuredClone(HangGhes);
            Flight_Edit['ThamSos'] = structuredClone(ThamSos);

            return res.render('staff/TraCuu/ChinhSuaChuyenBay', {
                layout: 'staff.handlebars',
                Flight_Edit: Flight_Edit,
                Flight_EditJS: JSON.stringify(Flight_Edit),
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new StaffController();
