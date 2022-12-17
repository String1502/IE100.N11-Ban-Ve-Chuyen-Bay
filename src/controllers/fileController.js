const fs = require('fs');
const path = require('path');
const reader = require('xlsx');
import db from '../models/index';
const { QueryTypes, where } = require('sequelize');

let addByExcel = async (req, res) => {
    let data = [];

    try {
        //Doc lay data tu excel
        const file = reader.readFile('src/public/temp/Demo.xlsx');
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
            let NgayBay = new Date(Ngay[2], Ngay[1] - 1, Ngay[0], Gio[0], Gio[1]);
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
        return res.send(JSON.stringify(chuyenbays));
    } catch (error) {
        console.log(error);
        return res.send('fail');
    }
};

let addByCom = async (req, res) => {
    //format
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
    });
    if (!check) {
        errNum++;
        res_err.MaSanBayDi = 1;
    }

    check = await db.SanBay.findOne({
        where: {
            MaSanBay: ChuyenBay.MaSanBayDen,
        },
    });
    if (!check) {
        errNum++;
        res_err.MaSanBayDen = 1;
    }

    let thamso = await db.ThamSo.findAll({
        raw: true,
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

// var data_send = {
//     NgayKhoiHanh: { Ngay: -1, Thang: -1, Nam: -1 },
//     GioKhoiHanh: { Gio: -1, Phut: -1 },
//     ThoiGianBay: -1,
//     GiaVeCoBan: -1,
//     ThoiGianBayToiThieu: -1,
//     ThoiGianDungToiThieu: -1,
//     SBTG_Max: -1,
//     GiaVeCoBan_Min: -1,
//     SBTG: [
//         {
//             ThuTu: -1,
//             MaSanBay: '',
//             NgayDen: { Ngay: -1, Thang: -1, Nam: -1 },
//             GioDen: { Gio: -1, Phut: -1 },
//             ThoiGianDung: -1,
//             GhiChu: '',
//         },
//     ],
//     HangVe: [
//         {
//             MaHangGhe: '',
//             TongVe: -1,
//         },
//     ],
// };
let AddChuyenBay = async (item) => {
    try {
        let thamso = await db.ThamSo.findAll({ raw: true });

        //save chuyenbay
        let ChuyenBay = await db.ChuyenBay.create({
            MaSanBayDi: item.MaSanBayDi,
            MaSanBayDen: item.MaSanBayDen,
            NgayGio: item.NgayGio,
            ThoiGianBay: item.ThoiGianBay,
            GiaVeCoBan: item.GiaVeCoBan,
            DoanhThu: 0,
            TrangThai: 'ChuaKhoiHanh',
        });
        await ChuyenBay.save();

        //save cac hang ghe
        for (var i in item.HangGhe) {
            let HangGhe = await db.ChiTietHangVe.create({
                MaChuyenBay: ChuyenBay.MaChuyenBay,
                MaHangGhe: item.HangGhe[i].MaHangGhe,
                TongVe: item.HangGhe[i].TongVe,
                VeDaBan: 0,
            });
            HangGhe.save();
        }

        //save chi tiet chuyen bay
        for (var i in item.SBTG) {
            let sbtg = await db.ChiTietChuyenBay.create({
                MaChuyenBay: ChuyenBay.MaChuyenBay,
                MaSBTG: item.SBTG[i].MaSanBay,
                ThuTu: item.SBTG[i].ThuTu,
                NgayGioDen: item.SBTG[i].NgayGioDen,
                ThoiGianDung: item.SBTG[i].ThoiGianDung,
                GhiChu: item.SBTG[i].GhiChu,
            });

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
    if (stringSBTG) {
        let array = stringSBTG.split('-');
        for (var i in array) {
            let trunggian = array[i].split('_');
            var ngay = trunggian[2].split('/');
            var gio = trunggian[3].split(':');
            var date = new Date(ngay[2], ngay[1] - 1, ngay[0], gio[0], gio[1]);
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
};
