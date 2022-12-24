import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
    getToday,
    showToast,
    onlyNumber,
    validateEmail,
    dateIsValid,
    formatVND,
} from '../start.js';

openLoader('Chờ chút');
closeLoader();

window.onlyNumber = onlyNumber;
window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});

Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-');
};

Date.prototype.display = function () {
    var dd = numberSmallerTen(this.getDate());
    var mm = numberSmallerTen(this.getMonth() + 1); // getMonth() is zero-based
    var yy = this.getFullYear();
    var hr = numberSmallerTen(this.getHours());
    var min = numberSmallerTen(this.getMinutes());

    return dd + '/' + mm + '/' + yy + ' ' + hr + ':' + min;
};

function IsNgayNotNull(Ngay) {
    if (Ngay.Ngay == -1 || Ngay.Ngay == NaN) {
        return false;
    } else if (Ngay.Thang == -1 || Ngay.Thang == NaN) {
        return false;
    } else if (Ngay.Nam == -1 || Ngay.Nam == NaN) {
        return false;
    }
    return true;
}

function IsGioNotNull(Gio) {
    if (Gio.Gio == -1 || Gio.Gio == NaN) {
        return false;
    } else if (Gio.Phut == -1 || Gio.Phut == NaN) {
        return false;
    }
    return true;
}

function CreateDateFromObject(Ngay = null, Gio = null) {
    var strNgay = '';
    var strGio = '';

    if (Ngay == null) {
        strNgay = '1700/01/01';
    } else {
        if (IsNgayNotNull(Ngay) == false) {
            strNgay = '1700/01/01';
        } else {
            var dd = numberSmallerTen(Ngay.Ngay);
            var mm = numberSmallerTen(Ngay.Thang);
            var yy = numberSmallerTen(Ngay.Nam);
            strNgay = yy + '/' + mm + '/' + dd;
        }
    }
    if (Gio == null) {
        strGio = '00:00:00';
    } else {
        if (IsGioNotNull(Gio) == false) {
            strGio = '00:00:00';
        } else {
            var hr = numberSmallerTen(Gio.Gio);
            var min = numberSmallerTen(Gio.Phut);
            strGio = hr + ':' + min + ':00';
        }
    }
    return new Date(strNgay + ' ' + strGio);
}

function CreateObjectFromDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yy = date.getFullYear();
    var hr = date.getHours();
    var min = date.getMinutes();

    return {
        Ngay: {
            Ngay: dd,
            Thang: mm,
            Nam: yy,
        },
        Gio: {
            Gio: hr,
            Phut: min,
        },
    };
}

var ThamSos;
var ThoiGianBayToiThieu = 0;
var GiaVeCoBan_Min = 0;
var SBTG_Max = 0;
var ThoiGianDungToiThieu = 0;
var ThoiGianNhanLich_Min = 0;
// Tạo gói gửi đi
var data_send = {
    MaChuyenBay: -1,
    MaSanBayDi: '',
    MaSanBayDen: '',
    NgayKhoiHanh: { Ngay: -1, Thang: -1, Nam: -1 },
    GioKhoiHanh: { Gio: -1, Phut: -1 },
    ThoiGianBay: -1,
    GiaVeCoBan: -1,
    TrangThai: '',
    ThoiGianBayToiThieu: -1,
    ThoiGianDungToiThieu: -1,
    SBTG_Max: -1,
    GiaVeCoBan_Min: -1,
    SBTG: [],
    HangVe: [],
};

// var SBTG_item = {
//     ThuTu: -1,
//     MaSanBay: '',
//     NgayDen: { Ngay: -1, Thang: -1, Nam: -1 },
//     GioDen: { Gio: -1, Phut: -1 },
//     ThoiGianDung: -1,
//     GhiChu: '',
// };

// var HangVe_item = {
//     MaHangGhe: '',
//     TongVe: -1,
// };

function Start() {
    // Tham số
    ThamSos = structuredClone(JSON.parse(document.getElementById('ThamSos').innerText));

    ThoiGianBayToiThieu = ThamSos.find((item) => item.TenThamSo == 'ThoiGianBayToiThieu').GiaTri;
    GiaVeCoBan_Min = ThamSos.find((item) => item.TenThamSo == 'GiaVeCoBan_Min').GiaTri;
    SBTG_Max = ThamSos.find((item) => item.TenThamSo == 'SBTG_Max').GiaTri;
    ThoiGianDungToiThieu = ThamSos.find((item) => item.TenThamSo == 'ThoiGianDungToiThieu').GiaTri;

    data_send.ThoiGianBayToiThieu = ThamSos.find((item) => item.TenThamSo == 'ThoiGianBayToiThieu').GiaTri;
    data_send.GiaVeCoBan_Min = ThamSos.find((item) => item.TenThamSo == 'GiaVeCoBan_Min').GiaTri;
    data_send.SBTG_Max = ThamSos.find((item) => item.TenThamSo == 'SBTG_Max').GiaTri;
    data_send.ThoiGianDungToiThieu = ThamSos.find((item) => item.TenThamSo == 'ThoiGianDungToiThieu').GiaTri;

    ThoiGianNhanLich_Min = ThamSos.find((item) => item.TenThamSo == 'ThoiGianNhanLich_Min').GiaTri;

    data_send.TrangThai = 'ChuaKhoiHanh';

    // Hàm chạy lần đầu
    KhoiTao();
    KhoiTaoCountDown();
}
Start();

// Đếm ngược
function KhoiTaoCountDown() {
    // đếm thời gian
    setInterval(function () {
        var now = new Date();
        Timer_NgayGio.innerText = now.display() + ':' + numberSmallerTen(now.getSeconds());
    }, 1000);
}

