const fs = require('fs');
const path = require('path');
const utils = require('util');
const puppeteer = require('puppeteer');
const hb = require('handlebars');
const readFile = utils.promisify(fs.readFile);
import db from '../models/index';
const { QueryTypes } = require('sequelize');
import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
    today,
    onlyNumber,
    showToast,
} from '../public/javascript/start.js';

let getTemplateHtml = async () => {
    try {
        const invoicePath = path.resolve('./src/resources/views/pdfTemplate/template.html');
        return await readFile(invoicePath, 'utf8');
    } catch (err) {
        return Promise.reject('Could not load html template');
    }
};

let getReportTemplateHtml = async () => {
    try {
        const invoicePath = path.resolve('./src/resources/views/pdfTemplate/report-template.handlebars');
        return await readFile(invoicePath, 'utf8');
    } catch (err) {
        return Promise.reject('Could not load html template');
    }
};

const date = new Date();
const offset = date.getTimezoneOffset() / 60;

// data_html = {
//     NguoiLienHe: {
//         HoTen: '',
//         SDT: '',
//         Email: ''
//     },
//     HangGhe: {
//         MaHangGhe: '',
//         TenHangGhe: '',
//     },
//     SoTien: '',
//     HanhKhach: [{
//         HoTen: '',
//         DoTuoi: '',
//     }],
//     ChuyenBay: [{
// MaChuyenBay: ,
// SanBayDi: ,
// SanBayDen: ,
// KhoiHanh: {
//     Gio,
//     Phut,
//     Ngay,
//     Thang,
//     Nam,
// },
// Den: {
//     Gio,
//     Phut,
//     Ngay,
//     Thang,
//     Nam,
// },,
// HanhLy: -1,
// BookingID: '',
//     }]
// }

