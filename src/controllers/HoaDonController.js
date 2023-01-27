import db from '../models/index';
const { QueryTypes, where } = require('sequelize');
import Mailer from '../utils/mailer';
const fs = require('fs');
const path = require('path');
import pdfController from './pdfController';
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
//#region Tao ve
// thongtintaove
// req.body =
// {
//     MangChuyenBayDat: [{
//         MaChuyenBay,
//         MaMocHanhLy: [],
//     }],
//     HanhKhach: [{
//         MaLoaiKhach,
//         HoTen,
//         NgaySinh,
//         GioiTinh,  //Vd: GioiTinh: 1    nam: 0, nu:1, khac:3
//     }],
//     NguoiLienHe: {
//         HoTen,
//         Email,
//         SDT
//     },
//     MaHangGhe,
//     NgayGioDat, //format: yyyy-MM-dd
// }

// example data
// req.body = {
//     HanhKhach: [{ "MaLoaiKhach": 1, "HoTen": "Tân Sơn Nhất", "NgaySinh": "2002-09-25" , "GioiTinh": 1 } , { "MaLoaiKhach": 2, "HoTen": "Tân Sơn Nhì", "NgaySinh": "2002-09-25" , "GioiTinh": 0 }],
//     MangChuyenBayDat:[{ "MaChuyenBay": 1, "MaMocHanhLy": [15, 20]} , { "MaChuyenBay": 2, "MaMocHanhLy": [20,25] }]
//     NguoiLienHe:{"HoTen": "Trí", "Email": "thanhtritran951@gmail.com", "SDT": "0899313685"}
//     MaHangGhe: Business,
//     NgayGioDat: 2022-11-12T06:03:13.715Z
// }

let Create = async function (req, res) {
    try {
        let form_data = { ...req.body };
        let createHoaDon = CreateHoaDon(form_data);
        return res.send(JSON.stringify('thanhcong'));
    } catch (error) {
        console.log(error);
    }
};

var MaEmBe = 1;
var MaTreEm = 2;
var MaNguoiLon = 3;