function KhoiTao() {
    // Sân bay đi
    const SanBayDi_ul = document.querySelector('.SanBayDi_ul');
    const SanBayDi_lis = SanBayDi_ul.querySelectorAll('.SanBayDi_li');
    for (let i = 0; i < SanBayDi_lis.length; i++) {
        SanBayDi_lis[i].addEventListener('click', (e) => {
            // check trùng sân bay
            let MaSB_click = e.target.querySelector('.SanBayDi_li_MaSanBay').innerText;
            let MaSB_Di = data_send.MaSanBayDi;
            let MaSB_Den = data_send.MaSanBayDen;

            if (MaSB_Di != '' && MaSB_click == MaSB_Di) {
                return;
            }
            if (MaSB_Den != '' && MaSB_click == MaSB_Den) {
                showToast({
                    header: 'Sân bay đi',
                    body: 'Sân bay đi không trùng sân bay đến',
                    duration: 5000,
                    type: 'warning',
                });
                return;
            }

            for (let y = 0; y < data_send.SBTG.length; y++) {
                if (MaSB_click == data_send.SBTG[y].MaSanBay) {
                    showToast({
                        header: 'Sân bay đi',
                        body: 'Chuyến bay đã dừng ở sân bay này',
                        duration: 5000,
                        type: 'warning',
                    });
                    return;
                }
            }

            SanBayDi.setAttribute('masanbay', MaSB_click);
            data_send.MaSanBayDi = MaSB_click;
            SanBayDi.setAttribute('value', e.target.querySelector('.SanBayDi_li_TenSanBay').innerText);
            CapNhatMaChuyenBay();
            On_off_NutNhanLich();
        });
    }

    // Sân bay đến
    const SanBayDen_ul = document.querySelector('.SanBayDen_ul');
    const SanBayDen_lis = SanBayDen_ul.querySelectorAll('.SanBayDen_li');
    for (let i = 0; i < SanBayDen_lis.length; i++) {
        SanBayDen_lis[i].addEventListener('click', (e) => {
            // check trùng sân bay
            let MaSB_click = e.target.querySelector('.SanBayDen_li_MaSanBay').innerText;
            let MaSB_Di = data_send.MaSanBayDi;
            let MaSB_Den = data_send.MaSanBayDen;

            if (MaSB_Den != '' && MaSB_click == MaSB_Den) {
                return;
            }
            if (MaSB_Di != '' && MaSB_click == MaSB_Di) {
                showToast({
                    header: 'Sân bay đến',
                    body: 'Sân bay đến không trùng sân bay đi',
                    duration: 5000,
                    type: 'warning',
                });
                return;
            }

            for (let y = 0; y < data_send.SBTG.length; y++) {
                if (MaSB_click == data_send.SBTG[y].MaSanBay) {
                    showToast({
                        header: 'Sân bay đến',
                        body: 'Chuyến bay đã dừng ở sân bay này',
                        duration: 5000,
                        type: 'warning',
                    });
                    return;
                }
            }

            SanBayDen.setAttribute('masanbay', MaSB_click);
            data_send.MaSanBayDen = MaSB_click;
            SanBayDen.setAttribute('value', e.target.querySelector('.SanBayDen_li_TenSanBay').innerText);
            CapNhatMaChuyenBay();
            On_off_NutNhanLich();
        });
    }

    // nút swap
    if (SwapSanBay) {
        SwapSanBay.addEventListener('click', (e) => {
            var MaSBDen = data_send.MaSanBayDen;
            var MaSBDi = data_send.MaSanBayDi;
            var TenSBDen = SanBayDen.getAttribute('value');
            var TenSBDi = SanBayDi.getAttribute('value');

            SanBayDen.setAttribute('value', TenSBDi);
            SanBayDen.setAttribute('masanbay', MaSBDi);

            SanBayDi.setAttribute('masanbay', MaSBDen);
            SanBayDi.setAttribute('value', TenSBDen);

            data_send.MaSanBayDi = MaSBDen;
            data_send.MaSanBayDen = MaSBDi;
            CapNhatMaChuyenBay();
            On_off_NutNhanLich();
        });
    }

    // Ngày khởi hành
    if (NgayKhoiHanh) {
        var minDate = new Date();
        minDate = new Date(minDate.getTime() + ThoiGianNhanLich_Min * 24 * 60 * 60 * 1000);
        // Demo
        NgayKhoiHanh.setAttribute('min', minDate.yyyymmdd());
        NgayKhoiHanh.setAttribute('value', minDate.yyyymmdd());
        data_send.NgayKhoiHanh.Ngay = minDate.getDate();
        data_send.NgayKhoiHanh.Thang = minDate.getMonth() + 1;
        data_send.NgayKhoiHanh.Nam = minDate.getFullYear();

        NgayKhoiHanh.addEventListener('change', (e) => {
            if (e.target.value == '') {
            } else {
                var temp = new Date(e.target.value + ' 00:00:00');
                data_send.NgayKhoiHanh.Ngay = temp.getDate();
                data_send.NgayKhoiHanh.Thang = temp.getMonth() + 1;
                data_send.NgayKhoiHanh.Nam = temp.getFullYear();
                if (GioKhoiHanh.value == '') {
                    GioKhoiHanh.focus();
                } else {
                    var index = 0;
                    CapNhatThongBao_ThoiGianDen(index);
                    var ChanTruoc_Sau = GetChanTruoc(index + 1);
                    var GiaTri_Sau = GetChanSau(index);
                    if (GiaTri_Sau != null && ChanTruoc_Sau > GiaTri_Sau) {
                        var DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
                        for (let i = index + 1; i < DiemDung_Items.length; i++) {
                            var NgayGioDen_ThongBao_Sau = DiemDung_Items[i].querySelector('.NgayGioDen_ThongBao');
                            if (i == index + 1) {
                                NgayGioDen_ThongBao_Sau.classList.add('text-danger');
                                NgayGioDen_ThongBao_Sau.classList.remove('d-none');
                            } else {
                                NgayGioDen_ThongBao_Sau.classList.remove('text-danger');
                                NgayGioDen_ThongBao_Sau.classList.add('d-none');
                            }

                            DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').value = '';
                            DiemDung_Items[i].querySelector('.DiemDung_Item_GioDen').value = '';
                        }
                        DiemDung_Items[index + 1].querySelector('.DiemDung_Item_NgayDen').focus();
                        On_off_ThemDiemDung();
                        CapNhatThongBao_ThoiGianBay();
                        On_off_NutNhanLich();
                        return;
                    }
                    On_off_ThemDiemDung();
                    CapNhatThongBao_ThoiGianBay();
                    On_off_NutNhanLich();
                }
            }
        });
        NgayKhoiHanh.addEventListener('blur', (e) => {
            if (e.target.value == '') {
                showToast({
                    header: 'Ngày khởi hành',
                    body: 'Ngày khởi hành không được trống',
                    duration: 5000,
                    type: 'warning',
                });
                e.target.focus();
            } else {
                UnDisableAll_Blur();
            }
        });
        NgayKhoiHanh.addEventListener('focus', (e) => {
            DisableAll_Focus(0);
        });
    }

    // Giờ khởi hành
    if (GioKhoiHanh) {
        GioKhoiHanh.addEventListener('change', (e) => {
            if (e.target.value == '') {
            } else {
                var temp = new Date('1900-01-01 ' + e.target.value + ':00');
                data_send.GioKhoiHanh.Gio = temp.getHours();
                data_send.GioKhoiHanh.Phut = temp.getMinutes();
                if (NgayKhoiHanh.value == '') {
                    NgayKhoiHanh.focus();
                } else {
                    var index = 0;
                    CapNhatThongBao_ThoiGianDen(index);
                    var ChanTruoc_Sau = GetChanTruoc(index + 1);
                    var GiaTri_Sau = GetChanSau(index);
                    if (GiaTri_Sau != null && ChanTruoc_Sau > GiaTri_Sau) {
                        var DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
                        for (let i = index + 1; i < DiemDung_Items.length; i++) {
                            var NgayGioDen_ThongBao_Sau = DiemDung_Items[i].querySelector('.NgayGioDen_ThongBao');
                            if (i == index + 1) {
                                NgayGioDen_ThongBao_Sau.classList.add('text-danger');
                                NgayGioDen_ThongBao_Sau.classList.remove('d-none');
                            } else {
                                NgayGioDen_ThongBao_Sau.classList.remove('text-danger');
                                NgayGioDen_ThongBao_Sau.classList.add('d-none');
                            }

                            DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').value = '';
                            DiemDung_Items[i].querySelector('.DiemDung_Item_GioDen').value = '';
                        }
                        DiemDung_Items[index + 1].querySelector('.DiemDung_Item_NgayDen').focus();
                        On_off_ThemDiemDung();
                        CapNhatThongBao_ThoiGianBay();
                        On_off_NutNhanLich();
                        return;
                    }
                    On_off_ThemDiemDung();
                    CapNhatThongBao_ThoiGianBay();
                    On_off_NutNhanLich();
                }
            }
        });
        GioKhoiHanh.addEventListener('blur', (e) => {
            if (e.target.value == '') {
                showToast({
                    header: 'Giờ khởi hành',
                    body: 'Giờ khởi hành không được trống',
                    duration: 5000,
                    type: 'warning',
                });
                e.target.focus();
            } else {
                UnDisableAll_Blur();
            }
        });
        GioKhoiHanh.addEventListener('focus', (e) => {
            DisableAll_Focus(0);
        });
    }

    // Thời gian bay
    if (ThoiGianBay) {
        ThoiGianBay.addEventListener('change', (e) => {
            if (e.target.value == '') {
                showToast({
                    header: 'Thời gian bay',
                    body: 'Yêu cầu tối thiểu ' + e.target.getAttribute('min') + ' phút',
                    duration: 5000,
                    type: 'warning',
                });
                e.target.value = e.target.getAttribute('min');
            } else {
                if (parseInt(e.target.value) < parseInt(e.target.getAttribute('min'))) {
                    showToast({
                        header: 'Thời gian bay',
                        body: 'Yêu cầu tối thiểu ' + e.target.getAttribute('min') + ' phút',
                        duration: 5000,
                        type: 'warning',
                    });
                    e.target.value = e.target.getAttribute('min');
                }
            }
            data_send.ThoiGianBay = parseInt(e.target.value);
            On_off_NutNhanLich();
        });
        ThoiGianBay.addEventListener('blur', (e) => {
            if (e.target.value == '') {
                e.target.value = e.target.getAttribute('min');
            } else {
                if (parseInt(e.target.value) < parseInt(e.target.getAttribute('min'))) {
                    e.target.value = e.target.getAttribute('min');
                }
            }
            data_send.ThoiGianBay = parseInt(e.target.value);
            On_off_NutNhanLich();
        });
    }

    // Giá vé cơ bản
    if (GiaVeCoBan) {
        GiaVeCoBan_ThongBao.classList.remove('d-none');
        GiaVeCoBan_ThongBao.innerText = 'Tối thiểu ' + numberWithDot(GiaVeCoBan_Min) + ' VND';
        GiaVeCoBan.addEventListener('focus', (e) => {
            GiaVeCoBan_ThongBao.classList.add('text-danger');
        });
        GiaVeCoBan.addEventListener('blur', (e) => {
            if (e.target.value == '') {
                e.target.value = numberWithDot(GiaVeCoBan_Min);
            } else {
                if (parseInt(numberWithoutDot(e.target.value)) < GiaVeCoBan_Min) {
                    e.target.value = numberWithDot(GiaVeCoBan_Min);
                } else {
                    e.target.value = numberWithDot(e.target.value);
                }
            }
            data_send.GiaVeCoBan = parseInt(numberWithoutDot(e.target.value));
            On_off_ThemHangGhe();
            On_off_NutNhanLich();
            GiaVeCoBan_ThongBao.classList.remove('text-danger');
        });
        GiaVeCoBan.addEventListener('keyup', (e) => {
            e.target.value = formatVND(e.target.value);
            var GiaVe = 0;
            if (e.target.value == '') {
                GiaVe = GiaVeCoBan_Min;
            } else {
                GiaVe = parseInt(numberWithoutDot(e.target.value));
                if (GiaVe < GiaVeCoBan_Min) {
                    GiaVe = GiaVeCoBan_Min;
                }
            }
            var HangGhe_Item_GiaVes = document.querySelectorAll('.HangGhe_Item_GiaVe');
            for (let i = 1; i < HangGhe_Item_GiaVes.length; i++) {
                var HeSo = parseFloat(HangGhe_Item_GiaVes[i].getAttribute('heso'));
                HangGhe_Item_GiaVes[i].value = numberWithDot(GiaVe * HeSo);
            }
        });
    }

    // Nút thêm điểm dừng
    if (ThemDiemDung) {
        ThemDiemDung.addEventListener('click', (e) => {
            ThemSBTG();
        });
    }

    // Nút thêm hạng vé
    if (ThemHangGhe) {
        ThemHangGhe.addEventListener('click', (e) => {
            ThemHG();
        });
    }

    if (NhanLichChuyenBay) {
        NhanLichChuyenBay.addEventListener('click', (e) => {
            var Modal = new bootstrap.Modal(document.getElementById('Modal'), true);
            Modal.show();
        });
    }

    if (Modal_NhanLich) {
        Modal_NhanLich.addEventListener('click', (e) => {
            data_send.HangVe = [];
            var HangGhe_Items = document.querySelectorAll('.HangGhe_Item');
            for (let i = 1; i < HangGhe_Items.length; i++) {
                var mahangve = HangGhe_Items[i].querySelector('.HangGhe_Item_MaHangVe').getAttribute('mahangve');
                var tongsove = parseInt(HangGhe_Items[i].querySelector('.HangGhe_Item_TongSoVe').value);

                data_send.HangVe.push({
                    MaHangGhe: mahangve,
                    TongVe: tongsove,
                });
            }
            SendForm_NhanLich();
        });
    }
}

