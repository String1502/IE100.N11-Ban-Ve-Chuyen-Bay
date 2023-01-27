import mailConfig from '../config/mail.config';
import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
    today,
    onlyNumber,
    showToast,
} from '../public/javascript/start.js';
import db, { sequelize } from '../models/index';
import HoaDonController from './HoaDonController';
const { QueryTypes } = require('sequelize');
import Mailer from '../utils/mailer';

class ClientController {
    // "/"
    async index(req, res) {
        try {
            //K phải khách hàng là get tới url này thì đăng xuất
            if (req.signedCookies.MaUser) {
                let user = await db.User.findOne({ where: { MaUser: req.signedCookies.MaUser }, raw: true });
                if (user.MaChucVu != '3KH') {
                    res.clearCookie('MaUser');
                }
            }

            let SanBays = await db.sequelize.query(
                `select MaSanBay , TenSanBay, TenTinhThanh from sanbay, tinhthanh where sanbay.matinhthanh = tinhthanh.matinhthanh and sanbay.trangthai ='HoatDong'`,
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                    logging: false,
                },
            );

            // let HangGhes = [{ MaHangGhe: 'Eco', TenHangGhe: 'Phổ thông' }];
            let HangGhes = await db.HangGhe.findAll({
                attributes: ['MaHangGhe', 'TenHangGhe'],
                where: {
                    TrangThai: 'ApDung',
                },
                raw: true,
                logging: false,
            });

            let ThamSos = await db.sequelize.query(`select * from thamso `, {
                type: QueryTypes.SELECT,
                raw: true,
            });

            //get so hanh khach toi da 1 chuyen bay
            // let HanhKhach_Max = await db.ThamSo.findOne({
            //     attributes: ['GiaTri'],
            //     where: {
            //         TenThamSo: 'HanhKhach_Max',
            //     },
            //     logging: false,
            // });
            // HanhKhach_Max = HanhKhach_Max.GiaTri;

            //get so so chuyen bay toi da 1 lan dat ve
            // let ChuyenBay_Max = await db.ThamSo.findOne({
            //     attributes: ['GiaTri'],
            //     where: {
            //         TenThamSo: 'ChuyenBay_Max',
            //     },
            //     logging: false,
            // });
            // ChuyenBay_Max = ChuyenBay_Max.GiaTri;

            let LoaiKhachHang = await db.sequelize.query('SELECT * FROM `loaikhachhang`', {
                type: QueryTypes.SELECT,
                raw: true,
                logging: false,
            });

            var Package = { SanBays: SanBays, HangGhes: HangGhes, ThamSos: ThamSos, LoaiKhachHang: LoaiKhachHang };

            return res.render('client/TraCuuChuyenBay', {
                layout: 'client.handlebars',
                Package: Package,
                PackageJS: JSON.stringify(Package),
            });
        } catch (error) {
            console.log(error);
        }
    }

    // /tracuuhoadon
    async tracuuhoadon(req, res) {
        try {
            return res.render('client/TraCuuHoaDon', {
                layout: 'client.handlebars',
            });
        } catch (error) {
            console.log(error);
        }
    }
    //Đăng xuất
    async logout(req, res) {
        try {
            res.clearCookie('MaUser');
            return res.send();
        } catch (error) {
            console.log(error);
        }
    }
    // ChooseHeader
    async ChooseHeader(req, res) {
        try {
            if (req.signedCookies.MaUser) {
                let user = await db.User.findOne({
                    where: { MaUser: req.signedCookies.MaUser },
                    raw: true,
                });
                res.send({
                    HoTen: user.HoTen,
                });
            } else {
                res.send();
            }
        } catch (error) {
            console.log(error);
        }
    }
    async VeCuaToi(req, res) {
        // MaHoaDon
        // MaVe
        // MaChuyenBay
        try {
            let HoaDons = await db.sequelize.query(
                "select hoadon.MaHoaDon, hoadon.MaUser, hoadon.HoTen, hoadon.Email, hoadon.SDT, hoadon.NgayGioThanhToan, hoadon.TongTien, htthanhtoan.Ten from hoadon, htthanhtoan where hoadon.MaHTTT=htthanhtoan.MaHTTT and hoadon.MaUser = '" +
                    req.signedCookies.MaUser +
                    "' and hoadon.TrangThai='DaThanhToan'",
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            HoaDons.sort((a, b) => {
                let datea = new Date(a.NgayGioThanhToan);
                let dateb = new Date(b.NgayGioThanhToan);
                if (datea < dateb) return 1;
                else return -1;
            });
            for (let i = 0; i < HoaDons.length; i++) {
                let NgayTT = new Date(new Date(HoaDons[i].NgayGioThanhToan).getTime() - 7 * 60 * 60 * 1000);
                HoaDons[i].NgayGioThanhToan =
                    ('0' + NgayTT.getHours()).slice(-2) +
                    ':' +
                    ('0' + NgayTT.getMinutes()).slice(-2) +
                    ' ' +
                    ('0' + NgayTT.getDate()).slice(-2) +
                    '/' +
                    ('0' + (NgayTT.getMonth() + 1)).slice(-2) +
                    '/' +
                    NgayTT.getFullYear();
                HoaDons[i].TongTien = numberWithDot(HoaDons[i].TongTien) + ' VND';
                let Ves = await db.sequelize.query(
                    "select ve.MaVe, mochanhly.SoKgToiDa, hanhkhach.HoTen, hanhkhach.GioiTinh , hanhkhach.NgaySinh , hanhkhach.MaHK , ve.GiaVe , ve.MaCTVe, ve.MaHoaDon from ve, mochanhly, hanhkhach where ve.MaHK=hanhkhach.MaHK and ve.MaMocHanhLy=mochanhly.MaMocHanhLy and ve.MaHoaDon = '" +
                        HoaDons[i].MaHoaDon +
                        "'",
                    {
                        type: QueryTypes.SELECT,
                        raw: true,
                    },
                );
                let MaGhe;
                for (let j = 0; j < Ves.length; j++) {
                    Ves[j].GiaVe = numberWithDot(Ves[j].GiaVe) + ' VND';
                    Ves[j].GioiTinh = Ves[j].GioiTinh == 1 ? 'Nam' : 'Nữ';
                    let NS = new Date(Ves[j].NgaySinh);
                    Ves[j].NgaySinh =
                        'Ngày ' + NS.getDate() + ' Tháng ' + (NS.getMonth() + 1) + ' Năm ' + NS.getFullYear();
                    let CTVE = await db.sequelize.query(
                        "select chuyenbay.MaSanBayDi, chuyenbay.MaSanBayDen, chuyenbay.MaChuyenBay, chitiethangve.MaCTVe, hangghe.MaHangGhe, hangghe.TenHangGhe from chuyenbay, chitiethangve, hangghe where chitiethangve.MaHangGhe=hangghe.MaHangGhe and chitiethangve.MaChuyenBay=chuyenbay.MaChuyenBay and chitiethangve.MaCTVe= '" +
                            Ves[j].MaCTVe +
                            "' limit 1",
                        {
                            type: QueryTypes.SELECT,
                            raw: true,
                        },
                    );
                    Ves[j].MaChuyenBay = CTVE[0].MaSanBayDi + '-' + CTVE[0].MaSanBayDen + '-' + CTVE[0].MaChuyenBay;
                    Ves[j].MaChuyenBayCT = CTVE[0].MaChuyenBay;
                    Ves[j].HangVe = CTVE[0].MaHangGhe + '-' + CTVE[0].TenHangGhe;
                    Ves[j].MaVe = Ves[j].MaChuyenBay + Ves[j].MaVe;
                    MaGhe = CTVE[0].MaHangGhe;
                }
                HoaDons[i].MaHoaDon = HoaDons[i].MaUser + '-' + HoaDons[i].MaHoaDon + '-' + MaGhe;
                HoaDons[i].Ves = structuredClone(Ves);
            }
            return res.render('client/VeCuaToi', {
                layout: 'client.handlebars',
                HoaDons: HoaDons,
            });
        } catch (error) {
            console.log(error);
        }
    }
    async ChiTietChuyenBay(req, res) {
        try {
            let p = req.body;
            let ChuyenBay = await db.ChuyenBay.findOne({
                where: { MaChuyenBay: p.MaChuyenBay },
                raw: true,
            });
            let SanBay = await sequelize.query(
                "select sanbay.TenSanBay, tinhthanh.TenTinhThanh from tinhthanh, sanbay where tinhthanh.MaTinhThanh = sanbay.MaTinhThanh and sanbay.MaSanBay = '" +
                    ChuyenBay.MaSanBayDi +
                    "'",
                { type: QueryTypes.SELECT, raw: true },
            );
            ChuyenBay.SanBayDi = structuredClone(SanBay);
            SanBay = await sequelize.query(
                "select sanbay.TenSanBay, tinhthanh.TenTinhThanh from tinhthanh, sanbay where tinhthanh.MaTinhThanh = sanbay.MaTinhThanh and sanbay.MaSanBay = '" +
                    ChuyenBay.MaSanBayDen +
                    "'",
                { type: QueryTypes.SELECT, raw: true },
            );
            ChuyenBay.SanBayDen = structuredClone(SanBay);
            let ChiTietChuyenBay = await db.ChiTietChuyenBay.findAll({
                where: { MaChuyenBay: p.MaChuyenBay },
                raw: true,
            });
            ChiTietChuyenBay.sort((a, b) => {
                if (a.ThuTu < b.ThuTu) return -1;
                else return 1;
            });
            console.log(ChiTietChuyenBay);
            for (let i = 0; i < ChiTietChuyenBay.length; i++) {
                let SanBay = await sequelize.query(
                    "select sanbay.TenSanBay, tinhthanh.TenTinhThanh from tinhthanh, sanbay where tinhthanh.MaTinhThanh = sanbay.MaTinhThanh and sanbay.MaSanBay = '" +
                        ChiTietChuyenBay[i].MaSBTG +
                        "'",
                    { type: QueryTypes.SELECT, raw: true },
                );
                ChiTietChuyenBay[i].SBTG = structuredClone(SanBay);
            }
            let P = {};
            P.ChuyenBay = structuredClone(ChuyenBay);
            P.ChiTietChuyenBay = structuredClone(ChiTietChuyenBay);
            return res.send(P);
        } catch (error) {
            console.log(error);
        }
    }
    // "/choose_flight" - TraCuuChuyenBay
    async choose_flight(req, res) {
        try {
            // From DB
            let HanhLy = await db.sequelize.query('select SoKgToiDa , GiaTien from mochanhly WHERE  GiaTien <> 0', {
                type: QueryTypes.SELECT,
                raw: true,
                logging: false,
            });
            // Req.body
            let MangChuyenBayTimKiem = JSON.parse(req.body.MangChuyenBay);
            let HangGhe = JSON.parse(req.body.HangGhe);
            let HanhKhach = JSON.parse(req.body.HanhKhach);
            for (let i = 0; i < MangChuyenBayTimKiem.length; i++) {
                MangChuyenBayTimKiem[i]['ThuTu'] = i + 1;
                MangChuyenBayTimKiem[i]['ChuyenBayDaChon'] = {
                    MaChuyenBay: '',
                    ThoiGianDi: { GioDi: { Gio: -1, Phut: -1 }, NgayDi: { Ngay: -1, Thang: -1, Nam: -1 } },
                    SanBayDi: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
                    ThoiGianDen: { GioDen: { Gio: -1, Phut: -1 }, NgayDen: { Ngay: -1, Thang: -1, Nam: -1 } },
                    SanBayDen: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
                    ThoiGianBay: { Gio: -1, Phut: -1 },
                    SoDiemDung: -1,
                    GiaVe: -1,
                    ChanBay: [
                        {
                            ThoiGianDi: {
                                GioDi: { Gio: -1, Phut: -1 },
                                NgayDi: { Ngay: -1, Thang: -1, Nam: -1 },
                            },
                            SanBayDi: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
                            ThoiGianDen: {
                                GioDen: { Gio: -1, Phut: -1 },
                                NgayDen: { Ngay: -1, Thang: -1, Nam: -1 },
                            },
                            SanBayDen: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
                            ThoiGianBay: { Gio: -1, Phut: -1 },
                            ThoiGianDung_SanBayDen: { Gio: -1, Phut: -1 },
                        },
                    ],
                };
            }

            let PackageBooking_ = {
                MangChuyenBayTimKiem: MangChuyenBayTimKiem,
                HangGhe: HangGhe,
                HanhKhach: HanhKhach,
                HanhLy: HanhLy,
            };
            return res.render('client/ChonChuyenBay', {
                layout: 'client.handlebars',
                PackageBooking: PackageBooking_,
                PackageBookingJS: JSON.stringify(PackageBooking_),
            });
        } catch (error) {
            console.log(error);
        }
    }

    // "/pre-booking" - TomTatTruocDat
    async prebooking(req, res) {
        try {
            let form = JSON.parse(req.body.PackageBooking);
            let mangchuyenbay = [...form.MangChuyenBayTimKiem];
            let manghanhkhach = [...form.HanhKhach];

            for (var i = 0; i < mangchuyenbay.length; i++) {
                mangchuyenbay[i] = {
                    MaChuyenBay: mangchuyenbay[i].ChuyenBayDaChon.MaChuyenBay,
                    GiaVe: mangchuyenbay[i].ChuyenBayDaChon.GiaVe,
                };
            }

            let tile_loaihanhkhach = await db.LoaiKhachHang.findAll({});

            for (var i = 0; i < manghanhkhach.length; i++) {
                for (var j = 0; j < tile_loaihanhkhach.length; j++) {
                    if (manghanhkhach[i].title == tile_loaihanhkhach[j].TenLoai) {
                        manghanhkhach[i].HeSo = tile_loaihanhkhach[j].HeSo;
                        manghanhkhach[i].TongTienVe = 0;
                        manghanhkhach[i].SoTuoiToiDa = tile_loaihanhkhach[j].SoTuoiToiDa;
                        manghanhkhach[i].SoTuoiToiThieu = tile_loaihanhkhach[j].SoTuoiToiThieu;
                        break;
                    }
                }
            }

            // let GiaVe_TreEm = db.ThamSo.findOne({
            //     where: {
            //         TenThamSo: 'GiaVeTreEm',
            //     },
            // });
            let GiaVe_TreEm = 100000;

            //tong tien ve = gia ve chuyen bay * heso_hanhkhach * sohanhkhach
            for (var i = 0; i < mangchuyenbay.length; i++) {
                for (var j = 0; j < manghanhkhach.length; j++) {
                    if (manghanhkhach[j].title === 'Em bé')
                        manghanhkhach[j].TongTienVe += GiaVe_TreEm * parseInt(manghanhkhach[j].value);
                    else
                        manghanhkhach[j].TongTienVe +=
                            mangchuyenbay[i].GiaVe *
                            parseFloat(manghanhkhach[j].HeSo) *
                            parseInt(manghanhkhach[j].value);
                }
            }

            for (var i in manghanhkhach) delete manghanhkhach[i].HeSo;

            let PackageBooking_ = JSON.parse(req.body.PackageBooking);
            PackageBooking_.HanhKhach = manghanhkhach;

            let hangghe = await db.HangGhe.findOne({
                attributes: ['MaHangGhe', 'TenHangGhe', 'HeSo'],
                where: {
                    MaHangGhe: form.HangGhe.MaHangGhe,
                },
                raw: true,
            });
            PackageBooking_.HangGhe = hangghe;

            return res.render('client/TomTatTruocDat', {
                layout: 'client.handlebars',
                PackageBooking: PackageBooking_,
                PackageBookingJS: JSON.stringify(PackageBooking_),
            });
        } catch (error) {
            console.log(error);
        }
    }

    // "/booking" - DienThongTin
    async booking(req, res) {
        try {
            let PackageBooking_ = JSON.parse(req.body.PackageBooking);

            let HeSoHanhKhach = await db.sequelize.query('select MaLoaiKhach, TenLoai , HeSo from loaikhachhang', {
                type: QueryTypes.SELECT,
                raw: true,
            });

            for (let i = 0; i < PackageBooking_.HanhKhach.length; i++) {
                const HeSo = HeSoHanhKhach.find((item) => item.TenLoai == PackageBooking_.HanhKhach[i].title);
                PackageBooking_.HanhKhach[i]['HeSo'] = HeSo.HeSo;
                PackageBooking_.HanhKhach[i]['MaLoaiKhach'] = HeSo.MaLoaiKhach;
            }

            let MocHanhLy = await db.sequelize.query('select MaMocHanhLy, SoKgToiDa, GiaTien from mochanhly', {
                type: QueryTypes.SELECT,
                raw: true,
            });

            PackageBooking_.HanhLy = MocHanhLy;

            let HanhKhach = [];
            let index = 0;
            for (let j = 0; j < PackageBooking_.HanhKhach.length; j++) {
                for (let z = 0; z < PackageBooking_.HanhKhach[j].value; z++) {
                    HanhKhach.push({
                        index: index,
                        MaLoaiKhach: PackageBooking_.HanhKhach[j].MaLoaiKhach,
                        TenLoai: PackageBooking_.HanhKhach[j].title,
                        ThuTu: z + 1,
                        GioiTinh: -1,
                        Ho: '',
                        Ten: '',
                        NgaySinh: { Ngay: 0, Thang: 0, Nam: 0 },
                        SoTuoiToiDa: PackageBooking_.HanhKhach[j].SoTuoiToiDa,
                        SoTuoiToiThieu: PackageBooking_.HanhKhach[j].SoTuoiToiThieu,
                    });
                    index++;
                }
            }

            let MangChuyenBayDat = [];
            let LoaiKhachEmBe = PackageBooking_.HanhKhach.find((item) => item.title == 'Em bé').MaLoaiKhach;
            for (let i = 0; i < PackageBooking_.MangChuyenBayTimKiem.length; i++) {
                let CBDChon = PackageBooking_.MangChuyenBayTimKiem[i].ChuyenBayDaChon;
                let MaMocHanhLy = [];
                for (let j = 0; j < HanhKhach.length; j++) {
                    if (HanhKhach[j].MaLoaiKhach == LoaiKhachEmBe) MaMocHanhLy.push(-1);
                    else MaMocHanhLy.push(0);
                }
                MangChuyenBayDat.push({ MaChuyenBay: CBDChon.MaChuyenBay, MaMocHanhLy: MaMocHanhLy });
            }

            PackageBooking_['HoaDon'] = {
                NguoiLienHe: { Ho: '', Ten: '', SDT: 0, Email: '' },
                MaHangGhe: PackageBooking_.HangGhe.MaHangGhe,
                NgayGioDat: '',
                MangChuyenBayDat: MangChuyenBayDat,
                HanhKhach: HanhKhach,
            };

            console.log(PackageBooking_);
            return res.render('client/DienThongTin', {
                layout: 'client.handlebars',
                PackageBooking: PackageBooking_,
                PackageBookingJS: JSON.stringify(PackageBooking_),
            });
        } catch (error) {
            console.log(error);
        }
    }

    // "/payment" - ThanhToan
    async payment(req, res) {
        try {
            let PackageBooking_ = JSON.parse(req.body.PackageBooking);

            return res.render('client/ThanhToan', {
                layout: 'client.handlebars',
                PackageBookingJS: JSON.stringify(PackageBooking_),
            });
        } catch (error) {
            console.log(error);
        }
    }

    //#region Mã xác nhận
    // data_req = { Email: '' };
    // res =  { Code: 'xxxxxx' }; x -> (0,9)
    // if(err) res = { Code: '-1' }
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

            let Code = '' + num1 + num2 + num3 + num4 + num5 + num6;

            await Mailer.sendMail(Email, 'Verify mail', `<p>Your verify code: ${Code} </p>`);

            return res.send({ Code: Code });
        } catch (error) {
            console.log(error);
            return res.send({ Code: '-1' });
        }
    }
    //#endregion
}

