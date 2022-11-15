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
//#endregion

//#region tìm thông tin chuyến bay chỉ định
//req.body = { MaChuyenBay , MaChuyenBayHienThi }

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
let getFlight = async (req, res) => {
    try {
        let maChuyenBay = req.body.MaChuyenBay;
        let maChuyenBayHienThi = req.body.MaChuyenBayHienThi;
        let Chuyenbay = await db.ChuyenBay.findOne({
            attributes: { exclude: ['createdAt', 'updatedAt', 'TrangThai', 'DoanhThu'] },
            where: {
                MaChuyenBay: maChuyenBay,
            },
            raw: true,
        });

        //add san bay trung gian
        let sbtg = await db.sequelize.query(
            'SELECT `MaSBTG`, TenSanBay , `ThuTu`, `NgayGioDen`, `ThoiGianDung`, `GhiChu` FROM `chitietchuyenbay`, sanbay WHERE chitietchuyenbay.MaSBTG = sanbay.MaSanBay AND MaChuyenBay = :machuyenbay ',
            {
                replacements: {
                    machuyenbay: maChuyenBay,
                },
                type: QueryTypes.SELECT,
                raw: true,
            },
        );
        for (var i in sbtg) {
            let ngayGioDen = formatDateTime(sbtg[i].NgayGioDen);
            sbtg[i].ThoiGianDen = {
                GioDen: { Gio: ngayGioDen.Gio, Phut: ngayGioDen.Phut },
                NgayDen: { Ngay: ngayGioDen.Ngay, Thang: ngayGioDen.Thang, Nam: ngayGioDen.Nam },
            };
            delete sbtg[i].NgayGioDen;
        }
        Chuyenbay.SanBayTG = sbtg;

        //hangve = [{MaHangGhe, TenHangGhe, HeSo, TongVe, VeDaBan }]
        let HangVes = await db.sequelize.query(
            '  SELECT  MaCTVe, chitiethangve.`MaHangGhe`, hangghe.TenHangGhe ,  hangghe.HeSo ,`TongVe`, `VeDaBan` FROM `chitiethangve`, hangghe WHERE chitiethangve.MaHangGhe = hangghe.MaHangGhe AND MaChuyenBay = :machuyenbay ',
            {
                replacements: {
                    machuyenbay: maChuyenBay,
                },
                type: QueryTypes.SELECT,
                raw: true,
            },
        );
        let tongGheTrong = 0;
        Chuyenbay.HangVe = [];
        for (var i in HangVes) {
            let hangve = {
                TenHangVe: HangVes[i].TenHangGhe,
                GiaTien: HangVes[i].HeSo * Chuyenbay.GiaVeCoBan, // = giavecoban*heso
                GheTrong: HangVes[i].TongVe - HangVes[i].VeDaBan,
            };
            tongGheTrong += hangve.GheTrong;
            Chuyenbay.HangVe.push(hangve);
        }
        Chuyenbay.GheTrong = tongGheTrong;

        let VeDaDats = [];
        // console.log(HangVe);
        for (var i in HangVes) {
            HangVes[i].GiaTien = parseInt(Chuyenbay.GiaVeCoBan) * parseFloat(HangVes[i].HeSo);

            let vedadat = await db.sequelize.query(
                '  SELECT MaVe, ve.MaHK, hanhkhach.HoTen, `MaVe`, ve.MaMocHanhLy as MocHanhLy,GioiTinh ,`GiaVe`, NgaySinh, MaHoaDon FROM `ve` , mochanhly , hanhkhach WHERE ve.MaMocHanhLy = mochanhly.MaMocHanhLy AND ve.MaHK = hanhkhach.MaHK AND MaCTVe = :mactve ',
                {
                    replacements: {
                        mactve: HangVes[i].MaCTVe,
                    },
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            for (var j in vedadat) {
                vedadat[j].HanhKhach = {};
                let NgaySinh = formatDateTime(vedadat[j].NgaySinh);
                vedadat[j].HanhKhach = {
                    MaHK: vedadat[j].MaHK,
                    GioiTinh: vedadat[j].GioiTinh,
                    HoTen: vedadat[j].HoTen,
                    NgaySinh: {
                        Ngay: NgaySinh.Ngay,
                        Thang: NgaySinh.Thang,
                        Nam: NgaySinh.Nam,
                    },
                };

                let NguoiLienHe = await db.HoaDon.findOne(
                    {
                        attributes: ['SDT', 'HoTen', 'Email', 'NgayGioThanhToan'],
                        where: {
                            MaHoaDon: vedadat[j].MaHoaDon,
                        },
                    },
                    { raw: true },
                );
                let ngaygioThanhToan = NguoiLienHe.NgayGioThanhToan;
                delete NguoiLienHe.NgayGioThanhToan;

                vedadat[j].NguoiLienHe = NguoiLienHe;
                console.log();

                if (ngaygioThanhToan) {
                    let ngaydat = formatDateTime(ngaygioThanhToan);
                    vedadat[j].ThoiGianThanhToan = {
                        GioThanhToan: {
                            Gio: ngaydat.Gio,
                            Phut: ngaydat.Phut,
                        },
                        NgayThanhToan: {
                            Ngay: ngaydat.Ngay,
                            Thang: ngaydat.Thang,
                            Nam: ngaydat.Nam,
                        },
                    };
                } else {
                    vedadat[j].ThoiGianThanhToan = {
                        GioThanhToan: {
                            Gio: -1,
                            Phut: -1,
                        },
                        NgayThanhToan: {
                            Ngay: -1,
                            Thang: -1,
                            Nam: -1,
                        },
                    };
                }

                vedadat[j].MaVeHienThi = maChuyenBayHienThi + vedadat[j].MaVe;

                delete vedadat[j].MaHK;
                delete vedadat[j].GioiTinh;
                delete vedadat[j].HoTen;
                delete vedadat[j].NgaySinh;
            }
            if (vedadat) VeDaDats = VeDaDats.concat(vedadat);
        }
        Chuyenbay.VeDaDat = VeDaDats;

        Chuyenbay.SanBayDi = await getInfoSanBay(Chuyenbay.MaSanBayDi);
        Chuyenbay.SanBayDen = await getInfoSanBay(Chuyenbay.MaSanBayDen);

        let thoiGianDi = formatDateTime(Chuyenbay.NgayGio);
        (Chuyenbay.ThoiGianDi = {
            GioDi: {
                Gio: thoiGianDi.Gio,
                Phut: thoiGianDi.Phut,
            },
            NgayDi: {
                Ngay: thoiGianDi.Ngay,
                Thang: thoiGianDi.Thang,
                Nam: thoiGianDi.Nam,
            },
        }),
            delete Chuyenbay.NgayGio;
        delete Chuyenbay.MaSanBayDi;
        delete Chuyenbay.MaSanBayDen;

        console.log(Chuyenbay);
        return res.send(JSON.stringify(Chuyenbay));
    } catch (error) {
        console.log(error);
        return {};
    }
};
//#endregion

//#region axios filter chuyenbay
//data_send = {
//     MaChuyenBay: '',
//     MaSanBayDi: '',
//     MaSanBayDen: '',
//     MaHangGhe: '',
//     GheTrong: '',
//     NgayKhoiHanh: {Ngay: , Thang: , Nam:},
//     GioKhoiHanh: {Gio: , Phut:},
//     GiaVeCoBan: -1,
//     TrangThai: ''
// }

//data_res = [{
//     MaChuyenBay,
//     MaHienThi,
//     GheTrong,
//     GiaVeCoBan,
//     SoDiemDung,
//     TrangThai,
//     KhoiHanh: {
//         NgayDi: {Ngay, Thang, Nam},
//         GioDi: {Gio, Phut}
//     },
//     SanBayDi: {
//         MaSanBay,
//         TenSanBay,
//         TinhThanh,
//     }
//     SanBayDen: {
//         MaSanBay,
//         TenSanBay,
//         TinhThanh,
//     }
//     HangGhe: [{
//         MaHangGhe,
//         TenHangGhe,
//         HeSo,
//     }]
// }]

let filterFlight = async (req, res) => {
    try {
        let form_data = { ...req.body };

        form_data.GioKhoiHanh = JSON.parse(form_data.GioKhoiHanh);
        let chuyenbays;
        if (typeof form_data.GioKhoiHanh.Gio !== 'undefined' && parseInt(form_data.GioKhoiHanh.Gio) !== -1) {
            //
            chuyenbays = await db.sequelize.query(
                'SELECT `MaChuyenBay`, `MaSanBayDi`, `MaSanBayDen`, `NgayGio`, `ThoiGianBay`, `GiaVeCoBan`, `DoanhThu`, `TrangThai`, `createdAt`, `updatedAt` FROM `chuyenbay` WHERE HOUR(NgayGio) > :gio OR( HOUR(NgayGio) = :gio AND MINUTE(NgayGio) >= :phut)',
                {
                    replacements: {
                        gio: form_data.GioKhoiHanh.Gio,
                        phut: form_data.GioKhoiHanh.Phut,
                    },
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
        } else {
            chuyenbays = await db.ChuyenBay.findAll({
                raw: true,
            });
        }

        //#region Lọc lại chuyến bay
        for (var i in chuyenbays) {
            let ghetrong = await db.ChiTietHangVe.findAll({
                attributes: ['TongVe', 'VeDaBan', 'MaHangGhe'],
                where: {
                    MaChuyenBay: chuyenbays[i].MaChuyenBay,
                },
                raw: true,
            });

            chuyenbays[i].GheTrong = 0;
            chuyenbays[i].MaHangGhe = [];
            if (ghetrong) {
                ghetrong.forEach((element) => {
                    chuyenbays[i].GheTrong = chuyenbays[i].GheTrong + element.TongVe - element.VeDaBan;
                    chuyenbays[i].MaHangGhe.push(element.MaHangGhe);
                });
            }
        }

        if (typeof form_data.MaChuyenBay !== 'undefined' && form_data.MaChuyenBay !== '') {
            chuyenbays = chuyenbays.filter((item, index) => {
                return item.MaChuyenBay === parseInt(form_data.MaChuyenBay);
            });
        }

        if (typeof form_data.MaSanBayDi !== 'undefined' && form_data.MaSanBayDi !== '') {
            chuyenbays = chuyenbays.filter((item, index) => {
                return item.MaSanBayDi === form_data.MaSanBayDi;
            });
        }

        if (typeof form_data.MaSanBayDen !== 'undefined' && form_data.MaSanBayDen !== '') {
            chuyenbays = chuyenbays.filter((item, index) => {
                return item.MaSanBayDen === form_data.MaSanBayDen;
            });
        }

        if (typeof form_data.GiaVeCoBan !== 'undefined' && parseInt(form_data.GiaVeCoBan) !== -1) {
            chuyenbays = chuyenbays.filter((item, index) => {
                return item.GiaVeCoBan <= parseInt(form_data.GiaVeCoBan);
            });
        }

        if (typeof form_data.GheTrong !== 'undefined' && parseInt(form_data.GheTrong) !== -1) {
            chuyenbays = chuyenbays.filter((item, index) => {
                return item.GheTrong <= parseInt(form_data.GheTrong);
            });
        }

        form_data.NgayKhoiHanh = JSON.parse(form_data.NgayKhoiHanh);
        if (typeof form_data.NgayKhoiHanh.Ngay !== 'undefined' && parseInt(form_data.NgayKhoiHanh.Ngay) !== -1) {
            let strDate =
                form_data.NgayKhoiHanh.Nam + '-' + form_data.NgayKhoiHanh.Thang + '-' + form_data.NgayKhoiHanh.Ngay;
            let date = new Date(strDate);
            chuyenbays = chuyenbays.filter((item, index) => {
                return item.NgayGio >= date;
            });
        }

        if (typeof form_data.TrangThai !== 'undefined' && form_data.TrangThai !== '') {
            chuyenbays = chuyenbays.filter((item, index) => {
                return item.TrangThai === form_data.TrangThai;
            });
        }

        if (typeof form_data.MaHangGhe !== 'undefined' && form_data.MaHangGhe !== '') {
            for (var i in chuyenbays) {
                let find_mahangghe = chuyenbays[i].MaHangGhe.find((element) => {
                    return element === form_data.MaHangGhe;
                });
                if (find_mahangghe) {
                    chuyenbays[i].MaHangGhe = find_mahangghe;
                } else {
                    chuyenbays[i].MaHangGhe = '';
                }
                chuyenbays = chuyenbays.filter((item, index) => {
                    return item.MaHangGhe !== '';
                });
            }
        }
        //#endregion

        //#region Add thêm thông tin
        for (var i in chuyenbays) {
            delete chuyenbays[i].createdAt;
            delete chuyenbays[i].updatedAt;
            delete chuyenbays[i].DoanhThu;

            //Ma Hien Thi
            chuyenbays[i].MaHienThi =
                chuyenbays[i].MaSanBayDi + '-' + chuyenbays[i].MaSanBayDen + '-' + chuyenbays[i].MaChuyenBay;

            chuyenbays[i].SanBayDi = await getInfoSanBay(chuyenbays[i].MaSanBayDi);
            chuyenbays[i].SanBayDen = await getInfoSanBay(chuyenbays[i].MaSanBayDen);
            chuyenbays[i].HangGhe = await getInfoHangGhe(chuyenbays[i].MaChuyenBay);

            //so diem dung
            let sbtg = await db.sequelize.query(
                'SELECT `MaSBTG`, `ThuTu`, `NgayGioDen`, `ThoiGianDung`, `TenSanBay`, `TenTinhThanh`  FROM `chitietchuyenbay` , sanbay , tinhthanh WHERE chitietchuyenbay.MaSBTG = sanbay.MaSanBay AND sanbay.MaTinhThanh = tinhthanh.MaTinhThanh AND  MaChuyenBay = :machuyenbay',
                {
                    replacements: {
                        machuyenbay: chuyenbays[i].MaChuyenBay,
                    },
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            chuyenbays[i].SoDiemDung = sbtg.length;

            //format thoigian
            let thoigiandi_chuyenbay = new Date(chuyenbays[i].NgayGio);
            //thoigian di
            chuyenbays[i].KhoiHanh = {
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

            delete chuyenbays[i].MaSanBayDi;
            delete chuyenbays[i].MaSanBayDen;
            delete chuyenbays[i].MaHangGhe;
            delete chuyenbays[i].NgayGio;
            delete chuyenbays[i].ThoiGianBay;
        }
        //#endregion
        // console.log(chuyenbays);
        return res.send(JSON.stringify(chuyenbays));
    } catch (error) {
        console.log(error);
        return res.send([]);
    }
};

//#endregion

//#region func util
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
        include: [{ model: db.TinhThanh, attributes: ['TenTinhThanh'] }],
    });
    return {
        MaSanBay: sanbay.MaSanBay,
        TenSanBay: sanbay.TenSanBay,
        TinhThanh: sanbay.TinhThanh.TenTinhThanh,
    };
};

let getInfoHangGhe = async (machuyenbay) => {
    // SELECT  chitiethangve.`MaHangGhe`, hangghe.TenHangGhe, hangghe.HeSo FROM `chitiethangve` , hangghe WHERE chitiethangve.MaHangGhe = hangghe.MaHangGhe AND MaChuyenBay = 1
    let hangghe = await db.sequelize.query(
        ' SELECT  chitiethangve.`MaHangGhe`, hangghe.TenHangGhe, hangghe.HeSo FROM `chitiethangve` , hangghe WHERE chitiethangve.MaHangGhe = hangghe.MaHangGhe AND MaChuyenBay = :machuyenbay ',
        {
            replacements: {
                machuyenbay: machuyenbay,
            },
            type: QueryTypes.SELECT,
            raw: true,
        },
    );
    return hangghe;
};

let formatDateTime = (dateTime) => {
    let timeFormat = new Date(dateTime);

    return {
        Gio: timeFormat.getUTCHours(),
        Phut: timeFormat.getMinutes(),
        Ngay: timeFormat.getUTCDate(),
        Thang: timeFormat.getMonth() + 1,
        Nam: timeFormat.getFullYear(),
    };
};
//#endregion

module.exports = {
    fullSearch: fullSearch,
    toHoursAndMinutes: toHoursAndMinutes,
    GetInfoAllFlights: GetInfoAllFlights,
    filterFlight: filterFlight,
    getFlight: getFlight,
};
