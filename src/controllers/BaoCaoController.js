import db from '../models/index';
const { QueryTypes, where } = require('sequelize');

import pdfController from './pdfController';

//#region Hen's
//
// let req.body = {
//     Nam: -1,
// }
// let res_data = {
//     Nam: -1,
//     TongDoanhThu: 0,
//     DoanhThu: [
//         {
//             Thang: -1,
//             TongDoanhThu: -1,
//             SoChuyenBay: -1,
//             ChuyenBay: [
//                 {
//                     MaChuyenBay: '',
//                     NgayKhoiHanh: '',
//                     TongVe: -1,
//                     VeDaBan: -1,
//                     DoanhThu: -1,
//                     TiLe: -1,
//                     HangVes: [
//                           {
//                               MaHangGhe: '',
//                               TenHangGhe: '',
//                               Gia: '',
//                               VeDaBan = -1.
//                               DoanhThu = -1
//                           }
//                     ]
//
//                 },
//             ],
//         },
//     ],
// };

//#endregion

//
// let req.body = {
//     Nam: -1,
// }
// let res_data = {
//     Nam: -1,
// TongDoanhThu: 0,
//     DoanhThu: [
//         {
//             Thang: -1,
//             TongDoanhThu: -1,
//             SoChuyenBay: -1,
//             ChuyenBay: [
//                 {
//                     MaChuyenBay: '',
//                     NgayKhoiHanh: '',
//                     TongVe: -1,
//                     VeDaBan: -1,
//                     DoanhThu: -1,
//                     TiLe: -1,
//                 },
//             ],
//         },
//     ],
// };
class BaoCaoController {
    // POST
    // "/GetReports"
    async DoanhThuNam(req, res) {
        let Nam = req.body.Nam;

        let res_data = {
            Nam: -1,
            TongDoanhThu: 0,
            DoanhThu: [
                // {
                //     Thang: -1,
                //     TongDoanhThu: -1,
                //     SoChuyenBay: -1,
                //     ChuyenBay: [],
                // },
            ],
        };

        res_data.Nam = Nam;

        let DoanhThuNam = await db.DoanhThuNam.findOne({
            where: {
                Nam: Nam,
            },
        });

        res_data.TongDoanhThu = DoanhThuNam.DoanhThu;

        let DoanhThuThang = await db.sequelize.query('SELECT * FROM `doanhthuthang` WHERE doanhthuthang.Nam = :nam', {
            replacements: {
                nam: Nam,
            },
            type: QueryTypes.SELECT,
            raw: true,
        });

        if (DoanhThuThang.length === 0) {
            return res.send(JSON.stringify(res_data));
        }

        for (var i in DoanhThuThang) {
            let chuyenBays = await db.sequelize.query(
                `
                    select 
                        MaChuyenBay, MaSanBayDi, MaSanBayDen, a.TenSanBay as TenSanBayDi, b.TenSanBay as TenSanBayDen,
                        DATE_FORMAT(NgayGio, "%H:%i %d-%m-%Y") as NgayGio, ThoiGianBay, GiaVeCoBan, DoanhThu
                    from 
                        (chuyenbay INNER JOIN sanbay a on chuyenbay.MaSanBayDi=a.MaSanBay) INNER JOIN
                        sanbay b on chuyenbay.MaSanBayDen=b.MaSanBay
                    where 
                        year(chuyenbay.NgayGio)=:nam and 
                        month(chuyenbay.NgayGio)=:thang AND
                        chuyenbay.TrangThai='DaKhoiHanh'
                `,
                {
                    replacements: {
                        nam: Nam,
                        thang: DoanhThuThang[i].Thang,
                    },
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            for (var j in chuyenBays) {
                console.log(j);

                // Mã hiển thị
                chuyenBays[j].MaHienThi =
                    chuyenBays[j].MaSanBayDi + '-' + chuyenBays[j].MaSanBayDen + '-' + chuyenBays[j].MaChuyenBay;

                // Tỉ lệ
                chuyenBays[j].TiLe = 0;

                if (DoanhThuThang[i].DoanhThu != 0)
                    chuyenBays[j].TiLe = ((chuyenBays[j].DoanhThu * 100) / DoanhThuThang[i].DoanhThu).toFixed(2);

                // Chi tiết hạng vé
                const chiTietHangVes = await db.sequelize.query(
                    `
                        SELECT hangghe.MaHangGhe, TenHangGhe, HeSo, TongVe, VeDaBan 
                        FROM hangghe INNER JOIN chitiethangve ON hangghe.MaHangGhe=chitiethangve.MaHangGhe 
                        WHERE chitiethangve.MaChuyenBay = :maChuyenBay;
                    `,
                    {
                        replacements: {
                            maChuyenBay: chuyenBays[j].MaChuyenBay,
                        },
                        type: QueryTypes.SELECT,
                        raw: true,
                    },
                );

                // Vé đã bán
                chuyenBays[j].TongVe = chiTietHangVes.reduce(
                    (accumulator, chiTietHangVe) => accumulator + chiTietHangVe.TongVe,
                    0,
                );
                chuyenBays[j].VeDaBan = chiTietHangVes.reduce(
                    (accumulator, chiTietHangVe) => accumulator + chiTietHangVe.VeDaBan,
                    0,
                );
                chuyenBays[j].ChiTietHangVe = chiTietHangVes;
            }

            // for (var j in chuyenbays) {
            //     console.log(j);
            //     chuyenbays[i].MaHienThi =
            //         chuyenbays[i].MaSanBayDi + '-' + chuyenbays[i].MaSanBayDen + '-' + chuyenbays[i].MaChuyenBay;
            //     chuyenbays[i].TiLe = ((chuyenbays[i].DoanhThu * 100) / DoanhThuThang.DoanhThu).toFixed(2);
            // }

            let doanhThu = {
                Thang: DoanhThuThang[i].Thang,
                TongDoanhThu: DoanhThuThang[i].DoanhThu,
                SoChuyenBay: chuyenBays.length,
                ChuyenBay: chuyenBays,
            };

            res_data.DoanhThu.push(doanhThu);
        }

        return res.send(JSON.stringify(res_data));
    }

    // POST
    // "/GetBills"
    async HoaDonTheoChuyenBay(req, res) {
        const maChuyenBay = req.body.maChuyenBay;

        console.log(maChuyenBay);

        let res_data = {
            HoaDonList: [],
        };

        let HoaDonList = await db.sequelize.query(
            `
            select 
                hoadon.MaHoaDon, chuyenbay.MaSanBayDi, chuyenbay.MaSanBayDen ,hoadon.HoTen as NguoiThanhToan, COUNT(ve.MaVe) as SoVe,
                DATE_FORMAT(hoadon.NgayGioDat, "%H:%i %d-%m-%Y") as NgayGioDat,
                htthanhtoan.Ten as HinhThucThanhToan, hoadon.TongTien 
            from
                (chitiethangve inner join
                ve on chitiethangve.MaCTVe=ve.MaCTVe) inner join
                hoadon on ve.MaHoaDon=hoadon.MaHoaDon inner JOIN
                htthanhtoan on hoadon.MaHTTT=htthanhtoan.MaHTTT inner JOIN
                chuyenbay on chuyenbay.MaChuyenBay=chitiethangve.MaChuyenBay
                where chitiethangve.MaChuyenBay=:maChuyenBay
            group by hoadon.MaHoaDon
        `,
            {
                replacements: {
                    maChuyenBay: maChuyenBay,
                },
                type: QueryTypes.SELECT,
                raw: true,
            },
        );

        if (HoaDonList.length === 0) {
            return res.send(JSON.stringify(res_data));
        }

        for (let i = 0; i < HoaDonList.length; i++) {
            HoaDonList[
                i
            ].MaHoaDonHienThi = `${HoaDonList[i].MaSanBayDi}-${HoaDonList[i].MaSanBayDen}-${HoaDonList[i].MaHoaDon}`;

            res_data.HoaDonList.push(HoaDonList[i]);
        }

        return res.send(JSON.stringify(res_data));
    }

    // POST
    // "/"
    async index(req, res) {
        try {
            // Load year combobox
            const years = await db.sequelize.query(' SELECT nam FROM doanhthunam', {
                type: QueryTypes.SELECT,
                raw: true,
            });

            return res.render('staff/BaoCaoDoanhThu', {
                layout: 'staff.handlebars',
                years: years,
            });
        } catch (error) {
            console.log(error);
        }
    }

    // POST
    // "/PrintReport"
    async PrintReport(req, res) {
        try {
            const data = req.body;
            console.log(data);
            let pdf = await pdfController.generateReportPdf(data);
            console.log(pdf);

            if (pdf.status === 'ok') {
                return res.send('Sucessful');
            } else {
                return res.send('Fail');
            }

            // let directory = path.join(__dirname, '../public/temp');

            // fs.readdir(directory, (err, files) => {
            //     if (err) throw err;

            //     for (const file of files) {
            //         fs.unlink(path.join(directory, file), (err) => {
            //             if (err) throw err;
            //         });
            //     }
            // });
            // return 1;
        } catch (error) {
            console.log(error);
            return res.send('Error');
        }
    }

    // GET
    // "/ReportTemplate"
    async ReportTemplate(req, res) {
        try {
            return res.render('staff/report-template', {
                layout: 'staff.handlebars',
            });
        } catch (error) {
            console.log(error);
            return res.send('Error');
        }
    }
}

module.exports = new BaoCaoController();
