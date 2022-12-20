import { raw } from 'body-parser';
import db, { sequelize } from '../models/index';
import { dateIsValid } from '../public/javascript/start';
const { QueryTypes } = require('sequelize');

class QuyDinhController {
    // 'staff/QuyDinh'
    async Regulations(req, res) {
        try {
            let MaUser = req.signedCookies.MaUser;
            let Users = await db.sequelize.query(
                'select user.`MaUser` from user, phanquyen where user.MaChucVu=phanquyen.MaChucVu and phanquyen.MaQuyen = 4',
                { type: QueryTypes.SELECT, raw: true },
            );

            let HienThi = 'd-none';
            for (let i = 0; i < Users.length; i++) {
                console.log(Users[i].MaUser);
                if (Users[i].MaUser == MaUser) {
                    HienThi = '';
                    break;
                }
            }
            let ThamSos = await db.sequelize.query('select TenThamSo, TenHienThi, NgayHieuLuc , GiaTri from thamso', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let SanBays = await db.sequelize.query('select MaSanBay , TenSanBay, TrangThai, MaTinhThanh from sanbay', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let TinhThanhs = await db.sequelize.query('select MaTinhThanh , TenTinhThanh from tinhthanh', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let HangGhes = await db.sequelize.query('select MaHangGhe , TenHangGhe, HeSo, TrangThai from hangghe', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let LoaiKhachHangs = await db.sequelize.query(
                'select MaLoaiKhach as MaLoaiKhachHang, TenLoai as TenLoaiKhachHang, SoTuoiToiThieu,SoTuoiToiDa, HeSo from loaikhachhang',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            let MocHanhLys = await db.sequelize.query('select MaMocHanhLy, SoKgToiDa ,GiaTien from mochanhly', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            for (let i = 0; i < SanBays.length; i++) {
                SanBays[i].TinhThanhs = structuredClone(TinhThanhs);
                SanBays[i].TinhThanhs = TinhThanhs;
            }
            return res.render('staff/QuyDinh', {
                layout: 'staff.handlebars',
                ThamSos: ThamSos,
                SanBays: SanBays,
                TinhThanhs: TinhThanhs,
                HangGhes: HangGhes,
                LoaiKhachHangs: LoaiKhachHangs,
                MocHanhLys: MocHanhLys,
                HienThi: HienThi,
            });
        } catch (error) {
            console.log(error);
        }
    }
    // Load màn hình quy định
    async LoadRegulation(req, res) {
        try {
            let Package = {};
            let ThamSos = await db.sequelize.query('select TenThamSo, TenHienThi, NgayHieuLuc , GiaTri from thamso', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let SanBays = await db.sequelize.query('select MaSanBay , TenSanBay, TrangThai, MaTinhThanh from sanbay', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let TinhThanhs = await db.sequelize.query('select MaTinhThanh , TenTinhThanh from tinhthanh', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let HangGhes = await db.sequelize.query('select MaHangGhe , TenHangGhe, HeSo, TrangThai from hangghe', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let LoaiKhachHangs = await db.sequelize.query(
                'select MaLoaiKhach as MaLoaiKhachHang, TenLoai as TenLoaiKhachHang, SoTuoiToiThieu, SoTuoiToiDa, HeSo from loaikhachhang',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            let MocHanhLys = await db.sequelize.query('select MaMocHanhLy, SoKgToiDa, GiaTien from mochanhly', {
                type: QueryTypes.SELECT,
                raw: true,
            });

            let ChuyenBays = await sequelize.query(
                'select MaChuyenBay, MaSanBayDi,	MaSanBayDen	, NgayGio	, ThoiGianBay , GiaVeCoBan , DoanhThu,TrangThai, ThoiGianBayToiThieu, ThoiGianDungToiThieu, SBTG_Max, GiaVeCoBan_Min from chuyenbay',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            for (let i = 0; i < ChuyenBays.length; i++) {
                let ChiTietChuyenBays = await sequelize.query(
                    "select MaCTCB,	MaChuyenBay,	MaSBTG	,ThuTu	,NgayGioDen ,ThoiGianDung from chitietchuyenbay where MaChuyenBay = '" +
                        ChuyenBays[i].MaChuyenBay +
                        "'",
                    {
                        type: QueryTypes.SELECT,
                        raw: true,
                    },
                );
                ChuyenBays[i].SBTG_Max_check = ChiTietChuyenBays.length;
                if (ChiTietChuyenBays.length == 0) {
                    ChuyenBays[i].ThoiGianBay_check = ChuyenBays[i].ThoiGianBay;
                    continue;
                }
                ChuyenBays[i].ThoiGianDung_check = ChiTietChuyenBays[0].ThoiGianDung;
                for (let j = 0; j < ChiTietChuyenBays.length; j++) {
                    ChuyenBays[i].ThoiGianDung_check = Math.min(
                        ChuyenBays[i].ThoiGianDung_check,
                        ChiTietChuyenBays[j].ThoiGianDung,
                    );
                    if (j == 0) {
                        ChuyenBays[i].ThoiGianBay_check = parseFloat(
                            (ChiTietChuyenBays[j].NgayGioDen.getTime() - ChuyenBays[i].NgayGio.getTime()) / 60000,
                        );
                    } else {
                        ChuyenBays[i].ThoiGianBay_check = Math.min(
                            ChuyenBays[i].ThoiGianBay_check,
                            parseFloat(
                                (ChiTietChuyenBays[j].NgayGioDen.getTime() -
                                    ChiTietChuyenBays[j - 1].NgayGioDen.getTime()) /
                                    60000 -
                                    ChiTietChuyenBays[j - 1].ThoiGianDung,
                            ),
                        );
                    }
                }
            }
            Package.ThamSos = structuredClone(ThamSos);
            Package.SanBays = structuredClone(SanBays);
            Package.TinhThanhs = structuredClone(TinhThanhs);
            Package.HangGhes = structuredClone(HangGhes);
            Package.LoaiKhachHangs = structuredClone(LoaiKhachHangs);
            Package.MocHanhLys = structuredClone(MocHanhLys);
            Package.ChuyenBays = structuredClone(ChuyenBays);
            return res.send(Package);
        } catch (error) {
            console.log(error);
        }
    }
    // cập nhật tham số
    async UpdateThamSo(req, res) {
        try {
            let P_ThamSo = req.body.P_ThamSo;
            let U_ThamSo = await db.ThamSo.findAll({});
            for (let i = 0; i < U_ThamSo.length; i++) {
                await U_ThamSo[i].set({
                    GiaTri: parseInt(P_ThamSo[i].GiaTri),
                    NgayHieuLuc: P_ThamSo[i].NgayHieuLuc,
                });
                await U_ThamSo[i].save();
            }
            let CBVP = req.body.CBVP;
            let o = 0;
            let ChuyenBay = await db.ChuyenBay.findAll();
            for (let i = 0; i < ChuyenBay.length; i++) {
                if (ChuyenBay[i]._previousDataValues.MaChuyenBay == CBVP[o]) {
                    await ChuyenBay[i].set({
                        TrangThai: 'ViPhamQuyDinh',
                    });
                    await ChuyenBay[i].save();
                    o++;
                } else {
                    let dateThoiGianBayToiThieu = new Date(P_ThamSo[5].NgayHieuLuc);
                    let dateThoiGianDungToiThieu = new Date(P_ThamSo[8].NgayHieuLuc);
                    let dateSBTG = new Date(P_ThamSo[4].NgayHieuLuc);
                    let dateGiaVeCoBan = new Date(P_ThamSo[1].NgayHieuLuc);
                    let date = new Date(ChuyenBay[i]._previousDataValues.NgayGio);
                    if (date.getTime() > dateThoiGianBayToiThieu.getTime()) {
                        await ChuyenBay[i].set({
                            TrangThai: 'ChuaKhoiHanh',
                            ThoiGianBayToiThieu: P_ThamSo[5].GiaTri,
                        });
                        await ChuyenBay[i].save();
                    }
                    if (date.getTime() > dateGiaVeCoBan.getTime()) {
                        await ChuyenBay[i].set({
                            TrangThai: 'ChuaKhoiHanh',
                            GiaVeCoBan_Min: P_ThamSo[1].GiaTri,
                        });
                        await ChuyenBay[i].save();
                    }
                    if (date.getTime() > dateSBTG.getTime()) {
                        await ChuyenBay[i].set({
                            TrangThai: 'ChuaKhoiHanh',
                            SBTG_Max: P_ThamSo[4].GiaTri,
                        });
                        await ChuyenBay[i].save();
                    }
                    if (date.getTime() > dateThoiGianDungToiThieu.getTime()) {
                        await ChuyenBay[i].set({
                            TrangThai: 'ChuaKhoiHanh',
                            ThoiGianDungToiThieu: P_ThamSo[8].GiaTri,
                        });
                        await ChuyenBay[i].save();
                    }
                }
            }
            return res.send(U_ThamSo);
        } catch (error) {
            console.log(error);
        }
    }

    //cập nhật sân bay
    async UpdateSanBay(req, res) {
        try {
            let SanBay_P = req.body;
            let SanBay_U = SanBay_P.SanBays_P_Update;
            let SanBay_A = SanBay_P.SanBays_P_Add;
            let SanBay = await db.SanBay.findAll({});
            for (let i = 0; i < SanBay_U.length; i++) {
                if (SanBay_U[i].ID_Update == 1) {
                    await SanBay[i].set({
                        TenSanBay: SanBay_U[i].TenSanBay,
                        MaTinhThanh: SanBay_U[i].MaTinhThanh,
                        TrangThai: SanBay_U[i].TrangThai,
                    });
                    await SanBay[i].save();
                }
            }
            console.log(SanBay_A);
            for (let i = 0; i < SanBay_A.length; i++) {
                await db.SanBay.create({
                    MaSanBay: SanBay_A[i].MaSanBay,
                    TenSanBay: SanBay_A[i].TenSanBay,
                    MaTinhThanh: SanBay_A[i].MaTinhThanh,
                    TrangThai: SanBay_A[i].TrangThai,
                });
            }
            let Package = [];
            let SanBays = await db.sequelize.query('select MaSanBay , TenSanBay, TrangThai, MaTinhThanh from sanbay', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            Package = structuredClone(SanBays);
            return res.send(Package);
        } catch (error) {
            console.log(error);
        }
    }

    // cập nhật hạng ghế
    async UpdateHangGhe(req, res) {
        try {
            let HangGhe_P = req.body;
            let HangGhe_U = HangGhe_P.HangGhes_P_Update;
            let HangGhe_A = HangGhe_P.HangGhes_P_Add;
            let HangGhe = await db.HangGhe.findAll({});
            for (let i = 0; i < HangGhe_U.length; i++) {
                if (HangGhe_U[i].ID_Update == 1) {
                    await HangGhe[i].set({
                        TenHangGhe: HangGhe_U[i].TenHangGhe,
                        HeSo: HangGhe_U[i].HeSo,
                        TrangThai: HangGhe_U[i].TrangThai,
                    });
                    await HangGhe[i].save();
                }
            }
            for (let i = 0; i < HangGhe_A.length; i++) {
                await db.HangGhe.create({
                    MaHangGhe: HangGhe_A[i].MaHangGhe,
                    TenHangGhe: HangGhe_A[i].TenHangGhe,
                    HeSo: HangGhe_A[i].HeSo,
                    TrangThai: HangGhe_A[i].TrangThai,
                });
            }
            let Package = [];

            let HangGhes = await db.sequelize.query('select MaHangGhe , TenHangGhe, HeSo , TrangThai from HangGhe', {
                type: QueryTypes.SELECT,
                raw: true,
            });

            Package = structuredClone(HangGhes);
            return res.send(Package);
        } catch (error) {
            console.log(error);
        }
    }

    // cập nhật loại khách hàng
    async UpdateLoaiKhachHang(req, res) {
        try {
            let LoaiKhachHang_P = req.body;
            let LoaiKhachHang_U = LoaiKhachHang_P.LoaiKhachHangs_P_Update;
            let LoaiKhachHang_A = LoaiKhachHang_P.LoaiKhachHangs_P_Add;
            let LoaiKhachHang = await db.LoaiKhachHang.findAll({});
            for (let i = 0; i < LoaiKhachHang_U.length; i++) {
                if (LoaiKhachHang_U[i].ID_Update == 1) {
                    await LoaiKhachHang[i].set({
                        TenLoai: LoaiKhachHang_U[i].TenLoaiKhachHang,
                        SoTuoiToiDa: LoaiKhachHang_U[i].SoTuoiToiDa,
                        SoTuoiToiThieu: LoaiKhachHang_U[i].SoTuoiToiThieu,
                        HeSo: LoaiKhachHang_U[i].HeSo,
                    });
                    await LoaiKhachHang[i].save();
                }
            }
            for (let i = 0; i < LoaiKhachHang_A.length; i++) {
                await db.LoaiKhachHang.create({
                    TenLoai: LoaiKhachHang_A[i].TenLoaiKhachHang,
                    SoTuoiToiDa: LoaiKhachHang_A[i].SoTuoiToiDa,
                    SoTuoiToiThieu: LoaiKhachHang_A[i].SoTuoiToiThieu,
                    HeSo: LoaiKhachHang_A[i].HeSo,
                });
            }
            let Package = [];

            let LoaiKhachHangs = await db.sequelize.query(
                'select MaLoaiKhach as MaLoaiKhachHang, TenLoai as TenLoaiKhachHang, SoTuoiToiThieu,SoTuoiToiDa, HeSo from loaikhachhang',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            Package = structuredClone(LoaiKhachHangs);
            return res.send(Package);
        } catch (error) {
            console.log(error);
        }
    }

    // cập nhật mốc hành lý
    async UpdateMocHanhLy(req, res) {
        try {
            let MocHanhLy_P = req.body;
            let MocHanhLy_U = MocHanhLy_P.MocHanhLys_P_Update;
            let MocHanhLy_A = MocHanhLy_P.MocHanhLys_P_Add;
            let MocHanhLy = await db.MocHanhLy.findAll({});
            for (let i = 0; i < MocHanhLy_U.length; i++) {
                if (MocHanhLy_U[i].ID_Update == 1) {
                    await MocHanhLy[i].set({
                        SoKgToiDa: MocHanhLy_U[i].SoKgToiDa,
                        GiaTien: MocHanhLy_U[i].GiaTien,
                    });
                    await MocHanhLy[i].save();
                }
            }
            for (let i = 0; i < MocHanhLy_A.length; i++) {
                await db.MocHanhLy.create({
                    SoKgToiDa: MocHanhLy_A[i].SoKgToiDa,
                    GiaTien: MocHanhLy_A[i].GiaTien,
                });
            }
            let Package = [];

            let MocHanhLys = await db.sequelize.query('select MaMocHanhLy, SoKgToiDa, GiaTien from mochanhly', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            Package = structuredClone(MocHanhLys);
            return res.send(Package);
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new QuyDinhController();
