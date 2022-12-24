const fs = require('fs');
const path = require('path');
const reader = require('xlsx');
import db from '../models/index';
const { QueryTypes, where } = require('sequelize');

// let Chuyenbay = {
//     MaChuyenBayDi: '',
//     MaChuyenBayDen: '',
//     ThoiGianDi: { GioDi: { Gio: -1, Phut: -1 }, NgayDi: { Ngay: -1, Thang: -1, Nam: -1 } },
//     ThoiGianBay: -1,
//     GiaVeCoBan: -1,
//     HangGhe: [
//         {
//             MaHangGhe: '',
//             TongVe: '',
//         },
//     ],
//     SBTG: [
//         {
//             MaSanBay: '',
//             ThuTu: -1,
//             ThoiGianDen: { GioDen: { Gio: -1, Phut: -1 }, GioDen: { Ngay: -1, Thang: -1, Nam: -1 } },
//             ThoiGianDung: -1,
//             GhiChu: '',
//         },
//     ],
// };

// let err = {
//     errNum: 3,
//     res_err: {
//         MaSanBayDi: 0,
//         MaSanBayDen: 0,
//         NgayGio: 0, // 1 khi sai định dạng
//         Sbtg_Max: 0,
//         GiaVe_Min: 1, // 1 vé cơ bản < giá vé min
//         ThoiGianNhanLich_Min: 0, //Thời gian bay > now + nhận lịch min
//         GiaVeCoBan: 0, // 1 khi chứa ký tự
//         ThoiGianBayToiThieu: 0, //1 khi có khoảng thời gian bay giữa các sân bay lỗi
//         SBTG: [
//             {
//                 Thu Tu: 1, Thứ tự trong file excel
//                 MaSanBay: 0,
//                 ThoiGianDung: 0, // 1 khi thoigiandung_sbtg < tối thiểu
//                 NgayGioDen: 0, // 1 khi DateStart_ChuyenBay > ThoiGianDen_SBTG || DateEnd_ChuyenBay < ThoiGianDen_SBTG
//             },
//         ],
//         HangGhe: [
//             {
//                 MaHangGhe: 0,
//                 TongVe: 0,
//             },
//         ],
//     },
//     RowEx: 11,
// };

let res_excel = [
    {
        MaSanBayDi: 'DAD',
        MaSanBayDen: 'HA',
        NgayGio: '2022-12-31T07:30:00.000Z',
        ThoiGianBay: 180,
        GiaVeCoBan: 500000,
        HangGhe: [
            {
                MaHangGhe: 'Deluxe',
                TongVe: '60',
            },
            {
                MaHangGhe: 'Business',
                TongVe: '10',
            },
        ],
        SBTG: [
            {
                MaSanBay: 'PXU',
                ThuTu: 1,
                NgayGioDen: '2022-12-31T08:00:00.000Z',
                ThoiGianDung: '15',
                GhiChu: 'Note',
            },
            {
                MaSanBay: 'DAD',
                ThuTu: 2,
                NgayGioDen: '2022-12-31T08:45:00.000Z',
                ThoiGianDung: '15',
                GhiChu: 'Note',
            },
        ],
        RowEx: 10,
        errNum: 0,
    },
    {
        errNum: 3,
        res_err: {
            MaSanBayDi: 0,
            MaSanBayDen: 0,
            NgayGio: 0,
            Sbtg_Max: 0,
            GiaVe_Min: 1,
            ThoiGianDung_Min: 0,
            ThoiGianBay_Min: 1,
            SBTG: [
                {
                    MaSanBay: 0,
                    NgayDen: 0,
                    ThoiGianDung: 0,
                },
            ],
            HangGhe: [
                {
                    MaHangGhe: 0,
                    TongVe: 0,
                },
            ],
        },
        RowEx: 11,
    },
];

//get dateNow and timezone
const date = new Date();
const offset = date.getTimezoneOffset() / 60;

