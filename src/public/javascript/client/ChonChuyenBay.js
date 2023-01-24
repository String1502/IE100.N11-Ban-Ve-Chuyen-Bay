import { numberWithDot, numberWithoutDot, numberSmallerTen, openLoader, closeLoader } from '../start.js';

axios({
    method: 'post',
    url: '/hoadon/XoaCookieMaHangVe',
}).then((res) => {});

// #region Bộ lọc
// Add event bộ lọc điểm dừng
const BoLoc_DiemDung = document.getElementById('BoLoc_DiemDung');
if (BoLoc_DiemDung) {
    // Bay thẳng
    document.getElementById('BoLoc_DiemDung_BayThang').addEventListener('click', (e) => {
        document.getElementById('BoLoc_DiemDung_1DiemDung').checked = false;
        document.getElementById('BoLoc_DiemDung_Hon2DiemDung').checked = false;
        XuLyCacBoLoc();
    });
    // 1 điểm dừng
    document.getElementById('BoLoc_DiemDung_1DiemDung').addEventListener('click', (e) => {
        document.getElementById('BoLoc_DiemDung_BayThang').checked = false;
        document.getElementById('BoLoc_DiemDung_Hon2DiemDung').checked = false;
        XuLyCacBoLoc();
    });
    // 2 điểm dừng
    document.getElementById('BoLoc_DiemDung_Hon2DiemDung').addEventListener('click', (e) => {
        document.getElementById('BoLoc_DiemDung_BayThang').checked = false;
        document.getElementById('BoLoc_DiemDung_1DiemDung').checked = false;
        XuLyCacBoLoc();
    });
    // thời gian dừng range
    document.getElementById('BoLoc_DiemDung_ThoiGianDung_Range').addEventListener('change', (e) => {
        document.getElementById('BoLoc_DiemDung_ThoiGianDung').innerText = numberSmallerTen(e.target.value) + ' h';
    });
}

// Add event bộ lọc thời gian bay
const BoLoc_ThoiGianBay = document.getElementById('BoLoc_ThoiGianBay');
if (BoLoc_ThoiGianBay) {
    // Cất cánh sáng sớm
    document.getElementById('BoLoc_ThoiGianBay_CatCanh_SangSom').addEventListener('click', (e) => {
        document.getElementById('BoLoc_ThoiGianBay_CatCanh_Sang').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_CatCanh_Chieu').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_CatCanh_Toi').checked = false;
        XuLyCacBoLoc();
    });
    // Cất cánh sáng
    document.getElementById('BoLoc_ThoiGianBay_CatCanh_Sang').addEventListener('click', (e) => {
        document.getElementById('BoLoc_ThoiGianBay_CatCanh_SangSom').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_CatCanh_Chieu').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_CatCanh_Toi').checked = false;
        XuLyCacBoLoc();
    });
    // Cất cánh chiều
    document.getElementById('BoLoc_ThoiGianBay_CatCanh_Chieu').addEventListener('click', (e) => {
        document.getElementById('BoLoc_ThoiGianBay_CatCanh_Sang').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_CatCanh_SangSom').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_CatCanh_Toi').checked = false;
        XuLyCacBoLoc();
    });
    // Cất cánh tối
    document.getElementById('BoLoc_ThoiGianBay_CatCanh_Toi').addEventListener('click', (e) => {
        document.getElementById('BoLoc_ThoiGianBay_CatCanh_Sang').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_CatCanh_SangSom').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_CatCanh_Chieu').checked = false;

        XuLyCacBoLoc();
    });

    // Hạ cánh sáng sớm
    document.getElementById('BoLoc_ThoiGianBay_HaCanh_SangSom').addEventListener('click', (e) => {
        document.getElementById('BoLoc_ThoiGianBay_HaCanh_Sang').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_HaCanh_Chieu').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_HaCanh_Toi').checked = false;
        XuLyCacBoLoc();
    });
    // Hạ cánh sáng
    document.getElementById('BoLoc_ThoiGianBay_HaCanh_Sang').addEventListener('click', (e) => {
        document.getElementById('BoLoc_ThoiGianBay_HaCanh_SangSom').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_HaCanh_Chieu').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_HaCanh_Toi').checked = false;
        XuLyCacBoLoc();
    });
    // Hạ cánh chiều
    document.getElementById('BoLoc_ThoiGianBay_HaCanh_Chieu').addEventListener('click', (e) => {
        document.getElementById('BoLoc_ThoiGianBay_HaCanh_SangSom').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_HaCanh_Sang').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_HaCanh_Toi').checked = false;
        XuLyCacBoLoc();
    });
    // Hạ cánh tối
    document.getElementById('BoLoc_ThoiGianBay_HaCanh_Toi').addEventListener('click', (e) => {
        document.getElementById('BoLoc_ThoiGianBay_HaCanh_SangSom').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_HaCanh_Sang').checked = false;
        document.getElementById('BoLoc_ThoiGianBay_HaCanh_Chieu').checked = false;
        XuLyCacBoLoc();
    });

    // thời gian bay range
    document.getElementById('BoLoc_ThoiGianBay_ThoiGianBay_Range').addEventListener('change', (e) => {
        document.getElementById('BoLoc_ThoiGianBay_ThoiGianBay').innerText = numberSmallerTen(e.target.value) + ' h';
        XuLyCacBoLoc();
    });
}

// Add event bộ lọc thêm
const BoLoc_Them = document.getElementById('BoLoc_Them');
if (BoLoc_Them) {
    // giá vé range
    document.getElementById('BoLoc_ThemBoLoc_GiaVe_Range').addEventListener('change', (e) => {
        document.getElementById('BoLoc_ThemBoLoc_GiaVe').innerText = numberWithDot(e.target.value) + ' VND';
        XuLyCacBoLoc();
    });
}

