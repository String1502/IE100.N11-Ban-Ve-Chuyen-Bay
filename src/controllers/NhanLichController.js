import db from '../models/index';
const { QueryTypes } = require('sequelize');

class NhanLichController {
    // "/staff/nhanlich"
    async chooseAdd(req, res) {
        try {
            return res.render('staff/NhanLich/KieuNhanLich', {
                layout: 'staff.handlebars',
            });
        } catch (error) {
            console.log(error);
        }
    }
    // "/staff/nhanlich/thucong"
    async addbyType(req, res) {
        try {
            let SanBays = await db.sequelize.query(
                `select MaSanBay , TenSanBay, TenTinhThanh as TinhThanh from sanbay, tinhthanh where sanbay.matinhthanh = tinhthanh.matinhthanh and sanbay.TrangThai = 'HoatDong'`,
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            let HangGhes = await db.sequelize.query(
                `select MaHangGhe , TenHangGhe, HeSo from hangghe where hangghe.TrangThai = 'ApDung' `,
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            var SB_HG = {
                SanBays: SanBays,
                HangGhes: HangGhes,
            };

            let ThamSos = await db.sequelize.query(`select * from thamso `, {
                type: QueryTypes.SELECT,
                raw: true,
            });

            return res.render('staff/NhanLich/NhanLichThuCong', {
                layout: 'staff.handlebars',
                SB_HG: SB_HG,
                ThamSos: JSON.stringify(ThamSos),
            });
        } catch (error) {
            console.log(error);
        }
    }
    // "/staff/nhanlich/fromexcel"
    async addbyExcel(req, res) {
        try {
            let SanBays = await db.sequelize.query(
                `select MaSanBay , TenSanBay, TenTinhThanh as TinhThanh from sanbay, tinhthanh where sanbay.matinhthanh = tinhthanh.matinhthanh and sanbay.TrangThai = 'HoatDong'`,
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            let HangGhes = await db.sequelize.query(
                `select MaHangGhe , TenHangGhe, HeSo from hangghe where hangghe.TrangThai = 'ApDung' `,
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            return res.render('staff/NhanLich/NhanLichTuExcel', {
                layout: 'staff.handlebars',
                SB_HG: JSON.stringify({ SanBays: SanBays, HangGhes: HangGhes }),
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new NhanLichController();
