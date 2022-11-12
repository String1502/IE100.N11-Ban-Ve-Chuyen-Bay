import { raw } from 'body-parser';
import db from '../models/index';
const { QueryTypes, where } = require('sequelize');

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
//         MaMocHanhLy,
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
        let HanhKhachs = JSON.parse(req_body.HanhKhach);

        for (var index in HanhKhachs) {
            const HanhKhach = await db.HanhKhach.create(
                {
                    MaLoaiKhach: HanhKhachs[index].MaLoaiKhach,
                    HoTen: HanhKhachs[index].HoTen,
                    NgaySinh: HanhKhachs[index].NgaySinh,
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
        let MangChuyenBayDat = JSON.parse(req_body.MangChuyenBayDat);

        let nguoilienhe = JSON.parse(req_body.NguoiLienHe);
        //create hoa don
        let hoadon = await db.HoaDon.create(
            {
                HoTen: nguoilienhe.HoTen,
                Email: nguoilienhe.Email,
                SDT: nguoilienhe.SDT,
                NgayGioDat: Date.parse(req_body.NgayGioDat),
                TongTien: 0,
            },
            { raw: true },
        );
        await hoadon.save();

        let ves = [];

        //[ [15,25], [25,25] ]
        let mangHanhLyDat = [];
        for (var i = 0; i < MangChuyenBayDat.length; i++) {
            mangHanhLyDat.push(MangChuyenBayDat[i].MaMocHanhLy);
        }

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

            // tao ve cho 1 hanh khach
            for (var index in HanhKhachs) {
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
                console.log(mocHanhLy);
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

                //info_chuyenbay[0].HeSo * info_chuyenbay[0].GiaVe *
                hoadon.TongTien += ve.GiaVe;
                await hoadon.save();

                //update doanh thu chuyen bay
                let chuyenbay = await db.ChuyenBay.findOne({
                    where: {
                        MaChuyenBay: info_chuyenbay[0].MaChuyenBay,
                    },
                });
                chuyenbay.set({
                    DoanhThu: chuyenbay.DoanhThu + ve.GiaVe,
                });
                chuyenbay.save();
            }

            //update ve da ban
            let chitiet = await db.ChiTietHangVe.findOne({
                where: {
                    MaCTVe: info_chuyenbay[0].MaCTVe,
                },
            });
            chitiet.set({
                VeDaBan: chitiet.VeDaBan + HanhKhachs.length,
            });
            await chitiet.save();
        }

        return 1;
    } catch (error) {
        console.log(error);
        return 0;
    }
};

module.exports = {
    Create: Create,
};