let getfromExcel = async (req, res) => {
    let data = [];

    try {
        //Doc lay data tu excel
        const file = reader.readFile('./src/public/temp/Demo.xlsx');

        //const file = reader.readFile(req.files);
        const worksheet = file.Sheets[file.SheetNames[0]];
        const arr = reader.utils.sheet_to_json(worksheet);
        let data = [];

        for (var i = 8; i < arr.length; i++) {
            if (!arr[i].__EMPTY_6) arr[i].__EMPTY_6 = undefined;
            arr[i].RowEx = i + 2;
            data.push(arr[i]);
        }

        let chuyenbays = [];
        for (var i in data) {
            let dataTemp = Object.values(data[i]);
            let Ngay = dataTemp[2].split('_');
            let Gio = dataTemp[3].split('_');
            let NgayBay = new Date(Ngay[2], Ngay[1] - 1, Ngay[0], Gio[0] - offset, Gio[1]);
            let hangghe = getHangGhe(dataTemp[6]);
            let sbtg = getSBTG(dataTemp[7]);

            let chuyenbay = {
                MaSanBayDi: dataTemp[0],
                MaSanBayDen: dataTemp[1],
                NgayGio: NgayBay,
                ThoiGianDi: {
                    GioDi: { Gio: Gio[0], Phut: Gio[1] },
                    NgayDi: { Ngay: Ngay[0], Thang: Ngay[1], Nam: Ngay[2] },
                },
                ThoiGianBay: dataTemp[5],
                GiaVeCoBan: dataTemp[4],
                HangGhe: hangghe,
                SBTG: sbtg,
                RowEx: dataTemp[8],
                errNum: 0,
            };
            chuyenbays.push(chuyenbay);
        }

        for (var i in chuyenbays) {
            let check = await checkChuyenBayValid(chuyenbays[i]);

            if (check.errNum !== 0) {
                check.RowEx = chuyenbays[i].RowEx;
                chuyenbays[i] = check;
            }
            //them nhung chuyen bay ko loi
            if (chuyenbays[i].errNum === 0) {
                // await AddChuyenBay(chuyenbays[i]);
            }
        }

        // var filePath = path.join(__dirname, '../pulibc/temp/Demo.xlsx');

        // fs.unlinkSync(filePath);

        return res.send(JSON.stringify(chuyenbays));
    } catch (error) {
        console.log(error);
        return res.send('fail');
    }
};

let addByExcel = async (req, res) => {
    let chuyenbays = req.body;
    try {
        for (var i in chuyenbays) {
            chuyenbays[i].NgayGio = new Date(
                chuyenbays[i].NgayKhoiHanh.Nam,
                chuyenbays[i].NgayKhoiHanh.Thang - 1,
                chuyenbays[i].NgayKhoiHanh.Ngay,
                chuyenbays[i].GioKhoiHanh.Gio - offset,
                chuyenbays[i].GioKhoiHanh.Phut,
            );
            chuyenbays[i].d = 1;
            for (var j in chuyenbays[i].SBTG) {
                data_send.SBTG[i].NgayGioDen = new Date(
                    chuyenbays[i].SBTG[j].NgayDen.Nam,
                    chuyenbays[i].SBTG[j].NgayDen.Thang - 1,
                    chuyenbays[i].SBTG[j].NgayDen.Ngay,
                    chuyenbays[i].SBTG[j].GioDen.Gio - offset,
                    chuyenbays[i].SBTG[j].GioDen.Phut,
                );
            }

            chuyenbays[i].HangGhe = chuyenbays[i].HangVe;

            await AddChuyenBay(chuyenbays[i]);
        }

        return res.send('true');
    } catch (error) {
        console.log(error);
        return res.send('false');
    }
};

//

