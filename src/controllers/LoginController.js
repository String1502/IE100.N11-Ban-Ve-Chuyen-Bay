import db from '../models/index';
const { QueryTypes } = require('sequelize');
import Mailer from '../utils/mailer';

class LoginController {
    //Kiểm tra tài khoản mật khẩu
    async check(req, res) {
        try {
            let user = await db.User.findOne({
                where: { MaUser: req.body.MaUser, MatKhau: req.body.MatKhau },
                raw: true,
            });
            let ChucVu = await db.ChucVu.findOne({
                where: { TenChucVu: 'Khách hàng' },
                raw: true,
            });
            let check1 = true;
            let HieuLuc = true;
            let KH = false;
            if (user) {
                if (user.TrangThai == 'VoHieu') {
                    HieuLuc = false;
                }
                if (user.MaChucVu == ChucVu.MaChucVu) KH = true;
            }
            if (!user) {
                check1 = false;
                HieuLuc = false;
            }
            if (KH === req.body.KH && check1 == true && HieuLuc == true) {
                res.cookie('MaUser', user.MaUser, {
                    signed: true,
                });
            }

            return res.send({
                check1: check1,
                HieuLuc: HieuLuc,
                KH: KH,
            });
        } catch (error) {
            console.log(error);
        }
    }
    // "/login"
    async login(req, res) {
        try {
            return res.render('login/DangNhap', {
                layout: 'client.handlebars',
            });
        } catch (error) {
            console.log(error);
        }
    }
    async register(req, res) {
        try {
            let ChucVu = await db.ChucVu.findOne({
                where: { TenChucVu: 'Khách hàng' },
                raw: true,
            });
            let Users = await db.sequelize.query(
                'select MaUser, Email,MatKhau,HoTen,CCCD,GioiTinh,NgaySinh,MaChucVu,HinhAnh,TrangThai,SDT from user',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            return res.render('login/DangKy', {
                layout: 'client.handlebars',
                MaChucVu: ChucVu.MaChucVu,
                Users: JSON.stringify(Users),
            });
        } catch (error) {
            console.log(error);
        }
    }
    async forgotpassword(req, res) {
        let Users = await db.User.findAll({
            raw: true,
        });
        try {
            return res.render('login/QuenMatKhau', {
                layout: 'client.handlebars',
                Users: JSON.stringify(Users),
            });
        } catch (error) {}
    }
    async validateCode(req, res) {
        try {
            function RandomNum(min, max) {
                return parseInt(Math.random() * (max - min) + min);
            }

            let Email = req.body.Email;

            let num1 = RandomNum(0, 10); //0-9
            let num2 = RandomNum(0, 10);
            let num3 = RandomNum(0, 10);
            let num4 = RandomNum(0, 10);
            let num5 = RandomNum(0, 10);
            let num6 = RandomNum(0, 10);
            let num7 = RandomNum(0, 10);
            let num8 = RandomNum(0, 10);

            let Code = '' + num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8;
            let User = await db.User.findOne({
                where: { Email: Email },
            });
            console.log(User);
            await User.set({
                MatKhau: Code,
            });
            User.save();
            await Mailer.sendMail(Email, 'Lấy lại mật khẩu', `<p>Mật khẩu mới của bạn: ${Code} </p>`);

            return res.send({ Code: Code });
        } catch (error) {
            console.log(error);
            return res.send({ Code: '-1' });
        }
    }
}

module.exports = new LoginController();
