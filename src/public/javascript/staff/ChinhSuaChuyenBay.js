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
    money_format_input,
    validateEmail,
} from '../start.js';

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

let Flight_Edit;

let SanBayTG;
let Mang_Update_SBTG = [];
let SBTG_Max_DB = 5;
let SBTG_Max_Cur = 5;
let ThoiGianBayToiThieu = 30;
let ThoiGianBayCur = 0;
let ThoiGianDungToiThieu = 15;
let GiaVeCoBan_Min = 300000;
let ThoiGianKhoiHanh_ChinhSua_ToiThieu = 180;
let BatDauChinhSua = Date.now();

let HangGhe;
function GetFlight_Edit() {
    openLoader('Chờ chút');
    Flight_Edit = JSON.parse(document.getElementById('Flight_EditJS').getAttribute('Flight_EditJS'));

    console.log(Flight_Edit);

    // Gán thông tin chuyến bay cố định
    document.getElementById('MaChuyenBay').value = Flight_Edit.MaChuyenBayHienThi;
    document.getElementById('SanBayDi').value = Flight_Edit.SanBayDi.TenSanBay;
    document.getElementById('SanBayDi').setAttribute('masanbay', Flight_Edit.SanBayDi.MaSanBay);
    document.getElementById('SanBayDen').value = Flight_Edit.SanBayDen.TenSanBay;
    document.getElementById('SanBayDen').setAttribute('masanbay', Flight_Edit.SanBayDen.MaSanBay);
    document.getElementById('TrangThai').setAttribute('giatri', Flight_Edit.TrangThai);
    if (Flight_Edit.TrangThai == 'ChuaKhoiHanh') {
        document.getElementById('TrangThai').value = 'Chưa khởi hành';
    } else if (Flight_Edit.TrangThai == 'DaKhoiHanh') {
        document.getElementById('TrangThai').value = 'Đã khởi hành';
    } else document.getElementById('TrangThai').value = 'Đã hủy';

    let NgayDiString =
        Flight_Edit.ThoiGianDi.NgayDi.Nam +
        '-' +
        Flight_Edit.ThoiGianDi.NgayDi.Thang +
        '-' +
        Flight_Edit.ThoiGianDi.NgayDi.Ngay;
    document.getElementById('NgayKhoiHanh').value = NgayDiString;

    document
        .getElementById('GioKhoiHanh')
        .setAttribute(
            'value',
            numberSmallerTen(Flight_Edit.ThoiGianDi.GioDi.Gio) +
                ':' +
                numberSmallerTen(Flight_Edit.ThoiGianDi.GioDi.Phut),
        );

    document.getElementById('ThoiGianBay').value = Flight_Edit.ThoiGianBay;
    ThoiGianBayCur = Flight_Edit.ThoiGianBay;
    document.getElementById('ThoiGianBay').setAttribute('min', ThoiGianBayToiThieu);

    document.getElementById('GiaVeCoBan').value = numberWithDot(Flight_Edit.GiaVeCoBan);
    document.getElementById('GiaVeCoBan').setAttribute('min', GiaVeCoBan_Min);

    Flight_Edit.SanBayTG.sort((a, b) => {
        if (a.ThuTu > b.ThuTu) return 1;
    });

    //Hàm chạy lần đầu để dô đây
    LoadSBTGLenView();
    LoadHGLenView();
    closeLoader();
}
if (!Flight_Edit) GetFlight_Edit();

// Ngày khởi hành
if (NgayKhoiHanh) {
    NgayKhoiHanh.addEventListener('change', (e) => {
        var index = 0;
        if (e.target.value != '') {
            // GioKhoiHanh
            if (GioKhoiHanh.value != '') {
                if (
                    Check_ThGianDen_SBTG(parseInt(index), new Date(e.target.value + ' ' + GioKhoiHanh.value + ':00')) ==
                    true
                ) {
                    Mang_Update_SBTG[index].GiaTri = new Date(e.target.value + ' ' + GioKhoiHanh.value + ':00');
                    On_Off_NutThem();
                } else {
                    var thgian = new Date(Mang_Update_SBTG[index].GiaTri.getTime());
                    if (thgian != null) {
                        var year = thgian.getFullYear();
                        var month = thgian.getMonth() + 1;
                        var day = thgian.getDate();
                        e.target.value = year + '-' + numberSmallerTen(month) + '-' + numberSmallerTen(day);
                    } else e.target.value = '';
                }
            }
        }
    });
    NgayKhoiHanh.addEventListener('focus', (e) => {
        var index = -1;
        Mang_Update_SBTG.forEach((item) => {
            if (item.GiaTri == null) {
                index = item.index;
            }
        });
        if (index != -1) {
            const DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
            for (let i = 1; i < DiemDung_Items.length; i++) {
                if (DiemDung_Items[i].getAttribute('index') == index.toString()) {
                    if (DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').value == '') {
                        DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').focus();
                    } else if (DiemDung_Items[i].querySelector('.DiemDung_Item_GioDen').value == '') {
                        DiemDung_Items[i].querySelector('.DiemDung_Item_GioDen').focus();
                    } else {
                        DiemDung_Items[i].querySelector('.DiemDung_Item_ThoiGianDung').focus();
                    }
                    showToast({
                        header: 'Điểm dừng còn trống',
                        body: 'Vui lòng chọn thời gian đến trước khi chỉnh sửa thời gian khởi hành.',
                        duration: 5000,
                        type: 'danger',
                    });
                    break;
                }
            }
        }
    });
    NgayKhoiHanh.addEventListener('blur', (e) => {
        var index = 0;
        // GioKhoiHanh
        if (e.target.value != '') {
            if (GioKhoiHanh.value == '') {
                GioKhoiHanh.focus();
            }
        } else {
            if (GioKhoiHanh.value != '') {
                showToast({
                    header: 'Thời gian khởi hành',
                    body: 'Ngày khởi hành không được trống!',
                    duration: 5000,
                    type: 'danger',
                });
                e.target.focus();
            }
        }
    });
}