// var data_demo = {
//     NgayKhoiHanh: { Ngay: 31, Thang: 12, Nam: 2022 },
//     GioKhoiHanh: { Gio: 7, Phut: 30 },
//     MaSanBayDi: 'SG',
//     MaSanBayDen: 'HA',
//     ThoiGianBay: 180,
//     GiaVeCoBan: 1000000,
//     ThoiGianBayToiThieu: -1,
//     ThoiGianDungToiThieu: -1,
//     SBTG_Max: -1,
//     GiaVeCoBan_Min: -1,
//     SBTG: [
//         {
//             ThuTu: 1,
//             MaSanBay: 'PXU',
//             NgayDen: { Ngay: 31, Thang: 12, Nam: 2022 },
//             GioDen: { Gio: 8, Phut: 0 },
//             ThoiGianDung: 15,
//             GhiChu: 'asdasdsa',
//         },
//         {
//             ThuTu: 2,
//             MaSanBay: 'DAD',
//             NgayDen: { Ngay: 31, Thang: 12, Nam: 2022 },
//             GioDen: { Gio: 8, Phut: 45 },
//             ThoiGianDung: 15,
//             GhiChu: '123zxc sdasd',
//         },
//     ],
//     HangVe: [
//         {
//             MaHangGhe: 'Deluxe',
//             TongVe: 50,
//         },
//     ],
// };
let addByTay = async (req, res) => {
    //format
    // let data_send = data_demo;
    let data_send = req.body;

    const date = new Date();
    const offset = date.getTimezoneOffset() / 60;

    data_send.NgayGio = new Date(
        data_send.NgayKhoiHanh.Nam,
        data_send.NgayKhoiHanh.Thang - 1,
        data_send.NgayKhoiHanh.Ngay,
        data_send.GioKhoiHanh.Gio - offset,
        data_send.GioKhoiHanh.Phut,
    );

    for (var i in data_send.SBTG) {
        data_send.SBTG[i].NgayGioDen = new Date(
            data_send.SBTG[i].NgayDen.Nam,
            data_send.SBTG[i].NgayDen.Thang - 1,
            data_send.SBTG[i].NgayDen.Ngay,
            data_send.SBTG[i].GioDen.Gio - offset,
            data_send.SBTG[i].GioDen.Phut,
        );
    }
    data_send.HangGhe = data_send.HangVe;

    //add
    let checkValid = await checkChuyenBayValid(data_send);
    if (checkValid.errNum === 0) {
        let check = await AddChuyenBay(data_send);
        if (check) return res.send('true');
        else return res.send('false');
    } else return res.send('false');
};
//

