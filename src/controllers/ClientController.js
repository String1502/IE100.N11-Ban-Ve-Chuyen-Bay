import db from '../models/index';
const { QueryTypes } = require('sequelize');

class ClientController {
    // "/"
    async index(req, res) {
        let SanBays = [
            { MaSanBay: 'TSN', TenSanBay: 'Tân Sơn Nhất', TinhThanh: 'HCM' },
            { MaSanBay: 'DAD', TenSanBay: 'Haha', TinhThanh: 'Đà Nẵng' },
        ];
        let HangGhes = [{ MaHangGhe: 'Eco', TenHangGhe: 'Phổ thông' }];
        let HanhKhach_Max = 7;
        let ChuyenBay_Max = 5;
        try {
            return res.render('client/TraCuuChuyenBay', {
                layout: 'client.handlebars',
                SanBays: SanBays,
                HangGhes: HangGhes,
                HanhKhach_Max: HanhKhach_Max,
                ChuyenBay_Max: ChuyenBay_Max,
            });
        } catch (error) {
            console.log(error);
        }
    }
    // "/choose_flight"
    async choose_flight(req, res) {
        let MangChuyenBay = JSON.parse(req.body.MangChuyenBay);
        let HangGhe = JSON.parse(req.body.HangGhe);
        let HanhKhach = JSON.parse(req.body.HanhKhach);
        console.log(MangChuyenBay);
        console.log(HangGhe);
        console.log(HanhKhach);
        try {
            return res.render('client/ChonChuyenBay', {
                layout: 'client.handlebars',
                mangchuyenbay: MangChuyenBay,
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new ClientController();
