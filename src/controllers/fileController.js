const fs = require('fs');
const path = require('path');
const reader = require('xlsx');

let readExcel = async (req, res) => {
    let data = [];

    try {
        const file = reader.readFile('src/public/temp/Demo.xlsx');
        const worksheet = file.Sheets[file.SheetNames[0]];
        const arr = reader.utils.sheet_to_json(worksheet);
        let data = [];
        //Doc tu row 10 excel
        for (var i = 8; i < arr.length; i++) {
            data.push(arr[i]);
        }

        let chuyenbays = [];
        for (var i in data) {
            let dataTemp = Object.values(data[i]);
            let Ngay = dataTemp[2].split('_');
            let Gio = dataTemp[3].split('_');
            let NgayBay = new Date(Ngay[2], Ngay[1], Ngay[0], Gio[0], Gio[1]);
            let hangghe = getHangGhe(dataTemp[6]);
            let sbtg = getSBTG(dataTemp[7]);
            let chuyenbay = {
                MaChuyenBayDi: dataTemp[0],
                MaChuyenBayDen: dataTemp[1],
                NgayGio: NgayBay,
                ThoiGianBay: dataTemp[5],
                GiaVeCoBan: dataTemp[4],
                HangGhe: hangghe,
                SBTG: sbtg,
            };
            chuyenbays.push(chuyenbay);
        }

        return res.send(chuyenbays);
    } catch (error) {
        console.log(error);
        return res.send('false');
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
            var date = new Date(ngay[2], ngay[1], ngay[0], gio[0], gio[1]);
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

module.exports = {
    readExcel: readExcel,
};