let CreateHoaDon = async (req, res) => {
    //create hanhkhach
    try {
        let data_res = {
            MaHoaDon: '',
            MaHoaDonHienThi: '',
            ChuyenBay: [], // mảng các chuyến bay trong hóa đơn
            SoVe: 0, // tổng số vé của hóa đơn
            NoiDungThanhToan: '',
            TongTien: -1,
        };
        let req_body = { ...req.body };
        let MaHoaDon = req.signedCookies.MaHoaDon;
        if (MaHoaDon) {
            let hoadon = await db.sequelize.query('SELECT * FROM hoadon WHERE hoadon.MaHoaDon = :mahoadon;', {
                replacements: {
                    mahoadon: parseInt(MaHoaDon),
                },
                type: QueryTypes.SELECT,
                raw: true,
            });
            data_res.MaHoaDon = MaHoaDon;
            data_res.MaHoaDonHienThi = req_body.MaUser + '-' + MaHoaDon + '-' + req_body.MaHangGhe;
            data_res.NoiDungThanhToan = 'THANH TOAN HOA DON ' + data_res.MaHoaDonHienThi;
            data_res.TongTien = hoadon[0].TongTien;
        } else {
            // Kiểm tra hết vé
            for (let i = 0; i < req_body.MangChuyenBayDat.length; i++) {
                let chitiet = await db.ChiTietHangVe.findOne({
                    where: {
                        MaChuyenBay: req_body.MangChuyenBayDat[i].MaChuyenBay,
                        MaHangGhe: req_body.MaHangGhe,
                    },
                });
                if (chitiet.VeDaBan + req_body.HanhKhach.length > chitiet.TongVe) {
                    return res.send(-1);
                }
            }

            let HanhKhachs = req_body.HanhKhach; // Lấy .HanhKhach
            let nguoilienhe = req_body.NguoiLienHe;

            nguoilienhe.HoTen = nguoilienhe.Ho + ' ' + nguoilienhe.Ten;

            // Thêm hành khách vào DB
            for (var index in HanhKhachs) {
                HanhKhachs[index].HoTen = HanhKhachs[index].Ho + ' ' + HanhKhachs[index].Ten;

                let NgaySinh = CreateDateFromObject(HanhKhachs[index].NgaySinh);

                const HanhKhach = await db.HanhKhach.create(
                    {
                        MaLoaiKhach: HanhKhachs[index].MaLoaiKhach,
                        HoTen: HanhKhachs[index].HoTen,
                        NgaySinh: NgaySinh,
                        GioiTinh: HanhKhachs[index].GioiTinh,
                    },
                    { raw: true },
                );
                await HanhKhach.save();
                HanhKhachs[index] = { ...HanhKhach.dataValues };
            }
            for (var i in HanhKhachs) {
                let heso_hanhkhach = await db.LoaiKhachHang.findOne({
                    attributes: ['HeSo', 'TenLoai'],
                    where: {
                        MaLoaiKhach: HanhKhachs[i].MaLoaiKhach,
                    },
                });
                HanhKhachs[i].HeSo = parseFloat(heso_hanhkhach.dataValues.HeSo);
                HanhKhachs[i].TenLoai = heso_hanhkhach.dataValues.TenLoai;
            }
            //HanhKhachs {MaLoaiKhach , HoTen, NgaySinh, GioiTinh, HeSo}

            let MangChuyenBayDat = req_body.MangChuyenBayDat;
            // Mã chuyến bay + mảng mốc hành lý thứ tự hành lý theo hành khách

            //create hoa don
            var giodat = new Date();
            let hoadon = await db.HoaDon.create(
                {
                    HoTen: nguoilienhe.HoTen,
                    Email: nguoilienhe.Email,
                    SDT: nguoilienhe.SDT,
                    NgayGioDat: new Date(giodat.getTime() + 7 * 60 * 60 * 1000),
                    TongTien: 0,
                    TrangThai: 'ChuaThanhToan',
                },
                { raw: true },
            );
            await hoadon.save();

            //[ [15,25], [25,25] ]
            let mangHanhLyDat = []; // Các mảng hành lý theo tt hành khách của từng chuyến bay
            for (var i = 0; i < MangChuyenBayDat.length; i++) {
                mangHanhLyDat.push(MangChuyenBayDat[i].MaMocHanhLy);
            }

            let ves = [];
            for (var i = 0; i < MangChuyenBayDat.length; i++) {
                //info_chuyenbay{MaCTVe, MaChuyenBay, HeSo, GiaVe}
                let info_chuyenbay = await db.sequelize.query(
                    'SELECT `MaCTVe`, chuyenbay.`MaChuyenBay`, HeSo, GiaVeCoBan FROM `chitiethangve`, chuyenbay, hangghe WHERE chitiethangve.MaChuyenBay = chuyenbay.MaChuyenBay AND chitiethangve.MaHangGhe = hangghe.MaHangGhe  AND chuyenbay.MaChuyenBay = :machuyenbay AND chitiethangve.MaHangGhe = :mahangghe ',
                    {
                        replacements: {
                            machuyenbay: MangChuyenBayDat[i].MaChuyenBay,
                            mahangghe: req_body.MaHangGhe,
                        },
                        type: QueryTypes.SELECT,
                        raw: true,
                    },
                );
                let DoanhThu = 0;
                // tao ve cho 1 hanh khach
                for (var index in HanhKhachs) {
                    if (mangHanhLyDat[i][index] === -1) mangHanhLyDat[i][index] = 0;
                    let mocHanhLy = await db.MocHanhLy.findOne(
                        {
                            where: {
                                SoKgToiDa: mangHanhLyDat[i][index],
                            },
                        },
                        { raw: true },
                    );
                    mocHanhLy = mocHanhLy.dataValues;

                    let ve;
                    // Mã 1: Em bé
                    //  Tạo vé cho khách hk phải em bé
                    if (HanhKhachs[index].MaLoaiKhach !== MaEmBe) {
                        ve = await db.Ve.create(
                            {
                                MaMocHanhLy: mocHanhLy.MaMocHanhLy,
                                MaCTVe: info_chuyenbay[0].MaCTVe,
                                MaHK: HanhKhachs[index].MaHK,
                                GiaVe:
                                    info_chuyenbay[0].HeSo *
                                        info_chuyenbay[0].GiaVeCoBan *
                                        parseFloat(HanhKhachs[index].HeSo) +
                                    mocHanhLy.GiaTien,
                                // Giave = heso_hangghe * giave_coban * heso_loaikhach + giatien_hanhly
                                MaHoaDon: hoadon.MaHoaDon,
                            },
                            { raw: true },
                        );

                        ve.save();
                        ve = ve.dataValues;
                        ves.push(ve);
                    } else {
                        // Là em bé
                        let GiaVe_TreEm = await db.ThamSo.findOne({
                            where: {
                                TenThamSo: 'MucPhuThuTreSoSinh',
                            },
                        });
                        GiaVe_TreEm = GiaVe_TreEm.GiaTri;
                        ve = await db.Ve.create(
                            {
                                MaMocHanhLy: mocHanhLy.MaMocHanhLy,
                                MaCTVe: info_chuyenbay[0].MaCTVe,
                                MaHK: HanhKhachs[index].MaHK,
                                GiaVe: GiaVe_TreEm,
                                MaHoaDon: hoadon.MaHoaDon,
                            },
                            { raw: true },
                        );
                        ve.save();
                        ve = ve.dataValues;
                        ves.push(ve);
                    }
                    hoadon.set({
                        TongTien: hoadon.TongTien + ve.GiaVe,
                    });
                    await hoadon.save();
                    DoanhThu = DoanhThu + ve.GiaVe;
                }
                data_res.ChuyenBay.push({
                    MaChuyenBay: info_chuyenbay[0].MaChuyenBay,
                    DoanhThu: DoanhThu,
                    MaCTVe: info_chuyenbay[0].MaCTVe,
                });
            }
            data_res.MaHoaDon = hoadon.MaHoaDon;
            data_res.MaHoaDonHienThi = req_body.MaUser + '-' + hoadon.MaHoaDon + '-' + req_body.MaHangGhe;
            data_res.NoiDungThanhToan = 'THANH TOAN HOA DON ' + data_res.MaHoaDonHienThi;
            data_res.SoVe = HanhKhachs.length;
            data_res.TongTien = hoadon.TongTien;

            res.cookie('MaHoaDon', hoadon.MaHoaDon, {
                signed: true,
            });
        }
        console.log(data_res);
        return res.send(data_res);
    } catch (error) {
        console.log(error);
        return res.send(-1);
    }
};
//#endregion