let generatePdf = async (MaHoaDon, PackageBooking, MaHTTT) => {
    let data = {
        MaHoaDon: '',
        ThoiGianThanhToan: '',
        NguoiLienHe: {
            HoTen: '',
            SDT: '',
            Email: '',
        },
        HangGhe: {
            MaHangGhe: '',
            TenHangGhe: '',
        },
        SoTien: '',
        ChuyenBay: [],
        TenHTTT: '',
    };

    data.MaHoaDon = PackageBooking.HoaDon.MaHoaDon;
    data.ThoiGianThanhToan = PackageBooking.HoaDon.ThoiGianThanhToan;
    let HTTT = await db.sequelize.query('SELECT * FROM htthanhtoan WHERE htthanhtoan.MaHTTT=:mahttt;', {
        replacements: {
            mahttt: MaHTTT,
        },
        type: QueryTypes.SELECT,
        raw: true,
    });
    data.TenHTTT = HTTT[0].Ten;

    data.NguoiLienHe.HoTen = PackageBooking.HoaDon.NguoiLienHe.HoTen;
    data.NguoiLienHe.SDT = PackageBooking.HoaDon.NguoiLienHe.SDT;
    data.NguoiLienHe.Email = PackageBooking.HoaDon.NguoiLienHe.Email;

    data.HangGhe.MaHangGhe = PackageBooking.HoaDon.MaHangGhe;
    let TenHangGhe = await db.HangGhe.findOne(
        {
            where: {
                MaHangGhe: PackageBooking.HoaDon.MaHangGhe,
            },
        },
        { raw: true },
    );
    data.HangGhe.TenHangGhe = TenHangGhe.TenHangGhe;

    let TongTien = await db.HoaDon.findOne({
        where: {
            MaHoaDon: MaHoaDon,
        },
    });
    data.SoTien = numberWithDot(TongTien.TongTien) + ' VND';

    for (var i in PackageBooking.ChuyenBayDaChon) {
        var KhoiHanh = new Date(PackageBooking.ChuyenBayDaChon[i].ChuyenBay.NgayGio);
        KhoiHanh = new Date(KhoiHanh.getTime() + offset * 60 * 60 * 1000);
        var Den = new Date(KhoiHanh.getTime() + PackageBooking.ChuyenBayDaChon[i].ChuyenBay.ThoiGianBay * 60000);

        let chuyenbay = {
            ThuTu: PackageBooking.ChuyenBayDaChon[i].ThuTu,
            MaChuyenBay: `${PackageBooking.ChuyenBayDaChon[i].SanBayDi.MaSanBay}-${PackageBooking.ChuyenBayDaChon[i].SanBayDen.MaSanBay}-${PackageBooking.ChuyenBayDaChon[i].ChuyenBay.MaChuyenBay}`,
            SanBayDi: PackageBooking.ChuyenBayDaChon[i].SanBayDi.TenSanBay,
            SanBayDen: PackageBooking.ChuyenBayDaChon[i].SanBayDen.TenSanBay,
            KhoiHanh: {
                Gio: numberSmallerTen(KhoiHanh.getHours()),
                Phut: numberSmallerTen(KhoiHanh.getMinutes()),
                Ngay: numberSmallerTen(KhoiHanh.getDate()),
                Thang: numberSmallerTen(KhoiHanh.getMonth() + 1),
                Nam: KhoiHanh.getFullYear(),
            },
            Den: {
                Gio: numberSmallerTen(Den.getHours()),
                Phut: numberSmallerTen(Den.getMinutes()),
                Ngay: numberSmallerTen(Den.getDate()),
                Thang: numberSmallerTen(Den.getMonth() + 1),
                Nam: Den.getFullYear(),
            },
            BookingID: '',
            HanhKhach: structuredClone(PackageBooking.ChuyenBayDaChon[i].HanhKhach),
        };
        chuyenbay.BookingID = `${MaHoaDon}-${chuyenbay.MaChuyenBay}`;
        data.ChuyenBay.push(chuyenbay);
    }

    // SELECT  chitiethangve.MaChuyenBay, mochanhly.SoKgToiDa FROM `hoadon`, ve, mochanhly , chitiethangve WHERE hoadon.MaHoaDon = ve.MaHoaDon AND ve.MaMocHanhLy = mochanhly.MaMocHanhLy AND ve.MaCTVe = chitiethangve.MaCTVe AND chitiethangve.MaChuyenBay = 1 AND hoadon.MaHoaDon = 46 GROUP BY chitiethangve.MaChuyenBay

    let date = new Date();
    const filename = `[${date.toDateString()}].[${MaHoaDon}-${data.HangGhe.MaHangGhe}].pdf`;
    await getTemplateHtml()
        .then(async (call) => {
            // Now we have the html code of our template in res object
            // you can check by logging it on console
            // console.log(res)
            const template = hb.compile(call, { strict: true });
            // we have compile our code with handlebars
            const result = template(data);
            // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
            const html = result;
            // we are using headless mode
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            // We set the page content as the generated html by handlebars
            await page.setContent(html);
            // We use pdf function to generate the pdf in the same folder as this file.

            await page.pdf({ path: `./src/public/temp/${filename}`, format: 'A4' });
            await browser.close();
            console.log('PDF Generated');
        })
        .catch((err) => {
            console.error(err);
            return 'fail';
        });

    return {
        status: 'ok',
        filename: filename,
    };
};

let generateReportPdf = async (data) => {
    console.log(data);
    const filename = `report-${data.Year}.pdf`;

    await getReportTemplateHtml()
        .then(async (call) => {
            // Now we have the html code of our template in res object
            // you can check by logging it on console
            // console.log(res)
            // console.log(call);
            const template = hb.compile(call, { strict: true });
            // we have compile our code with handlebars
            const result = template(data);
            // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
            const html = result;
            // we are using headless mode
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            // We set the page content as the generated html by handlebars
            await page.setContent(html);
            // We use pdf function to generate the pdf in the same folder as this file.

            await page.pdf({ path: `./src/public/temp/${filename}`, format: 'A4' });
            await browser.close();
            console.log('PDF Generated');
        })
        .catch((err) => {
            console.error(err);
            return 'fail';
        });

    return {
        status: 'ok',
        filename: filename,
    };
};

module.exports = {
    generatePdf: generatePdf,
    generateReportPdf: generateReportPdf,
};
