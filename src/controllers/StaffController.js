import db from '../models/index';
const { QueryTypes } = require('sequelize');

class StaffController {
    //LoadHeder
    async LoadHeader(req, res) {
        try {
            let P = {};
            let MaUser = req.signedCookies.MaUser;
            let User = await db.User.findOne({ where: { MaUser: MaUser }, raw: true });
            let Quyen = await db.sequelize.query(
                "select MaQuyen from phanquyen where MaChucVu = '" + User.MaChucVu + "'",
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            let QuyenHT = [];
            for (let i = 0; i < 6; i++) {
                QuyenHT[i] = 0;
            }
            for (let i = 0; i < Quyen.length; i++) {
                QuyenHT[Quyen[i].MaQuyen] = 1;
            }
            P.HoTen = User.HoTen;
            P.QuyenHT = QuyenHT;
            return res.send(P);
        } catch (err) {
            console.log(err);
        }
    }
    //Màn hình profile
    async Profile(req, res) {
        try {
            let ChucVus = await db.sequelize.query('select MaChucVu, TenChucVu from chucvu', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let Users = await db.sequelize.query(
                'select MaUser, Email,MatKhau,HoTen,CCCD,GioiTinh,NgaySinh,MaChucVu,HinhAnh,TrangThai,SDT from user',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            let MaUser = req.signedCookies.MaUser;
            return res.render('staff/Profile', {
                layout: 'staff.handlebars',
                ChucVus: ChucVus,
                Users: JSON.stringify(Users),
                MaUser: MaUser,
            });
        } catch (error) {
            console.log(error);
        }
    }
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

            let ThamSos = await db.sequelize.query(`select * from thamso `, {
                type: QueryTypes.SELECT,
                raw: true,
            });

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