//#region bam vao nut thanh toan
let ThanhToan = async (MaHoaDon, MaHTTT, NgayGioThanhToan, MaUser) => {
    try {
        // Kiểm tra hết vé
        let SoVeCuaTungChuyenBay = await db.sequelize.query(
            'SELECT ve.MaCTVe, COUNT(ve.MaVe) AS SoVe FROM ve, hoadon  WHERE ve.MaHoaDon = hoadon.MaHoaDon  AND hoadon.MaHoaDon = :mahoadon GROUP BY ve.MaCTVe;',
            {
                replacements: {
                    mahoadon: MaHoaDon,
                },
                type: QueryTypes.SELECT,
                raw: true,
            },
        );

        for (let i = 0; i < SoVeCuaTungChuyenBay.length; i++) {
            let chitiet = await db.ChiTietHangVe.findOne({
                where: {
                    MaCTVe: SoVeCuaTungChuyenBay[i].MaCTVe,
                },
            });
            if (chitiet.VeDaBan + SoVeCuaTungChuyenBay[i].SoVe > chitiet.TongVe) {
                return -1;
            }
        }

        // Cập nhật vé đã bán
        for (let i = 0; i < SoVeCuaTungChuyenBay.length; i++) {
            let chitiet = await db.ChiTietHangVe.findOne({
                where: {
                    MaCTVe: SoVeCuaTungChuyenBay[i].MaCTVe,
                },
            });
            chitiet.set({
                VeDaBan: chitiet.VeDaBan + SoVeCuaTungChuyenBay[i].SoVe,
            });
            await chitiet.save();
        }

        //update doanh thu

        let chuyenbays = await db.sequelize.query(
            'SELECT DISTINCT chitiethangve.MaChuyenBay FROM ve, hoadon, chitiethangve WHERE ve.MaHoaDon = hoadon.MaHoaDon AND ve.MaCTVe = chitiethangve.MaCTVe AND hoadon.MaHoaDon = :mahoadon',
            {
                replacements: {
                    mahoadon: MaHoaDon,
                },
                type: QueryTypes.SELECT,
                raw: true,
            },
        );

        for (var i in chuyenbays) {
            let chuyenbay = await db.ChuyenBay.findOne({
                where: {
                    MaChuyenBay: chuyenbays[i].MaChuyenBay,
                },
            });

            let doanhthu = await db.sequelize.query(
                'SELECT  SUM(ve.GiaVe) doanhthu FROM ve, hoadon, chitiethangve  WHERE ve.MaHoaDon = hoadon.MaHoaDon  AND ve.MaCTVe = chitiethangve.MaCTVe  AND hoadon.MaHoaDon = :mahoadon AND chitiethangve.MaChuyenBay = :machuyenbay GROUP BY ve.MaCTVe;',
                {
                    replacements: {
                        mahoadon: MaHoaDon,
                        machuyenbay: chuyenbays[i].MaChuyenBay,
                    },
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            chuyenbay.set({
                DoanhThu: chuyenbay.DoanhThu + parseInt(doanhthu[0].doanhthu),
            });
            await chuyenbay.save();
        }

        //Add NgayGioThanhToan
        let hoadon = await db.HoaDon.findOne({
            where: {
                MaHoaDon: MaHoaDon,
            },
        });
        hoadon.set({
            NgayGioThanhToan: new Date(NgayGioThanhToan.getTime() + 7 * 60 * 60 * 1000),
            TrangThai: 'DaThanhToan',
            MaHTTT: MaHTTT,
            MaUser: MaUser,
        });
        await hoadon.save();

        // Gửi PDF

        let MaHangGhe = await db.sequelize.query(
            'SELECT DISTINCT chitiethangve.MaHangGhe  from hoadon, ve, chitiethangve WHERE hoadon.MaHoaDon = :mahoadon AND hoadon.MaHoaDon = ve.MaHoaDon AND ve.MaCTVe = chitiethangve.MaCTVe',
            {
                replacements: {
                    mahoadon: hoadon.MaHoaDon,
                },
                type: QueryTypes.SELECT,
                raw: true,
            },
        );

        let PackageBooking = {};

        PackageBooking.HoaDon = {};
        PackageBooking.HoaDon.MaHoaDon = hoadon.MaHoaDon + '-' + MaHangGhe[0].MaHangGhe;

        const date = new Date();
        const offset = date.getTimezoneOffset() / 60;
        var thgianthanhtoan = new Date(hoadon.NgayGioThanhToan);
        thgianthanhtoan = new Date(thgianthanhtoan.getTime() + offset * 60 * 60 * 1000);
        PackageBooking.HoaDon.ThoiGianThanhToan =
            numberSmallerTen(thgianthanhtoan.getHours()) +
            ':' +
            numberSmallerTen(thgianthanhtoan.getMinutes()) +
            ' ' +
            numberSmallerTen(thgianthanhtoan.getDate()) +
            '/' +
            numberSmallerTen(thgianthanhtoan.getMonth() + 1) +
            '/' +
            thgianthanhtoan.getFullYear();

        PackageBooking.HoaDon.NguoiLienHe = {};

        PackageBooking.HoaDon.NguoiLienHe.HoTen = hoadon.HoTen;
        PackageBooking.HoaDon.NguoiLienHe.SDT = hoadon.SDT;
        PackageBooking.HoaDon.NguoiLienHe.Email = hoadon.Email;

        PackageBooking.HoaDon.MaHangGhe = MaHangGhe[0].MaHangGhe;

        PackageBooking.ChuyenBayDaChon = [];
        var thutu = 0;
        for (var i in chuyenbays) {
            thutu = thutu + 1;
            let chuyenbay = await db.ChuyenBay.findOne({
                where: {
                    MaChuyenBay: chuyenbays[i].MaChuyenBay,
                },
            });

            let SanBayDi = await db.SanBay.findOne({
                where: {
                    MaSanBay: chuyenbay.MaSanBayDi,
                },
            });

            let SanBayDen = await db.SanBay.findOne({
                where: {
                    MaSanBay: chuyenbay.MaSanBayDen,
                },
            });

            var chuyenbay_detail = {
                ThuTu: numberSmallerTen(thutu),
                ChuyenBay: chuyenbay,
                SanBayDi: SanBayDi,
                SanBayDen: SanBayDen,
                HanhKhach: [],
            };
            let hanhkhach = await db.sequelize.query(
                'SELECT hanhkhach.HoTen, loaikhachhang.TenLoai, mochanhly.SoKgToiDa FROM ve, hoadon, hanhkhach, loaikhachhang, mochanhly, chitiethangve WHERE ve.MaHoaDon = hoadon.MaHoaDon  AND ve.MaHK = hanhkhach.MaHK  AND hanhkhach.MaLoaiKhach = loaikhachhang.MaLoaiKhach  AND ve.MaMocHanhLy = mochanhly.MaMocHanhLy AND ve.MaCTVe = chitiethangve.MaCTVe AND hoadon.MaHoaDon = :mahoadon AND chitiethangve.MaChuyenBay=:machuyenbay;',
                {
                    replacements: {
                        mahoadon: hoadon.MaHoaDon,
                        machuyenbay: chuyenbays[i].MaChuyenBay,
                    },
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            for (let j = 0; j < hanhkhach.length; j++) {
                var khach = {
                    ThuTu: numberSmallerTen(j + 1),
                    HoTen: hanhkhach[j].HoTen,
                    TenLoai: hanhkhach[j].TenLoai,
                    SoKgToiDa: hanhkhach[j].SoKgToiDa,
                };
                chuyenbay_detail.HanhKhach.push(khach);
            }

            PackageBooking.ChuyenBayDaChon.push(chuyenbay_detail);
        }

        let pdf = await pdfController.generatePdf(hoadon.MaHoaDon, PackageBooking, MaHTTT);

        if (pdf.status === 'ok') {
            await Mailer.sendMailWithAttach(
                hoadon.Email,
                `[Planet] Your E-invoice - Invoice ID [${hoadon.MaHoaDon}-${MaHangGhe[0].MaHangGhe}]`,
                `<p>Cám ơn bạn đã lựa chọn Planet!</p>`,
                pdf.filename,
            );
        } else {
            return res.send('Fail');
        }

        let directory = path.join(__dirname, '../public/temp');

        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(directory, file), (err) => {
                    if (err) throw err;
                });
            }
        });
        return 1;
    } catch (error) {
        console.log(error);
        return -1;
    }
};
//#endregion