// Add event sắp xếp
const BoLoc_SapXep = document.getElementById('BoLoc_SapXep');
if (BoLoc_SapXep) {
    // Giá thấp nhất
    document.getElementById('BoLoc_SapXep_GiaThapNhat').addEventListener('click', (e) => {
        if (!e.target.checked) return;
        XuLyCacBoLoc();
    });
    // Cất cánh sớm nhất
    document.getElementById('BoLoc_SapXep_CatCanhSomNhat').addEventListener('click', (e) => {
        if (!e.target.checked) return;
        XuLyCacBoLoc();
    });
    // Cất cánh muộn nhất
    document.getElementById('BoLoc_SapXep_CatCanhMuonNhat').addEventListener('click', (e) => {
        if (!e.target.checked) return;
        XuLyCacBoLoc();
    });
    // Hạ cánh sớm nhất
    document.getElementById('BoLoc_SapXep_HaCanhSomNhat').addEventListener('click', (e) => {
        if (!e.target.checked) return;
        XuLyCacBoLoc();
    });
    // Hạ cánh muộn nhất
    document.getElementById('BoLoc_SapXep_HaCanhMuonNhat').addEventListener('click', (e) => {
        if (!e.target.checked) return;
        XuLyCacBoLoc();
    });
    // Thời gian bay ngắn nhất
    document.getElementById('BoLoc_SapXep_ThoiGianBayNganNhat').addEventListener('click', (e) => {
        if (!e.target.checked) return;
        XuLyCacBoLoc();
    });
}
// #endregion