function On_off_ThemDiemDung() {
    var block = false;
    if (NgayKhoiHanh.value == '' || GioKhoiHanh.value == '') {
        block = true;
    }
    if (block == true) {
        DiemDung_ThongBao.classList.remove('d-none');
    } else {
        DiemDung_ThongBao.classList.add('d-none');
    }

    var DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
    if (DiemDung_Items.length - 1 > SBTG_Max) {
        block = true;
    } else {
        for (let i = 1; i < DiemDung_Items.length; i++) {
            if (DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').value == '') {
                block = true;
                break;
            } else if (DiemDung_Items[i].querySelector('.DiemDung_Item_GioDen').value == '') {
                block = true;
                break;
            } else if (DiemDung_Items[i].querySelector('.DiemDung_Item_ThoiGianDung').value == '') {
                block = true;
                break;
            }
        }
    }

    ThemDiemDung.disabled = block;
}

function CapNhatMaChuyenBay() {
    if (data_send.MaSanBayDi == '' || data_send.MaSanBayDen == '') {
        MaChuyenBay.value = '';
    } else {
        axios({
            method: 'post',
            url: '/flight/get-all-flights',
            data: { GetFlight_fromSV: true },
        }).then((res) => {
            var Flight_amount = res.data.length + 1;

            if (Flight_amount) {
                MaChuyenBay.value = data_send.MaSanBayDi + '-' + data_send.MaSanBayDen + '-' + Flight_amount;
            }
        });
    }
}

