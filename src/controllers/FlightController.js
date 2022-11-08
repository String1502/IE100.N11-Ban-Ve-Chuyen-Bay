import db from '../models/index';
const { QueryTypes, where } = require('sequelize');

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
//     ThoiGianBay: { Gio: -1, Phut: -1 },
//     SoDiemDung: -1,
//     GiaVe: -1,
//     ChanBay: [
//         {
//             ThoiGianDen: { GioDen: { Gio: -1, Phut: -1 },
//             NgayDen: { Ngay: -1, Thang: -1, Nam: -1 } },
//             SanBayDen: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
//             ThoiGianDung_SanBayDen: { Gio: -1, Phut: -1 },
//         },
//     ],
// }]

let fullSearch = async (req, res) => {
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
        console.log(list_ChuyenBaySuit);
        return res.send(JSON.stringify(list_ChuyenBaySuit));
    } catch (error) {
        console.log(error);
    }
};

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

        if (checkChuyenBay[0].TongVe - checkChuyenBay[0].VeDaBan < form_data.songuoi) {
            list_ChuyenBaySuit.splice(i, 1);
        }
    }
    //tim sanbay trung gian + conver time
    for (var i = 0; i < list_ChuyenBaySuit.length; i++) {
        //sbtg
        let chanbay = {};
        //get chan bay theo ma chuyen bay
        chanbay = await db.sequelize.query(
            'SELECT `MaSBTG`, `ThuTu`, `NgayGioDen`, `ThoiGianDung`, `TenSanBay`, `TenTinhThanh`  FROM `chitietchuyenbay` , sanbay , tinhthanh WHERE chitietchuyenbay.MaSBTG = sanbay.MaSanBay AND sanbay.MaTinhThanh = tinhthanh.MaTinhThanh AND  MaChuyenBay = :machuyenbay',
            {
                replacements: {
                    machuyenbay: list_ChuyenBaySuit[i].MaChuyenBay,
                },
                type: QueryTypes.SELECT,
                raw: true,
            },
        );
        //format data
        for (var j = 0; j < chanbay.length; j++) {
            let dateObject = new Date(chanbay[i].NgayGioDen);
            chanbay[j] = {
                ThuTu: chanbay[j].ThuTu,
                SanBayDen: {
                    MaSanBay: chanbay[j].MaSBTG,
                    TenSanBay: chanbay[j].TenSanBay,
                    TinhThanh: chanbay[j].TenTinhThanh,
                },
                ThoiGianDen: {
                    GioDi: {
                        Gio: dateObject.getHours(),
                        Phut: dateObject.getMinutes(),
                    },
                    NgayDi: {
                        Ngay: dateObject.getDate(),
                        Thang: dateObject.getMonth() + 1,
                        Nam: dateObject.getFullYear(),
                    },
                },
                ThoiGianDung_SanBayDen: toHoursAndMinutes(chanbay[j].ThoiGianDung),
            };
        }
        list_ChuyenBaySuit[i].ChanBay = chanbay;

        //convert
        let dateObject = Date.parse(list_ChuyenBaySuit[i].ThoiGianDi);
        dateObject = new Date(list_ChuyenBaySuit[i].ThoiGianDi);

        list_ChuyenBaySuit[i].ThoiGianDi = {
            GioDen: {
                Gio: dateObject.getHours(),
                Phut: dateObject.getMinutes(),
            },
            NgayDen: {
                Ngay: dateObject.getDate(),
                Thang: dateObject.getMonth() + 1,
                Nam: dateObject.getFullYear(),
            },
        };

        list_ChuyenBaySuit[i].ThoiGianBay = toHoursAndMinutes(list_ChuyenBaySuit[i].ThoiGianBay);
        //count chan bay
        list_ChuyenBaySuit[i].SoDiemDung = list_ChuyenBaySuit[i].ChanBay.length;
    }

    return list_ChuyenBaySuit;
};

let toHoursAndMinutes = (totalMinutes) => {
    totalMinutes = parseInt(totalMinutes);
    const Gio = Math.floor(totalMinutes / 60);
    const Phut = totalMinutes % 60;
    return { Gio, Phut };
};

module.exports = {
    fullSearch: fullSearch,
    toHoursAndMinutes: toHoursAndMinutes,
};
