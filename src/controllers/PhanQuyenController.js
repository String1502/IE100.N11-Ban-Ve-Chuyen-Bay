import db from '../models/index';
const { QueryTypes } = require('sequelize');

class PhanQuyenController {
    //staff/Authorization
    async Authorization(req, res) {
        try {
            let ChucVus = await db.sequelize.query('select MaChucVu, TenChucVu from chucvu', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let Users = await db.sequelize.query(
                'select MaUser, Email, MatKhau,HoTen ,SDT,  CCCD, GioiTinh, NgaySinh, MaChucVu, HinhAnh, TrangThai from user ',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            for (let i = 0; i < ChucVus.length; i++) {
                let U = [];
                let t = 0;
                for (let j = 0; j < Users.length; j++) {
                    if (Users[j].MaChucVu == ChucVus[i].MaChucVu) {
                        U[t] = Users[j];
                        t++;
                    }
                }
                ChucVus[i].Users = structuredClone(U);
                ChucVus[i].SoLuong = U.length;
            }
            return res.render('staff/PhanQuyenChuyenBay', {
                layout: 'staff.handlebars',
                ChucVus: ChucVus,
            });
        } catch (error) {
            console.log(error);
        }
    }

    //staff/AddPosition
    async AddPosition(req, res) {
        try {
            let ChucVus = await db.sequelize.query('select MaChucVu, TenChucVu from chucvu', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let Quyens = await db.sequelize.query('select MaQuyen, TenQuyen, TenManHinhDuocLoad from quyen', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            return res.render('staff/ThemChucVu', {
                layout: 'staff.handlebars',
                Quyens: Quyens,
                ChucVus: JSON.stringify(ChucVus),
            });
        } catch (error) {
            console.log(error);
        }
    }

    //staff//EditPosition
    async EditPosition(req, res) {
        try {
            let ChucVu = {};
            ChucVu.TenChucVu = req.body.Package;
            let ChucVus = await db.sequelize.query('select MaChucVu, TenChucVu from chucvu', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            for (let i = 0; i < ChucVus.length; i++) {
                if (ChucVus[i].TenChucVu == ChucVu.TenChucVu) {
                    ChucVu.MaChucVu = ChucVus[i].MaChucVu;
                    break;
                }
            }
            let PhanQuyens = await db.PhanQuyen.findAll();
            let P = [];
            for (let i = 0; i < PhanQuyens.length; i++) {
                if (PhanQuyens[i].MaChucVu == ChucVu.MaChucVu) {
                    P[PhanQuyens[i].MaQuyen] = 1;
                }
            }
            ChucVu.Quyens = structuredClone(P);
            let Quyens = await db.sequelize.query('select MaQuyen, TenQuyen, TenManHinhDuocLoad from quyen', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            return res.render('staff/SuaChucVu', {
                layout: 'staff.handlebars',
                ChucVus: JSON.stringify(ChucVus),
                ChucVu: JSON.stringify(ChucVu),
                Quyens: Quyens,
            });
        } catch (error) {
            console.log(error);
        }
    }

    //staff//ThemChucVu
    async ThemChucVu(req, res) {
        try {
            let ChucVu_P = req.body;
            await db.ChucVu.create({
                MaChucVu: ChucVu_P.MaChucVu,
                TenChucVu: ChucVu_P.TenChucVu,
            });
            for (let i = 0; i < ChucVu_P.Quyens.length; i++) {
                await db.PhanQuyen.create({
                    MaChucVu: ChucVu_P.MaChucVu,
                    MaQuyen: ChucVu_P.Quyens[i],
                });
            }
            return res.send('tc');
        } catch (error) {
            console.log(error);
        }
    }

    //staff//SuaChucVu
    async SuaChucVu(req, res) {
        try {
            let ChucVu_P = req.body;
            let ChucVu = await db.ChucVu.findAll();
            for (let i = 0; i < ChucVu.length; i++) {
                if (ChucVu[i].MaChucVu == ChucVu_P.MaChucVu) {
                    ChucVu[i].set({
                        TenChucVu: ChucVu_P.TenChucVu,
                    });
                    await ChucVu[i].save();
                }
            }

            await db.sequelize.query("Delete from phanquyen where MaChucVu = '" + ChucVu_P.MaChucVu + "'");
            for (let i = 0; i < ChucVu_P.Quyens.length; i++) {
                await db.PhanQuyen.create({
                    MaChucVu: ChucVu_P.MaChucVu,
                    MaQuyen: ChucVu_P.Quyens[i],
                });
            }
            return res.send('tc');
        } catch (error) {
            console.log(error);
        }
    }

    //staff/AddUser
    async AddUser(req, res) {
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
            let MaChucVu = req.body.Package;
            return res.render('staff/ThemUser', {
                layout: 'staff.handlebars',
                MaChucVu: MaChucVu,
                Users: JSON.stringify(Users),
                ChucVus: ChucVus,
            });
        } catch (error) {
            console.log(error);
        }
    }

    //staff//EditUser
    async EditUser(req, res) {
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
            let MaUser = req.body.Package;
            return res.render('staff/SuaUser', {
                layout: 'staff.handlebars',
                ChucVus: ChucVus,
                Users: JSON.stringify(Users),
                MaUser: MaUser,
            });
        } catch (error) {
            console.log(error);
        }
    }

    //staff//ThemUser
    async ThemUser(req, res) {
        try {
            let User_P = req.body;
            await db.User.create({
                MaUser: User_P.MaUser,
                MaChucVu: User_P.MaChucVu,
                MatKhau: User_P.MatKhau,
                HoTen: User_P.HoTen,
                GioiTinh: User_P.GioiTinh,
                NgaySinh: User_P.NgaySinh,
                CCCD: User_P.CCCD,
                SDT: User_P.SDT,
                TrangThai: 'HieuLuc',
                Email: User_P.Email,
            });
            console.log(User_P);
            return res.send('tc');
        } catch (error) {
            console.log(error);
        }
    }

    //staff//SuaUser
    async SuaUser(req, res) {
        try {
            let User_P = req.body;
            let User = await db.User.findOne({
                where: { MaUser: User_P.MaUser },
            });
            if (User) {
                User.set({
                    MaChucVu: User_P.MaChucVu,
                    HoTen: User_P.HoTen,
                    GioiTinh: User_P.GioiTinh,
                    NgaySinh: User_P.NgaySinh,
                    CCCD: User_P.CCCD,
                    SDT: User_P.SDT,
                    TrangThai: User_P.TrangThai == 1 ? 'HieuLuc' : 'VoHieu',
                    Email: User_P.Email,
                });
                User.save();
            }
            console.log(User_P);
            return res.send('tc');
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new PhanQuyenController();
