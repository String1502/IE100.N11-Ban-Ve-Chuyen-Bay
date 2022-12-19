import db from '../models/index';
const { QueryTypes, where } = require('sequelize');

//
// let req.body = {
//     Nam: -1,
// }
// let res_data = {
//     Nam: -1,
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
    // "/get"
    async DoanhThuNam(req, res) {
        let Nam = req.body.Nam;

        let res_data = {
            Nam: -1,
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
            let chuyenbays = await db.sequelize.query(
                'SELECT chuyenbay.MaChuyenBay, MaSanBayDi, MaSanBayDen, NgayGio, TongVe, VeDaBan, DoanhThu FROM `chuyenbay`, chitiethangve WHERE YEAR(NgayGio) = :nam AND MONTH(NgayGio) = :thang AND chuyenbay.MaChuyenBay = chitiethangve.MaChuyenBay',
                {
                    replacements: {
                        nam: Nam,
                        thang: DoanhThuThang[i].Thang,
                    },
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            console.log(chuyenbays.length);
            for (var j in chuyenbays) {
                chuyenbays[i].MaHienThi =
                    chuyenbays[i].MaSanBayDi + '-' + chuyenbays[i].MaSanBayDen + '-' + chuyenbays[i].MaChuyenBay;
                chuyenbays[i].TiLe = ((chuyenbays[i].DoanhThu * 100) / DoanhThuThang.DoanhThu).toFixed(2);
            }

            let doanhThu = {
                Thang: DoanhThuThang[i].Thang,
                TongDoanhThu: DoanhThuThang[i].DoanhThu,
                SoChuyenBay: DoanhThuThang[i].SoChuyenBay,
                ChuyenBay: chuyenbays,
            };
            res_data.DoanhThu.push(doanhThu);
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

    async LoadReportToView() {}
}

module.exports = new BaoCaoController();
