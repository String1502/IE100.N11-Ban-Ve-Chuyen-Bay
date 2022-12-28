const fs = require('fs');
const path = require('path');
const utils = require('util');
const puppeteer = require('puppeteer');
const hb = require('handlebars');
const readFile = utils.promisify(fs.readFile);
import db from '../models/index';
const { QueryTypes } = require('sequelize');

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
        HanhKhach: [],
        ChuyenBay: [],
        TenHTTT: '',
    };

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

    for (var i in PackageBooking.HoaDon.HanhKhach) {
        let khach = {
            HoTen: PackageBooking.HoaDon.HanhKhach[i].HoTen,
            DoTuoi: PackageBooking.HoaDon.HanhKhach[i].TenLoai,
        };
        data.HanhKhach.push(khach);
    }

    for (var i in PackageBooking.ChuyenBayDaChon) {
        let HanhLy = await db.sequelize.query(
            'SELECT SUM(mochanhly.SoKgToiDa) as TongKg FROM `hoadon`, ve, mochanhly , chitiethangve WHERE hoadon.MaHoaDon = ve.MaHoaDon AND ve.MaMocHanhLy = mochanhly.MaMocHanhLy AND ve.MaCTVe = chitiethangve.MaCTVe AND chitiethangve.MaChuyenBay = :machuyenbay AND hoadon.MaHoaDon = :mahoadon GROUP BY chitiethangve.MaChuyenBay',
            {
                replacements: {
                    machuyenbay: PackageBooking.ChuyenBayDaChon[i].ChuyenBay.MaChuyenBay,
                    mahoadon: MaHoaDon,
                },
                type: QueryTypes.SELECT,
                raw: true,
            },
        );

        var KhoiHanh = new Date(PackageBooking.ChuyenBayDaChon[i].ChuyenBay.NgayGio);
        var Den = new Date(KhoiHanh.getTime() + PackageBooking.ChuyenBayDaChon[i].ChuyenBay.ThoiGianBay * 60000);

        let chuyenbay = {
            MaChuyenBay: `${PackageBooking.ChuyenBayDaChon[i].SanBayDi.MaSanBay}-${PackageBooking.ChuyenBayDaChon[i].SanBayDen.MaSanBay}-${PackageBooking.ChuyenBayDaChon[i].ChuyenBay.MaChuyenBay}`,
            SanBayDi: PackageBooking.ChuyenBayDaChon[i].SanBayDi.TenSanBay,
            SanBayDen: PackageBooking.ChuyenBayDaChon[i].SanBayDen.TenSanBay,
            KhoiHanh: {
                Gio: KhoiHanh.getHours(),
                Phut: KhoiHanh.getMinutes(),
                Ngay: KhoiHanh.getDate(),
                Thang: KhoiHanh.getMonth() + 1,
                Nam: KhoiHanh.getFullYear(),
            },
            Den: {
                Gio: Den.getHours(),
                Phut: Den.getMinutes(),
                Ngay: Den.getDate(),
                Thang: Den.getMonth() + 1,
                Nam: Den.getFullYear(),
            },
            HanhLy: HanhLy[0].TongKg,
            BookingID: '',
        };
        chuyenbay.BookingID = `${MaHoaDon}-${chuyenbay.MaChuyenBay}`;
        data.ChuyenBay.push(chuyenbay);
    }

    // SELECT  chitiethangve.MaChuyenBay, mochanhly.SoKgToiDa FROM `hoadon`, ve, mochanhly , chitiethangve WHERE hoadon.MaHoaDon = ve.MaHoaDon AND ve.MaMocHanhLy = mochanhly.MaMocHanhLy AND ve.MaCTVe = chitiethangve.MaCTVe AND chitiethangve.MaChuyenBay = 1 AND hoadon.MaHoaDon = 46 GROUP BY chitiethangve.MaChuyenBay

    let date = new Date();
    const filename = `[${date.toDateString()}].[Deluxe-${MaHoaDon}].pdf`;
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

let numberWithDot = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

module.exports = {
    generatePdf: generatePdf,
    generateReportPdf: generateReportPdf,
};
