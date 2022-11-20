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
    // ngayf update, input roongx
    async UpdateThamSo(req, res) {
        try {
            let P_ThamSo = req.body;
            let U_ThamSo = await db.ThamSo.findOne({
                where: {
                    TenThamSo: P_ThamSo.TenThamSo,
                },
            });
            if (U_ThamSo) {
                await U_ThamSo.set({
                    GiaTri: P_ThamSo.GiaTri,
                });
                await U_ThamSo.save();
            }
            console.log(U_ThamSo);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new StaffController();