// Giờ khởi hành
if (GioKhoiHanh) {
    GioKhoiHanh.addEventListener('change', (e) => {
        var index = 0;
        if (e.target.value != '') {
            // NgayKhoiHanh
            if (NgayKhoiHanh.value != '') {
                if (
                    Check_ThGianDen_SBTG(parseInt(index), new Date(NgayKhoiHanh.value + ' ' + e.target.value + ':00'))
                ) {
                    Mang_Update_SBTG[index].GiaTri = new Date(NgayKhoiHanh.value + ' ' + e.target.value + ':00');
                    On_Off_NutThem();
                } else {
                    var thgian = Mang_Update_SBTG[index].GiaTri;
                    if (thgian != null) {
                        var hour = thgian.getHours();
                        var minutes = thgian.getMinutes();
                        e.target.value = numberSmallerTen(hour) + ':' + numberSmallerTen(minutes);
                    } else e.target.value = '';
                }
            }
        }
    });
    GioKhoiHanh.addEventListener('blur', (e) => {
        var index = 0;
        // GioKhoiHanh
        if (e.target.value != '') {
            if (NgayKhoiHanh.value == '') {
                NgayKhoiHanh.focus();
            }
        } else {
            if (NgayKhoiHanh.value != '') {
                showToast({
                    header: 'Thời gian khởi hành',
                    body: 'Thời gian khởi hành không được trống!',
                    duration: 5000,
                    type: 'danger',
                });
                e.target.focus();
            }
        }
    });
    GioKhoiHanh.addEventListener('focus', (e) => {
        var index = -1;
        Mang_Update_SBTG.forEach((item) => {
            if (item.GiaTri == null) {
                index = item.index;
            }
        });
        if (index != -1) {
            const DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
            for (let i = 1; i < DiemDung_Items.length; i++) {
                if (DiemDung_Items[i].getAttribute('index') == index.toString()) {
                    if (DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').value == '') {
                        DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').focus();
                    } else if (DiemDung_Items[i].querySelector('.DiemDung_Item_GioDen').value == '') {
                        DiemDung_Items[i].querySelector('.DiemDung_Item_GioDen').focus();
                    } else {
                        DiemDung_Items[i].querySelector('.DiemDung_Item_ThoiGianDung').focus();
                    }

                    showToast({
                        header: 'Điểm dừng còn trống',
                        body: 'Vui lòng chọn thời gian đến trước khi chỉnh sửa thời gian khởi hành.',
                        duration: 5000,
                        type: 'danger',
                    });
                    break;
                }
            }
        }
    });
}

// Thời gian bay
if (ThoiGianBay) {
    ThoiGianBay.addEventListener('change', (e) => {
        if (e.target.value != '') {
            if (GioKhoiHanh.value != '') {
                if (NgayKhoiHanh.value != '') {
                    var thgianbay_change = parseInt(e.target.value);
                    if (thgianbay_change < ThoiGianBayToiThieu) {
                        showToast({
                            header: 'Thời gian bay',
                            body: 'Thời gian bay tối thiểu là ' + ThoiGianBayToiThieu + ' phút',
                            duration: 5000,
                            type: 'danger',
                        });
                        return;
                    }

                    if (Mang_Update_SBTG.length - 1 == 0) {
                        return;
                    }

                    var ChanTruoc = null;
                    var ChanSau = null;

                    var lastitem = Mang_Update_SBTG[Mang_Update_SBTG.length - 1];
                    ChanTruoc = Mang_Update_SBTG[0].GiaTri;
                    ChanSau = new Date(
                        lastitem.GiaTri.getTime() + 60000 * (lastitem.TGBayToiThieu + lastitem.ThoiGianDung),
                    );

                    var ThoiGianBay_min = (ChanSau.getTime() - ChanTruoc.getTime()) / 60000;

                    if (thgianbay_change < ThoiGianBay_min) {
                        showToast({
                            header: 'Thời gian bay',
                            body: 'Yêu cầu lớn hơn ' + ThoiGianBay_min + ' phút.',
                            duration: 5000,
                            type: 'danger',
                        });
                        e.target.value = ThoiGianBayCur;
                    } else {
                        ThoiGianBayCur = parseInt(e.target.value);
                        On_Off_NutThem();
                    }
                }
            }
        }
    });
}