function CapNhatThongBao_ThoiGianBay() {
    if (IsNgayNotNull(data_send.NgayKhoiHanh) == false || IsGioNotNull(data_send.GioKhoiHanh) == false) {
        ThoiGianBay_ThongBao.classList.add('d-none');
        ThoiGianBay_ThongBao.classList.remove('text-danger');
        return;
    }
    var ChanTruoc = CreateDateFromObject(data_send.NgayKhoiHanh, data_send.GioKhoiHanh);
    var ChanSau = null;
    if (data_send.SBTG.length > 0) {
        var lastitem = null;
        data_send.SBTG.forEach((item) => {
            if (IsNgayNotNull(item.NgayDen) == true && IsGioNotNull(item.GioDen) == true && item.ThoiGianDung > 0) {
                lastitem = item;
            }
        });
        if (lastitem != null) {
            ChanSau = CreateDateFromObject(lastitem.NgayDen, lastitem.GioDen);
            ChanSau = new Date(ChanSau.getTime() + (lastitem.ThoiGianDung + ThoiGianBayToiThieu) * 60000);
        }
    }
    if (ChanSau == null) {
        ChanSau = new Date(ChanTruoc.getTime() + ThoiGianBayToiThieu * 60000);
    }

    var distance = (ChanSau.getTime() - ChanTruoc.getTime()) / 60000;

    ThoiGianBay_ThongBao.classList.remove('d-none');
    ThoiGianBay_ThongBao.classList.add('text-danger');
    ThoiGianBay_ThongBao.innerText = 'Yêu cầu tối thiểu ' + distance + ' phút';
    ThoiGianBay.setAttribute('min', distance);
}

function GetChanTruoc(ThuTu) {
    var index = parseInt(ThuTu.toString()) - 1;
    var ChanTruoc;
    if (index == 0) {
        ChanTruoc = CreateDateFromObject(data_send.NgayKhoiHanh, data_send.GioKhoiHanh);
        ChanTruoc = new Date(ChanTruoc.getTime() + ThoiGianBayToiThieu * 60000);
    } else {
        var temp = data_send.SBTG.find((item) => item.ThuTu == index);
        ChanTruoc = CreateDateFromObject(temp.NgayDen, temp.GioDen);
        ChanTruoc = new Date(ChanTruoc.getTime() + (ThoiGianBayToiThieu + temp.ThoiGianDung) * 60000);
    }
    return ChanTruoc;
}

function GetChanSau(ThuTu) {
    var index = parseInt(ThuTu.toString()) + 1;
    var ChanSau = null;
    var temp = data_send.SBTG.find((item) => item.ThuTu == index);
    if (temp === undefined) {
    } else {
        if (IsNgayNotNull(temp.NgayDen) == false || IsGioNotNull(temp.GioDen) == false) {
        } else {
            ChanSau = CreateDateFromObject(temp.NgayDen, temp.GioDen);
        }
    }
    return ChanSau;
}

function CapNhatThongBao_ThoiGianDen(ThuTu) {
    // Thay đổi ở: ThuTu + 1
    var index = parseInt(ThuTu.toString());
    var index_next = index + 1;
    if (index < 0) {
        return;
    }

    var DiemDung_Items = document.querySelectorAll('.DiemDung_Item');

    for (let i = 1; i < DiemDung_Items.length; i++) {
        var DiemDung_Item_ThuTu = parseInt(DiemDung_Items[i].getAttribute('index'));
        if (index_next == DiemDung_Item_ThuTu) {
            //
            var ChanTruoc = GetChanTruoc(index_next);
            var NgayGioDen_ThongBao = DiemDung_Items[i].querySelector('.NgayGioDen_ThongBao');
            NgayGioDen_ThongBao.classList.remove('d-none');
            NgayGioDen_ThongBao.innerText = 'Yêu cầu thời gian đến tối thiểu: ' + ChanTruoc.display();

            DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').setAttribute('min', ChanTruoc.yyyymmdd());
            break;
        }
    }
}

function DisableAll_Focus(ThuTu) {
    var index = parseInt(ThuTu.toString());

    NgayKhoiHanh.disabled = true;
    GioKhoiHanh.disabled = true;
    var DiemDung_Item_NgayDens = document.querySelectorAll('.DiemDung_Item_NgayDen');
    var DiemDung_Item_GioDens = document.querySelectorAll('.DiemDung_Item_GioDen');
    var DiemDung_Item_ThoiGianDungs = document.querySelectorAll('.DiemDung_Item_ThoiGianDung');
    var DiemDung_Item_Xoas = document.querySelectorAll('.DiemDung_Item_Xoa');
    for (let i = 1; i < DiemDung_Item_NgayDens.length; i++) {
        DiemDung_Item_NgayDens[i].disabled = true;
        DiemDung_Item_GioDens[i].disabled = true;
        DiemDung_Item_ThoiGianDungs[i].disabled = true;
        DiemDung_Item_Xoas[i].disabled = true;
    }

    if (index == 0) {
        NgayKhoiHanh.disabled = false;
        GioKhoiHanh.disabled = false;
    } else {
        DiemDung_Item_NgayDens[index].disabled = false;
        DiemDung_Item_GioDens[index].disabled = false;
        DiemDung_Item_ThoiGianDungs[index].disabled = false;
    }
}

