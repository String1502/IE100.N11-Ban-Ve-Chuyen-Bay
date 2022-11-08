import db from '../models/index';
const { QueryTypes } = require('sequelize');

class ClientController {
    // "/"
    async index(req, res) {
        let SanBays = [
            { MaSanBay: 'TSN', TenSanBay: 'Tân Sơn Nhất', TinhThanh: 'HCM' },
            { MaSanBay: 'DAD', TenSanBay: 'Haha', TinhThanh: 'Đà Nẵng' },
        ];
        let HangGhes = [{ MaHangGhe: 'Eco', TenHangGhe: 'Phổ thông' }];
        let HanhKhach_Max = 7;
        let ChuyenBay_Max = 5;
        try {
            return res.render('client/TraCuuChuyenBay', {
                layout: 'client.handlebars',
                SanBays: SanBays,
                HangGhes: HangGhes,
                HanhKhach_Max: HanhKhach_Max,
                ChuyenBay_Max: ChuyenBay_Max,
            });
        } catch (error) {
            console.log(error);
        }
    }

    // "/choose_flight"
    async choose_flight(req, res) {
        // From database
        let ChuyenBays = [
            {
                MaChuyenBay: '1',
                ThoiGianDi: { GioDi: { Gio: 1, Phut: 11 }, NgayDi: { Ngay: 1, Thang: 1, Nam: 2023 } },
                SanBayDi: { MaSanBay: 'TSN', TenSanBay: 'Tân Sơn Nhất', TinhThanh: 'HCM' },
                ThoiGianDen: { GioDen: { Gio: 12, Phut: 12 }, NgayDen: { Ngay: 2, Thang: 1, Nam: 2023 } },
                SanBayDen: { MaSanBay: 'DAD', TenSanBay: 'Tân Sơn Nhì', TinhThanh: 'Đà Nẵng' },
                ThoiGianBay: { Gio: 25, Phut: 1 },
                SoDiemDung: 1,
                GiaVe: 500000,
                ChanBay: [
                    {
                        ThoiGianDi: { GioDi: { Gio: 11, Phut: 11 }, NgayDi: { Ngay: 1, Thang: 1, Nam: 2023 } },
                        SanBayDi: { MaSanBay: 'TSN', TenSanBay: 'Tân Sơn Nhất', TinhThanh: 'HCM' },
                        ThoiGianDen: { GioDen: { Gio: 6, Phut: 6 }, NgayDen: { Ngay: 2, Thang: 1, Nam: 2023 } },
                        SanBayDen: { MaSanBay: 'DAD', TenSanBay: 'Tân Sơn Nhì', TinhThanh: 'Đà Nẵng' },
                        ThoiGianBay: { Gio: 5, Phut: 5 },
                        ThoiGianDung_SanBayDen: { Gio: 0, Phut: 30 },
                    },
                    {
                        ThoiGianDi: { GioDi: { Gio: 11, Phut: 11 }, NgayDi: { Ngay: 2, Thang: 1, Nam: 2023 } },
                        SanBayDi: { MaSanBay: 'TSN', TenSanBay: 'Tân Sơn Nhất', TinhThanh: 'HCM' },
                        ThoiGianDen: { GioDen: { Gio: 12, Phut: 12 }, NgayDen: { Ngay: 2, Thang: 1, Nam: 2023 } },
                        SanBayDen: { MaSanBay: 'DAD', TenSanBay: 'Tân Sơn Nhì', TinhThanh: 'Đà Nẵng' },
                        ThoiGianBay: { Gio: 1, Phut: 1 },
                        ThoiGianDung_SanBayDen: { Gio: 0, Phut: 0 },
                    },
                ],
            },
        ];

        // Req.body
        let MangChuyenBayTimKiem = JSON.parse(req.body.MangChuyenBay);
        let HangGhe = JSON.parse(req.body.HangGhe);
        let HanhKhach = JSON.parse(req.body.HanhKhach);
        for (let i = 0; i < MangChuyenBayTimKiem.length; i++) {
            MangChuyenBayTimKiem[i]['ThuTu'] = i + 1;
            MangChuyenBayTimKiem[i]['ChuyenBayDaChon'] = [
                {
                    MaChuyenBay: '',
                    ThoiGianDi: { GioDi: { Gio: -1, Phut: -1 }, NgayDi: { Ngay: -1, Thang: -1, Nam: -1 } },
                    SanBayDi: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
                    ThoiGianDen: { GioDen: { Gio: -1, Phut: -1 }, NgayDen: { Ngay: -1, Thang: -1, Nam: -1 } },
                    SanBayDen: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
                    ThoiGianBay: { Gio: -1, Phut: -1 },
                    SoDiemDung: -1,
                    GiaVe: -1,
                    ChanBay: [
                        {
                            ThoiGianDi: { GioDi: { Gio: -1, Phut: -1 }, NgayDi: { Ngay: -1, Thang: -1, Nam: -1 } },
                            SanBayDi: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
                            ThoiGianDen: { GioDen: { Gio: -1, Phut: -1 }, NgayDen: { Ngay: -1, Thang: -1, Nam: -1 } },
                            SanBayDen: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
                            ThoiGianBay: { Gio: -1, Phut: -1 },
                            ThoiGianDung_SanBayDen: { Gio: -1, Phut: -1 },
                        },
                    ],
                },
            ];
        }

        try {
            return res.render('client/ChonChuyenBay', {
                layout: 'client.handlebars',
                MangChuyenBayTimKiem: MangChuyenBayTimKiem,
                ChuyenBays: ChuyenBays,
                HangGhe: HangGhe,
                HanhKhach: HanhKhach,
            });
        } catch (error) {
            console.log(error);
        }
    }

    // "/pre-booking"
    async prebooking(req, res) {
        try {
            return res.render('client/TomTatTruocDat', {
                layout: 'client.handlebars',
            });
        } catch (error) {
            console.log(error);
        }
    }

    async booking(req, res) {
        try {
            return res.render('client/DienThongTin', {
                layout: 'client.handlebars',
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new ClientController();
