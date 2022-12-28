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

            let ThamSos = await db.sequelize.query(`select * from thamso `, {
                type: QueryTypes.SELECT,
                raw: true,
            });

            return res.render('staff/NhanLich/NhanLichTuExcel', {
                layout: 'staff.handlebars',
                SB_HG: JSON.stringify({ SanBays: SanBays, HangGhes: HangGhes, ThamSos: ThamSos }),
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Download file excel template
    async downExcelTemplate(req, res) {
        try {
            var filePath = './src/public/ExcelTemplate/PlanetExcelTemplate.xlsx';
            var fileName = 'PlanetExcelTemplate.xlsx';
            return res.download(filePath, fileName);
        } catch (error) {
            console.log(error);
        }
    }

    // Download file excel template
    async FlightAmount(req, res) {
        try {
            let amount = await db.sequelize.query(`SELECT MAX(MaChuyenBay) AS last_flight FROM chuyenbay`, {
                type: QueryTypes.SELECT,
                raw: true,
            });
            return res.send(amount[0]);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new NhanLichController();
