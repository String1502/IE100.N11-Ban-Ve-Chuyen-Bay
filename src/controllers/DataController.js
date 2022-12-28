import db from '../models/index';
const { QueryTypes, where } = require('sequelize');

const timeUpdate = 2000; //ms

const date = new Date();
const offset = date.getTimezoneOffset() / 60;

const cancelHoaDon = 15000;

const updateData = setInterval(async function () {
    await updateChuyenBay();
    await DoanhThuNam();
    await HuyHoaDon();
}, timeUpdate);

let updateChuyenBay = async () => {
    let ChuyenBays = await db.ChuyenBay.findAll({
        where: {
            TrangThai: 'ChuaKhoiHanh',
        },
        logging: false,
    });
    let dateNow = new Date();
    dateNow = new Date(dateNow.getTime() - offset * 60 * 60 * 1000);
    for (var i in ChuyenBays) {
        if (ChuyenBays[i].NgayGio <= dateNow) {
            ChuyenBays[i].TrangThai = 'DaKhoiHanh';
            await ChuyenBays[i].save({ logging: false });
        }
    }
};

let DoanhThuNam = async () => {
    let DoanhThuNams = await db.sequelize.query('SELECT DISTINCT YEAR(NgayGio) as Nam FROM chuyenbay', {
        type: QueryTypes.SELECT,
        raw: true,
        logging: false,
    });

    for (var i in DoanhThuNams) {
        let DtNam = await db.DoanhThuNam.findOne({
            where: {
                Nam: DoanhThuNams[i].Nam,
            },
            logging: false,
        });

        // Chua co thi tao
        if (!DtNam) {
            DtNam = await db.DoanhThuNam.create(
                {
                    Nam: DoanhThuNams[i].Nam,
                    SoChuyenBay: 0,
                    DoanhThu: 0,
                },
                { logging: false },
            );
            await DtNam.save({ logging: false });
        }

        //update doanh thu thang
        await DoanhThuThang(DoanhThuNams[i].Nam);

        //update DoanhThuNam
        let DoanhThuThangs = await db.DoanhThuThang.findAll({
            where: {
                Nam: DoanhThuNams[i].Nam,
            },
            logging: false,
            raw: true,
        });

        let tongDoanhThu = 0;
        let tongChuyenBay = 0;
        for (var j in DoanhThuThangs) {
            tongDoanhThu += DoanhThuThangs[j].DoanhThu;
            tongChuyenBay += DoanhThuThangs[j].SoChuyenBay;
        }
        DtNam.SoChuyenBay = tongChuyenBay;
        DtNam.DoanhThu = tongDoanhThu;
        await DtNam.save({ logging: false });
    }
};

let DoanhThuThang = async (Nam) => {
    // SELECT DISTINCT MONTH(NgayGio) FROM `chuyenbay` WHERE YEAR(NgayGio) = 2022
    let Thangs = await db.sequelize.query(
        'SELECT DISTINCT MONTH(NgayGio) as Thang FROM `chuyenbay` WHERE YEAR(NgayGio) = :nam',
        {
            replacements: {
                nam: Nam,
            },
            type: QueryTypes.SELECT,
            raw: true,
            logging: false,
        },
    );
    for (var i in Thangs) {
        let DtThang = await db.DoanhThuThang.findOne({
            where: {
                Thang: Thangs[i].Thang,
                Nam: Nam,
            },
            logging: false,
        });

        // Chua co thi tao
        if (!DtThang) {
            DtThang = await db.DoanhThuThang.create({
                Nam: Nam,
                Thang: Thangs[i].Thang,
                SoChuyenBay: 0,
                DoanhThu: 0,
            });
            await DtThang.save({ logging: false });
        }

        let ChuyenBayinThang = await db.sequelize.query(
            `SELECT SUM(DoanhThu) as TongDoanhThu, COUNT(DoanhThu) as SoChuyenBay from chuyenbay WHERE YEAR(NgayGio) = :nam AND MONTH(NgayGio)= :thang AND TrangThai='DaKhoiHanh'`,
            {
                replacements: {
                    nam: Nam,
                    thang: Thangs[i].Thang,
                },
                type: QueryTypes.SELECT,
                raw: true,
                logging: false,
            },
        );

        DtThang.DoanhThu = ChuyenBayinThang[0].TongDoanhThu > 0 ? ChuyenBayinThang[0].TongDoanhThu : 0;
        DtThang.SoChuyenBay = ChuyenBayinThang[0].SoChuyenBay;
        DtThang.save({ logging: false });
    }
};

let HuyHoaDon = async () => {
    let dateNow = new Date();
    dateNow = new Date(dateNow.getTime() - offset * 60 * 60 * 1000);
    let HoaDons = await db.HoaDon.findAll({
        where: {
            TrangThai: 'ChuaThanhToan',
        },
        logging: false,
    });

    for (var i in HoaDons) {
        var distance = dateNow.getTime() - HoaDons[i].NgayGioDat.getTime();
        if (distance >= cancelHoaDon) {
            HoaDons[i].TrangThai = 'DaHuy';
            await HoaDons[i].save({ logging: false });
        }
    }
};

module.exports = updateData;
