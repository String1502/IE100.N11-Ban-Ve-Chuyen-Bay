import db from '../models/index';
const { QueryTypes, where } = require('sequelize');

//operator for sequelize
const { Op } = require('sequelize'); //https://sequelize.org/docs/v6/core-concepts/model-querying-basics/

//#region Tra cứu chuyến bay cho client
//req.body
// {
//     mahangghe: 'Eco',
//     hanhkhach:  [{ value: , title: ""}]; Vd: { value: 5 , title: "Người lớn"},
//     ngaydi: '2022-11-11',
//     masanbaydi: 'BMV',
//     masanbayden: 'PQC',
// }

//data fullsearch (1 lan req 1 chuyen bay)
// [{
//     MaChuyenBay: '',
//     ThoiGianDi: { GioDi: { Gio: -1, Phut: -1 }, NgayDi: { Ngay: -1, Thang: -1, Nam: -1 } },
//     ThoiGianDen:  {GioDi: { Gio: -1, Phut: -1 }, NgayDi: { Ngay: -1, Thang: -1, Nam: -1 } },
//     ThoiGianBay: { Gio: -1, Phut: -1 },
//     SoDiemDung: -1,
//     GiaVe: -1,
//     SanBayDi: { MaSanBay: 'TSN', TenSanBay: 'Tân Sơn Nhất', TinhThanh: 'HCM' },
//     SanBayDen: { MaSanBay: 'DAD', TenSanBay: 'Tân Sơn Nhì', TinhThanh: 'Đà Nẵng' },
//     ChanBay: [
//         {
//             ThoiGianDen: { GioDen: { Gio: -1, Phut: -1 },
//             NgayDen: { Ngay: -1, Thang: -1, Nam: -1 } },
//             SanBayDen: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
//             ThoiGianDung_SanBayDen: { Gio: -1, Phut: -1 },
//         },
//     ],
// }]

async function fullSearch(req, res) {
    try {
        //form truyen len
        // {
        //     HangGhe,
        //     HanhKhach, Object: { value: , title: ""}; Vd: { value: 5 , title: "Người lớn"}
        //     ngaydi,
        //     masanbaydi,
        //     masanbayden,
        // }
        let form_data = { ...req.body };
        let list_ChuyenBaySuit = await search_flight(form_data);
        return res.send(JSON.stringify(list_ChuyenBaySuit));
    } catch (error) {
        console.log(error);
        return res.send([]);
    }
}