function UnDisableAll_Blur() {
    NgayKhoiHanh.disabled = false;
    GioKhoiHanh.disabled = false;
    var DiemDung_Item_NgayDens = document.querySelectorAll('.DiemDung_Item_NgayDen');
    var DiemDung_Item_GioDens = document.querySelectorAll('.DiemDung_Item_GioDen');
    var DiemDung_Item_ThoiGianDungs = document.querySelectorAll('.DiemDung_Item_ThoiGianDung');
    var DiemDung_Item_Xoas = document.querySelectorAll('.DiemDung_Item_Xoa');
    for (let i = 1; i < DiemDung_Item_NgayDens.length; i++) {
        DiemDung_Item_NgayDens[i].disabled = false;
        DiemDung_Item_GioDens[i].disabled = false;
        DiemDung_Item_ThoiGianDungs[i].disabled = false;
        DiemDung_Item_Xoas[i].disabled = false;
    }
}

// Hàm thêm SBTG
function ThemSBTG() {
    const node = document.querySelector('.DiemDung_Item').cloneNode(true);
    node.classList.remove('d-none');

    // Thứ tự
    var index = document.querySelectorAll('.DiemDung_Item').length;
    node.querySelector('.DiemDung_Item_ThuTu').value = index;
    node.setAttribute('index', index);
    node.querySelector('.DiemDung_Item_SanBayDung').setAttribute('index', index);
    node.querySelector('.DiemDung_Item_NgayDen').setAttribute('index', index);
    node.querySelector('.DiemDung_Item_GioDen').setAttribute('index', index);
    node.querySelector('.DiemDung_Item_ThoiGianDung').setAttribute('index', index);
    node.querySelector('.DiemDung_Item_GhiChu').setAttribute('index', index);
    node.querySelector('.DiemDung_Item_Xoa').setAttribute('index', index);

    // Sân bay đến
    const SanBayDung_ul = node.querySelector('.DiemDung_Item_SanBayDung_ul');
    const DiemDung_Item_SanBayDung_lis = SanBayDung_ul.querySelectorAll('.DiemDung_Item_SanBayDung_li');
    for (let i = 0; i < DiemDung_Item_SanBayDung_lis.length; i++) {
        DiemDung_Item_SanBayDung_lis[i].addEventListener('click', (e) => {
            // check trùng sân bay
            let MaSB_click = e.target.querySelector('.DiemDung_Item_SanBayDung_li_MaSanBay').innerText;
            let MaSB_Di = data_send.MaSanBayDi;
            let MaSB_Den = data_send.MaSanBayDen;

            var index = parseInt(
                e.target.closest('.input-group').querySelector('.DiemDung_Item_SanBayDung').getAttribute('index'),
            );
            var header = 'Điểm dừng thứ ' + index;
            var index_data_send_SBTG = -1;

            if (MaSB_Di != '' && MaSB_click == MaSB_Di) {
                showToast({
                    header: header,
                    body: 'Sân bay không trùng sân bay đi',
                    duration: 5000,
                    type: 'warning',
                });
                return;
            }
            if (MaSB_Den != '' && MaSB_click == MaSB_Den) {
                showToast({
                    header: header,
                    body: 'Sân bay không trùng sân bay đến',
                    duration: 5000,
                    type: 'warning',
                });
                return;
            }
            for (let y = 0; y < data_send.SBTG.length; y++) {
                if (index == data_send.SBTG[y].ThuTu) {
                    index_data_send_SBTG = y;
                    continue;
                }
                if (MaSB_click == data_send.SBTG[y].MaSanBay) {
                    showToast({
                        header: header,
                        body: 'Chuyến bay đã dừng ở sân bay này',
                        duration: 5000,
                        type: 'warning',
                    });
                    return;
                }
            }

            var input = e.target.closest('.input-group').querySelector('.DiemDung_Item_SanBayDung');

            input.setAttribute('masanbay', MaSB_click);
            input.setAttribute('value', e.target.querySelector('.DiemDung_Item_SanBayDung_li_TenSanBay').innerText);

            data_send.SBTG[index_data_send_SBTG].MaSanBay = MaSB_click;
            On_off_NutNhanLich();
        });
    }

    // Ngày đến
    node.querySelector('.DiemDung_Item_NgayDen').addEventListener('change', (e) => {
        var index = parseInt(e.target.getAttribute('index'));
        if (e.target.value != '') {
            const GioDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_GioDen');
            if (GioDen.value != '') {
                const ThoiGianDung = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_ThoiGianDung');
                if (ThoiGianDung.value != '') {
                    var ChanTruoc = GetChanTruoc(index);
                    var GiaTri = new Date(e.target.value + ' ' + GioDen.value + ':00');

                    var NgayGioDen_ThongBao = e.target.closest('.DiemDung_Item').querySelector('.NgayGioDen_ThongBao');
                    if (ChanTruoc != null && ChanTruoc > GiaTri) {
                        NgayGioDen_ThongBao.classList.add('text-danger');
                        e.target.value = '';
                        GioDen.value = '';
                        e.target.focus();
                        On_off_ThemDiemDung();
                        CapNhatThongBao_ThoiGianBay();
                        On_off_NutNhanLich();
                        return;
                    }
                    NgayGioDen_ThongBao.classList.remove('text-danger');

                    var temp = data_send.SBTG.find((item) => item.ThuTu == index);
                    temp.NgayDen = structuredClone(CreateObjectFromDate(GiaTri).Ngay);
                    temp.GioDen = structuredClone(CreateObjectFromDate(GiaTri).Gio);

                    CapNhatThongBao_ThoiGianDen(index);

                    var ChanTruoc_Sau = GetChanTruoc(index + 1);
                    var GiaTri_Sau = GetChanSau(index);
                    if (GiaTri_Sau != null && ChanTruoc_Sau > GiaTri_Sau) {
                        var DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
                        for (let i = index + 1; i < DiemDung_Items.length; i++) {
                            var NgayGioDen_ThongBao_Sau = DiemDung_Items[i].querySelector('.NgayGioDen_ThongBao');
                            if (i == index + 1) {
                                NgayGioDen_ThongBao_Sau.classList.add('text-danger');
                                NgayGioDen_ThongBao_Sau.classList.remove('d-none');
                            } else {
                                NgayGioDen_ThongBao_Sau.classList.remove('text-danger');
                                NgayGioDen_ThongBao_Sau.classList.add('d-none');
                            }

                            DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').value = '';
                            DiemDung_Items[i].querySelector('.DiemDung_Item_GioDen').value = '';
                        }
                        DiemDung_Items[index + 1].querySelector('.DiemDung_Item_NgayDen').focus();
                        On_off_ThemDiemDung();
                        CapNhatThongBao_ThoiGianBay();
                        On_off_NutNhanLich();
                        return;
                    }

                    On_off_ThemDiemDung();
                    CapNhatThongBao_ThoiGianBay();
                    On_off_NutNhanLich();
                }
            }
        }
    });
    node.querySelector('.DiemDung_Item_NgayDen').addEventListener('blur', (e) => {
        var index = parseInt(e.target.getAttribute('index'));
        const GioDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_GioDen');
        const ThoiGianDung = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_ThoiGianDung');
        if (e.target.value != '') {
            if (GioDen.value == '') {
                GioDen.focus();
            } else if (ThoiGianDung.value == '') {
                ThoiGianDung.focus();
            } else {
                UnDisableAll_Blur();
            }
        } else {
            if (GioDen.value != '' || ThoiGianDung.value != '') {
                showToast({
                    header: 'Điểm dừng thứ ' + index,
                    body: 'Ngày đến không được trống!',
                    duration: 5000,
                    type: 'danger',
                });
                e.target.focus();
            }
        }
    });
    node.querySelector('.DiemDung_Item_NgayDen').addEventListener('focus', (e) => {
        var index = parseInt(e.target.getAttribute('index'));
        DisableAll_Focus(index);
    });

    // Giờ đến
    node.querySelector('.DiemDung_Item_GioDen').addEventListener('change', (e) => {
        var index = parseInt(e.target.getAttribute('index'));
        if (e.target.value != '') {
            const NgayDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_NgayDen');
            if (NgayDen.value != '') {
                const ThoiGianDung = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_ThoiGianDung');
                if (ThoiGianDung.value != '') {
                    var ChanTruoc = GetChanTruoc(index);
                    var GiaTri = new Date(NgayDen.value + ' ' + e.target.value + ':00');

                    var NgayGioDen_ThongBao = e.target.closest('.DiemDung_Item').querySelector('.NgayGioDen_ThongBao');
                    if (ChanTruoc != null && ChanTruoc > GiaTri) {
                        NgayGioDen_ThongBao.classList.add('text-danger');
                        e.target.value = '';
                        NgayDen.value = '';
                        NgayDen.focus();
                        On_off_ThemDiemDung();
                        CapNhatThongBao_ThoiGianBay();
                        On_off_NutNhanLich();
                        return;
                    }
                    NgayGioDen_ThongBao.classList.remove('text-danger');

                    var temp = data_send.SBTG.find((item) => item.ThuTu == index);
                    temp.NgayDen = structuredClone(CreateObjectFromDate(GiaTri).Ngay);
                    temp.GioDen = structuredClone(CreateObjectFromDate(GiaTri).Gio);

                    CapNhatThongBao_ThoiGianDen(index);

                    var ChanTruoc_Sau = GetChanTruoc(index + 1);
                    var GiaTri_Sau = GetChanSau(index);
                    if (GiaTri_Sau != null && ChanTruoc_Sau > GiaTri_Sau) {
                        var DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
                        for (let i = index + 1; i < DiemDung_Items.length; i++) {
                            var NgayGioDen_ThongBao_Sau = DiemDung_Items[i].querySelector('.NgayGioDen_ThongBao');
                            if (i == index + 1) {
                                NgayGioDen_ThongBao_Sau.classList.add('text-danger');
                                NgayGioDen_ThongBao_Sau.classList.remove('d-none');
                            } else {
                                NgayGioDen_ThongBao_Sau.classList.remove('text-danger');
                                NgayGioDen_ThongBao_Sau.classList.add('d-none');
                            }

                            DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').value = '';
                            DiemDung_Items[i].querySelector('.DiemDung_Item_GioDen').value = '';
                        }
                        DiemDung_Items[index + 1].querySelector('.DiemDung_Item_NgayDen').focus();
                        On_off_ThemDiemDung();
                        CapNhatThongBao_ThoiGianBay();
                        On_off_NutNhanLich();
                        return;
                    }

                    On_off_ThemDiemDung();
                    CapNhatThongBao_ThoiGianBay();
                    On_off_NutNhanLich();
                }
            }
        }
    });
    node.querySelector('.DiemDung_Item_GioDen').addEventListener('blur', (e) => {
        var index = parseInt(e.target.getAttribute('index'));
        const NgayDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_NgayDen');
        const ThoiGianDung = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_ThoiGianDung');
        if (e.target.value != '') {
            if (NgayDen.value == '') {
                NgayDen.focus();
            } else if (ThoiGianDung.value == '') {
                ThoiGianDung.focus();
            } else {
                UnDisableAll_Blur();
            }
        } else {
            if (NgayDen.value != '' || ThoiGianDung.value != '') {
                showToast({
                    header: 'Điểm dừng thứ ' + index,
                    body: 'Giờ đến không được trống!',
                    duration: 5000,
                    type: 'danger',
                });
                e.target.focus();
            }
        }
    });
    node.querySelector('.DiemDung_Item_GioDen').addEventListener('focus', (e) => {
        var index = parseInt(e.target.getAttribute('index'));
        DisableAll_Focus(index);
    });

    // Thời gian dừng
    node.querySelector('.DiemDung_Item_ThoiGianDung').addEventListener('change', (e) => {
        var index = parseInt(e.target.getAttribute('index'));
        if (e.target.value != '') {
            if (parseInt(e.target.value) < ThoiGianDungToiThieu) {
                e.target.value = ThoiGianDungToiThieu;
                showToast({
                    header: 'Điểm dừng thứ ' + index,
                    body: 'Thời gian dừng tối thiểu ' + ThoiGianDungToiThieu + ' phút',
                    duration: 5000,
                    type: 'danger',
                });
            }
            const NgayDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_NgayDen');
            if (NgayDen.value != '') {
                const GioDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_GioDen');
                if (GioDen.value != '') {
                    var temp = data_send.SBTG.find((item) => item.ThuTu == index);
                    temp.ThoiGianDung = parseInt(e.target.value);

                    CapNhatThongBao_ThoiGianDen(index);

                    var ChanTruoc_Sau = GetChanTruoc(index + 1);
                    var GiaTri_Sau = GetChanSau(index);
                    if (GiaTri_Sau != null && ChanTruoc_Sau > GiaTri_Sau) {
                        var DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
                        for (let i = index + 1; i < DiemDung_Items.length; i++) {
                            var NgayGioDen_ThongBao_Sau = DiemDung_Items[i].querySelector('.NgayGioDen_ThongBao');
                            if (i == index + 1) {
                                NgayGioDen_ThongBao_Sau.classList.add('text-danger');
                                NgayGioDen_ThongBao_Sau.classList.remove('d-none');
                            } else {
                                NgayGioDen_ThongBao_Sau.classList.remove('text-danger');
                                NgayGioDen_ThongBao_Sau.classList.add('d-none');
                            }

                            DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').value = '';
                            DiemDung_Items[i].querySelector('.DiemDung_Item_GioDen').value = '';
                        }
                        DiemDung_Items[index + 1].querySelector('.DiemDung_Item_NgayDen').focus();
                        On_off_ThemDiemDung();
                        CapNhatThongBao_ThoiGianBay();
                        On_off_NutNhanLich();
                        return;
                    }

                    On_off_ThemDiemDung();
                    CapNhatThongBao_ThoiGianBay();
                    On_off_NutNhanLich();
                }
            }
        } else {
            e.target.value = ThoiGianDungToiThieu;
            showToast({
                header: 'Điểm dừng thứ ' + index,
                body: 'Thời gian dừng tối thiểu ' + ThoiGianDungToiThieu + ' phút',
                duration: 5000,
                type: 'danger',
            });
        }
        On_off_NutNhanLich();
    });
    node.querySelector('.DiemDung_Item_ThoiGianDung').addEventListener('blur', (e) => {
        var index = parseInt(e.target.getAttribute('index'));
        const NgayDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_NgayDen');
        const GioDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_GioDen');
        if (e.target.value != '') {
            if (NgayDen.value == '') {
                NgayDen.focus();
            } else if (GioDen.value == '') {
                GioDen.focus();
            } else {
                e.target
                    .closest('.DiemDung_Item')
                    .querySelector('.ThoiGianDung_ThongBao')
                    .classList.remove('text-danger');
            }
        }
    });
    node.querySelector('.DiemDung_Item_ThoiGianDung').addEventListener('focus', (e) => {
        var index = parseInt(e.target.getAttribute('index'));
        const NgayDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_NgayDen');
        const GioDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_GioDen');
        if (NgayDen.value == '') {
            showToast({
                header: 'Điểm dừng thứ ' + index,
                body: 'Vui lòng chọn ngày đến trước',
                duration: 5000,
                type: 'danger',
            });
            NgayDen.focus();
        } else if (GioDen.value == '') {
            showToast({
                header: 'Điểm dừng thứ ' + index,
                body: 'Vui lòng chọn giờ đến trước',
                duration: 5000,
                type: 'danger',
            });
            GioDen.focus();
        } else {
            e.target.closest('.DiemDung_Item').querySelector('.ThoiGianDung_ThongBao').classList.add('text-danger');
        }
    });

    node.querySelector('.DiemDung_Item_ThoiGianDung').value = ThoiGianDungToiThieu;
    node.querySelector('.DiemDung_Item_ThoiGianDung').setAttribute('min', ThoiGianDungToiThieu);
    node.querySelector('.ThoiGianDung_ThongBao').classList.remove('d-none');
    node.querySelector('.ThoiGianDung_ThongBao').innerText =
        'Tối thiểu ' + numberSmallerTen(ThoiGianDungToiThieu) + ' phút';

    // Ghi chú
    node.querySelector('.DiemDung_Item_GhiChu').addEventListener('change', (e) => {
        data_send.SBTG.find((item) => item.ThuTu == index).GhiChu = e.target.value;
        On_off_NutNhanLich();
    });

    // Nút xóa
    const DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
    if (DiemDung_Items.length > 1) {
        const lastitem = DiemDung_Items[DiemDung_Items.length - 1].querySelector('.DiemDung_Item_Xoa');
        lastitem.classList.add('d-none');
    }
    const NutXoa = node.querySelector('.DiemDung_Item_Xoa');
    NutXoa.classList.remove('d-none');
    NutXoa.addEventListener('click', (e) => {
        const DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
        const sublastitem = DiemDung_Items[DiemDung_Items.length - 2].querySelector('.DiemDung_Item_Xoa');
        var index = parseInt(sublastitem.getAttribute('index'));
        if (DiemDung_Items.length - 1 > 1) {
            sublastitem.classList.remove('d-none');
        }
        document.getElementById('DiemDung_Container').removeChild(e.target.closest('.DiemDung_Item'));
        data_send.SBTG.pop();
        On_off_ThemDiemDung();
        CapNhatThongBao_ThoiGianBay();
        On_off_NutNhanLich();
    });

    DiemDung_Container.appendChild(node);

    data_send.SBTG.push({
        ThuTu: index,
        MaSanBay: '',
        NgayDen: { Ngay: -1, Thang: -1, Nam: -1 },
        GioDen: { Gio: -1, Phut: -1 },
        ThoiGianDung: ThoiGianDungToiThieu,
        GhiChu: '',
    });
    CapNhatThongBao_ThoiGianDen(index - 1);
    On_off_ThemDiemDung();
    On_off_NutNhanLich();
}