let checkChuyenBayValid = async (ChuyenBay) => {
    let errNum = 0;
    let res_err = {
        MaSanBayDi: 0,
        MaSanBayDen: 0,
        NgayGio: 0,
        Sbtg_Max: 0,
        GiaVe_Min: 0,
        ThoiGianDung_Min: 0,
        ThoiGianBay_Min: 0,
        ThoiGianNhanLich_Min: 0,
        HangGhe: [],
        SBTG: [],
    };

    for (var i in ChuyenBay.HangGhe) {
        //check Ma Hang ghe
        let checkHangGhe = await db.HangGhe.findOne({
            where: {
                MaHangGhe: ChuyenBay.HangGhe[i].MaHangGhe,
            },
            raw: true,
            logging: false,
        });

        if (!checkHangGhe) {
            errNum++;
            let hangghe = {
                ThuTu: i,
                MaHangGhe: 1,
                TongVe: 0,
            };
            res_err.HangGhe.push(hangghe);
        } else {
            let hangghe = {
                ThuTu: i,
                MaHangGhe: 0,
                TongVe: 0,
            };
            res_err.HangGhe.push(hangghe);
        }

        ///check tong ve > 0
        if (ChuyenBay.HangGhe[i].TongVe <= 0) {
            errNum++;
            res_err.HangGhe[i].TongVe = 1;
        } else {
            res_err.HangGhe[i].TongVe = 0;
        }
    }

    //check ma chuyen bay di, den
    let check = await db.SanBay.findOne({
        where: {
            MaSanBay: ChuyenBay.MaSanBayDi,
        },
        logging: false,
    });
    if (!check) {
        errNum++;
        res_err.MaSanBayDi = 1;
    }

    check = await db.SanBay.findOne({
        where: {
            MaSanBay: ChuyenBay.MaSanBayDen,
        },
        logging: false,
    });
    if (!check || ChuyenBay.MaSanBayDi === ChuyenBay.MaSanBayDen) {
        errNum++;
        res_err.MaSanBayDen = 1;
    }

    let thamso = await db.ThamSo.findAll({
        raw: true,
        logging: false,
    });
    //     thời gian khởi hành  x
    // thời gian bay tối thiểu  x
    // thời gian dừng tối thiểu x
    // sbtg_max                 x
    // giá vé cơ bản tối thiểu  x

    //check thoigianbay
    // let ThoiGianBayToiThieu = thamso.find((item) => {
    //     return item.TenThamSo === 'ThoiGianBayToiThieu';
    // });
    // if (ChuyenBay.ThoiGianBay < ThoiGianBayToiThieu.GiaTri) return 1;

    //check sum sbtg
    let sbtg_max = thamso.find((item) => {
        return item.TenThamSo === 'SBTG_Max';
    });
    if (ChuyenBay.SBTG.length > sbtg_max.GiaTri) {
        errNum++;
        res_err.Sbtg_Max = 1;
    }

    //check gia ve min
    let GiaVeCoBan_Min = thamso.find((item) => {
        return item.TenThamSo === 'GiaVeCoBan_Min';
    });
    if (!parseInt(ChuyenBay.GiaVeCoBan)) {
        errNum++;
        res_err.GiaVe = 1;
    } else if (ChuyenBay.GiaVeCoBan < GiaVeCoBan_Min.GiaTri) {
        errNum++;
        res_err.GiaVe_Min = 1;
    }

    //check ngay gio bay
    let ThoiGianNhanLich_Min = thamso.find((item) => {
        return item.TenThamSo === 'ThoiGianNhanLich_Min';
    });
    let date = Date.now();
    date = new Date(date);

    let start = date.addDays(ThoiGianNhanLich_Min.GiaTri);

    if (!isNaN(ChuyenBay.NgayGio.getTime())) {
        if (ChuyenBay.NgayGio < start) {
            errNum++;
            res_err.ThoiGianNhanLich_Min = 1;
        }
    } else {
        errNum++;
        res_err.NgayGio = 1;
    }

    //check thoi gian dung
    let dateStart_ChuyenBay = ChuyenBay.NgayGio;
    let dateEnd_ChuyenBay = add_minutes(dateStart_ChuyenBay, ChuyenBay.ThoiGianBay);

    let dateStart_Sbtg, dateEnd_Sbtg, thoigianbay, dateEnd_Sbtg_Prev;
    //Thoi gian bay tu Begin ->  sbtg1 -> sbtg2 -> .... -> sbtgn
    let ThoiGianDungToiThieu = thamso.find((item) => {
        return item.TenThamSo === 'ThoiGianDungToiThieu';
    });
    let ThoiGianBayToiThieu = thamso.find((item) => {
        return item.TenThamSo === 'ThoiGianBayToiThieu';
    });
    if (ChuyenBay.ThoiGianBay < ThoiGianBayToiThieu.GiaTri) {
        errNum++;
        res_err.ThoiGianBay_Min = 1;
    }

    let arrMaSanBay = [];
    arrMaSanBay.push(ChuyenBay.MaSanBayDi);
    arrMaSanBay.push(ChuyenBay.MaSanBayDen);

    let tongTime = 0;
    for (var i in ChuyenBay.SBTG) {
        let errSBTG = {
            ThuTu: i,
            MaSanBay: 0,
            ThoiGianDung: 0,
            NgayGioDen: 0,
        };
        // check MaSanBay
        let check = await db.SanBay.findOne({
            where: {
                MaSanBay: ChuyenBay.MaSanBayDi,
            },
            logging: false,
        });
        if (!check) {
            errNum++;
            errSBTG.MaSanBay = 1;
        }
        let found = arrMaSanBay.find((item) => {
            return item === ChuyenBay.SBTG[i].MaSanBay;
        });

        if (found) {
            errNum++;
            errSBTG.MaSanBay = 1;
        } else arrMaSanBay.push(ChuyenBay.SBTG[i].MaSanBay);

        //check thoi gian dung toi thieu
        if (ChuyenBay.SBTG[i].ThoiGianDung < ThoiGianDungToiThieu.GiaTri) {
            errNum++;
            errSBTG.MaSanBay = 1;
        }

        //check thoi gian bay
        if (!dateEnd_Sbtg_Prev) dateEnd_Sbtg_Prev = dateStart_ChuyenBay;
        else dateEnd_Sbtg_Prev = dateEnd_Sbtg;
        dateStart_Sbtg = ChuyenBay.SBTG[i].NgayGioDen;
        dateEnd_Sbtg = add_minutes(dateStart_Sbtg, ChuyenBay.SBTG[i].ThoiGianDung);

        //check  chuyenbay_start <  thoi gian den sbtg < chuyenbay_end
        if (ChuyenBay.SBTG[i].NgayGioDen <= dateStart_ChuyenBay || ChuyenBay.SBTG[i].NgayGioDen >= dateEnd_ChuyenBay) {
            errNum++;
            errSBTG.NgayGioDen = 1;
        }

        let ThoiGianBay = getMinDiff(dateEnd_Sbtg_Prev, dateStart_Sbtg);
        tongTime += ThoiGianBay;
        if (ThoiGianBay < ThoiGianBayToiThieu.GiaTri) {
            errNum++;
            res_err.ThoiGianBay_Min = 1;
        }

        res_err.SBTG.push(errSBTG);
    }
    //Thoi gian bay tu stgbn -> End chuyen bay
    if (ChuyenBay.SBTG.length !== 0) {
        dateEnd_Sbtg_Prev = dateEnd_Sbtg;
        dateStart_Sbtg = ChuyenBay.SBTG[ChuyenBay.SBTG.length - 1].NgayGioDen;
        dateEnd_Sbtg = add_minutes(dateStart_Sbtg, ChuyenBay.SBTG[ChuyenBay.SBTG.length - 1].ThoiGianDung);
        let ThoiGianBay = getMinDiff(dateEnd_Sbtg_Prev, dateEnd_ChuyenBay);
        tongTime += ThoiGianBay;
        if (ThoiGianBay < ThoiGianBayToiThieu.GiaTri) {
            errNum++;
            res_err.ThoiGianBay_Min = 1;
        }
    }

    return { errNum, res_err };
};