//#region update hóa đơn
// req_body
// {
// 	MaHoaDon:-1,
// 	NguoiLienHe:
// 	{
// 		HoTen:'',
// 		SDT: '',
// 		Email: '',
// 	}
// }

//res = true || false

let updateHoaDon = async (req, res) => {
    try {
        let form_data = { ...req.body };

        let hoadon = await db.HoaDon.findOne({
            where: {
                MaHoaDon: form_data.MaHoaDon,
            },
        });

        await hoadon.set({
            HoTen: form_data.NguoiLienHe.HoTen,
            SDT: form_data.NguoiLienHe.SDT,
            Email: form_data.NguoiLienHe.Email,
        });

        await hoadon.save();
        return res.send('true');
    } catch (error) {
        console.log(error);
        return res.send('false');
    }
};
//#endregion

// #region Trường Huy thêm
function CreateDateFromObject(Ngay = null, Gio = null) {
    var strNgay = '';
    var strGio = '';

    if (Ngay == null) {
        strNgay = '1700/01/01';
    } else {
        if (IsNgayNotNull(Ngay) == false) {
            strNgay = '1700/01/01';
        } else {
            var dd = numberSmallerTen(Ngay.Ngay);
            var mm = numberSmallerTen(Ngay.Thang);
            var yy = numberSmallerTen(Ngay.Nam);
            strNgay = yy + '/' + mm + '/' + dd;
        }
    }
    if (Gio == null) {
        strGio = '00:00:00';
    } else {
        if (IsGioNotNull(Gio) == false) {
            strGio = '00:00:00';
        } else {
            var hr = numberSmallerTen(Gio.Gio);
            var min = numberSmallerTen(Gio.Phut);
            strGio = hr + ':' + min + ':00';
        }
    }
    return new Date(strNgay + ' ' + strGio);
}

function CreateObjectFromDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yy = date.getFullYear();
    var hr = date.getHours();
    var min = date.getMinutes();

    return {
        Ngay: {
            Ngay: dd,
            Thang: mm,
            Nam: yy,
        },
        Gio: {
            Gio: hr,
            Phut: min,
        },
    };
}

function IsNgayNotNull(Ngay) {
    if (Ngay.Ngay == -1 || Ngay.Ngay == NaN) {
        return false;
    } else if (Ngay.Thang == -1 || Ngay.Thang == NaN) {
        return false;
    } else if (Ngay.Nam == -1 || Ngay.Nam == NaN) {
        return false;
    }
    return true;
}

function IsGioNotNull(Gio) {
    if (Gio.Gio == -1 || Gio.Gio == NaN) {
        return false;
    } else if (Gio.Phut == -1 || Gio.Phut == NaN) {
        return false;
    }
    return true;
}

let HuyHoaDon = async (MaHoaDon) => {
    let hoadon = await db.HoaDon.findOne({
        where: {
            MaHoaDon: MaHoaDon,
        },
    });
    hoadon.set({
        TrangThai: 'DaHuy',
    });
    await hoadon.save();
};

let XoaCookieMaHangVe = async (req, res) => {
    try {
        let MaHoaDon = req.signedCookies.MaHoaDon;
        if (MaHoaDon) {
            res.clearCookie('MaHoaDon');
        }
        return res.send();
    } catch (error) {
        console.log(error);
        return res.send();
    }
};

