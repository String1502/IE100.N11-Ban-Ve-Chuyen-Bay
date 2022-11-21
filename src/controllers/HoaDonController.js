import db from '../models/index';
const { QueryTypes, where } = require('sequelize');
import Mailer from '../utils/mailer';
import pdfController from './pdfController';
const fs = require('fs');
const path = require('path');

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

let CreateHoaDon = async (req_body) => {
    //create hanhkhach
    try {
        let data_res = {
            MaHoaDon: '',
            ChuyenBay: [],
            SoVe: 0, // so ve 1 chuyen
        };

        let HanhKhachs = req_body.HanhKhach;
        let nguoilienhe = req_body.NguoiLienHe;

        nguoilienhe.HoTen = nguoilienhe.Ho + ' ' + nguoilienhe.Ten;

        for (var index in HanhKhachs) {
            HanhKhachs[index].HoTen = HanhKhachs[index].Ho + ' ' + HanhKhachs[index].Ten;
            // HanhKhachs[index].NgaySinh =
            //     HanhKhachs[index].NgaySinh.Nam +
            //     '-' +
            //     HanhKhachs[index].NgaySinh.Thang +
            //     '-' +
            //     HanhKhachs[index].NgaySinh.Ngay;

            let NgaySinh = new Date(
                parseInt(HanhKhachs[index].NgaySinh.Nam),
                parseInt(HanhKhachs[index].NgaySinh.Thang),
                parseInt(HanhKhachs[index].NgaySinh.Ngay),
                7,
                0,
            );
            console.log(NgaySinh);

            const HanhKhach = await db.HanhKhach.create(
                {
                    MaLoaiKhach: HanhKhachs[index].MaLoaiKhach,
                    HoTen: HanhKhachs[index].HoTen,
                    NgaySinh: NgaySinh, //new Date(HanhKhachs[index].NgaySinh),
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

        //create hoa don
        let giodat = new Date(req_body.NgayGioDat);
        console.log(giodat.getUTCHours() + 7);
        console.log(giodat.getUTCMinutes());

        giodat = new Date(
            giodat.getFullYear(),
            giodat.getMonth(),
            giodat.getDate(),
            giodat.getHours() + 7,
            giodat.getMinutes(),
        );
        console.log(giodat.getHours());
        console.log(giodat.getUTCHours());

        let hoadon = await db.HoaDon.create(
            {
                HoTen: nguoilienhe.HoTen,
                Email: nguoilienhe.Email,
                SDT: nguoilienhe.SDT,
                NgayGioDat: giodat,
                TongTien: 0,
                TrangThai: 'ChuaThanhToan',
            },
            { raw: true },
        );
        await hoadon.save();

        //[ [15,25], [25,25] ]
        let mangHanhLyDat = [];
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
                if (HanhKhachs[index].TenLoai !== 'Em bé') {
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
                    // let GiaVe_TreEm = db.ThamSo.findOne({
                    //     where: {
                    //         TenThamSo: 'GiaVeTreEm',
                    //     }
                    // })
                    let GiaVe_TreEm = 100000;
                    ve = await db.Ve.create(
                        {
                            MaMocHanhLy: mocHanhLy.MaMocHanhLy,
                            MaCTVe: info_chuyenbay[0].MaCTVe,
                            MaHK: HanhKhachs[index].MaHK,
                            GiaVe: GiaVe_TreEm,
                            // Giave = heso_hangghe * giave_coban * heso_loaikhach + giatien_hanhly
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
        data_res.SoVe = HanhKhachs.length;
        return data_res;
    } catch (error) {
        console.log(error);
        return -1;
    }
};
//#endregion

//#region bam vao nut thanh toan
let ThanhToan = async (req, res) => {
    try {
        //update doanh thu
        let data_req = { ...req.body };
        let chuyenbays = data_req.ChuyenBay;
        for (var i in chuyenbays) {
            console.log(chuyenbays);
            let chuyenbay = await db.ChuyenBay.findOne({
                where: {
                    MaChuyenBay: chuyenbays[i].MaChuyenBay,
                },
            });
            chuyenbay.set({
                DoanhThu: chuyenbay.DoanhThu + chuyenbays[i].DoanhThu,
            });
            await chuyenbay.save();

            //update so ve ban
            let chitiet = await db.ChiTietHangVe.findOne({
                where: {
                    MaCTVe: chuyenbays[i].MaCTVe,
                },
            });
            chitiet.set({
                VeDaBan: chitiet.VeDaBan + data_req.SoVe,
            });
            await chitiet.save();
        }
        //Add NgayGioThanhToan

        data_req.NgayGioThanhToan = new Date(data_req.NgayGioThanhToan);
        let giodat = new Date(
            data_req.NgayGioThanhToan.getFullYear(),
            data_req.NgayGioThanhToan.getMonth(),
            data_req.NgayGioThanhToan.getDate(),
            data_req.NgayGioThanhToan.getHours() + 7,
            data_req.NgayGioThanhToan.getMinutes(),
        );
        let hoadon = await db.HoaDon.findOne({
            where: {
                MaHoaDon: data_req.MaHoaDon,
            },
        });
        hoadon.set({
            NgayGioThanhToan: giodat,
            TrangThai: 'DaThanhToan',
        });
        await hoadon.save();

        let pdf = await pdfController.generateHoaDonPdf();
        if (pdf.status === 'ok') {
            await Mailer.sendMail(
                hoadon.Email,
                'Verify mail',
                `<a href="https://www.facebook.com/">verify</a>`,
                pdf.filename,
            );
        } else return res.send('Fail');

        let directory = path.join(__dirname, '../public/temp');

        fs.unlink(path.join(directory, pdf.filename), (err) => {
            if (err) throw err;
        });
        console.log('Gửi mail được!');
        return res.send('Success');
    } catch (error) {
        console.log(error);
        return res.send('Fail');
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

module.exports = {
    Create: Create,
    CreateHoaDon: CreateHoaDon,
    ThanhToan: ThanhToan,
    updateHoaDon: updateHoaDon,
};
