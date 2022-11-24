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
    // 'staff/QuyDinh'
    async Regulations(req, res) {
        try {
            let ThamSos = await db.sequelize.query('select TenThamSo , GiaTri from thamso', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let SanBays = await db.sequelize.query('select MaSanBay , TenSanBay, TrangThai, MaTinhThanh from sanbay', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let TinhThanhs = await db.sequelize.query('select MaTinhThanh , TenTinhThanh from tinhthanh', {
                type: QueryTypes.SELECT,
                raw: true,
            });

            for (let i = 0; i < SanBays.length; i++) {
                SanBays[i].TinhThanhs = structuredClone(TinhThanhs);
                SanBays[i].TinhThanhs = TinhThanhs;
            }
            return res.render('staff/QuyDinh', {
                layout: 'staff.handlebars',
                ThamSos: ThamSos,
                SanBays: SanBays,
                TinhThanhs: TinhThanhs,
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Update ThamSo
    async UpdateThamSo(req, res) {
        try {
            let P_ThamSo = req.body;
            let U_ThamSo = await db.ThamSo.findAll({});
            for (let i = 0; i < U_ThamSo.length; i++) {
                await U_ThamSo[i].set({
                    GiaTri: parseInt(P_ThamSo[i]),
                });
                await U_ThamSo[i].save();
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Load màn hình quy định
    async LoadRegulation(req, res) {
        try {
            let Package = {};
            let ThamSos = await db.sequelize.query('select TenThamSo , GiaTri from thamso', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let SanBays = await db.sequelize.query('select MaSanBay , TenSanBay, TrangThai, MaTinhThanh from sanbay', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let TinhThanhs = await db.sequelize.query('select MaTinhThanh , TenTinhThanh from tinhthanh', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            Package.ThamSos = structuredClone(ThamSos);
            Package.SanBays = structuredClone(SanBays);
            Package.TinhThanhs = structuredClone(TinhThanhs);
            return res.send(Package);
        } catch (error) {
            console.log(error);
        }
    }

    // Update ThamSo
    async UpdateSanBay(req, res) {
        try {
            let SanBay_P = req.body;
            let SanBay_U = SanBay_P.SanBays_P_Update;
            let SanBay_A = SanBay_P.SanBays_P_Add;
            let SanBay = await db.SanBay.findAll({});
            for (let i = 0; i < SanBay_U.length; i++) {
                if (SanBay_U[i].ID_Update == 1) {
                    await SanBay[i].set({
                        TenSanBay: SanBay_U[i].TenSanBay,
                        MaTinhThanh: SanBay_U[i].MaTinhThanh,
                        TrangThai: SanBay_U[i].TrangThai,
                    });
                    await SanBay[i].save();
                }
            }
            console.log(SanBay_A);
            for (let i = 0; i < SanBay_A.length; i++) {
                await db.SanBay.create({
                    MaSanBay: SanBay_A[i].MaSanBay,
                    TenSanBay: SanBay_A[i].TenSanBay,
                    MaTinhThanh: SanBay_A[i].MaTinhThanh,
                    TrangThai: SanBay_A[i].TrangThai,
                });
            }
            let Package = {};
            let ThamSos = await db.sequelize.query('select TenThamSo , GiaTri from thamso', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let SanBays = await db.sequelize.query('select MaSanBay , TenSanBay, TrangThai, MaTinhThanh from sanbay', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let TinhThanhs = await db.sequelize.query('select MaTinhThanh , TenTinhThanh from tinhthanh', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            Package.ThamSos = structuredClone(ThamSos);
            Package.SanBays = structuredClone(SanBays);
            Package.TinhThanhs = structuredClone(TinhThanhs);
            return res.send(Package);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new StaffController();