module.exports = new ClientController();

/* Phần ghi chú-Back up */
// let ChuyenBays = [
//     {
//         MaChuyenBay: '1',
//         ThoiGianDi: { GioDi: { Gio: 1, Phut: 11 }, NgayDi: { Ngay: 1, Thang: 1, Nam: 2023 } },
//         SanBayDi: { MaSanBay: 'TSN', TenSanBay: 'Tân Sơn Nhất', TinhThanh: 'HCM' },
//         ThoiGianDen: { GioDen: { Gio: 12, Phut: 12 }, NgayDen: { Ngay: 2, Thang: 1, Nam: 2023 } },
//         SanBayDen: { MaSanBay: 'DAD', TenSanBay: 'Tân Sơn Nhì', TinhThanh: 'Đà Nẵng' },
//         ThoiGianBay: { Gio: 25, Phut: 1 },
//         SoDiemDung: 1,
//         GiaVe: 500000,
//         ChanBay: [
//             {
//                 ThoiGianDi: { GioDi: { Gio: 11, Phut: 11 }, NgayDi: { Ngay: 1, Thang: 1, Nam: 2023 } },
//                 SanBayDi: { MaSanBay: 'TSN', TenSanBay: 'Tân Sơn Nhất', TinhThanh: 'HCM' },
//                 ThoiGianDen: { GioDen: { Gio: 6, Phut: 6 }, NgayDen: { Ngay: 2, Thang: 1, Nam: 2023 } },
//                 SanBayDen: { MaSanBay: 'DAD', TenSanBay: 'Tân Sơn Nhì', TinhThanh: 'Đà Nẵng' },
//                 ThoiGianBay: { Gio: 5, Phut: 5 },
//                 ThoiGianDung_SanBayDen: { Gio: 0, Phut: 30 },
//             },
//         ],
//     },
// ];

// HoaDon:
// {
//     NguoiLienHe: {Ho:'', Ten:'', SDT:0, Email:''},
//     MaHangGhe:'',
//     NgayGioDat:'',
//     MangChuyenBayDat:
//         [   {   MaChuyenBay:0, MaMocHanhLy:[],  },  ],
//     HanhKhach:
//         [   {MaLoaiKhach: 3, GioiTinh:'', Ho:'', Ten:'', NgaySinh: {Ngay:0, Thang:0, Nam:0} }   ],
// },
