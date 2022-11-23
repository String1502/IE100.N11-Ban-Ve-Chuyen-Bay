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

let generatePdf = async (MaHoaDon, PackageBooking) => {
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
    };

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
    data.SoTien = numberWithDot(TongTien.TongTien);

    for (var i in PackageBooking.HoaDon.HanhKhach) {
        let khach = {
            HoTen: PackageBooking.HoaDon.HanhKhach[i].HoTen,
            DoTuoi: PackageBooking.HoaDon.HanhKhach[i].TenLoai,
        };
        data.HanhKhach.push(khach);
    }

    for (var i in PackageBooking.MangChuyenBayTimKiem) {
        let chuyenbay = {
            MaChuyenBay: `${PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.SanBayDi.MaSanBay}-${PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.SanBayDen.MaSanBay}-${PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.MaChuyenBay}`,
            SanBayDi: PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.SanBayDi.TenSanBay,
            SanBayDen: PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.SanBayDen.TenSanBay,
            KhoiHanh: {
                Gio: PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianDi.GioDi.Gio,
                Phut: PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianDi.GioDi.Phut,
                Ngay: PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianDi.NgayDi.Ngay,
                Thang: PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianDi.NgayDi.Thang,
                Nam: PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianDi.NgayDi.Nam,
            },
            Den: {
                Gio: PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianDen.GioDen.Gio,
                Phut: PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianDen.GioDen.Phut,
                Ngay: PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianDen.NgayDen.Ngay,
                Thang: PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianDen.NgayDen.Thang,
                Nam: PackageBooking.MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianDen.NgayDen.Nam,
            },
            HanhLy: 30,
            BookingID: '',
        };
        chuyenbay.BookingID = `${MaHoaDon}-${chuyenbay.MaChuyenBay}`;
        data.ChuyenBay.push(chuyenbay);
    }

    let date = new Date(Date.now());
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

            await page.pdf({ path: `./src/public/temp/${filename}`, format: 'A3' });
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
};