// --------------------SBTG-----------------------
// Mới dô đưa SBTG lên view
function LoadSBTGLenView() {
    SanBayTG = structuredClone(Flight_Edit.SanBayTG);
    SanBayTG.sort((a, b) => {
        return a.ThuTu - b.ThuTu;
    });

    for (let i = 0; i < SanBayTG.length; i++) {
        var GiaTri;
        var ThoiGianDung;
        var TGBayToiThieu;
        ThoiGianDung = SanBayTG[i].ThoiGianDung;
        TGBayToiThieu = ThoiGianBayToiThieu;
        GiaTri = new Date(
            SanBayTG[i].ThoiGianDen.NgayDen.Nam,
            SanBayTG[i].ThoiGianDen.NgayDen.Thang - 1,
            SanBayTG[i].ThoiGianDen.NgayDen.Ngay,
            SanBayTG[i].ThoiGianDen.GioDen.Gio,
            SanBayTG[i].ThoiGianDen.GioDen.Phut,
            0,
            0,
        );
        if (i == 0) {
            // Thêm Khởi hành
            ThoiGianDung = 0;
            TGBayToiThieu = ThoiGianBayToiThieu;
            GiaTri = new Date(
                Flight_Edit.ThoiGianDi.NgayDi.Nam,
                Flight_Edit.ThoiGianDi.NgayDi.Thang - 1,
                Flight_Edit.ThoiGianDi.NgayDi.Ngay,
                Flight_Edit.ThoiGianDi.GioDi.Gio,
                Flight_Edit.ThoiGianDi.GioDi.Phut,
                0,
                0,
            );

            Mang_Update_SBTG.push({
                index: 0,
                GiaTri: GiaTri,
                ThoiGianDung: ThoiGianDung,
                TGBayToiThieu: TGBayToiThieu,
            });

            // Thêm SBTG đầu
            ThoiGianDung = SanBayTG[i].ThoiGianDung;
            TGBayToiThieu = ThoiGianBayToiThieu;
            GiaTri = new Date(
                SanBayTG[i].ThoiGianDen.NgayDen.Nam,
                SanBayTG[i].ThoiGianDen.NgayDen.Thang - 1,
                SanBayTG[i].ThoiGianDen.NgayDen.Ngay,
                SanBayTG[i].ThoiGianDen.GioDen.Gio,
                SanBayTG[i].ThoiGianDen.GioDen.Phut,
                0,
                0,
            );
        }

        Mang_Update_SBTG.push({
            index: SanBayTG[i].ThuTu,
            GiaTri: GiaTri,
            ThoiGianDung: ThoiGianDung,
            TGBayToiThieu: TGBayToiThieu,
        });

        var SBTG = structuredClone(SanBayTG[i]);
        ThemSBTG(SBTG);
    }
    console.log(Mang_Update_SBTG);
    On_Off_NutThem();
}

// Bật tắt nút thêm
function On_Off_NutThem() {
    SetMinMaxChoThGianDen();
    CapNhatSBTG_Cur();
    if (Mang_Update_SBTG.length - 1 >= SBTG_Max_Cur) {
        ThemDiemDung.disabled = true;
    } else {
        const DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
        for (let i = 1; i < DiemDung_Items.length; i++) {
            if (DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').value == '') {
                ThemDiemDung.disabled = true;
                return;
            } else if (DiemDung_Items[i].querySelector('.DiemDung_Item_GioDen').value == '') {
                ThemDiemDung.disabled = true;
                return;
            }
        }
        ThemDiemDung.disabled = false;
    }
}

// Nút thêm điểm dừng
if (ThemDiemDung) {
    ThemDiemDung.addEventListener('click', (e) => {
        ThemSBTG();
    });
}

