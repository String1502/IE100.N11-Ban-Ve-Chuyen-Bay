import db from '../models/index';
const { QueryTypes } = require('sequelize');

class SiteController {
    //Read
    async index(req, res) {
        try {
            // Cach 1
            let data = await db.HanhKhach.findAll();

            // Cach 2
            // let data = await db.sequelize.query(
            //     'select * from hanhkhaches, loaikhachhangs where hanhkhaches.MaLoaiKhach = loaikhachhangs.MaLoaiKhach',
            //     {
            //         type: QueryTypes.SELECT,
            //     },
            // );

            return res.render('home', {
                data: JSON.stringify(data),
            });
            // return res.send(JSON.stringify(data));
        } catch (error) {
            console.log(error);
        }
    }

    //Create
    async createHanhKhach(req, res) {
        try {
            // let user = req.body
            await db.HanhKhach.create({
                MaLoaiKhach: '1',
                HoTen: 'Trí',
                CCCD: '0190231293',
                SDT: '0293842934',
                GioiTinh: 1 === '1' ? true : false,
            });

            res.send('Tao thanh cong');
        } catch (error) {
            console.log(error);
        }
    }
    //Update
    async editHanhKhach(req, res) {
        try {
            //tim user can cap nhat
            let hanhkhach = await db.HanhKhach.findOne({
                where: { MaHK: 1 },
            });

            //update data
            if (hanhkhach) {
                hanhkhach.HoTen = 'Yasuo';

                await hanhkhach.save();
            }

            res.send(JSON.stringify(hanhkhach));
        } catch (error) {
            console.log(error);
        }
    }

    //Delete
    async deleteHanhKhach(req, res) {
        try {
            //tim user can cap nhat
            let hanhkhach = await db.HanhKhach.findOne({
                where: { MaHK: 1 },
            });

            //delete data
            if (hanhkhach) {
                await hanhkhach.destroy();
            }

            res.send('delete succes');
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new SiteController();
