import db from '../models/index';
const { QueryTypes, where } = require('sequelize');

//#region register new account
// req.body = {
//     MaUser: '',
//     Email: '',
//     MatKhau: '',
//     GioiTinh: 0,
//     NgaySinh: '',
//     HoTen: '',
// }
let register = async (req, res) => {
    try {
        var MaUser = req.body.MaUser;
        var Email = req.body.Email;
        var MatKhau = req.body.MatKhau;
        var GioiTinh = req.body.GioiTinh;
        var NgaySinh = req.body.NgaySinh;
        var HoTen = req.body.HoTen;

        var checkMaUser = await db.User.findOne({
            where: {
                MaUser: MaUser,
            },
        });
        if (!checkMaUser) return res.send('Tai khoan da ton tai');

        var checkMail = await db.User.findOne({
            where: {
                Email: Email,
            },
        });
        if (!checkMaUser) return res.send('Email trung');

        const user = await db.User.create({
            MaUser: MaUser,
            Email: Email,
            MatKhau: MatKhau,
            GioiTinh: GioiTinh,
            NgaySinh: Date.parse(Date.now()),
            HoTen: HoTen,
        });
        await user.save();

        return res.send('Tao tai khoan thanh cong');
    } catch (error) {
        console.log(e);
        return res.send('Tao tai khoan that bai');
    }
};
//#endregion

//#region auth login
let login = async (req, res) => {
    const { mauser, password } = req.body;

    if (mauser && password) {
        const user = await db.User.findOne({
            where: {
                MaUser: mauser,
            },
        });
        if (!user) return res.send('Tai khoan khong ton tai');
        if (user.MatKhau !== password) return res.send('Sai mat khau');

        req.session.loggedin = true;
        req.session.user = user;
        return res.redirect('/');
    }
};
//#endregion

module.exports = {
    register: register,
};