// Lấy khoảng dư từ đích -> điểm đến gần nhất
function KhoangDu() {
    var lastitem_CoGiaTri = null;
    Mang_Update_SBTG.forEach((item) => {
        if (item.GiaTri != null) {
            lastitem_CoGiaTri = item;
        }
    });

    var ChanTruoc = new Date(
        lastitem_CoGiaTri.GiaTri.getTime() + 60000 * (lastitem_CoGiaTri.TGBayToiThieu + lastitem_CoGiaTri.ThoiGianDung),
    );

    var ChanSau = new Date(Mang_Update_SBTG[0].GiaTri.getTime() + 60000 * ThoiGianBayCur);
    return (ChanSau.getTime() - ChanTruoc.getTime()) / 60000;
}

// Cập nhật SBTG_Max_Cur
function CapNhatSBTG_Cur() {
    var khoangdu = KhoangDu();
    khoangdu -= khoangdu % 45;
    SBTG_Max_Cur =
        Mang_Update_SBTG.length - 1 + khoangdu / 45 > SBTG_Max_DB
            ? SBTG_Max_DB
            : Mang_Update_SBTG.length - 1 + khoangdu / 45;
}

// Hàm thêm SBTG
function ThemSBTG(SBTG = null) {
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
    node.querySelector('.DiemDung_Item_Luu').setAttribute('index', index);
    node.querySelector('.DiemDung_Item_Huy').setAttribute('index', index);

    // Sân bay đến
    const SanBayDung_ul = node.querySelector('.DiemDung_Item_SanBayDung_ul');
    const DiemDung_Item_SanBayDung_lis = SanBayDung_ul.querySelectorAll('.DiemDung_Item_SanBayDung_li');
    for (let i = 0; i < DiemDung_Item_SanBayDung_lis.length; i++) {
        DiemDung_Item_SanBayDung_lis[i].addEventListener('click', (e) => {
            // check trùng sân bay
            let index = e.target
                .closest('.input-group')
                .querySelector('.DiemDung_Item_SanBayDung')
                .getAttribute('index');
            let MaSB_click = e.target.querySelector('.DiemDung_Item_SanBayDung_li_MaSanBay').innerText;
            let MaSB_Di = document.getElementById('SanBayDi').getAttribute('masanbay');
            let MaSB_Den = document.getElementById('SanBayDen').getAttribute('masanbay');

            let DiemDung_Item_SanBayDungs = document.querySelectorAll('.DiemDung_Item_SanBayDung');

            if (MaSB_click == MaSB_Di) {
                showToast({
                    header: 'Điểm dừng thứ ' + index,
                    body: 'Sân bay dừng không trùng sân bay đi',
                    duration: 5000,
                    type: 'warning',
                });
                return;
            } else if (MaSB_click == MaSB_Den) {
                showToast({
                    header: 'Điểm dừng thứ ' + index,
                    body: 'Sân bay dừng không trùng sân bay đến',
                    duration: 5000,
                    type: 'warning',
                });
                return;
            }

            for (let y = 1; y < DiemDung_Item_SanBayDungs.length; y++) {
                if (DiemDung_Item_SanBayDungs[y].getAttribute('index') == index) continue;
                let masanbay = DiemDung_Item_SanBayDungs[y].getAttribute('masanbay');
                if (masanbay == '') continue;
                else if (masanbay == MaSB_click) {
                    showToast({
                        header: 'Điểm dừng thứ ' + index,
                        body: 'Chuyến bay đã dừng ở sân bay này',
                        duration: 5000,
                        type: 'warning',
                    });
                    return;
                }
            }

            e.target
                .closest('.input-group')
                .querySelector('.DiemDung_Item_SanBayDung')
                .setAttribute('masanbay', MaSB_click);
            e.target
                .closest('.input-group')
                .querySelector('.DiemDung_Item_SanBayDung')
                .setAttribute('value', e.target.querySelector('.DiemDung_Item_SanBayDung_li_TenSanBay').innerText);
        });
    }

    // Ngày đến
    node.querySelector('.DiemDung_Item_NgayDen').addEventListener('change', (e) => {
        var index = e.target.getAttribute('index');
        if (e.target.value != '') {
            const GioDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_GioDen');
            if (GioDen.value != '') {
                const ThoiGianDung = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_ThoiGianDung');
                if (ThoiGianDung.value != '') {
                    if (Check_ThGianDen_SBTG(parseInt(index), new Date(e.target.value + ' ' + GioDen.value + ':00'))) {
                        Mang_Update_SBTG[parseInt(index)].GiaTri = new Date(
                            e.target.value + ' ' + GioDen.value + ':00',
                        );
                        On_Off_NutThem();
                    } else {
                        var thgian = Mang_Update_SBTG[parseInt(index)].GiaTri;
                        if (thgian != null) {
                            var year = thgian.getFullYear();
                            var month = thgian.getMonth() + 1;
                            var day = thgian.getDate();
                            e.target.value = year + '-' + numberSmallerTen(month) + '-' + numberSmallerTen(day);
                        } else e.target.value = '';
                    }
                }
            }
        }
    });
    node.querySelector('.DiemDung_Item_NgayDen').addEventListener('blur', (e) => {
        var index = e.target.getAttribute('index');
        const GioDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_GioDen');
        const ThoiGianDung = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_ThoiGianDung');
        if (e.target.value != '') {
            if (GioDen.value == '') {
                GioDen.focus();
            } else if (ThoiGianDung.value == '') {
                ThoiGianDung.focus();
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

    // Giờ đến
    node.querySelector('.DiemDung_Item_GioDen').addEventListener('change', (e) => {
        var index = e.target.getAttribute('index');
        if (e.target.value != '') {
            const NgayDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_NgayDen');
            if (NgayDen.value != '') {
                const ThoiGianDung = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_ThoiGianDung');
                if (ThoiGianDung.value != '') {
                    if (Check_ThGianDen_SBTG(parseInt(index), new Date(NgayDen.value + ' ' + e.target.value + ':00'))) {
                        Mang_Update_SBTG[parseInt(index)].GiaTri = new Date(
                            NgayDen.value + ' ' + e.target.value + ':00',
                        );
                        On_Off_NutThem();
                    } else {
                        var thgian = Mang_Update_SBTG[parseInt(index)].GiaTri;
                        if (thgian != null) {
                            var hour = thgian.getHours();
                            var minutes = thgian.getMinutes();
                            e.target.value = numberSmallerTen(hour) + ':' + numberSmallerTen(minutes);
                        } else e.target.value = '';
                    }
                }
            }
        }
    });
    node.querySelector('.DiemDung_Item_GioDen').addEventListener('blur', (e) => {
        var index = e.target.getAttribute('index');
        const NgayDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_NgayDen');
        const ThoiGianDung = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_ThoiGianDung');
        if (e.target.value != '') {
            if (NgayDen.value == '') {
                NgayDen.focus();
            } else if (ThoiGianDung.value == '') {
                ThoiGianDung.focus();
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

    // Thời gian dừng
    node.querySelector('.DiemDung_Item_ThoiGianDung').addEventListener('change', (e) => {
        var index = e.target.getAttribute('index');
        if (e.target.value != '') {
            const NgayDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_NgayDen');
            if (NgayDen.value != '') {
                const GioDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_GioDen');
                if (GioDen.value != '') {
                    if (Check_ThGianDung_SBTG(parseInt(index), parseInt(e.target.value))) {
                        Mang_Update_SBTG[parseInt(index)].ThoiGianDung = parseInt(e.target.value);
                        On_Off_NutThem();
                    } else {
                        var thgian = Mang_Update_SBTG[parseInt(index)].ThoiGianDung;
                        e.target.value = numberSmallerTen(thgian);
                    }
                }
            }
        }
    });
    node.querySelector('.DiemDung_Item_ThoiGianDung').addEventListener('blur', (e) => {
        var index = e.target.getAttribute('index');
        const NgayDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_NgayDen');
        const GioDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_GioDen');
        if (e.target.value != '') {
            if (NgayDen.value == '') {
                NgayDen.focus();
            } else if (GioDen.value == '') {
                GioDen.focus();
            }
        } else {
            if (NgayDen.value != '' || GioDen.value != '') {
                showToast({
                    header: 'Điểm dừng thứ ' + index,
                    body: 'Thời gian dừng không được trống!',
                    duration: 5000,
                    type: 'danger',
                });
                e.target.focus();
            }
        }
    });
    node.querySelector('.DiemDung_Item_ThoiGianDung').addEventListener('focus', (e) => {
        const NgayDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_NgayDen');
        const GioDen = e.target.closest('.DiemDung_Item').querySelector('.DiemDung_Item_GioDen');
        if (NgayDen.value == '') {
            e.target.setAttribute('max', ThoiGianDungToiThieu);
            showToast({
                header: 'Điểm dừng thứ ' + index,
                body: 'Vui lòng chọn ngày đến trước',
                duration: 5000,
                type: 'danger',
            });
            NgayDen.focus();
        } else if (GioDen.value == '') {
            e.target.setAttribute('max', ThoiGianDungToiThieu);
            showToast({
                header: 'Điểm dừng thứ ' + index,
                body: 'Vui lòng chọn giờ đến trước',
                duration: 5000,
                type: 'danger',
            });
            GioDen.focus();
        } else {
            e.target.setAttribute('max', 10000);
        }
    });
    node.querySelector('.DiemDung_Item_ThoiGianDung').value = ThoiGianDungToiThieu;
    node.querySelector('.DiemDung_Item_ThoiGianDung').setAttribute('min', ThoiGianDungToiThieu);

    // Nút xóa
    const DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
    if (DiemDung_Items.length > 1) {
        const lastitem = DiemDung_Items[DiemDung_Items.length - 1].querySelector('.DiemDung_Item_Xoa');
        if (!lastitem.classList.contains('d-none')) {
            lastitem.classList.add('d-none');
        }
    }
    const NutXoa = node.querySelector('.DiemDung_Item_Xoa');
    if (NutXoa.classList.contains('d-none')) {
        NutXoa.classList.remove('d-none');
    }
    NutXoa.addEventListener('click', (e) => {
        const DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
        const sublastitem = DiemDung_Items[DiemDung_Items.length - 2].querySelector('.DiemDung_Item_Xoa');
        var index = parseInt(sublastitem.getAttribute('index'));
        if (DiemDung_Items.length - 1 > 1) {
            if (sublastitem.classList.contains('d-none')) {
                sublastitem.classList.remove('d-none');
            }
        }
        Mang_Update_SBTG.pop();
        document.getElementById('DiemDung_Container').removeChild(e.target.closest('.DiemDung_Item'));
        On_Off_NutThem();
        console.log(Mang_Update_SBTG);
    });

    DiemDung_Container.appendChild(node);

    if (SBTG != null) {
        node.querySelector('.DiemDung_Item_SanBayDung').setAttribute('value', SBTG.TenSanBay);
        node.querySelector('.DiemDung_Item_SanBayDung').setAttribute('masanbay', SBTG.MaSBTG);
        node.querySelector('.DiemDung_Item_NgayDen').value =
            SBTG.ThoiGianDen.NgayDen.Nam + '-' + SBTG.ThoiGianDen.NgayDen.Thang + '-' + SBTG.ThoiGianDen.NgayDen.Ngay;
        node.querySelector('.DiemDung_Item_GioDen').value =
            numberSmallerTen(SBTG.ThoiGianDen.GioDen.Gio) + ':' + numberSmallerTen(SBTG.ThoiGianDen.GioDen.Phut);
        node.querySelector('.DiemDung_Item_ThoiGianDung').value = SBTG.ThoiGianDung;
        node.querySelector('.DiemDung_Item_GhiChu').value = SBTG.GhiChu != null ? SBTG.GhiChu : '';
    } else {
        Mang_Update_SBTG.push({
            index: index,
            GiaTri: null,
            ThoiGianDung: ThoiGianDungToiThieu,
            TGBayToiThieu: ThoiGianBayToiThieu,
        });
    }
    On_Off_NutThem();
}

// Hàm check TG SBTG
function Check_ThGianDen_SBTG(index, date_change) {
    if (date_change == null) return false;

    var i = index;
    var ChanTruoc = null;
    if (i == 0) {
        if (Mang_Update_SBTG.length - 1 > 0) {
            var sublastitem = Mang_Update_SBTG[Mang_Update_SBTG.length - 1];
            ChanTruoc = new Date(
                sublastitem.GiaTri.getTime() +
                    (sublastitem.ThoiGianDung + sublastitem.TGBayToiThieu - ThoiGianBayCur) * 60000,
            );
        } else ChanTruoc = new Date(BatDauChinhSua + ThoiGianKhoiHanh_ChinhSua_ToiThieu * 60000);
    } else {
        for (let j = i - 1; j >= 0; j--) {
            if (Mang_Update_SBTG[j].GiaTri != null) {
                ChanTruoc = new Date(
                    Mang_Update_SBTG[j].GiaTri.getTime() +
                        60000 * (Mang_Update_SBTG[j].TGBayToiThieu + Mang_Update_SBTG[j].ThoiGianDung),
                );
                break;
            }
        }
        if (ChanTruoc == null) {
            ChanTruoc = new Date(BatDauChinhSua + ThoiGianKhoiHanh_ChinhSua_ToiThieu * 60000);
        }
    }
    var GiaTri = date_change;
    var ChanSau = null;
    if (i == Mang_Update_SBTG.length - 1) {
        ChanSau = new Date(
            Mang_Update_SBTG[0].GiaTri.getTime() -
                60000 * (Mang_Update_SBTG[i].TGBayToiThieu + Mang_Update_SBTG[i].ThoiGianDung - ThoiGianBayCur),
        );
    } else {
        for (let j = i + 1; j < Mang_Update_SBTG.length; j++) {
            if (Mang_Update_SBTG[j].GiaTri != null) {
                ChanSau = new Date(
                    Mang_Update_SBTG[j].GiaTri.getTime() -
                        60000 * (Mang_Update_SBTG[i].TGBayToiThieu + Mang_Update_SBTG[i].ThoiGianDung),
                );
                break;
            }
        }
        if (ChanSau == null) {
            ChanSau = new Date(
                Mang_Update_SBTG[0].GiaTri.getTime() -
                    60000 * (Mang_Update_SBTG[i].TGBayToiThieu + Mang_Update_SBTG[i].ThoiGianDung - ThoiGianBayCur),
            );
        }
    }

    var header = '';
    var body = '';
    var check = true;
    if (ChanSau.getTime() == ChanTruoc.getTime()) {
        if (i == 0) {
            header = 'Khởi hành';
            body = 'Do ràng buộc không thể thay đổi thời điểm khởi hành.';
        } else {
            header = 'Điểm dừng thứ ' + i;
            body = 'Do ràng buộc không thể thay đổi thời điểm đến.';
        }

        check = false;
    } else if (ChanTruoc > GiaTri) {
        if (i == 0) {
            header = 'Khởi hành';
            body = 'Yêu cầu thời điểm khởi hành';
        } else {
            header = 'Điểm dừng thứ ' + i;
            body = 'Yêu cầu thời điểm dừng';
        }
        body +=
            ' lớn hơn hoặc bằng: <br><br>' +
            numberSmallerTen(ChanTruoc.getDate()) +
            '/' +
            numberSmallerTen(ChanTruoc.getMonth() + 1) +
            '/' +
            ChanTruoc.getFullYear() +
            ' ' +
            numberSmallerTen(ChanTruoc.getHours()) +
            ':' +
            numberSmallerTen(ChanTruoc.getMinutes());
        check = false;
    } else if (GiaTri > ChanSau) {
        if (i == 0) {
            header = 'Khởi hành';
            body = 'Yêu cầu thời điểm khởi hành';
        } else {
            header = 'Điểm dừng thứ ' + i;
            body = 'Yêu cầu thời điểm dừng';
        }
        body +=
            ' nhỏ hơn hoặc bằng: <br><br>' +
            numberSmallerTen(ChanSau.getDate()) +
            '/' +
            numberSmallerTen(ChanSau.getMonth() + 1) +
            '/' +
            ChanSau.getFullYear() +
            ' ' +
            numberSmallerTen(ChanSau.getHours()) +
            ':' +
            numberSmallerTen(ChanSau.getMinutes());
        check = false;
    }
    if (check == false) {
        showToast({
            header: header,
            body: body,
            duration: 5000,
            type: 'danger',
        });
    }
    return check;
}

function Check_ThGianDung_SBTG(index, thgiandung_change) {
    if (thgiandung_change < ThoiGianDungToiThieu) {
        showToast({
            header: 'Điểm dừng thứ ' + index,
            body: 'Thời gian dừng tối thiểu là ' + ThoiGianDungToiThieu + ' phút',
            duration: 5000,
            type: 'danger',
        });
        return false;
    }

    var i = index;
    var ChanTruoc = new Date(Mang_Update_SBTG[i].GiaTri.getTime() + 60000 * Mang_Update_SBTG[i].TGBayToiThieu);

    var GiaTri = thgiandung_change;

    var ChanSau =
        i == Mang_Update_SBTG.length - 1
            ? new Date(Mang_Update_SBTG[0].GiaTri.getTime() + 60000 * ThoiGianBayCur)
            : new Date(Mang_Update_SBTG[i + 1].GiaTri.getTime());

    var ThoiGianDung_max = (ChanSau.getTime() - ChanTruoc.getTime()) / 60000;
    if (ThoiGianDung_max == ThoiGianDungToiThieu) {
        showToast({
            header: 'Điểm dừng thứ ' + i,
            body: 'Do ràng buộc không thể thay đổi thời gian dừng',
            duration: 5000,
            type: 'danger',
        });
        return false;
    }
    if (GiaTri > ThoiGianDung_max) {
        showToast({
            header: 'Điểm dừng thứ ' + i,
            body: 'Thời gian dừng nhỏ hơn hoặc bằng ' + ThoiGianDung_max + ' phút',
            duration: 5000,
            type: 'danger',
        });
        return false;
    }
    return true;
}

// Set min max cho các input date
function SetMinMaxChoThGianDen() {
    const DiemDung_Items = document.querySelectorAll('.DiemDung_Item');

    for (let i = 0; i < DiemDung_Items.length; i++) {
        var ChanTruoc = null;
        if (i == 0) {
            for (let j = Mang_Update_SBTG.length - 1; j > 0; j--) {
                if (Mang_Update_SBTG[j].GiaTri != null) {
                    var sublastitem = Mang_Update_SBTG[j];
                    ChanTruoc = new Date(
                        sublastitem.GiaTri.getTime() +
                            (sublastitem.ThoiGianDung + sublastitem.TGBayToiThieu - ThoiGianBayCur) * 60000,
                    );
                    break;
                }
            }
            if (ChanTruoc == null) {
                ChanTruoc = new Date(BatDauChinhSua + ThoiGianKhoiHanh_ChinhSua_ToiThieu * 60000);
            }
        } else {
            for (let j = i - 1; j >= 0; j--) {
                if (Mang_Update_SBTG[j].GiaTri != null) {
                    ChanTruoc = new Date(
                        Mang_Update_SBTG[j].GiaTri.getTime() +
                            60000 * (Mang_Update_SBTG[j].TGBayToiThieu + Mang_Update_SBTG[j].ThoiGianDung),
                    );
                    break;
                }
            }
            if (ChanTruoc == null) {
                ChanTruoc = new Date(BatDauChinhSua + ThoiGianKhoiHanh_ChinhSua_ToiThieu * 60000);
            }
        }

        var ChanSau = null;
        if (i == Mang_Update_SBTG.length - 1) {
            ChanSau = new Date(
                Mang_Update_SBTG[0].GiaTri.getTime() -
                    60000 * (Mang_Update_SBTG[i].TGBayToiThieu + Mang_Update_SBTG[i].ThoiGianDung - ThoiGianBayCur),
            );
        } else {
            for (let j = i + 1; j < Mang_Update_SBTG.length; j++) {
                if (Mang_Update_SBTG[j].GiaTri != null) {
                    ChanSau = new Date(
                        Mang_Update_SBTG[j].GiaTri.getTime() -
                            60000 * (Mang_Update_SBTG[i].TGBayToiThieu + Mang_Update_SBTG[i].ThoiGianDung),
                    );
                    break;
                }
            }
            if (ChanSau == null) {
                ChanSau = new Date(
                    Mang_Update_SBTG[0].GiaTri.getTime() -
                        60000 * (Mang_Update_SBTG[i].TGBayToiThieu + Mang_Update_SBTG[i].ThoiGianDung - ThoiGianBayCur),
                );
            }
        }

        if (i == 0) {
            NgayKhoiHanh.setAttribute('min', ChanTruoc.yyyymmdd());
            NgayKhoiHanh.setAttribute('max', ChanSau.yyyymmdd());
        } else {
            DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').setAttribute('min', ChanTruoc.yyyymmdd());
            DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').setAttribute('max', ChanSau.yyyymmdd());
        }
    }
}

// -----------------Hạng ghế--------------
// Mới dô đưa HG lên view
function LoadHGLenView() {
    HangGhe = structuredClone(Flight_Edit.HangVe);
    HangGhe.sort((a, b) => {
        return a.GiaTien - b.GiaTien;
    });
    for (let i = 0; i < HangGhe.length; i++) {
        var HG = structuredClone(HangGhe[i]);
        ThemHG(HG);
    }
}

// Nút thêm hạng ghế
const ThemHangGhe = document.getElementById('ThemHangGhe');
if (ThemHangGhe) {
    ThemHangGhe.addEventListener('click', (e) => {
        ThemHG();
    });
}

function ThemHG(HG = null) {
    const node = document.querySelector('.HangGhe_Item').cloneNode(true);
    node.classList.remove('d-none');

    // Nút xóa
    const HangGhe_Items = document.querySelectorAll('.HangGhe_Item');
    if (HangGhe_Items.length > 1) {
        const lastitem = HangGhe_Items[HangGhe_Items.length - 1].querySelector('.HangGhe_Item_Xoa');
        if (!lastitem.classList.contains('d-none')) {
            lastitem.classList.add('d-none');
        }
    }
    const NutXoa = node.querySelector('.HangGhe_Item_Xoa');
    if (NutXoa.classList.contains('d-none')) {
        NutXoa.classList.remove('d-none');
    }
    NutXoa.addEventListener('click', (e) => {
        const HangGhe_Items = document.querySelectorAll('.HangGhe_Item');
        if (HangGhe_Items.length - 1 > 1) {
            const sublastitem = HangGhe_Items[HangGhe_Items.length - 2].querySelector('.HangGhe_Item_Xoa');
            if (sublastitem.classList.contains('d-none')) {
                sublastitem.classList.remove('d-none');
            }
        }
        document.getElementById('HangGhe_Container').removeChild(e.target.closest('.HangGhe_Item'));
    });

    if (HG != null) {
        node.querySelector('.HangGhe_Item_MaHangVe').setAttribute('value', HG.TenHangVe);
        node.querySelector('.HangGhe_Item_MaHangVe').setAttribute('mahangve', HG.MaHangVe);
        node.querySelector('.HangGhe_Item_GiaVe').setAttribute('value', numberWithDot(HG.GiaTien));
        node.querySelector('.HangGhe_Item_VeDaPhatHanh').setAttribute(
            'value',
            numberSmallerTen(HG.TongVe - HG.GheTrong),
        );
        node.querySelector('.HangGhe_Item_VeCoSan').setAttribute('value', numberSmallerTen(HG.GheTrong));
    }

    HangGhe_Container.appendChild(node);
}