// let chuyenbay = {
//     MaSanBayDi: dataTemp[0],
//     MaSanBayDen: dataTemp[1],
//     NgayGio: NgayBay,
//     ThoiGianBay: dataTemp[5],
//     GiaVeCoBan: dataTemp[4],
//     HangGhe: [
//         {
//             MaHangGhe: '',
//             TongVe: '',
//         },
//     ],
//     SBTG: [
//         {
//             MaSanBay: '',
//             ThuTu: -1,
//             NgayGioDen: '',
//             ThoiGianDung: -1,
//             GhiChu: '',
//         },
//     ],
//     RowEx: dataTemp[8],
//     errNum: 0,
// };

let AddChuyenBay = async (item) => {
    try {
        let thamso = await db.ThamSo.findAll({ raw: true, logging: false });

        // ThoiGianBayToiThieu: -1,
        //     ThoiGianDungToiThieu: -1,
        //     SBTG_Max: -1,
        //     GiaVeCoBan_Min: -1,
        let Sbtg_Max = thamso.find((item) => {
            return item.TenThamSo === 'GiaVeCoBan_Min';
        });
        let ThoiGianBayToiThieu = thamso.find((item) => {
            return item.TenThamSo === 'GiaVeCoBan_Min';
        });
        let ThoiGianDungToiThieu = thamso.find((item) => {
            return item.TenThamSo === 'GiaVeCoBan_Min';
        });
        let GiaVeCoBan_Min = thamso.find((item) => {
            return item.TenThamSo === 'GiaVeCoBan_Min';
        });

        //save chuyenbay
        let ChuyenBay = await db.ChuyenBay.create(
            {
                MaSanBayDi: item.MaSanBayDi,
                MaSanBayDen: item.MaSanBayDen,
                NgayGio: item.NgayGio,
                ThoiGianBay: item.ThoiGianBay,
                GiaVeCoBan: item.GiaVeCoBan,
                DoanhThu: 0,
                TrangThai: 'ChuaKhoiHanh',
                ThoiGianBayToiThieu: ThoiGianBayToiThieu.GiaTri,
                ThoiGianDungToiThieu: ThoiGianDungToiThieu.GiaTri,
                SBTG_Max: Sbtg_Max.GiaTri,
                GiaVeCoBan_Min: GiaVeCoBan_Min.GiaTri,
            },
            { logging: false },
        );
        await ChuyenBay.save({ logging: false });

        //save cac hang ghe
        for (var i in item.HangGhe) {
            let HangGhe = await db.ChiTietHangVe.create(
                {
                    MaChuyenBay: ChuyenBay.MaChuyenBay,
                    MaHangGhe: item.HangGhe[i].MaHangGhe,
                    TongVe: item.HangGhe[i].TongVe,
                    VeDaBan: 0,
                },
                { logging: false },
            );
            HangGhe.save();
        }

        //save chi tiet chuyen bay
        for (var i in item.SBTG) {
            let sbtg = await db.ChiTietChuyenBay.create(
                {
                    MaChuyenBay: ChuyenBay.MaChuyenBay,
                    MaSBTG: item.SBTG[i].MaSanBay,
                    ThuTu: item.SBTG[i].ThuTu,
                    NgayGioDen: item.SBTG[i].NgayGioDen,
                    ThoiGianDung: item.SBTG[i].ThoiGianDung,
                    GhiChu: item.SBTG[i].GhiChu,
                },
                { logging: false },
            );

            sbtg.save();
        }
        return 1;
    } catch (error) {
        console.log(error);
        return 0;
    }
};