let search_flight = async (form_data) => {
    form_data.songuoi = 0;
    for (let i = 0; i < form_data.hanhkhach.length; i++) {
        form_data.songuoi = form_data.songuoi + parseInt(form_data.hanhkhach[i].value);
    }
    //tim tat ca chuyen bay hop le
    let list_ChuyenBaySuit = await db.sequelize.query(
        'select `MaChuyenBay`, `MaSanBayDi` as SanBayDi, `MaSanBayDen` as SanBayDen, `NgayGio` as ThoiGianDi, `ThoiGianBay` as ThoiGianBay, `GiaVeCoBan` as GiaVe from chuyenbay where DATE(NgayGio) = :ngaygio AND TrangThai = "ChuaKhoiHanh" AND  MaSanBayDi =  :sanbaydi  AND MaSanBayDen =  :sanbayden ',
        {
            replacements: {
                ngaygio: form_data.ngaydi,
                sanbaydi: form_data.masanbaydi,
                sanbayden: form_data.masanbayden,
            },
            type: QueryTypes.SELECT,
            raw: true,
        },
    );

    //add thong tin san bay
    let SanBays = await db.sequelize.query(
        'select MaSanBay , TenSanBay, TenTinhThanh as TinhThanh from sanbay, tinhthanh where sanbay.matinhthanh = tinhthanh.matinhthanh',
        {
            type: QueryTypes.SELECT,
            raw: true,
        },
    );
    for (var i = 0; i < list_ChuyenBaySuit.length; i++) {
        SanBays.find((item) => {
            if (item.MaSanBay == list_ChuyenBaySuit[i].SanBayDen) list_ChuyenBaySuit[i].SanBayDen = item;
            if (item.MaSanBay == list_ChuyenBaySuit[i].SanBayDi) list_ChuyenBaySuit[i].SanBayDi = item;
        });
    }

    let thoigiandi_chuyenbay;
    let thoigianden_chuyenbay;
    //tim chuyen bay co ghe trong
    for (var i = 0; i < list_ChuyenBaySuit.length; i++) {
        let checkChuyenBay = await db.sequelize.query(
            'SELECT MaChuyenBay, MaHangGhe, TongVe, VeDaBan FROM `chitiethangve` WHERE MaChuyenBay = :machuyenbay AND MaHangGhe = :mahangghe',
            {
                replacements: {
                    machuyenbay: list_ChuyenBaySuit[i].MaChuyenBay,
                    mahangghe: form_data.mahangghe,
                },
                type: QueryTypes.SELECT,
                raw: true,
            },
        );
        if (checkChuyenBay.length === 0) {
            list_ChuyenBaySuit.splice(i, 1);
            continue;
        }

        if (checkChuyenBay[0].TongVe - checkChuyenBay[0].VeDaBan < form_data.songuoi) {
            list_ChuyenBaySuit.splice(i, 1);
            continue;
        }

        //convert thoigiandi + thoigianden
        thoigiandi_chuyenbay = new Date(list_ChuyenBaySuit[i].ThoiGianDi);
        console.log(thoigiandi_chuyenbay);
        thoigianden_chuyenbay = add_minutes(thoigiandi_chuyenbay, list_ChuyenBaySuit[i].ThoiGianBay);
        //thoigian di
        list_ChuyenBaySuit[i].ThoiGianDi = {
            GioDi: {
                Gio: thoigiandi_chuyenbay.getUTCHours(),
                Phut: thoigiandi_chuyenbay.getMinutes(),
            },
            NgayDi: {
                Ngay: thoigiandi_chuyenbay.getUTCDate(),
                Thang: thoigiandi_chuyenbay.getMonth() + 1,
                Nam: thoigiandi_chuyenbay.getFullYear(),
            },
        };
        //thoiganden
        list_ChuyenBaySuit[i].ThoiGianDen = {
            GioDen: {
                Gio: thoigianden_chuyenbay.getUTCHours(),
                Phut: thoigianden_chuyenbay.getMinutes(),
            },
            NgayDen: {
                Ngay: thoigianden_chuyenbay.getUTCDate(),
                Thang: thoigianden_chuyenbay.getMonth() + 1,
                Nam: thoigianden_chuyenbay.getFullYear(),
            },
        };
    }

    if (list_ChuyenBaySuit.length !== 0) {
        // thoigian di, den, dung cua moi chan bay
        let thoigiandi;
        let thoigianden;
        let thoigianbay;
        let thoigiandung;
        //tim sanbay trung gian + convert time
        for (var i = 0; i < list_ChuyenBaySuit.length; i++) {
            //sbtg
            let sbtg;
            //chanbay
            let chanbays = [];
            let chanbay = {
                ThoiGianDi: { GioDi: { Gio: 11, Phut: 11 }, NgayDi: { Ngay: 1, Thang: 1, Nam: 2023 } },
                SanBayDi: { MaSanBay: 'TSN', TenSanBay: 'Tân Sơn Nhất', TinhThanh: 'HCM' },
                ThoiGianDen: { GioDen: { Gio: 6, Phut: 6 }, NgayDen: { Ngay: 2, Thang: 1, Nam: 2023 } },
                SanBayDen: { MaSanBay: 'DAD', TenSanBay: 'Tân Sơn Nhì', TinhThanh: 'Đà Nẵng' },
                ThoiGianBay: { Gio: 5, Phut: 5 },
                ThoiGianDung_SanBayDen: { Gio: 0, Phut: 30 },
            };

            // //get chan bay theo ma chuyen bay
            sbtg = await db.sequelize.query(
                'SELECT `MaSBTG`, `ThuTu`, `NgayGioDen`, `ThoiGianDung`, `TenSanBay`, `TenTinhThanh`  FROM `chitietchuyenbay` , sanbay , tinhthanh WHERE chitietchuyenbay.MaSBTG = sanbay.MaSanBay AND sanbay.MaTinhThanh = tinhthanh.MaTinhThanh AND  MaChuyenBay = :machuyenbay',
                {
                    replacements: {
                        machuyenbay: list_ChuyenBaySuit[i].MaChuyenBay,
                    },
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            //sort thoi gian dung max

            //get so diem dung
            list_ChuyenBaySuit[i].SoDiemDung = sbtg.length;

            for (var j = 0; j < sbtg.length; j++) {
                if (j == 0) {
                    //san bay dau -> tram dung dau
                    thoigiandi = new Date(thoigiandi_chuyenbay);

                    thoigianden = new Date(sbtg[j].NgayGioDen);

                    thoigianbay = getMinDiff(thoigiandi, thoigianden);
                    thoigiandung = parseInt(sbtg[j].ThoiGianDung);
                    chanbay = {
                        SanBayDi: list_ChuyenBaySuit[i].SanBayDi,
                        ThoiGianDi: list_ChuyenBaySuit[i].ThoiGianDi,
                        SanBayDen: {
                            MaSanBay: sbtg[j].MaSBTG,
                            TenSanBay: sbtg[j].TenSanBay,
                            TinhThanh: sbtg[j].TenTinhThanh,
                        },
                        ThoiGianDen: {
                            GioDen: {
                                Gio: thoigianden.getUTCHours(),
                                Phut: thoigianden.getMinutes(),
                            },
                            NgayDen: {
                                Ngay: thoigianden.getUTCDate(),
                                Thang: thoigianden.getMonth() + 1,
                                Nam: thoigianden.getFullYear(),
                            },
                        },
                        ThoiGianDung_SanBayDen: toHoursAndMinutes(sbtg[j].ThoiGianDung),
                        ThoiGianBay: toHoursAndMinutes(thoigianbay),
                    };
                    chanbays.push(chanbay);
                    //tram dung dau -> san bay cuoi
                    thoigiandi = add_minutes(thoigianden, sbtg[j].ThoiGianDung);
                    thoigianbay = getMinDiff(thoigiandi, Date.parse(thoigianden_chuyenbay));
                    chanbay = {
                        SanBayDi: {
                            MaSanBay: sbtg[j].MaSBTG,
                            TenSanBay: sbtg[j].TenSanBay,
                            TinhThanh: sbtg[j].TenTinhThanh,
                        },
                        ThoiGianDi: {
                            GioDi: {
                                Gio: thoigiandi.getUTCHours(),
                                Phut: thoigiandi.getMinutes(),
                            },
                            NgayDi: {
                                Ngay: thoigiandi.getUTCDate(),
                                Thang: thoigiandi.getMonth() + 1,
                                Nam: thoigiandi.getFullYear(),
                            },
                        },
                        SanBayDen: list_ChuyenBaySuit[i].SanBayDen,
                        ThoiGianDen: list_ChuyenBaySuit[i].ThoiGianDen,
                        ThoiGianDung_SanBayDen: { Gio: 0, Phut: 0 },
                        ThoiGianBay: toHoursAndMinutes(thoigianbay),
                    };
                    chanbays.push(chanbay);
                } else {
                    //san bay truoc -> san bay trung gian
                    chanbays = chanbays.slice(0, -1);
                    thoigiandi = add_minutes(thoigianden, sbtg[j - 1].ThoiGianDung);
                    thoigianden = new Date(sbtg[j].NgayGioDen);
                    thoigianbay = getMinDiff(thoigiandi, thoigianden);

                    chanbay = {
                        SanBayDi: chanbays[j - 1].SanBayDen,
                        ThoiGianDi: {
                            GioDi: {
                                Gio: thoigiandi.getUTCHours(),
                                Phut: thoigiandi.getMinutes(),
                            },
                            NgayDi: {
                                Ngay: thoigiandi.getUTCDate(),
                                Thang: thoigiandi.getMonth() + 1,
                                Nam: thoigiandi.getFullYear(),
                            },
                        },
                        SanBayDen: {
                            MaSanBay: sbtg[j].MaSBTG,
                            TenSanBay: sbtg[j].TenSanBay,
                            TinhThanh: sbtg[j].TenTinhThanh,
                        },
                        ThoiGianDen: {
                            GioDen: {
                                Gio: thoigianden.getUTCHours(),
                                Phut: thoigianden.getMinutes(),
                            },
                            NgayDen: {
                                Ngay: thoigianden.getUTCDate(),
                                Thang: thoigianden.getMonth() + 1,
                                Nam: thoigianden.getFullYear(),
                            },
                        },
                        ThoiGianDung_SanBayDen: toHoursAndMinutes(sbtg[j].ThoiGianDung),
                        ThoiGianBay: toHoursAndMinutes(thoigianbay),
                    };
                    chanbays.push(chanbay);

                    //san bay trung gian -> san bay cuoi
                    thoigiandi = add_minutes(thoigianden, sbtg[j].ThoiGianDung);
                    thoigianbay = getMinDiff(thoigiandi, Date.parse(thoigianden_chuyenbay));

                    chanbay = {
                        SanBayDi: {
                            MaSanBay: sbtg[j].MaSBTG,
                            TenSanBay: sbtg[j].TenSanBay,
                            TinhThanh: sbtg[j].TenTinhThanh,
                        },
                        ThoiGianDi: {
                            GioDi: {
                                Gio: thoigiandi.getUTCHours(),
                                Phut: thoigiandi.getMinutes(),
                            },
                            NgayDi: {
                                Ngay: thoigiandi.getUTCDate(),
                                Thang: thoigiandi.getMonth() + 1,
                                Nam: thoigiandi.getFullYear(),
                            },
                        },
                        SanBayDen: list_ChuyenBaySuit[i].SanBayDen,
                        ThoiGianDen: list_ChuyenBaySuit[i].ThoiGianDen,
                        ThoiGianDung_SanBayDen: { Gio: 0, Phut: 0 },
                        ThoiGianBay: toHoursAndMinutes(thoigianbay),
                    };
                    chanbays.push(chanbay);
                }
            }

            list_ChuyenBaySuit[i].ChanBay = chanbays;

            list_ChuyenBaySuit[i].ThoiGianBay = toHoursAndMinutes(list_ChuyenBaySuit[i].ThoiGianBay);
            //Gia Ve = GiaVeCoBan * HeSoHangGhe
            let heso_hangghe = await db.HangGhe.findOne({
                where: {
                    MaHangGhe: form_data.mahangghe,
                },
            });

            list_ChuyenBaySuit[i].GiaVe = list_ChuyenBaySuit[i].GiaVe * parseFloat(heso_hangghe.HeSo);
        }
    }
    console.log(list_ChuyenBaySuit[0].ThoiGianDen);
    return list_ChuyenBaySuit;
};

let toHoursAndMinutes = (totalMinutes) => {
    totalMinutes = parseInt(totalMinutes);
    const Gio = Math.floor(totalMinutes / 60);
    const Phut = totalMinutes % 60;
    return { Gio, Phut };
};

let add_minutes = function (dt, minutes) {
    return new Date(dt.getTime() + minutes * 60000);
};

let getMinDiff = function (startDate, endDate) {
    const msInMinute = 60 * 1000;

    return Math.round(Math.abs(endDate - startDate) / msInMinute);
};
//#endregion

//#region Tra cứu cho nhân viên
//Trả về tất cả chuyến bay có thời gian khởi hành > time.now
// res = [{
//     MaChuyenBay,
//     SanBayDi: {
//         TenSanBay,
//         MaSanBay,
//     },
//     SanBayDen: {
//         TenSanBay,
//         MaSanBay,
//     },
//     NgayKhoiHanh,
//     SoDiemDung,
//     SoHangVe,
//     GiaVeCoBan,
//     GheTrong,
//     TongGhe,
// }]
let GetInfoAllFlights = async (req, res) => {
    try {
        let Chuyenbays = await db.ChuyenBay.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt', 'TrangThai', 'ThoiGianBay', 'DoanhThu'] },
            where: {
                // [Op.gt]: {
                //     NgayGio: now.yyyymmdd(),
                // },
            },
            raw: true,
        });

        // SELECT MaChuyenBay, COUNT(*) FROM `chitietchuyenbay` WHERE MaChuyenBay = 1 GROUP BY MaChuyenBay
        for (var i in Chuyenbays) {
            //sodiemdung luon cho 1 gtri duy nhat -> sodiemdung[0]
            let sodiemdung = await db.sequelize.query(
                'SELECT MaChuyenBay, COUNT(*) as SoDiemDung FROM `chitietchuyenbay` WHERE MaChuyenBay = :machuyenbay GROUP BY MaChuyenBay',
                {
                    replacements: {
                        machuyenbay: Chuyenbays[i].MaChuyenBay,
                    },
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            Chuyenbays[i].SoDiemDung = sodiemdung[0].SoDiemDung;

            //add info sanbay
            Chuyenbays[i].SanBayDi = await getInfoSanBay(Chuyenbays[i].MaSanBayDi);
            Chuyenbays[i].SanBayDen = await getInfoSanBay(Chuyenbays[i].MaSanBayDen);

            //tinh so ghe trong+ tong ghe

            let soghe = await db.sequelize.query(
                ' SELECT SUM(TongVe) as TongGhe, SUM(VeDaBan) as TongVeBan FROM `chitiethangve` WHERE MaChuyenBay = :machuyenbay GROUP BY MaChuyenBay',
                {
                    replacements: {
                        machuyenbay: Chuyenbays[i].MaChuyenBay,
                    },
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            Chuyenbays[i].GheTrong = parseInt(soghe[0].TongGhe) - parseInt(soghe[0].TongVeBan);
            Chuyenbays[i].TongGhe = parseInt(soghe[0].TongGhe);
        }

        console.log(Chuyenbays);

        return res.send(JSON.stringify(Chuyenbays));
    } catch (error) {
        console.log(error);
        return [];
    }
};

Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getUTCDate();

    return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-');
};

let getInfoSanBay = async (maSanBay) => {
    let sanbay = await db.SanBay.findOne({
        where: {
            MaSanBay: maSanBay,
        },
    });
    console.log(sanbay);
    return {
        MaSanBay: sanbay.MaSanBay,
        TenSanBay: sanbay.TenSanBay,
    };
};
//#endregion

//#region tìm thông tin chuyến bay chỉ định
//req.body = { MaChuyenBay }

//chuyenbay = {
//     MaCuyenBay,
//     NgayKhoiHanh,
//     ThoiGianBay
//     SanBayDi,
//     SanBayDen,
//     GiaVeCoBan,
//     SanBayTrungGian: [{
//         ThuTu,
//         TenSanBay,
//         ThoiGianDen,
//         ThoiGianDung,
//         GhiChu
//     }],
//     HangVe: [{
//         MaHangVe,
//         TenHangVe,
//         GiaTien,
//         GheTrong,
//     }]
//     VeDaDat: [{
//         MaVe,
//         MaHanhKhach,
//         TenKhach,
//         TenHangVe,
//         HanhLy,
//         NgayThanhToan,
//         LienLac,
//     }]
// }
let getFlight = async (machuyenbay) => {
    try {
        let Chuyenbay = await db.ChuyenBay.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt', 'TrangThai', 'DoanhThu'] },
            where: {
                MaChuyenBay: machuyenbay,
            },
            raw: true,
        });

        //add san bay trung gian
        let sbtg = await db.sequelize.query(
            'SELECT `MaSBTG`, TenSanBay , `ThuTu`, `NgayGioDen`, `ThoiGianDung`, `GhiChu` FROM `chitietchuyenbay`, sanbay WHERE chitietchuyenbay.MaSBTG = sanbay.MaSanBay AND MaChuyenBay = :machuyenbay ',
            {
                replacements: {
                    machuyenbay: machuyenbay,
                },
                type: QueryTypes.SELECT,
                raw: true,
            },
        );
        Chuyenbay.SanBayTrungGian = sbtg;

        //hangve = [{MaHangGhe, TenHangGhe, HeSo, TongVe, VeDaBan }]
        let HangVe = await db.sequelize.query(
            '  SELECT  MaCTVe, chitiethangve.`MaHangGhe`, hangghe.TenHangGhe ,  hangghe.HeSo ,`TongVe`, `VeDaBan` FROM `chitiethangve`, hangghe WHERE chitiethangve.MaHangGhe = hangghe.MaHangGhe AND MaChuyenBay = :machuyenbay ',
            {
                replacements: {
                    machuyenbay: machuyenbay,
                },
                type: QueryTypes.SELECT,
                raw: true,
            },
        );

        let VeDaDats = [];
        for (var i in HangVe) {
            HangVe[i].GiaTien = parseInt(Chuyenbay.GiaVeCoBan) * parseFloat(HangVe[i].HeSo);

            let vedadat = await db.sequelize.query(
                '  SELECT ve.MaHK, hanhkhach.HoTen, `MaVe`, mochanhly.SoKgToiDa, `GiaVe`FROM `ve` , mochanhly , hanhkhach WHERE ve.MaMocHanhLy = mochanhly.MaMocHanhLy AND ve.MaHK = hanhkhach.MaHK AND MaCTVe = :mactve ',
                {
                    replacements: {
                        mactve: HangVe[i].MaCTVe,
                    },
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            VeDaDats = VeDaDats.concat(vedadat);
        }
        Chuyenbay.VeDaDat = VeDaDats;

        return Chuyenbay;
    } catch (error) {
        console.log(error);
        return {};
    }
};
//#endregion

module.exports = {
    fullSearch: fullSearch,
    toHoursAndMinutes: toHoursAndMinutes,
    GetInfoAllFlights: GetInfoAllFlights,
};