function XuLyCacBoLoc() {
    let SanBayDi = PackageBooking.MangChuyenBayTimKiem[ChuyenBayDangChon].SanBayDi;
    let SanBayDen = PackageBooking.MangChuyenBayTimKiem[ChuyenBayDangChon].SanBayDen;
    let NgayDi = PackageBooking.MangChuyenBayTimKiem[ChuyenBayDangChon].NgayDi;

    var data_send = {
        mahangghe: PackageBooking.HangGhe.MaHangGhe,
        hanhkhach: PackageBooking.HanhKhach,
        ngaydi: NgayDi.Nam + '-' + numberSmallerTen(NgayDi.Thang) + '-' + numberSmallerTen(NgayDi.Ngay),
        masanbaydi: SanBayDi.MaSanBay.toString(),
        masanbayden: SanBayDen.MaSanBay.toString(),
    };
    openLoader('Chờ chút');
    axios({
        method: 'post',
        url: '/flight/fullsearch',
        data: data_send,
    }).then((res) => {
        ChuyenBay_Items_fromDB = res.data;

        if (document.getElementById('BoLoc_DiemDung_BayThang').checked)
            ChuyenBay_Items_fromDB = ChuyenBay_Items_fromDB.filter((item) => item.SoDiemDung == 0);
        if (document.getElementById('BoLoc_DiemDung_1DiemDung').checked)
            ChuyenBay_Items_fromDB = ChuyenBay_Items_fromDB.filter((item) => item.SoDiemDung == 1);
        if (document.getElementById('BoLoc_DiemDung_Hon2DiemDung').checked)
            ChuyenBay_Items_fromDB = ChuyenBay_Items_fromDB.filter((item) => item.SoDiemDung >= 2);

        if (document.getElementById('BoLoc_ThoiGianBay_CatCanh_SangSom').checked)
            ChuyenBay_Items_fromDB = ChuyenBay_Items_fromDB.filter((item) => {
                let ChanTren = new Date('1/1/1999 ' + '00:00:00');
                let ChanDuoi = new Date('1/1/1999 ' + '06:00:00');
                let value = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(item.ThoiGianDi.GioDi.Gio)}:${numberSmallerTen(
                            item.ThoiGianDi.GioDi.Phut,
                        )}:00`,
                );
                return value >= ChanTren && value <= ChanDuoi;
            });
        if (document.getElementById('BoLoc_ThoiGianBay_CatCanh_Sang').checked)
            ChuyenBay_Items_fromDB = ChuyenBay_Items_fromDB.filter((item) => {
                let ChanTren = new Date('1/1/1999 ' + '06:00:00');
                let ChanDuoi = new Date('1/1/1999 ' + '12:00:00');
                let value = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(item.ThoiGianDi.GioDi.Gio)}:${numberSmallerTen(
                            item.ThoiGianDi.GioDi.Phut,
                        )}:00`,
                );
                return value >= ChanTren && value <= ChanDuoi;
            });
        if (document.getElementById('BoLoc_ThoiGianBay_CatCanh_Chieu').checked)
            ChuyenBay_Items_fromDB = ChuyenBay_Items_fromDB.filter((item) => {
                let ChanTren = new Date('1/1/1999 ' + '12:00:00');
                let ChanDuoi = new Date('1/1/1999 ' + '18:00:00');
                let value = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(item.ThoiGianDi.GioDi.Gio)}:${numberSmallerTen(
                            item.ThoiGianDi.GioDi.Phut,
                        )}:00`,
                );
                return value >= ChanTren && value <= ChanDuoi;
            });
        if (document.getElementById('BoLoc_ThoiGianBay_CatCanh_Toi').checked)
            ChuyenBay_Items_fromDB = ChuyenBay_Items_fromDB.filter((item) => {
                let ChanTren = new Date('1/1/1999 ' + '18:00:00');
                let ChanDuoi = new Date('1/1/1999 ' + '24:00:00');
                let value = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(item.ThoiGianDi.GioDi.Gio)}:${numberSmallerTen(
                            item.ThoiGianDi.GioDi.Phut,
                        )}:00`,
                );
                return value >= ChanTren && value <= ChanDuoi;
            });

        if (document.getElementById('BoLoc_ThoiGianBay_HaCanh_SangSom').checked)
            ChuyenBay_Items_fromDB = ChuyenBay_Items_fromDB.filter((item) => {
                let ChanTren = new Date('1/1/1999 ' + '00:00:00');
                let ChanDuoi = new Date('1/1/1999 ' + '06:00:00');
                let value = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(item.ThoiGianDen.GioDen.Gio)}:${numberSmallerTen(
                            item.ThoiGianDen.GioDen.Phut,
                        )}:00`,
                );
                return value >= ChanTren && value <= ChanDuoi;
            });
        if (document.getElementById('BoLoc_ThoiGianBay_HaCanh_Sang').checked)
            ChuyenBay_Items_fromDB = ChuyenBay_Items_fromDB.filter((item) => {
                let ChanTren = new Date('1/1/1999 ' + '06:00:00');
                let ChanDuoi = new Date('1/1/1999 ' + '12:00:00');
                let value = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(item.ThoiGianDen.GioDen.Gio)}:${numberSmallerTen(
                            item.ThoiGianDen.GioDen.Phut,
                        )}:00`,
                );
                return value >= ChanTren && value <= ChanDuoi;
            });
        if (document.getElementById('BoLoc_ThoiGianBay_HaCanh_Chieu').checked)
            ChuyenBay_Items_fromDB = ChuyenBay_Items_fromDB.filter((item) => {
                let ChanTren = new Date('1/1/1999 ' + '12:00:00');
                let ChanDuoi = new Date('1/1/1999 ' + '18:00:00');
                let value = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(item.ThoiGianDen.GioDen.Gio)}:${numberSmallerTen(
                            item.ThoiGianDen.GioDen.Phut,
                        )}:00`,
                );
                return value >= ChanTren && value <= ChanDuoi;
            });
        if (document.getElementById('BoLoc_ThoiGianBay_HaCanh_Toi').checked)
            ChuyenBay_Items_fromDB = ChuyenBay_Items_fromDB.filter((item) => {
                let ChanTren = new Date('1/1/1999 ' + '18:00:00');
                let ChanDuoi = new Date('1/1/1999 ' + '24:00:00');
                let value = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(item.ThoiGianDen.GioDen.Gio)}:${numberSmallerTen(
                            item.ThoiGianDen.GioDen.Phut,
                        )}:00`,
                );
                return value >= ChanTren && value <= ChanDuoi;
            });

        ChuyenBay_Items_fromDB = ChuyenBay_Items_fromDB.filter(
            (item) =>
                item.ThoiGianBay.Gio <= parseInt(document.getElementById('BoLoc_ThoiGianBay_ThoiGianBay_Range').value),
        );
        ChuyenBay_Items_fromDB = ChuyenBay_Items_fromDB.filter(
            (item) => item.GiaVe <= parseInt(document.getElementById('BoLoc_ThemBoLoc_GiaVe_Range').value),
        );

        if (document.getElementById('BoLoc_SapXep_GiaThapNhat').checked)
            ChuyenBay_Items_fromDB.sort((a, b) => a.GiaVe - b.GiaVe);

        if (document.getElementById('BoLoc_SapXep_CatCanhSomNhat').checked)
            ChuyenBay_Items_fromDB.sort((a, b) => {
                let temp = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(a.ThoiGianDi.GioDi.Gio)}:${numberSmallerTen(a.ThoiGianDi.GioDi.Phut)}:00`,
                );
                let temp1 = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(b.ThoiGianDi.GioDi.Gio)}:${numberSmallerTen(b.ThoiGianDi.GioDi.Phut)}:00`,
                );
                return temp > temp1 ? 1 : temp == temp1 ? 0 : -1;
            });
        if (document.getElementById('BoLoc_SapXep_CatCanhMuonNhat').checked)
            ChuyenBay_Items_fromDB.sort((a, b) => {
                let temp = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(a.ThoiGianDi.GioDi.Gio)}:${numberSmallerTen(a.ThoiGianDi.GioDi.Phut)}:00`,
                );
                let temp1 = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(b.ThoiGianDi.GioDi.Gio)}:${numberSmallerTen(b.ThoiGianDi.GioDi.Phut)}:00`,
                );
                return temp > temp1 ? -1 : temp == temp1 ? 0 : 1;
            });
        if (document.getElementById('BoLoc_SapXep_HaCanhSomNhat').checked)
            ChuyenBay_Items_fromDB.sort((a, b) => {
                let temp = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(a.ThoiGianDen.GioDen.Gio)}:${numberSmallerTen(
                            a.ThoiGianDen.GioDen.Phut,
                        )}:00`,
                );
                let temp1 = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(b.ThoiGianDen.GioDen.Gio)}:${numberSmallerTen(
                            b.ThoiGianDen.GioDen.Phut,
                        )}:00`,
                );
                return temp > temp1 ? 1 : temp == temp1 ? 0 : -1;
            });
        if (document.getElementById('BoLoc_SapXep_HaCanhMuonNhat').checked)
            ChuyenBay_Items_fromDB.sort((a, b) => {
                let temp = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(a.ThoiGianDen.GioDen.Gio)}:${numberSmallerTen(
                            a.ThoiGianDen.GioDen.Phut,
                        )}:00`,
                );
                let temp1 = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(b.ThoiGianDen.GioDen.Gio)}:${numberSmallerTen(
                            b.ThoiGianDen.GioDen.Phut,
                        )}:00`,
                );
                return temp > temp1 ? -1 : temp == temp1 ? 0 : 1;
            });

        if (document.getElementById('BoLoc_SapXep_ThoiGianBayNganNhat').checked)
            ChuyenBay_Items_fromDB.sort((a, b) => {
                let temp = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(a.ThoiGianDen.GioDen.Gio)}:${numberSmallerTen(
                            a.ThoiGianDen.GioDen.Phut,
                        )}:00`,
                );
                let temp1 = new Date(
                    '1/1/1999 ' +
                        `${numberSmallerTen(b.ThoiGianDen.GioDen.Gio)}:${numberSmallerTen(
                            b.ThoiGianDen.GioDen.Phut,
                        )}:00`,
                );
                return temp > temp1 ? 1 : temp == temp1 ? 0 : -1;
            });
        HienThiChuyenBay_fromDB();
        closeLoader();
    });
}

function KhoiTaoCacRange_BoLoc() {
    const GiaVe = document.getElementById('BoLoc_ThemBoLoc_GiaVe_Range');
    const ThoiGianBay = document.getElementById('BoLoc_ThoiGianBay_ThoiGianBay_Range');

    let ThoiGianBay_Max;
    let ThoiGianBay_Min;

    let GiaVe_Max;
    let GiaVe_Min;

    if (ChuyenBay_Items_fromDB.length > 0) {
        ThoiGianBay_Max = ChuyenBay_Items_fromDB[0].ThoiGianBay.Gio;
        ThoiGianBay_Min = ChuyenBay_Items_fromDB[0].ThoiGianBay.Gio;
        GiaVe_Max = ChuyenBay_Items_fromDB[0].GiaVe;
        GiaVe_Min = ChuyenBay_Items_fromDB[0].GiaVe;
    }

    for (let i = 1; i < ChuyenBay_Items_fromDB.length; i++) {
        if (ThoiGianBay_Max < ChuyenBay_Items_fromDB[i].ThoiGianBay.Gio)
            ThoiGianBay_Max = ChuyenBay_Items_fromDB[i].ThoiGianBay.Gio;
        if (ThoiGianBay_Min > ChuyenBay_Items_fromDB[i].ThoiGianBay.Gio)
            ThoiGianBay_Min = ChuyenBay_Items_fromDB[i].ThoiGianBay.Gio;

        if (GiaVe_Max < ChuyenBay_Items_fromDB[i].GiaVe) GiaVe_Max = ChuyenBay_Items_fromDB[i].GiaVe;
        if (GiaVe_Min > ChuyenBay_Items_fromDB[i].GiaVe) GiaVe_Min = ChuyenBay_Items_fromDB[i].GiaVe;
    }

    GiaVe.setAttribute('min', GiaVe_Min);
    GiaVe.setAttribute('max', GiaVe_Max);
    GiaVe.setAttribute('step', Math.round((GiaVe_Max - GiaVe_Min) / 10));
    GiaVe.setAttribute('value', GiaVe_Max);
    document.getElementById('BoLoc_ThemBoLoc_GiaVe').innerText = numberWithDot(GiaVe_Max) + ' VND';

    ThoiGianBay.setAttribute('min', ThoiGianBay_Min);
    ThoiGianBay.setAttribute('max', ThoiGianBay_Max);
    ThoiGianBay.setAttribute('step', Math.round((ThoiGianBay_Max - ThoiGianBay_Min) / 10));
    ThoiGianBay.setAttribute('value', ThoiGianBay_Max);
    document.getElementById('BoLoc_ThoiGianBay_ThoiGianBay').innerText = ThoiGianBay_Max + ' h';
}

const ChuyenBay_Container = document.getElementById('ChuyenBay_Container');

//Lấy các tiêu chuẩn tra cứu từ Tra cứu chuyến bay
let PackageBooking;
let ChuyenBayDangChon = 0;
let ChuyenBay_Items_fromDB;
function GetPackageBooing_fromSV() {
    openLoader('Chờ chút');
    PackageBooking = JSON.parse(document.getElementById('PackageBookingJS').getAttribute('PackageBookingJS'));
    closeLoader();
    TomTat_Item_Detail_ChiTiet_HienThi();
    DoiMauChuyenBayDangChon();

    console.log(PackageBooking);
    // Chuyến bay số 1
    if (PackageBooking.MangChuyenBayTimKiem.length > 0)
        LayChuyenBay_fromDB(
            PackageBooking.MangChuyenBayTimKiem[0].SanBayDi,
            PackageBooking.MangChuyenBayTimKiem[0].SanBayDen,
            PackageBooking.MangChuyenBayTimKiem[0].NgayDi,
        );
}
if (!PackageBooking) GetPackageBooing_fromSV();

// Nhấn chi tiết trong tóm tắt - modal
function TomTat_Item_Detail_ChiTiet_HienThi() {
    const TomTat_Item_Detail_ChiTiets = document.querySelectorAll('.TomTat_Item_Detail_ChiTiet');
    const TomTat_Item_Detail_Modal = document.getElementById('TomTat_Item_Detail_Modal');

    for (let i = 0; i < TomTat_Item_Detail_ChiTiets.length; i++) {
        TomTat_Item_Detail_ChiTiets[i].addEventListener('click', (e) => {
            const index =
                parseInt(e.target.closest('.TomTat_Item').querySelector('.TomTat_Item_Title_ThuTu').innerText) - 1;
            const ChuyenBayDaChon = PackageBooking.MangChuyenBayTimKiem[index].ChuyenBayDaChon;
            TomTat_Item_Detail_Modal.querySelector('.TomTat_Item_Detail_Modal_MaChuyenBay').innerText =
                ChuyenBayDaChon.SanBayDi.MaSanBay +
                '-' +
                ChuyenBayDaChon.SanBayDen.MaSanBay +
                '-' +
                ChuyenBayDaChon.MaChuyenBay;
            TomTat_Item_Detail_Modal.querySelector('.TomTat_Item_Detail_Modal_GiaVe').innerText = numberWithDot(
                ChuyenBayDaChon.GiaVe,
            );

            const ChanBays = ChuyenBayDaChon.ChanBay;
            const TomTat_Item_Detail_Modal_TrungGian_Container = document.querySelector(
                '.TomTat_Item_Detail_Modal_TrungGian_Container',
            );
            const TomTat_Item_Detail_Modal_TrungGian_Items = document.querySelectorAll(
                '.TomTat_Item_Detail_Modal_TrungGian_Item',
            );

            if (TomTat_Item_Detail_Modal_TrungGian_Items.length > 1) {
                let num = TomTat_Item_Detail_Modal_TrungGian_Items.length;
                for (let j = num - 1; j > 0; j--) {
                    TomTat_Item_Detail_Modal_TrungGian_Container.removeChild(
                        TomTat_Item_Detail_Modal_TrungGian_Items[j],
                    );
                }
            }

            for (let j = 0; j < ChanBays.length; j++) {
                const TomTat_Item_Detail_Modal_TrungGian_Item =
                    TomTat_Item_Detail_Modal_TrungGian_Items[0].cloneNode(true);
                TomTat_Item_Detail_Modal_TrungGian_Item.classList.remove('d-none');

                TomTat_Item_Detail_Modal_TrungGian_Item.querySelector(
                    '.TomTat_Item_Detail_Modal_TrungGian_Item_GioDi',
                ).innerText =
                    numberSmallerTen(ChanBays[j].ThoiGianDi.GioDi.Gio) +
                    ':' +
                    numberSmallerTen(ChanBays[j].ThoiGianDi.GioDi.Phut);

                TomTat_Item_Detail_Modal_TrungGian_Item.querySelector(
                    '.TomTat_Item_Detail_Modal_TrungGian_Item_NgayDi',
                ).innerText =
                    numberSmallerTen(ChanBays[j].ThoiGianDi.NgayDi.Ngay) +
                    '-' +
                    numberSmallerTen(ChanBays[j].ThoiGianDi.NgayDi.Thang) +
                    '-' +
                    numberSmallerTen(ChanBays[j].ThoiGianDi.NgayDi.Nam);

                TomTat_Item_Detail_Modal_TrungGian_Item.querySelector(
                    '.TomTat_Item_Detail_Modal_TrungGian_Item_ThoiGianBay',
                ).innerText =
                    numberSmallerTen(ChanBays[j].ThoiGianBay.Gio) +
                    'h ' +
                    numberSmallerTen(ChanBays[j].ThoiGianBay.Phut) +
                    'm';

                TomTat_Item_Detail_Modal_TrungGian_Item.querySelector(
                    '.TomTat_Item_Detail_Modal_TrungGian_Item_NgayDen',
                ).innerText =
                    numberSmallerTen(ChanBays[j].ThoiGianDen.NgayDen.Ngay) +
                    '-' +
                    numberSmallerTen(ChanBays[j].ThoiGianDen.NgayDen.Thang) +
                    '-' +
                    numberSmallerTen(ChanBays[j].ThoiGianDen.NgayDen.Nam);

                TomTat_Item_Detail_Modal_TrungGian_Item.querySelector(
                    '.TomTat_Item_Detail_Modal_TrungGian_Item_GioDen',
                ).innerText =
                    numberSmallerTen(ChanBays[j].ThoiGianDen.GioDen.Gio) +
                    ':' +
                    numberSmallerTen(ChanBays[j].ThoiGianDen.GioDen.Phut);

                TomTat_Item_Detail_Modal_TrungGian_Item.querySelector(
                    '.TomTat_Item_Detail_Modal_TrungGian_Item_SanBayDi',
                ).innerText = ChanBays[j].SanBayDi.MaSanBay + ' - ' + ChanBays[j].SanBayDi.TinhThanh;

                TomTat_Item_Detail_Modal_TrungGian_Item.querySelector(
                    '.TomTat_Item_Detail_Modal_TrungGian_Item_SanBayDen',
                ).innerText = ChanBays[j].SanBayDen.MaSanBay + ' - ' + ChanBays[j].SanBayDen.TinhThanh;

                TomTat_Item_Detail_Modal_TrungGian_Item.querySelector(
                    '.TomTat_Item_Detail_Modal_TrungGian_Item_Divider_SanBay',
                ).innerText = `Dừng ở sân bay ${ChanBays[j].SanBayDen.TenSanBay} (${numberSmallerTen(
                    ChanBays[j].ThoiGianDung_SanBayDen.Gio,
                )}h ${numberSmallerTen(ChanBays[j].ThoiGianDung_SanBayDen.Phut)}m)`;

                if (j == ChanBays.length - 1)
                    TomTat_Item_Detail_Modal_TrungGian_Item.querySelector(
                        '.TomTat_Item_Detail_Modal_TrungGian_Item_Divider',
                    ).classList.add('d-none');

                TomTat_Item_Detail_Modal_TrungGian_Container.appendChild(TomTat_Item_Detail_Modal_TrungGian_Item);
            }
        });
    }
}

// Xóa các chuyến bay đang hiển thị
function XoaChuyenBay_Items() {
    const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');
    if (ChuyenBay_Items.length > 1) {
        let num = ChuyenBay_Items.length;
        for (let i = num - 1; i > 0; i--) {
            ChuyenBay_Container.removeChild(ChuyenBay_Items[i]);
        }
    }
}
// Đưa các chuyến bay từ DB lên view
function HienThiChuyenBay_fromDB() {
    openLoader('Tìm kiếm');
    const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');
    XoaChuyenBay_Items();

    if (ChuyenBay_Items_fromDB)
        if (ChuyenBay_Items_fromDB.length > 0) {
            document.getElementById('No_Flight').classList.add('d-none');
            // Copy node
            for (let i = 0; i < ChuyenBay_Items_fromDB.length; i++) {
                console.log(ChuyenBay_Items_fromDB[i]);
                const ChuyenBay_Item = ChuyenBay_Items[0].cloneNode(true);
                ChuyenBay_Item.classList.remove('d-none');

                ChuyenBay_Item.querySelector('.ChuyenBay_Item_MaChuyenBay').innerText =
                    ChuyenBay_Items_fromDB[i].SanBayDi.MaSanBay +
                    '-' +
                    ChuyenBay_Items_fromDB[i].SanBayDen.MaSanBay +
                    '-' +
                    ChuyenBay_Items_fromDB[i].MaChuyenBay;
                ChuyenBay_Item.querySelector('.ChuyenBay_Item_GioDi').innerText =
                    numberSmallerTen(ChuyenBay_Items_fromDB[i].ThoiGianDi.GioDi.Gio) +
                    ':' +
                    numberSmallerTen(ChuyenBay_Items_fromDB[i].ThoiGianDi.GioDi.Phut);
                ChuyenBay_Item.querySelector('.ChuyenBay_Item_MaSanBayDi').innerText =
                    ChuyenBay_Items_fromDB[i].SanBayDi.MaSanBay;
                ChuyenBay_Item.querySelector('.ChuyenBay_Item_ThoiGianBay').innerText =
                    numberSmallerTen(ChuyenBay_Items_fromDB[i].ThoiGianBay.Gio) +
                    'h ' +
                    numberSmallerTen(ChuyenBay_Items_fromDB[i].ThoiGianBay.Phut) +
                    'm';
                ChuyenBay_Item.querySelector('.ChuyenBay_Item_SoDiemDung').innerText =
                    ChuyenBay_Items_fromDB[i].SoDiemDung + ' điểm dừng';
                ChuyenBay_Item.querySelector('.ChuyenBay_Item_GioDen').innerText =
                    numberSmallerTen(ChuyenBay_Items_fromDB[i].ThoiGianDen.GioDen.Gio) +
                    ':' +
                    numberSmallerTen(ChuyenBay_Items_fromDB[i].ThoiGianDen.GioDen.Phut);
                ChuyenBay_Item.querySelector('.ChuyenBay_Item_MaSanBayDen').innerText =
                    ChuyenBay_Items_fromDB[i].SanBayDen.MaSanBay;
                ChuyenBay_Item.querySelector('.ChuyenBay_Item_GiaVe').innerText = numberWithDot(
                    ChuyenBay_Items_fromDB[i].GiaVe,
                );

                ChuyenBay_Item.querySelector('.ChuyenBay_Item_Detail_MaChuyenBay').innerText =
                    ChuyenBay_Items_fromDB[i].SanBayDi.MaSanBay +
                    '-' +
                    ChuyenBay_Items_fromDB[i].SanBayDen.MaSanBay +
                    '-' +
                    ChuyenBay_Items_fromDB[i].MaChuyenBay;
                ChuyenBay_Item.querySelector('.ChuyenBay_Item_Detail_GiaVe ').innerText = numberWithDot(
                    ChuyenBay_Items_fromDB[i].GiaVe,
                );

                ChuyenBay_Item.querySelector('.ChuyenBay_Item__Chon ').value = ChuyenBay_Items_fromDB[i].MaChuyenBay;

                const ChanBays = ChuyenBay_Items_fromDB[i].ChanBay;
                const ChuyenBay_Item_Detail_TrungGian_Container = ChuyenBay_Item.querySelector(
                    '.ChuyenBay_Item_Detail_TrungGian_Container',
                );

                const ChuyenBay_Item_Detail_TrungGian_Items =
                    ChuyenBay_Item_Detail_TrungGian_Container.querySelectorAll('.ChuyenBay_Item_Detail_TrungGian_Item');

                if (ChuyenBay_Item_Detail_TrungGian_Items.length > 1) {
                    let num = ChuyenBay_Item_Detail_TrungGian_Items.length;
                    for (let j = num - 1; j > 0; j--) {
                        ChuyenBay_Item_Detail_TrungGian_Container.removeChild(ChuyenBay_Item_Detail_TrungGian_Items[j]);
                    }
                }

                for (let j = 0; j < ChanBays.length; j++) {
                    const ChuyenBay_Item_Detail_TrungGian_Item =
                        ChuyenBay_Item_Detail_TrungGian_Items[0].cloneNode(true);
                    ChuyenBay_Item_Detail_TrungGian_Item.classList.remove('d-none');

                    ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                        '.ChuyenBay_Item_Detail_TrungGian_Item_GioDi',
                    ).innerText =
                        numberSmallerTen(ChanBays[j].ThoiGianDi.GioDi.Gio) +
                        ':' +
                        numberSmallerTen(ChanBays[j].ThoiGianDi.GioDi.Phut);

                    ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                        '.ChuyenBay_Item_Detail_TrungGian_Item_NgayDi',
                    ).innerText =
                        numberSmallerTen(ChanBays[j].ThoiGianDi.NgayDi.Ngay) +
                        '-' +
                        numberSmallerTen(ChanBays[j].ThoiGianDi.NgayDi.Thang) +
                        '-' +
                        numberSmallerTen(ChanBays[j].ThoiGianDi.NgayDi.Nam);

                    ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                        '.ChuyenBay_Item_Detail_TrungGian_Item_ThoiGianBay',
                    ).innerText =
                        numberSmallerTen(ChanBays[j].ThoiGianBay.Gio) +
                        'h ' +
                        numberSmallerTen(ChanBays[j].ThoiGianBay.Phut) +
                        'm';

                    ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                        '.ChuyenBay_Item_Detail_TrungGian_Item_NgayDen',
                    ).innerText =
                        numberSmallerTen(ChanBays[j].ThoiGianDen.NgayDen.Ngay) +
                        '-' +
                        numberSmallerTen(ChanBays[j].ThoiGianDen.NgayDen.Thang) +
                        '-' +
                        numberSmallerTen(ChanBays[j].ThoiGianDen.NgayDen.Nam);

                    ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                        '.ChuyenBay_Item_Detail_TrungGian_Item_GioDen',
                    ).innerText =
                        numberSmallerTen(ChanBays[j].ThoiGianDen.GioDen.Gio) +
                        ':' +
                        numberSmallerTen(ChanBays[j].ThoiGianDen.GioDen.Phut);

                    ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                        '.ChuyenBay_Item_Detail_TrungGian_Item_SanBayDi',
                    ).innerText = ChanBays[j].SanBayDi.MaSanBay + ' - ' + ChanBays[j].SanBayDi.TinhThanh;

                    ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                        '.ChuyenBay_Item_Detail_TrungGian_Item_SanBayDen',
                    ).innerText = ChanBays[j].SanBayDen.MaSanBay + ' - ' + ChanBays[j].SanBayDen.TinhThanh;

                    ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                        '.ChuyenBay_Item_Detail_TrungGian_Item_Divider_Content',
                    ).innerText = `Dừng ở sân bay ${ChanBays[j].SanBayDen.TenSanBay} (${numberSmallerTen(
                        ChanBays[j].ThoiGianDung_SanBayDen.Gio,
                    )}h ${numberSmallerTen(ChanBays[j].ThoiGianDung_SanBayDen.Phut)}m)`;

                    if (j == ChanBays.length - 1)
                        ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                            '.ChuyenBay_Item_Detail_TrungGian_Item_Divider',
                        ).classList.add('d-none');

                    ChuyenBay_Item_Detail_TrungGian_Container.appendChild(ChuyenBay_Item_Detail_TrungGian_Item);
                }

                ChuyenBay_Container.appendChild(ChuyenBay_Item);
            }

            addEventListener_ChuyenBay_Items();
            closeLoader();
        } else {
            closeLoader();
            document.getElementById('No_Flight').classList.remove('d-none');
        }
    else closeLoader();
}
// Lấy chuyến bay từ DB dựa vào 1 chuyến bay tra cứu
function LayChuyenBay_fromDB(SanBayDi, SanBayDen, NgayDi) {
    var data_send = {
        mahangghe: PackageBooking.HangGhe.MaHangGhe,
        hanhkhach: PackageBooking.HanhKhach,
        ngaydi: NgayDi.Nam + '-' + numberSmallerTen(NgayDi.Thang) + '-' + numberSmallerTen(NgayDi.Ngay),
        masanbaydi: SanBayDi.MaSanBay.toString(),
        masanbayden: SanBayDen.MaSanBay.toString(),
    };

    openLoader('Chờ chút');
    axios({
        method: 'post',
        url: '/flight/fullsearch',
        data: data_send,
    }).then((res) => {
        ChuyenBay_Items_fromDB = res.data;
        closeLoader();
        if (ChuyenBay_Items_fromDB) {
            console.log(ChuyenBay_Items_fromDB);
            if (ChuyenBay_Items_fromDB.length > 0) KhoiTaoCacRange_BoLoc();
            console.log('he');
            HienThiChuyenBay_fromDB();
        }
    });
}

// Đổi màu chuyến bay đang chọn
function DoiMauChuyenBayDangChon() {
    const TomTat_Item_Title_ThuTus = document.querySelectorAll('.TomTat_Item_Title_ThuTu');
    for (let j = 0; j < TomTat_Item_Title_ThuTus.length; j++) {
        let TomTat_Item = TomTat_Item_Title_ThuTus[j].closest('.TomTat_Item');
        if (parseInt(TomTat_Item_Title_ThuTus[j].innerText) - 1 == ChuyenBayDangChon) {
            if (TomTat_Item.querySelector('.TomTat_Item_Title_ThuTu').classList.contains('bg-primary'))
                TomTat_Item.querySelector('.TomTat_Item_Title_ThuTu').classList.remove('bg-primary');
            TomTat_Item.querySelector('.TomTat_Item_Title_ThuTu').classList.add('bg-secondary');

            if (TomTat_Item.querySelector('.TomTat_Item_Title_Decor').classList.contains('text-primary'))
                TomTat_Item.querySelector('.TomTat_Item_Title_Decor').classList.remove('text-primary');
            TomTat_Item.querySelector('.TomTat_Item_Title_Decor').classList.add('text-secondary');
        } else {
            if (TomTat_Item.querySelector('.TomTat_Item_Title_ThuTu').classList.contains('bg-secondary'))
                TomTat_Item.querySelector('.TomTat_Item_Title_ThuTu').classList.remove('bg-secondary');
            TomTat_Item.querySelector('.TomTat_Item_Title_ThuTu').classList.add('bg-primary');

            if (TomTat_Item.querySelector('.TomTat_Item_Title_Decor').classList.contains('text-secondary'))
                TomTat_Item.querySelector('.TomTat_Item_Title_Decor').classList.remove('text-secondary');
            TomTat_Item.querySelector('.TomTat_Item_Title_Decor').classList.add('text-primary');
        }
    }
}

// Add event các chuyến bay từ DB // Nhấn đổi chuyến bay trong tóm tắt
function addEventListener_ChuyenBay_Items() {
    const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');
    for (let i = 0; i < ChuyenBay_Items.length; i++) {
        // Sự kiện khi ấn chi tiết
        const ChuyenBay_Item_ChiTiet = ChuyenBay_Items[i].querySelector('.ChuyenBay_Item_ChiTiet');
        ChuyenBay_Item_ChiTiet.addEventListener('click', (e) => {
            const ChuyenBay_Item = e.target.closest('.ChuyenBay_Item');
            const ChuyenBay_Item_Detail = ChuyenBay_Item.querySelector('.ChuyenBay_Item_Detail');
            if (ChuyenBay_Item_Detail.classList.contains('d-none')) ChuyenBay_Item_Detail.classList.remove('d-none');
            else ChuyenBay_Item_Detail.classList.add('d-none');
        });

        //Sự kiện nút chọn
        const ChuyenBay_Item__Chon = ChuyenBay_Items[i].querySelector('.ChuyenBay_Item__Chon');
        ChuyenBay_Item__Chon.addEventListener('click', (e) => {
            openLoader('Chờ chút');
            const MaChuyenBay = e.target.value;
            const ChuyenBay = ChuyenBay_Items_fromDB.find((item) => item.MaChuyenBay == MaChuyenBay);

            let TomTatItem;
            const TomTat_Item_Title_ThuTus = document.querySelectorAll('.TomTat_Item_Title_ThuTu');
            for (let j = 0; j < TomTat_Item_Title_ThuTus.length; j++) {
                if (parseInt(TomTat_Item_Title_ThuTus[j].innerText) - 1 == ChuyenBayDangChon) {
                    TomTatItem = TomTat_Item_Title_ThuTus[j].closest('.TomTat_Item');
                    break;
                }
            }

            TomTatItem.querySelector('.TomTat_Item_Detail').classList.remove('d-none');
            TomTatItem.querySelector('.TomTat_Item_Detail_MaChuyenBay').innerText =
                ChuyenBay.SanBayDi.MaSanBay + '-' + ChuyenBay.SanBayDen.MaSanBay + '-' + ChuyenBay.MaChuyenBay;
            TomTatItem.querySelector('.TomTat_Item_Detail_GioDi').innerText =
                numberSmallerTen(ChuyenBay.ThoiGianDi.GioDi.Gio) +
                ':' +
                numberSmallerTen(ChuyenBay.ThoiGianDi.GioDi.Phut);
            TomTatItem.querySelector('.TomTat_Item_Detail_MaSanBayDi').innerText = ChuyenBay.SanBayDi.MaSanBay;
            TomTatItem.querySelector('.TomTat_Item_Detail_ThoiGianBay').innerText =
                numberSmallerTen(ChuyenBay.ThoiGianBay.Gio) + 'h ' + numberSmallerTen(ChuyenBay.ThoiGianBay.Phut) + 'm';
            TomTatItem.querySelector('.TomTat_Item_Detail_SoDiemDung').innerText = ChuyenBay.SoDiemDung + ' điểm dừng';
            TomTatItem.querySelector('.TomTat_Item_Detail_GioDen').innerText =
                numberSmallerTen(ChuyenBay.ThoiGianDen.GioDen.Gio) +
                ':' +
                numberSmallerTen(ChuyenBay.ThoiGianDen.GioDen.Phut);
            TomTatItem.querySelector('.TomTat_Item_Detail_MaSanBayDen').innerText = ChuyenBay.SanBayDen.MaSanBay;

            // nút đổi chuyến bay
            TomTatItem.querySelector('.TomTat_Item_Detail_DoiChuyenBay').addEventListener('click', (e) => {
                const TomTat_Item = e.target.closest('.TomTat_Item');

                const index_PackageBooking =
                    parseInt(TomTat_Item.querySelector('.TomTat_Item_Title_ThuTu').innerText) - 1;
                ChuyenBayDangChon = index_PackageBooking;
                DoiMauChuyenBayDangChon();

                const SanBayDi = PackageBooking.MangChuyenBayTimKiem[index_PackageBooking].SanBayDi;
                const SanBayDen = PackageBooking.MangChuyenBayTimKiem[index_PackageBooking].SanBayDen;
                const NgayDi = PackageBooking.MangChuyenBayTimKiem[index_PackageBooking].NgayDi;
                LayChuyenBay_fromDB(SanBayDi, SanBayDen, NgayDi);

                TomTat_Item.querySelector('.TomTat_Item_Detail').classList.add('d-none');
            });

            XoaChuyenBay_Items();
            PackageBooking.MangChuyenBayTimKiem[ChuyenBayDangChon].ChuyenBayDaChon = structuredClone(ChuyenBay);

            console.log(PackageBooking.MangChuyenBayTimKiem[ChuyenBayDangChon].ChuyenBayDaChon);

            ChuyenBayDangChon++;
            DoiMauChuyenBayDangChon();

            if (ChuyenBayDangChon > PackageBooking.MangChuyenBayTimKiem.length - 1) {
                SendForm(PackageBooking);
            } else {
                const SanBayDi = PackageBooking.MangChuyenBayTimKiem[ChuyenBayDangChon].SanBayDi;
                const SanBayDen = PackageBooking.MangChuyenBayTimKiem[ChuyenBayDangChon].SanBayDen;
                const NgayDi = PackageBooking.MangChuyenBayTimKiem[ChuyenBayDangChon].NgayDi;
                LayChuyenBay_fromDB(SanBayDi, SanBayDen, NgayDi);
            }

            closeLoader();
        });
    }
}

function SendForm(_PackageBooking) {
    document.getElementById('packagebooking').value = JSON.stringify(_PackageBooking);
    var book_flight_form = document.forms['book-flight-form'];
    book_flight_form.action = '/pre-booking';
    book_flight_form.submit();
}

window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});
