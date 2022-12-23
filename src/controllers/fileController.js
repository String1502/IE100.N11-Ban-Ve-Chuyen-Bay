const fs = require('fs');
const path = require('path');
const reader = require('xlsx');
import db from '../models/index';
const { QueryTypes, where } = require('sequelize');

//get dateNow and timezone
const date = new Date();
const offset = date.getTimezoneOffset() / 60;

let addByExcel = async (req, res) => {
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
                await AddChuyenBay(chuyenbays[i]);
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
// let Chuyenbay = {
//     MaChuyenBayDi: '',
//     MaChuyenBayDen: '',
//     NgayGio: '',
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
//             NgayGioDen: '',
//             ThoiGianDung: -1,
//             GhiChu: '',
//         },
//     ],
//     Err: {

//     }
// };

// {
//     errNum: 1,
//     res_err: {
//       MaSanBayDi: 0,
//       MaSanBayDen: 1,
//       NgayGio: 0,
//       Sbtg_Max: 0,
//       GiaVe_Min: 0,
//       ThoiGianDung_Min: 0,
//       ThoiGianBay_Min: 0
//     }
//   }

// if(ChuyenBay err)
// res_err = {
//     Sbtg_Max: 0,
//     GiaVe_Min: 0,
//     NgayGio: 0,
//     ThoiGianDung_Min: 0,
//     ThoiGianBay_Min: 0,
// };

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
    };
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
    if (!check) {
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
    if (ChuyenBay.GiaVeCoBan < GiaVeCoBan_Min.GiaTri) {
        errNum++;
        res_err.GiaVe_Min = 1;
    }

    //check ngay gio bay
    let ThoiGianNhanLich_Min = thamso.find((item) => {
        return item.TenThamSo === 'ThoiGianNhanLich_Min';
    });
    let date = Date.now();
    date = new Date(date);
    let start = date.addDays(ThoiGianNhanLich_Min);
    if (ChuyenBay.NgayGio > start) {
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
    let tongTime = 0;
    for (var i in ChuyenBay.SBTG) {
        //check thoi gian dung toi thieu
        if (ChuyenBay.SBTG[i].ThoiGianDung < ThoiGianDungToiThieu.GiaTri) {
            errNum++;
            res_err.ThoiGianDung_Min = 1;
        }

        //check thoi gian bay
        if (!dateEnd_Sbtg_Prev) dateEnd_Sbtg_Prev = dateStart_ChuyenBay;
        else dateEnd_Sbtg_Prev = dateEnd_Sbtg;
        dateStart_Sbtg = ChuyenBay.SBTG[i].NgayGioDen;
        dateEnd_Sbtg = add_minutes(dateStart_Sbtg, ChuyenBay.SBTG[i].ThoiGianDung);

        //check  chuyenbay_start <  thoi gian den sbtg < chuyenbay_end
        if (ChuyenBay.SBTG[i].NgayGioDen <= dateStart_ChuyenBay || ChuyenBay.SBTG[i].NgayGioDen >= dateEnd_ChuyenBay) {
            errNum++;
            res_err.ThoiGianBay_Min = 1;
        }

        let ThoiGianBay = getMinDiff(dateEnd_Sbtg_Prev, dateStart_Sbtg);
        tongTime += ThoiGianBay;
        if (ThoiGianBay < ThoiGianBayToiThieu.GiaTri) {
            errNum++;
            res_err.ThoiGianBay_Min = 1;
        }
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
                ThoiGianBayToiThieu: ThoiGianBayToiThieu,
                ThoiGianDungToiThieu: ThoiGianDungToiThieu,
                SBTG_Max: Sbtg_Max,
                GiaVeCoBan_Min: GiaVeCoBan_Min,
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
            let sanbay = {
                MaSanBay: trunggian[0],
                ThuTu: Number(i) + 1,
                NgayGioDen: date,
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
    addByExcel: addByExcel,
    addByTay: addByTay,
};