// Thêm hạng ghế
function ThemHG() {
    const node = document.querySelector('.HangGhe_Item').cloneNode(true);
    node.classList.remove('d-none');

    // Hạng vé
    const HangGhe_Item_MaHangVe_ul = node.querySelector('.HangGhe_Item_MaHangVe_ul');
    const HangGhe_Item_MaHangVe_lis = HangGhe_Item_MaHangVe_ul.querySelectorAll('.HangGhe_Item_MaHangVe_li');
    for (let i = 0; i < HangGhe_Item_MaHangVe_lis.length; i++) {
        HangGhe_Item_MaHangVe_lis[i].addEventListener('click', (e) => {
            var MaHangGhe = e.target.querySelector('.HangGhe_Item_MaHangVe_li_Ma').innerText;
            var TenHangGhe = e.target.querySelector('.HangGhe_Item_MaHangVe_li_Ten').innerText;
            var HeSo = parseFloat(e.target.querySelector('.HangGhe_Item_MaHangVe_li_HeSo').innerText);

            var HangGhe_Item_MaHangVes = document.querySelectorAll('.HangGhe_Item_MaHangVe');
            for (let j = 1; j < HangGhe_Item_MaHangVes.length; j++) {
                if (HangGhe_Item_MaHangVes[j].getAttribute('mahangve') == MaHangGhe) {
                    showToast({
                        header: TenHangGhe,
                        body: 'Hạng ghế đã tồn tại.',
                        duration: 5000,
                        type: 'warning',
                    });
                    return;
                }
            }
            var input = e.target.closest('.HangGhe_Item').querySelector('.HangGhe_Item_MaHangVe');

            input.value = TenHangGhe;
            input.setAttribute('mahangve', MaHangGhe);
            input.setAttribute('heso', HeSo);

            var GiaTien = e.target.closest('.HangGhe_Item').querySelector('.HangGhe_Item_GiaVe');
            GiaTien.value = numberWithDot(parseInt(numberWithoutDot(GiaVeCoBan.value)) * HeSo);
            GiaTien.setAttribute('heso', HeSo);
            On_off_NutNhanLich();
        });
    }

    // Tổng số vé
    node.querySelector('.HangGhe_Item_TongSoVe').setAttribute('value', 0);
    node.querySelector('.HangGhe_Item_TongSoVe').setAttribute('min', 0);
    node.querySelector('.HangGhe_Item_TongSoVe').addEventListener('change', (e) => {
        if (e.target.value == '') {
            e.target.value = '0';
        } else if (parseInt(e.target.value) < 0) {
            e.target.value = '0';
        }
        On_off_NutNhanLich();
    });

    // Nút xóa
    const NutXoa = node.querySelector('.HangGhe_Item_Xoa');
    if (NutXoa.classList.contains('d-none')) {
        NutXoa.classList.remove('d-none');
    }
    NutXoa.addEventListener('click', (e) => {
        document.getElementById('HangGhe_Container').removeChild(e.target.closest('.HangGhe_Item'));
        On_off_ThemHangGhe();
        On_off_NutNhanLich();
    });

    HangGhe_Container.appendChild(node);
    On_off_ThemHangGhe();
    On_off_NutNhanLich();
}

