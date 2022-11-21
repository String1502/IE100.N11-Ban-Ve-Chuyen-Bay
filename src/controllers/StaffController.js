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
            let ThamSos = await db.ThamSo.findAll({
                attributes: ['TenThamSo', 'GiaTri'],
                raw: true,
            });
            console.log(ThamSos);
            return res.render('staff/QuyDinh', {
                layout: 'staff.handlebars',
                ThamSos: ThamSos,
            });
        } catch (error) {
            console.log(error);
        }
    }
    // Update ThamSo
    // ngayf update
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
            console.log(U_ThamSo);
        } catch (error) {
            console.log(error);
        }
    }

    // LoadThamSo
    async LoadThamSo(req, res) {
        try {
            let PackageThamSo = await db.ThamSo.findAll();
            console.log(PackageThamSo);
            return res.send(PackageThamSo);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new StaffController();