let convertToDate = (stringNgay, stringGio) => {};

let getSBTG = (stringSBTG) => {
    let sbtg = [];
    const day = new Date();
    const offset = day.getTimezoneOffset() / 60;

    if (stringSBTG) {
        let array = stringSBTG.split('-');
        for (var i in array) {
            let trunggian = array[i].split('_');
            var ngay = trunggian[2].split('/');
            var gio = trunggian[3].split(':');
            var date = new Date(ngay[2], ngay[1] - 1, ngay[0], gio[0] - offset, gio[1]);
            //ThoiGianDen: { GioDen: { Gio: -1, Phut: -1 }, GioDen: { Ngay: -1, Thang: -1, Nam: -1 } },
            let sanbay = {
                MaSanBay: trunggian[0],
                ThuTu: Number(i) + 1,
                NgayGioDen: date,
                ThoiGianDen: {
                    GioDen: { Gio: gio[0], Phut: gio[1] },
                    NgayDen: { Ngay: ngay[0], Thang: ngay[1], Nam: ngay[2] },
                },
                ThoiGianDung: trunggian[1],
                GhiChu: trunggian[4],
            };
            sbtg.push(sanbay);
        }
    }
    return sbtg;
};

let getHangGhe = (stringHangGhe) => {
    let hangghes = [];
    if (stringHangGhe) {
        let array = stringHangGhe.split('-');

        for (var i in array) {
            let hangghe = array[i].split('_');
            hangghe = {
                MaHangGhe: hangghe[0],
                TongVe: hangghe[1],
            };
            hangghes.push(hangghe);
        }
    }
    return hangghes;
};

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
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

module.exports = {
    getfromExcel: getfromExcel,
    addByExcel: addByExcel,
    addByTay: addByTay,
};