let TraCuuHoaDon = async (req, res) => {
    let req_body = { ...req.body };
    var mahoadon = req_body.MaHoaDon;

    let hoadon = await db.HoaDon.findOne({
        where: {
            MaHoaDon: mahoadon,
        },
    });

    if (!hoadon) {
        return res.send(false);
    }

    var MaHangGhe = await db.sequelize.query(
        'SELECT DISTINCT chitiethangve.MaHangGhe  from hoadon, ve, chitiethangve WHERE hoadon.MaHoaDon = :mahoadon AND hoadon.MaHoaDon = ve.MaHoaDon AND ve.MaCTVe = chitiethangve.MaCTVe',
        {
            replacements: {
                mahoadon: mahoadon,
            },
            type: QueryTypes.SELECT,
            raw: true,
        },
    );
    MaHangGhe = MaHangGhe[0].MaHangGhe;
    var mahangghe = req_body.MaHangGhe;
    if (MaHangGhe != mahangghe) {
        return res.send(false);
    }

    let hangve = await db.HangGhe.findOne({
        where: {
            MaHangGhe: mahangghe,
        },
    });

    let httt = await db.HtThanhToan.findOne({
        where: {
            MaHTTT: hoadon.MaHTTT,
        },
    });

    const date = new Date();
    const offset = date.getTimezoneOffset() / 60;
    var ngaygiothanhtoan = new Date(hoadon.NgayGioThanhToan);
    ngaygiothanhtoan = new Date(ngaygiothanhtoan.getTime() + offset * 60 * 60 * 1000);

    var res_data = {
        MaHoaDon: mahoadon,
        MaHoaDonHienThi: mahoadon + '-' + mahangghe,
        HangVe: {
            MaHangVe: hangve.MaHangGhe,
            TenHangVe: hangve.TenHangGhe,
            HeSo: hangve.HeSo,
        },
        HTTT: {
            MaHTTT: httt.MaHTTT,
            Ten: httt.Ten,
        },
        TGTT: {
            Gio: ngaygiothanhtoan.getHours(),
            Phut: ngaygiothanhtoan.getMinutes(),
            Ngay: ngaygiothanhtoan.getDate(),
            Thang: ngaygiothanhtoan.getMonth() + 1,
            Nam: ngaygiothanhtoan.getFullYear(),
        },
        SoTien: hoadon.TongTien,
        LienHe: {
            HoTen: hoadon.HoTen,
            SDT: hoadon.SDT,
            Email: hoadon.Email,
        },
        ChuyenBays: [],
    };

    let chuyenbays = await db.sequelize.query(
        'SELECT DISTINCT chitiethangve.MaChuyenBay FROM ve, hoadon, chitiethangve WHERE ve.MaHoaDon = hoadon.MaHoaDon AND ve.MaCTVe = chitiethangve.MaCTVe AND hoadon.MaHoaDon = :mahoadon',
        {
            replacements: {
                mahoadon: mahoadon,
            },
            type: QueryTypes.SELECT,
            raw: true,
        },
    );

    for (let i = 0; i < chuyenbays.length; i++) {
        res_data.ChuyenBays.push({
            MaChuyenBay: chuyenbays[i].MaChuyenBay,
            MaChuyenBayHienThi:
                chuyenbays[i].MaSanBayDi + '-' + chuyenbays[i].MaSanBayDen + '-' + chuyenbays[i].MaChuyenBay,
        });
    }

    let hanhly = await db.MocHanhLy.findAll();
    res_data.DSHanhLy = hanhly;
    res.send(JSON.stringify(res_data));
};
// #endregion

module.exports = {
    Create: Create,
    CreateHoaDon: CreateHoaDon,
    ThanhToan: ThanhToan,
    HuyHoaDon: HuyHoaDon,
    updateHoaDon: updateHoaDon,
    XoaCookieMaHangVe: XoaCookieMaHangVe,
    TraCuuHoaDon: TraCuuHoaDon,
};