function On_off_ThemHangGhe() {
    var block = false;
    if (GiaVeCoBan.value == '') {
        block = true;
    }

    if (block == true) {
        HangGhe_ThongBao.innerText = 'Vui lòng nhập giá vé cơ bản trước.';
        HangGhe_ThongBao.classList.remove('text-danger');
        HangGhe_ThongBao.classList.remove('d-none');
    } else {
        if (document.querySelectorAll('.HangGhe_Item').length <= 1) {
            HangGhe_ThongBao.innerText = 'Yêu cầu chuyến bay có ít nhất 1 hạng vé.';
            HangGhe_ThongBao.classList.add('text-danger');
            HangGhe_ThongBao.classList.remove('d-none');
        } else {
            HangGhe_ThongBao.classList.add('d-none');
        }
    }

    var HangGhe_Item_MaHangVe_ul = document.querySelector('.HangGhe_Item_MaHangVe_ul');
    var HangGhe_Item_MaHangVe_lis = HangGhe_Item_MaHangVe_ul.querySelectorAll('.HangGhe_Item_MaHangVe_li');

    var HangGhe_Items = document.querySelectorAll('.HangGhe_Item');
    if (HangGhe_Items.length - 1 >= HangGhe_Item_MaHangVe_lis.length) {
        block = true;
    }
    ThemHangGhe.disabled = block;
}

// Hàm kiểm mọi thứ đã thay đổi hay chưa -- duyệt
function CheckTrongHoacThayDoi(isshowtoast) {
    var header = '';
    var body = '';
    var check = false;

    if (NgayKhoiHanh.value == '') {
        header = 'Ngày khởi hành';
        body = 'Không được trống.';
        check = true;
    } else if (GioKhoiHanh.value == '') {
        header = 'Giờ khởi hành';
        body = 'Không được trống.';
        check = true;
    } else if (ThoiGianBay.value == '' || parseInt(ThoiGianBay.value) < parseInt(ThoiGianBay.getAttribute('min'))) {
        header = 'Thời gian bay';
        body = 'Không được trống.';
        check = true;
    } else if (GiaVeCoBan.value == '' || parseInt(GiaVeCoBan.value) < parseInt(GiaVeCoBan.getAttribute('min'))) {
        header = 'Giá vé cơ bản';
        body = 'Không được trống.';
        check = true;
    } else {
        var DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
        for (let i = 1; i < DiemDung_Items.length; i++) {
            var SanBay = DiemDung_Items[i].querySelector('.DiemDung_Item_SanBayDung').value;
            var NgayDen = DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').value;
            var GioDen = DiemDung_Items[i].querySelector('.DiemDung_Item_GioDen').value;
            header = 'Điểm dừng ' + i;
            if (SanBay == '') {
                body = 'Sân bay đến đang trống.';
                check = true;
                break;
            } else if (NgayDen == '') {
                body = 'Ngày đến đang trống.';
                check = true;
                break;
            } else if (GioDen == '') {
                body = 'Giờ đến đang trống.';
                check = true;
                break;
            }
        }
        if (check == false) {
            var HangGhe_Items = document.querySelectorAll('.HangGhe_Item');
            if (HangGhe_Items.length <= 1) {
                check = true;
            }
            for (let i = 1; i < HangGhe_Items.length; i++) {
                var HangVe = HangGhe_Items[i].querySelector('.HangGhe_Item_MaHangVe').value;
                header = 'Hạng ghế thứ ' + i;
                if (HangVe == '') {
                    body = 'Tên hạng ghế đang trống.';
                    check = true;
                    break;
                }
            }
        }
    }

    if (check == true && isshowtoast == true) {
        showToast({
            header: header,
            body: body,
            duration: 5000,
            type: 'warning',
        });
    }
    return check;
}

function On_off_NutNhanLich() {
    if (CheckTrongHoacThayDoi(false) != false) {
        NhanLichChuyenBay.disabled = true;
    } else {
        NhanLichChuyenBay.disabled = false;
    }
}

function SendForm_NhanLich() {
    openLoader('Chờ chút');
    axios({
        method: 'post',
        // Trí
        url: '/flight/addByTay',
        data: data_send,
    }).then((res) => {
        var body = '';
        var type = '';
        if (res.data == true) {
            body = 'Thành công';
            type = 'success';
        } else if (res.data == false) {
            body = 'Thất bại';
            type = 'danger';
        }
        openLoader(body);
        closeLoader();
        showToast({
            header: 'Cập nhật chuyến bay',
            body: body,
            duration: 5000,
            type: type,
        });
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    });
}
