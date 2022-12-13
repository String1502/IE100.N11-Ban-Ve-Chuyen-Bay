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
let GiaVeCoBanCur = 300000;
let ThoiGianKhoiHanh_ChinhSua_ToiThieu = 180;
let BatDauChinhSua = Date.now();
let GioiHanThoiGianChinhSua = 15;

let ViPhamQuiDinh = false;

let HangGhe;
function GetFlight_Edit() {
    openLoader('Chờ chút');
    Flight_Edit = JSON.parse(document.getElementById('Flight_EditJS').getAttribute('Flight_EditJS'));

    var SanBays = structuredClone(Flight_Edit.SanBays);
    var HangGhes = structuredClone(Flight_Edit.HangGhes);
    var ThamSos = structuredClone(Flight_Edit.ThamSos);

    axios({
        method: 'post',
        url: '/flight/get-flight',
        data: { MaChuyenBay: Flight_Edit.MaChuyenBay, MaChuyenBayHienThi: Flight_Edit.MaChuyenBayHienThi },
    }).then((res) => {
        Flight_Edit = res.data;
        if (Flight_Edit) {
            Flight_Edit['MaChuyenBayHienThi'] =
                Flight_Edit.SanBayDi.MaSanBay + '-' + Flight_Edit.SanBayDen.MaSanBay + '-' + Flight_Edit.MaChuyenBay;
            Flight_Edit['SanBays'] = SanBays;
            Flight_Edit['HangGhes'] = HangGhes;
            Flight_Edit['ThamSos'] = ThamSos;
            // thêm hệ số vào các phần tử trong mảng Flight_Edit.HangVe
            for (let i = 0; i < Flight_Edit.HangVe.length; i++) {
                var hangve = Flight_Edit.HangGhes.find((item) => item.MaHangGhe == Flight_Edit.HangVe[i].MaHangVe);
                Flight_Edit.HangVe[i].HeSo = hangve.HeSo;
            }

            // Fix ghi chú của SBTG
            Flight_Edit.SanBayTG.map((item) => {
                item.GhiChu = item.GhiChu == null ? '' : item.GhiChu;
            });

            console.log(Flight_Edit);

            if (Flight_Edit.TrangThai == 'ViPhamQuiDinh') {
                ViPhamQuiDinh = true;
                closeLoader();
                KhoiTao_ModalChinhSua();
                var Modal = new bootstrap.Modal(document.getElementById('ModalStaticChinhSua'), true);
                Modal.show();
            } else {
                SBTG_Max_DB = Flight_Edit.SBTG_Max;
                SBTG_Max_Cur = Flight_Edit.SBTG_Max;

                ThoiGianBayToiThieu = Flight_Edit.ThoiGianBayToiThieu;
                ThoiGianBayCur = Flight_Edit.ThoiGianBay;

                ThoiGianDungToiThieu = Flight_Edit.ThoiGianDungToiThieu;

                GiaVeCoBan_Min = Flight_Edit.GiaVeCoBan_Min;
                GiaVeCoBanCur = Flight_Edit.GiaVeCoBan;

                // Gán thông tin chuyến bay cố định
                document.getElementById('MaChuyenBay').value = Flight_Edit.MaChuyenBayHienThi;
                document.getElementById('SanBayDi').value = Flight_Edit.SanBayDi.TenSanBay;
                document.getElementById('SanBayDi').setAttribute('masanbay', Flight_Edit.SanBayDi.MaSanBay);
                document.getElementById('SanBayDen').value = Flight_Edit.SanBayDen.TenSanBay;
                document.getElementById('SanBayDen').setAttribute('masanbay', Flight_Edit.SanBayDen.MaSanBay);
                document.getElementById('TrangThai').setAttribute('giatri', Flight_Edit.TrangThai);

                if (Flight_Edit.TrangThai == 'ChuaKhoiHanh') {
                    document.getElementById('TrangThai').value = 'Chưa khởi hành';
                    document.getElementById('TrangThai').classList.add('text-success-light');
                } else if (Flight_Edit.TrangThai == 'DaKhoiHanh') {
                    document.getElementById('TrangThai').value = 'Đã khởi hành';
                    document.getElementById('TrangThai').classList.add('text-success');
                } else if (Flight_Edit.TrangThai == 'DaHuy') {
                    document.getElementById('TrangThai').value = 'Đã hủy';
                    document.getElementById('TrangThai').classList.add('text-danger');
                } else if (Flight_Edit.TrangThai == 'ViPhamQuiDinh') {
                    document.getElementById('TrangThai').value = 'Vi phạm qui định';
                    document.getElementById('TrangThai').classList.add('text-secondary');
                }

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
        }
    });
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
                    On_Off_LuuThayDoi(false);
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
                    On_Off_LuuThayDoi(false);
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
                        e.target.value = ThoiGianBayCur;
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
                        On_Off_LuuThayDoi(false);
                    }
                }
            }
        } else {
            e.target.value = ThoiGianBayCur;
        }
    });
}

// Giá vé cơ bản
if (GiaVeCoBan) {
    GiaVeCoBan.addEventListener('focus', (e) => {
        e.target.value = numberWithoutDot(e.target.value);
    });
    GiaVeCoBan.addEventListener('blur', (e) => {
        if (e.target.value == '') {
            e.target.value = numberWithDot(GiaVeCoBanCur);
            return;
        }
        var GiaVe = parseInt(numberWithoutDot(e.target.value));
        if (GiaVe < GiaVeCoBan_Min) {
            showToast({
                header: 'Giá vé cơ bản',
                body: 'Tối thiểu là ' + numberWithDot(GiaVeCoBan_Min) + ' vnd.',
                duration: 5000,
                type: 'warning',
            });
            e.target.value = numberWithDot(GiaVeCoBanCur);
        } else {
            GiaVeCoBanCur = parseInt(e.target.value);
            e.target.value = numberWithDot(e.target.value);
            On_Off_LuuThayDoi(false);
        }
    });
    GiaVeCoBan.addEventListener('keyup', (e) => {
        var GiaVe = 0;
        if (e.target.value == '') {
            GiaVe = GiaVeCoBanCur;
        } else {
            GiaVe = parseInt(numberWithoutDot(e.target.value));
            if (GiaVe < GiaVeCoBan_Min) {
                GiaVe = GiaVeCoBanCur;
            }
        }
        var HangGhe_Item_GiaVes = document.querySelectorAll('.HangGhe_Item_GiaVe');
        for (let i = 1; i < HangGhe_Item_GiaVes.length; i++) {
            var HeSo = parseFloat(HangGhe_Item_GiaVes[i].getAttribute('heso'));
            HangGhe_Item_GiaVes[i].value = numberWithDot(GiaVe * HeSo);
        }
    });
}

// Đếm ngược
function KhoiTaoCountDown() {
    // đếm ngược khởi hành
    var x = setInterval(function () {
        var now = new Date().getTime();

        if (
            Mang_Update_SBTG.length < 1 ||
            Mang_Update_SBTG[0].GiaTri == null ||
            NgayKhoiHanh === document.activeElement ||
            GioKhoiHanh === document.activeElement
        ) {
            Timer_Ngay.innerText = '00';
            Timer_Gio.innerText = '00';
            Timer_Phut.innerText = '00';
            Timer_Giay.innerText = '00';
            if (Timer_Card.classList.contains('bg-primary-gradient')) {
                Timer_Card.classList.remove('bg-primary-gradient');
            }
            if (Timer_Card.classList.contains('bg-secondary-gradient')) {
                Timer_Card.classList.remove('bg-secondary-gradient');
            }
            if (!Timer_Card.classList.contains('bg-tertiary')) {
                Timer_Card.classList.add('bg-tertiary');
            }
            return;
        }

        var distance = Mang_Update_SBTG[0].GiaTri.getTime() - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (ThoiGianKhoiHanh_ChinhSua_ToiThieu * 60 * 1000 >= distance) {
            if (Timer_Card.classList.contains('bg-primary-gradient')) {
                Timer_Card.classList.remove('bg-primary-gradient');
            }
            if (Timer_Card.classList.contains('bg-tertiary')) {
                Timer_Card.classList.remove('bg-tertiary');
            }
            if (!Timer_Card.classList.contains('bg-secondary-gradient')) {
                Timer_Card.classList.add('bg-secondary-gradient');
            }
        } else {
            if (Timer_Card.classList.contains('bg-secondary-gradient')) {
                Timer_Card.classList.remove('bg-secondary-gradient');
            }
            if (Timer_Card.classList.contains('bg-tertiary')) {
                Timer_Card.classList.remove('bg-tertiary');
            }
            if (!Timer_Card.classList.contains('bg-primary-gradient')) {
                Timer_Card.classList.add('bg-primary-gradient');
            }
        }

        Timer_Ngay.innerText = numberSmallerTen(days);
        Timer_Gio.innerText = numberSmallerTen(hours);
        Timer_Phut.innerText = numberSmallerTen(minutes);
        Timer_Giay.innerText = numberSmallerTen(seconds);

        // If the count down is over, write some text
        if (distance <= 1) {
            clearInterval(x);
            Timer_Head.innerHTML = 'Đã khởi hành';
        }
    }, 1000);

    // đếm ngược thời gian chỉnh sửa còn lại
    var y = setInterval(function () {
        var now = new Date().getTime();

        var distance = BatDauChinhSua + GioiHanThoiGianChinhSua * 1000 * 60 - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance > 0) {
            TimerRemain_Phut.innerText = numberSmallerTen(minutes);
            TimerRemain_Giay.innerText = numberSmallerTen(seconds);
        } else {
            TimerRemain_Phut.innerText = '00';
            TimerRemain_Giay.innerText = '00';
        }

        // If the count down is over, write some text
        if (distance <= 0) {
            clearInterval(y);

            if (CheckThayDoi(false) != false) {
                var ModalStatic = new bootstrap.Modal(document.getElementById('ModalStatic'), true);
                if (ModalStatic_ThayDoi.classList.contains('d-none')) {
                    ModalStatic_ThayDoi.classList.remove('d-none');
                }
                if (ModalStatic_Luu.classList.contains('d-none')) {
                    ModalStatic_Luu.classList.remove('d-none');
                }
                ModalStatic.show();
            } else {
                var ModalStatic = new bootstrap.Modal(document.getElementById('ModalStatic'), true);
                ModalStatic.show();
            }
        }
    }, 1000);
}

// --------------------SBTG-----------------------
// Mới dô đưa SBTG lên view
function LoadSBTGLenView() {
    SanBayTG = structuredClone(Flight_Edit.SanBayTG);
    SanBayTG.sort((a, b) => {
        return a.ThuTu - b.ThuTu;
    });

    var GiaTri;
    var ThoiGianDung;
    var TGBayToiThieu;
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
    for (let i = 0; i < SanBayTG.length; i++) {
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
    KhoiTaoCountDown();
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
            On_Off_LuuThayDoi(false);
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
                        On_Off_LuuThayDoi(false);
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
                        On_Off_LuuThayDoi(false);
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
                        On_Off_LuuThayDoi(false);
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

    // Ghi chú
    node.querySelector('.DiemDung_Item_GhiChu').addEventListener('change', (e) => {
        On_Off_LuuThayDoi(false);
    });

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
        On_Off_LuuThayDoi(false);
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
if (ThemHangGhe) {
    ThemHangGhe.addEventListener('click', (e) => {
        ThemHG();
    });
}

// Thêm hạng ghế
function ThemHG(HG = null) {
    const node = document.querySelector('.HangGhe_Item').cloneNode(true);
    node.classList.remove('d-none');

    // Hạng vé
    const HangGhe_Item_MaHangVe_ul = node.querySelector('.HangGhe_Item_MaHangVe_ul');
    const HangGhe_Item_MaHangVe_lis = HangGhe_Item_MaHangVe_ul.querySelectorAll('.HangGhe_Item_MaHangVe_li');
    for (let i = 0; i < HangGhe_Item_MaHangVe_lis.length; i++) {
        HangGhe_Item_MaHangVe_lis[i].addEventListener('click', (e) => {
            var MaHangGhe = e.target.querySelector('.HangGhe_Item_MaHangVe_li_Ma').innerText;
            var TenHangGhe = e.target.querySelector('.HangGhe_Item_MaHangVe_li_Ten').innerText;

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
            var heso = parseFloat(e.target.querySelector('.HangGhe_Item_MaHangVe_li_HeSo').innerText);
            input.value = TenHangGhe;
            input.setAttribute('mahangve', MaHangGhe);
            input.setAttribute('heso', heso);
            var GiaTien = e.target.closest('.HangGhe_Item').querySelector('.HangGhe_Item_GiaVe');
            GiaTien.value = numberWithDot(parseInt(numberWithoutDot(GiaVeCoBan.value)) * heso);
            GiaTien.setAttribute('heso', heso);
            On_Off_LuuThayDoi(false);
        });
    }

    // Vé có sẵn
    node.querySelector('.HangGhe_Item_VeCoSan').setAttribute('value', 0);
    node.querySelector('.HangGhe_Item_VeCoSan').setAttribute('min', 0);
    node.querySelector('.HangGhe_Item_VeCoSan').addEventListener('change', (e) => {
        On_Off_LuuThayDoi(false);
    });

    // Vé đã phát hành
    node.querySelector('.HangGhe_Item_VeDaPhatHanh').setAttribute('value', 0);
    node.querySelector('.HangGhe_Item_VeDaPhatHanh').setAttribute('min', 0);

    // Nút xóa
    const HangGhe_Items = document.querySelectorAll('.HangGhe_Item');
    const NutXoa = node.querySelector('.HangGhe_Item_Xoa');
    if (NutXoa.classList.contains('d-none')) {
        NutXoa.classList.remove('d-none');
    }
    NutXoa.addEventListener('click', (e) => {
        document.getElementById('HangGhe_Container').removeChild(e.target.closest('.HangGhe_Item'));
        On_Off_NutThemHG();
        On_Off_LuuThayDoi(false);
    });

    // -----
    if (HG != null) {
        node.querySelector('.HangGhe_Item_MaHangVe').setAttribute('value', HG.TenHangVe);
        node.querySelector('.HangGhe_Item_MaHangVe').setAttribute('mahangve', HG.MaHangVe);
        node.querySelector('.HangGhe_Item_MaHangVe').disabled = true;

        node.querySelector('.HangGhe_Item_GiaVe').setAttribute('value', numberWithDot(HG.GiaTien));
        node.querySelector('.HangGhe_Item_GiaVe').setAttribute('heso', HG.HeSo);
        node.querySelector('.HangGhe_Item_VeDaPhatHanh').setAttribute('value', HG.TongVe - HG.GheTrong);
        node.querySelector('.HangGhe_Item_VeCoSan').setAttribute('value', numberSmallerTen(HG.GheTrong));

        node.querySelector('.HangGhe_Item_Xoa').disabled = true;
    }

    HangGhe_Container.appendChild(node);
    On_Off_NutThemHG();
}

// Bật tắt nút thêm
function On_Off_NutThemHG() {
    var HangGhe_Item_MaHangVes = document.querySelectorAll('.HangGhe_Item_MaHangVe');
    if (HangGhe_Item_MaHangVes.length - 1 >= Flight_Edit.HangGhes.length) {
        ThemHangGhe.disabled = true;
    } else {
        ThemHangGhe.disabled = false;
    }
}

// ----------------
// Hàm kiểm mọi thứ đã thay đổi hay chưa
function CheckTrong(isshowtoast) {
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
    } else if (ThoiGianBay.value == '') {
        header = 'Thời gian bay';
        body = 'Không được trống.';
        check = true;
    } else if (GiaVeCoBan.value == '') {
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

function CheckThayDoi(isshowtoast) {
    var check = CheckTrong(isshowtoast);
    if (check == true) {
        return false;
    }

    // Tạo gói gửi đi
    var data_send = {
        MaChuyenBay: -1,
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

    // Lấy những giá trị current
    var KhoiHanh = new Date(NgayKhoiHanh.value + ' ' + GioKhoiHanh.value + ':00');

    var NgayKhoiHanh_cur = { Ngay: KhoiHanh.getDate(), Thang: KhoiHanh.getMonth() + 1, Nam: KhoiHanh.getFullYear() };
    var GioKhoiHanh_cur = { Gio: KhoiHanh.getHours(), Phut: KhoiHanh.getMinutes() };
    var ThoiGianBay_Cur = parseInt(ThoiGianBay.value);
    var GVCB_cur = parseInt(numberWithoutDot(GiaVeCoBan.value));
    var TrangThai_cur = TrangThai.value;

    if (
        NgayKhoiHanh_cur.Ngay != Flight_Edit.ThoiGianDi.NgayDi.Ngay ||
        NgayKhoiHanh_cur.Thang != Flight_Edit.ThoiGianDi.NgayDi.Thang ||
        NgayKhoiHanh_cur.Nam != Flight_Edit.ThoiGianDi.NgayDi.Nam
    ) {
        data_send.NgayKhoiHanh = structuredClone(NgayKhoiHanh_cur);
        check = true;
    }

    if (
        GioKhoiHanh_cur.Gio != Flight_Edit.ThoiGianDi.GioDi.Gio ||
        GioKhoiHanh_cur.Phut != Flight_Edit.ThoiGianDi.GioDi.Phut
    ) {
        data_send.GioKhoiHanh = structuredClone(GioKhoiHanh_cur);
        check = true;
    }

    if (ThoiGianBay_Cur != Flight_Edit.ThoiGianBay) {
        data_send.ThoiGianBay = ThoiGianBay_Cur;
        check = true;
    }

    if (GVCB_cur != Flight_Edit.GiaVeCoBan) {
        data_send.GiaVeCoBan = GVCB_cur;
        check = true;
    }

    // Trạng thái
    if (TrangThai_cur == 'ViPhamQuiDinh') {
        data_send.ThoiGianBayToiThieu = Flight_Edit.ThamSos.find(
            (item) => item.TenThamSo == 'ThoiGianBayToiThieu',
        ).GiaTri;
        data_send.ThoiGianDungToiThieu = Flight_Edit.ThamSos.find(
            (item) => item.TenThamSo == 'ThoiGianDungToiThieu',
        ).GiaTri;
        data_send.SBTG_Max = Flight_Edit.ThamSos.find((item) => item.TenThamSo == 'SBTG_Max').GiaTri;
        data_send.GiaVeCoBan_Min = Flight_Edit.ThamSos.find((item) => item.TenThamSo == 'GiaVeCoBan_Min').GiaTri;
        check = true;
    }
    data_send.TrangThai = 'ChuaKhoiHanh';

    // SBTG
    var DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
    for (let i = 1; i < DiemDung_Items.length; i++) {
        var MaSanBay = DiemDung_Items[i].querySelector('.DiemDung_Item_SanBayDung').getAttribute('masanbay');

        var ThoiGianDen = new Date(
            DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen').value +
                ' ' +
                DiemDung_Items[i].querySelector('.DiemDung_Item_GioDen').value +
                ':00',
        );
        var NgayDen = {
            Ngay: ThoiGianDen.getDate(),
            Thang: ThoiGianDen.getMonth() + 1,
            Nam: ThoiGianDen.getFullYear(),
        };
        var GioDen = { Gio: ThoiGianDen.getHours(), Phut: ThoiGianDen.getMinutes() };

        var ThoiGianDung = DiemDung_Items[i].querySelector('.DiemDung_Item_ThoiGianDung').value;
        var GhiChu = DiemDung_Items[i].querySelector('.DiemDung_Item_GhiChu').value;
        if (i <= Flight_Edit.SanBayTG.length) {
            if (MaSanBay != Flight_Edit.SanBayTG[i - 1].MaSBTG) {
                check = true;
            }
            if (
                NgayDen.Ngay != Flight_Edit.SanBayTG[i - 1].ThoiGianDen.NgayDen.Ngay ||
                NgayDen.Thang != Flight_Edit.SanBayTG[i - 1].ThoiGianDen.NgayDen.Thang ||
                NgayDen.Nam != Flight_Edit.SanBayTG[i - 1].ThoiGianDen.NgayDen.Nam
            ) {
                check = true;
            }
            if (
                GioDen.Gio != Flight_Edit.SanBayTG[i - 1].ThoiGianDen.GioDen.Gio ||
                GioDen.Phut != Flight_Edit.SanBayTG[i - 1].ThoiGianDen.GioDen.Phut
            ) {
                check = true;
            }
            if (ThoiGianDung != Flight_Edit.SanBayTG[i - 1].ThoiGianDung) {
                check = true;
            }
            if (GhiChu != Flight_Edit.SanBayTG[i - 1].GhiChu) {
                check = true;
            }
        } else {
            check = true;
        }
        data_send.SBTG.push({
            ThuTu: i,
            MaSanBay: MaSanBay,
            NgayDen: NgayDen,
            GioDen: GioDen,
            ThoiGianDung: ThoiGianDung,
            GhiChu: GhiChu,
        });
    }

    // Hạng ghế
    var HangGhe_Items = document.querySelectorAll('.HangGhe_Item');
    for (let i = 1; i < HangGhe_Items.length; i++) {
        var MaHangVe = HangGhe_Items[i].querySelector('.HangGhe_Item_MaHangVe').getAttribute('mahangve');

        var DaPhatHanh = parseInt(HangGhe_Items[i].querySelector('.HangGhe_Item_VeDaPhatHanh').value);
        var CoSan = parseInt(HangGhe_Items[i].querySelector('.HangGhe_Item_VeCoSan').value);
        var TongVe = DaPhatHanh + CoSan;

        if (i <= Flight_Edit.HangVe.length) {
            if (MaHangVe != Flight_Edit.HangVe[i - 1].MaHangVe) {
                check = true;
            }

            if (TongVe != Flight_Edit.HangVe[i - 1].TongVe) {
                check = true;
            }
        } else {
            check = true;
        }

        data_send.HangVe.push({
            MaHangGhe: MaHangVe,
            TongVe: TongVe,
        });
    }

    if (check == true) {
        return data_send;
    }

    return check;
}

// hàm on_off nút lưu thay đổi
function On_Off_LuuThayDoi(isshowtoast) {
    if (CheckThayDoi(isshowtoast) != false) {
        LuuThayDoi.disabled = false;
    } else {
        LuuThayDoi.disabled = true;
    }
}

// ----------------
// Xử lý các modal
// Hủy quay về xem chi tiết chuyến bay
function SendForm_Huy() {
    var Package = {
        MaChuyenBayHienThi: Flight_Edit.MaChuyenBayHienThi,
        MaChuyenBay: Flight_Edit.MaChuyenBay,
    };
    document.getElementById('package').value = JSON.stringify(Package);
    var staff_form = document.forms['staff-form'];
    staff_form.action = '/staff/flightdetail';
    staff_form.submit();
}
// Gửi gói lưu
function SendForm_Luu() {
    alert(':<');
    // Trí
}

// nút thoát trong modal static thông báo
if (ModalStatic_Thoat) {
    ModalStatic_Thoat.addEventListener('click', (e) => {
        SendForm_Huy();
    });
}

// nút lưu trong modal static thông báo
if (ModalStatic_Luu) {
    ModalStatic_Luu.addEventListener('click', (e) => {
        SendForm_Luu();
    });
}

// nút lưu trong modal thông báo
if (Modal_Luu) {
    Modal_Luu.addEventListener('click', (e) => {
        SendForm_Luu();
    });
}

// nút thoát trong modal thông báo
if (Modal_Thoat) {
    Modal_Thoat.addEventListener('click', (e) => {
        SendForm_Huy();
    });
}

// Nút thoát ở bottom fix
if (ThoatChinhSuaChuyenBay) {
    ThoatChinhSuaChuyenBay.addEventListener('click', (e) => {
        if (CheckThayDoi(false) != false) {
            Modal_Body.innerText = 'Bạn có muốn lưu thay đổi?';
            if (Modal_Luu.classList.contains('d-none')) {
                Modal_Luu.classList.remove('d-none');
            }
            if (!Modal_Thoat.classList.contains('d-none')) {
                Modal_Thoat.classList.add('d-none');
            }
        } else {
            Modal_Body.innerText = 'Bạn muốn thoát?';
            if (!Modal_Luu.classList.contains('d-none')) {
                Modal_Luu.classList.add('d-none');
            }
            if (Modal_Thoat.classList.contains('d-none')) {
                Modal_Thoat.classList.remove('d-none');
            }
        }
        var Modal = new bootstrap.Modal(document.getElementById('Modal'), true);
        Modal.show();
    });
}

// Nút lưu ở bottom fix
if (LuuThayDoi) {
    LuuThayDoi.addEventListener('click', (e) => {
        Modal_Body.innerText = 'Bạn có muốn lưu thay đổi?';
        if (Modal_Luu.classList.contains('d-none')) {
            Modal_Luu.classList.remove('d-none');
        }
        if (!Modal_Thoat.classList.contains('d-none')) {
            Modal_Thoat.classList.add('d-none');
        }
        var Modal = new bootstrap.Modal(document.getElementById('Modal'), true);
        Modal.show();
    });
}

// ------------------------------------
// Modal chỉnh sửa

var GiaVeCoBan_Min_Check = false;
var SBTG_Max_Check = false;
var ThoiGianBay_Dung_Min_Check = false;
function KhoiTao_ModalChinhSua() {
    // Giá vé cơ bản
    var GiaVeCoBan_Min_TS = Flight_Edit.ThamSos.find((item) => item.TenThamSo == 'GiaVeCoBan_Min').GiaTri;

    // SBTG_Max
    var SBTG_Max_TS = Flight_Edit.ThamSos.find((item) => item.TenThamSo == 'SBTG_Max').GiaTri;

    // Thoi gian bay toi thieu
    var ThoiGianBay_Min_TS = Flight_Edit.ThamSos.find((item) => item.TenThamSo == 'ThoiGianBayToiThieu').GiaTri;

    // Thời gian dừng tối thiểu
    var ThoiGianDung_Min_TS = Flight_Edit.ThamSos.find((item) => item.TenThamSo == 'ThoiGianDungToiThieu').GiaTri;

    //--Giá vé cơ bản
    if (Flight_Edit.GiaVeCoBan < GiaVeCoBan_Min_TS) {
        GiaVeCoBan_Min_Check = true;
        ThongTinChuyenBay_ViPham.classList.remove('d-none');

        GiaVeCoBan_ViPham_div.classList.remove('d-none');

        GiaVeCoBan_ViPham_DeXuat.classList.add('text-danger');

        GiaVeCoBan_ViPham.value = numberWithDot(Flight_Edit.GiaVeCoBan);
        GiaVeCoBan_ViPham_DeXuat.innerText = 'Yêu cầu tối thiểu ' + numberWithDot(GiaVeCoBan_Min_TS) + ' VND.';

        GiaVeCoBan_ViPham.addEventListener('focus', (e) => {
            e.target.value = numberWithoutDot(e.target.value);
        });
        GiaVeCoBan_ViPham.addEventListener('blur', (e) => {
            if (e.target.value == '') {
                e.target.value = numberWithDot(GiaVeCoBan_Min_TS);
                On_Off_NutLuu_Modal_ChinhSua();
                return;
            }
            var GiaVe = parseInt(numberWithoutDot(e.target.value));
            if (GiaVe < GiaVeCoBan_Min_TS) {
                e.target.value = numberWithDot(GiaVeCoBan_Min_TS);
            } else {
                e.target.value = numberWithDot(e.target.value);
            }
            On_Off_NutLuu_Modal_ChinhSua();
        });
    }

    Flight_Edit.SanBayTG.forEach((item) => {
        const node = document.querySelector('.DiemDungViPham_Item').cloneNode(true);
        node.classList.remove('d-none');

        // Thứ tự
        var index = item.ThuTu;
        node.querySelector('.DiemDungViPham_Item_ThuTu').value = index;
        node.setAttribute('index', index);
        node.setAttribute('status', 'ConSuDung');
        node.querySelector('.DiemDungViPham_Item_SanBayDung').setAttribute('index', index);
        node.querySelector('.DiemDungViPham_Item_NgayDen').setAttribute('index', index);
        node.querySelector('.DiemDungViPham_Item_GioDen').setAttribute('index', index);
        node.querySelector('.DiemDungViPham_Item_ThoiGianDung').setAttribute('index', index);
        node.querySelector('.DiemDungViPham_Item_Xoa').setAttribute('index', index);

        node.querySelector('.DiemDungViPham_Item_SanBayDung').setAttribute('value', item.TenSanBay);
        node.querySelector('.DiemDungViPham_Item_SanBayDung').setAttribute('masanbay', item.MaSBTG);

        // Ngày đến
        node.querySelector('.DiemDungViPham_Item_NgayDen').value =
            item.ThoiGianDen.NgayDen.Nam + '-' + item.ThoiGianDen.NgayDen.Thang + '-' + item.ThoiGianDen.NgayDen.Ngay;
        node.querySelector('.DiemDungViPham_Item_NgayDen').addEventListener('change', (e) => {
            var index = parseInt(e.target.getAttribute('index'));
            if (e.target.value != '') {
                const GioDen = e.target.closest('.DiemDungViPham_Item').querySelector('.DiemDungViPham_Item_GioDen');
                if (GioDen.value != '') {
                    const ThoiGianDung = e.target
                        .closest('.DiemDungViPham_Item')
                        .querySelector('.DiemDungViPham_Item_ThoiGianDung');
                    if (ThoiGianDung.value != '') {
                        var lastitem = false;
                        if (Flight_Edit.SanBayTG.length == SBTG_Max_TS && index == Flight_Edit.SanBayTG.length) {
                            lastitem = true;
                        } else if (Flight_Edit.SanBayTG.length < SBTG_Max_TS && index == Flight_Edit.SanBayTG.length) {
                            lastitem = true;
                        } else if (Flight_Edit.SanBayTG.length > SBTG_Max_TS && index == SBTG_Max_TS) {
                            lastitem = true;
                        }

                        var ChanTruoc;
                        var GiaTri = new Date(e.target.value + ' ' + GioDen.value + ':00');
                        if (index == 1) {
                            ChanTruoc = new Date(
                                Flight_Edit.ThoiGianDi.NgayDi.Nam +
                                    '-' +
                                    Flight_Edit.ThoiGianDi.NgayDi.Thang +
                                    '-' +
                                    Flight_Edit.ThoiGianDi.NgayDi.Ngay +
                                    ' ' +
                                    Flight_Edit.ThoiGianDi.GioDi.Gio +
                                    ':' +
                                    Flight_Edit.ThoiGianDi.GioDi.Phut +
                                    ':00',
                            );
                            ChanTruoc = new Date(ChanTruoc.getTime() + 60000 * ThoiGianBay_Min_TS);
                        } else {
                            var Item_Truoc = document.querySelectorAll('.DiemDungViPham_Item')[index - 1];
                            var NgayDen_Truoc = Item_Truoc.querySelector('.DiemDungViPham_Item_NgayDen');
                            var GioDen_Truoc = Item_Truoc.querySelector('.DiemDungViPham_Item_GioDen');
                            var ThoiGianDung_Truoc = Item_Truoc.querySelector('.DiemDungViPham_Item_ThoiGianDung');

                            if (
                                NgayDen_Truoc.value == '' ||
                                GioDen_Truoc.value == '' ||
                                ThoiGianDung_Truoc.value == ''
                            ) {
                                e.target.value = '';
                                GioDen.value = '';
                                NgayDen_Truoc.focus();
                                On_Off_NutLuu_Modal_ChinhSua();
                                return;
                            } else {
                                ChanTruoc = new Date(NgayDen_Truoc.value + ' ' + GioDen_Truoc.value + ':00');
                                ChanTruoc = new Date(
                                    ChanTruoc.getTime() +
                                        60000 * (ThoiGianBay_Min_TS + parseInt(ThoiGianDung_Truoc.value)),
                                );
                            }
                        }

                        var ThongBao = e.target
                            .closest('.DiemDungViPham_Item')
                            .querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat');
                        if (ChanTruoc > GiaTri) {
                            ThongBao.classList.add('text-danger');

                            e.target.value = '';
                            GioDen.value = '';
                            e.target.focus();

                            ThoiGianBay_ViPham_DeXuat.classList.add('d-none');
                            ThoiGianBay_ViPham.disabled = true;
                            On_Off_NutLuu_Modal_ChinhSua();
                            return;
                        }

                        ThongBao.classList.remove('text-danger');

                        if (lastitem == false) {
                            var ChanTruoc_Sau = new Date(
                                GiaTri.getTime() + 60000 * (ThoiGianBay_Min_TS + parseInt(ThoiGianDung.value)),
                            );
                            var GiaTri_Sau;
                            var Item_Sau = document.querySelectorAll('.DiemDungViPham_Item')[index + 1];
                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.remove('d-none');

                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').innerText =
                                'Thời gian đến tối thiểu: ' +
                                numberSmallerTen(ChanTruoc_Sau.getDate()) +
                                '/' +
                                numberSmallerTen(ChanTruoc_Sau.getMonth() + 1) +
                                '/' +
                                ChanTruoc_Sau.getFullYear() +
                                ' ' +
                                numberSmallerTen(ChanTruoc_Sau.getHours()) +
                                ':' +
                                numberSmallerTen(ChanTruoc_Sau.getMinutes());

                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayDen').setAttribute(
                                'min',
                                ChanTruoc_Sau.yyyymmdd(),
                            );

                            Item_Sau.querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat').classList.remove(
                                'd-none',
                            );

                            Item_Sau.querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat').innerText =
                                'Thời gian dừng tối thiểu: ' + numberSmallerTen(ThoiGianDung_Min_TS) + ' phút.';

                            Item_Sau.querySelector('.DiemDungViPham_Item_ThoiGianDung').setAttribute(
                                'min',
                                ThoiGianDung_Min_TS,
                            );

                            var NgayDen_Sau = Item_Sau.querySelector('.DiemDungViPham_Item_NgayDen');
                            var GioDen_Sau = Item_Sau.querySelector('.DiemDungViPham_Item_GioDen');
                            var ThoiGianDung_Sau = Item_Sau.querySelector('.DiemDungViPham_Item_ThoiGianDung');
                            if (NgayDen_Sau.value == '' || GioDen_Sau.value == '' || ThoiGianDung_Sau.value == '') {
                                NgayDen_Sau.disabled = false;
                                GioDen_Sau.disabled = false;
                                ThoiGianDung_Sau.disabled = false;
                                Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.add(
                                    'text-danger',
                                );
                                console.log('Hah');
                                NgayDen_Sau.focus();
                                ThoiGianBay_ViPham_DeXuat.classList.add('d-none');
                                ThoiGianBay_ViPham.disabled = true;
                                On_Off_NutLuu_Modal_ChinhSua();
                                return;
                            } else {
                                GiaTri_Sau = new Date(NgayDen_Sau.value + ' ' + GioDen_Sau.value + ':00');
                            }
                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.remove(
                                'text-danger',
                            );

                            if (ChanTruoc_Sau > GiaTri_Sau) {
                                NgayDen_Sau.value = '';
                                GioDen_Sau.value = '';

                                Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.add(
                                    'text-danger',
                                );

                                var DiemDungViPham_Items = document.querySelectorAll('.DiemDungViPham_Item')[index + 1];
                                for (let i = index + 2; i < DiemDungViPham_Items.length; i++) {
                                    DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_NgayDen').value = '';
                                    DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_GioDen').value = '';
                                    DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_ThoiGianDung').value =
                                        '';

                                    DiemDungViPham_Items[i].querySelector(
                                        '.DiemDungViPham_Item_NgayDen',
                                    ).disabled = false;
                                    DiemDungViPham_Items[i].querySelector(
                                        '.DiemDungViPham_Item_GioDen',
                                    ).disabled = false;
                                    DiemDungViPham_Items[i].querySelector(
                                        '.DiemDungViPham_Item_ThoiGianDung',
                                    ).disabled = false;

                                    DiemDungViPham_Items[i]
                                        .querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat')
                                        .classList.add('d-none');
                                    DiemDungViPham_Items[i]
                                        .querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat')
                                        .classList.remove('text-danger');

                                    DiemDungViPham_Items[i]
                                        .querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat')
                                        .classList.add('d-none');
                                    DiemDungViPham_Items[i]
                                        .querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat')
                                        .classList.remove('text-danger');
                                }
                                ThoiGianBay_ViPham_DeXuat.classList.add('d-none');
                                ThoiGianBay_ViPham.disabled = true;
                                NgayDen_Sau.focus();
                                On_Off_NutLuu_Modal_ChinhSua();
                                return;
                            }

                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.remove(
                                'text-danger',
                            );

                            ThoiGianBay_ViPham_div.classList.remove('d-none');
                            ThoiGianBay_ViPham_DeXuat.classList.remove('d-none');
                            ThoiGianBay_ViPham.disabled = false;
                        } else {
                            ThoiGianBay_ViPham_div.classList.remove('d-none');
                            ThoiGianBay_ViPham_DeXuat.classList.remove('d-none');
                            ThoiGianBay_ViPham.disabled = false;

                            ChanTruoc = new Date(
                                Flight_Edit.ThoiGianDi.NgayDi.Nam +
                                    '-' +
                                    Flight_Edit.ThoiGianDi.NgayDi.Thang +
                                    '-' +
                                    Flight_Edit.ThoiGianDi.NgayDi.Ngay +
                                    ' ' +
                                    Flight_Edit.ThoiGianDi.GioDi.Gio +
                                    ':' +
                                    Flight_Edit.ThoiGianDi.GioDi.Phut +
                                    ':00',
                            );
                            var ChanSau = new Date(
                                GiaTri.getTime() + 60000 * (parseInt(ThoiGianDung.value) + ThoiGianBay_Min_TS),
                            );

                            var distance = (ChanSau.getTime() - ChanTruoc.getTime()) / 60000;

                            if (parseInt(ThoiGianBay_ViPham.value) < distance) {
                                ThoiGianBay_ViPham.setAttribute('value', distance);
                            }
                            ThoiGianBay_ViPham.setAttribute('min', distance);
                            ThoiGianBay_ViPham.focus();
                            ThoiGianBay_ViPham_DeXuat.innerText = 'Yêu cầu tối thiểu: ' + distance + ' phút.';

                            ThoiGianBay_ViPham_DeXuat.classList.add('text-danger');
                        }
                        On_Off_NutLuu_Modal_ChinhSua();
                    }
                }
            }
        });
        node.querySelector('.DiemDungViPham_Item_NgayDen').addEventListener('blur', (e) => {
            var index = e.target.getAttribute('index');
            const GioDen = e.target.closest('.DiemDungViPham_Item').querySelector('.DiemDungViPham_Item_GioDen');
            const ThoiGianDung = e.target
                .closest('.DiemDungViPham_Item')
                .querySelector('.DiemDungViPham_Item_ThoiGianDung');
            if (e.target.value != '') {
                if (GioDen.value == '') {
                    GioDen.focus();
                } else if (ThoiGianDung.value == '') {
                    ThoiGianDung.focus();
                }
            } else {
                if (GioDen.value != '' || ThoiGianDung.value != '') {
                    e.target.focus();
                }
            }
        });

        // Giờ đến
        node.querySelector('.DiemDungViPham_Item_GioDen').value =
            numberSmallerTen(item.ThoiGianDen.GioDen.Gio) + ':' + numberSmallerTen(item.ThoiGianDen.GioDen.Phut);
        node.querySelector('.DiemDungViPham_Item_GioDen').addEventListener('change', (e) => {
            var index = parseInt(e.target.getAttribute('index'));
            if (e.target.value != '') {
                const NgayDen = e.target.closest('.DiemDungViPham_Item').querySelector('.DiemDungViPham_Item_NgayDen');
                if (NgayDen.value != '') {
                    const ThoiGianDung = e.target
                        .closest('.DiemDungViPham_Item')
                        .querySelector('.DiemDungViPham_Item_ThoiGianDung');
                    if (ThoiGianDung.value != '') {
                        var lastitem = false;
                        if (Flight_Edit.SanBayTG.length == SBTG_Max_TS && index == Flight_Edit.SanBayTG.length) {
                            lastitem = true;
                        } else if (Flight_Edit.SanBayTG.length < SBTG_Max_TS && index == Flight_Edit.SanBayTG.length) {
                            lastitem = true;
                        } else if (Flight_Edit.SanBayTG.length > SBTG_Max_TS && index == SBTG_Max_TS) {
                            lastitem = true;
                        }

                        var ChanTruoc;
                        var GiaTri = new Date(NgayDen.value + ' ' + e.target.value + ':00');
                        if (index == 1) {
                            ChanTruoc = new Date(
                                Flight_Edit.ThoiGianDi.NgayDi.Nam +
                                    '-' +
                                    Flight_Edit.ThoiGianDi.NgayDi.Thang +
                                    '-' +
                                    Flight_Edit.ThoiGianDi.NgayDi.Ngay +
                                    ' ' +
                                    Flight_Edit.ThoiGianDi.GioDi.Gio +
                                    ':' +
                                    Flight_Edit.ThoiGianDi.GioDi.Phut +
                                    ':00',
                            );
                            ChanTruoc = new Date(ChanTruoc.getTime() + 60000 * ThoiGianBay_Min_TS);
                        } else {
                            var Item_Truoc = document.querySelectorAll('.DiemDungViPham_Item')[index - 1];
                            var NgayDen_Truoc = Item_Truoc.querySelector('.DiemDungViPham_Item_NgayDen');
                            var GioDen_Truoc = Item_Truoc.querySelector('.DiemDungViPham_Item_GioDen');
                            var ThoiGianDung_Truoc = Item_Truoc.querySelector('.DiemDungViPham_Item_ThoiGianDung');

                            if (
                                NgayDen_Truoc.value == '' ||
                                GioDen_Truoc.value == '' ||
                                ThoiGianDung_Truoc.value == ''
                            ) {
                                e.target.value = '';
                                NgayDen.value = '';
                                NgayDen_Truoc.focus();
                                ThoiGianBay_ViPham_DeXuat.classList.add('d-none');
                                ThoiGianBay_ViPham.disabled = true;
                                On_Off_NutLuu_Modal_ChinhSua();
                                return;
                            } else {
                                ChanTruoc = new Date(NgayDen_Truoc.value + ' ' + GioDen_Truoc.value + ':00');
                                ChanTruoc = new Date(
                                    ChanTruoc.getTime() +
                                        60000 * (ThoiGianBay_Min_TS + parseInt(ThoiGianDung_Truoc.value)),
                                );
                            }
                        }

                        var ThongBao = e.target
                            .closest('.DiemDungViPham_Item')
                            .querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat');
                        if (ChanTruoc > GiaTri) {
                            ThongBao.classList.add('text-danger');

                            e.target.value = '';
                            NgayDen.value = '';
                            NgayDen.focus();
                            ThoiGianBay_ViPham_DeXuat.classList.add('d-none');
                            ThoiGianBay_ViPham.disabled = true;
                            On_Off_NutLuu_Modal_ChinhSua();
                            return;
                        }

                        ThongBao.classList.remove('text-danger');

                        if (lastitem == false) {
                            var ChanTruoc_Sau = new Date(
                                GiaTri.getTime() + 60000 * (ThoiGianBay_Min_TS + parseInt(ThoiGianDung.value)),
                            );
                            var GiaTri_Sau;
                            var Item_Sau = document.querySelectorAll('.DiemDungViPham_Item')[index + 1];
                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.remove('d-none');

                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').innerText =
                                'Thời gian đến tối thiểu: ' +
                                numberSmallerTen(ChanTruoc_Sau.getDate()) +
                                '/' +
                                numberSmallerTen(ChanTruoc_Sau.getMonth() + 1) +
                                '/' +
                                ChanTruoc_Sau.getFullYear() +
                                ' ' +
                                numberSmallerTen(ChanTruoc_Sau.getHours()) +
                                ':' +
                                numberSmallerTen(ChanTruoc_Sau.getMinutes());

                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayDen').setAttribute(
                                'min',
                                ChanTruoc_Sau.yyyymmdd(),
                            );

                            Item_Sau.querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat').classList.remove(
                                'd-none',
                            );

                            Item_Sau.querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat').innerText =
                                'Thời gian dừng tối thiểu: ' + numberSmallerTen(ThoiGianDung_Min_TS) + ' phút.';

                            Item_Sau.querySelector('.DiemDungViPham_Item_ThoiGianDung').setAttribute(
                                'min',
                                ThoiGianDung_Min_TS,
                            );

                            var NgayDen_Sau = Item_Sau.querySelector('.DiemDungViPham_Item_NgayDen');
                            var GioDen_Sau = Item_Sau.querySelector('.DiemDungViPham_Item_GioDen');
                            var ThoiGianDung_Sau = Item_Sau.querySelector('.DiemDungViPham_Item_ThoiGianDung');
                            if (NgayDen_Sau.value == '' || GioDen_Sau.value == '' || ThoiGianDung_Sau.value == '') {
                                NgayDen_Sau.disabled = false;
                                GioDen_Sau.disabled = false;
                                ThoiGianDung_Sau.disabled = false;
                                Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.add(
                                    'text-danger',
                                );
                                NgayDen_Sau.focus();
                                ThoiGianBay_ViPham_DeXuat.classList.add('d-none');
                                ThoiGianBay_ViPham.disabled = true;
                                On_Off_NutLuu_Modal_ChinhSua();
                                return;
                            } else {
                                GiaTri_Sau = new Date(NgayDen_Sau.value + ' ' + GioDen_Sau.value + ':00');
                            }
                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.remove(
                                'text-danger',
                            );

                            if (ChanTruoc_Sau > GiaTri_Sau) {
                                NgayDen_Sau.value = '';
                                GioDen_Sau.value = '';

                                Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.add(
                                    'text-danger',
                                );

                                var DiemDungViPham_Items = document.querySelectorAll('.DiemDungViPham_Item')[index + 1];
                                for (let i = index + 2; i < DiemDungViPham_Items.length; i++) {
                                    DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_NgayDen').value = '';
                                    DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_GioDen').value = '';
                                    DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_ThoiGianDung').value =
                                        '';

                                    DiemDungViPham_Items[i].querySelector(
                                        '.DiemDungViPham_Item_NgayDen',
                                    ).disabled = false;
                                    DiemDungViPham_Items[i].querySelector(
                                        '.DiemDungViPham_Item_GioDen',
                                    ).disabled = false;
                                    DiemDungViPham_Items[i].querySelector(
                                        '.DiemDungViPham_Item_ThoiGianDung',
                                    ).disabled = false;

                                    DiemDungViPham_Items[i]
                                        .querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat')
                                        .classList.add('d-none');
                                    DiemDungViPham_Items[i]
                                        .querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat')
                                        .classList.remove('text-danger');

                                    DiemDungViPham_Items[i]
                                        .querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat')
                                        .classList.add('d-none');
                                    DiemDungViPham_Items[i]
                                        .querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat')
                                        .classList.remove('text-danger');
                                }
                                ThoiGianBay_ViPham_DeXuat.classList.add('d-none');
                                ThoiGianBay_ViPham.disabled = true;
                                NgayDen_Sau.focus();
                                On_Off_NutLuu_Modal_ChinhSua();
                                return;
                            }

                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.remove(
                                'text-danger',
                            );

                            ThoiGianBay_ViPham_div.classList.remove('d-none');
                            ThoiGianBay_ViPham_DeXuat.classList.remove('d-none');
                            ThoiGianBay_ViPham.disabled = false;
                        } else {
                            ThoiGianBay_ViPham_div.classList.remove('d-none');
                            ThoiGianBay_ViPham_DeXuat.classList.remove('d-none');

                            ThoiGianBay_ViPham.disabled = false;

                            ChanTruoc = new Date(
                                Flight_Edit.ThoiGianDi.NgayDi.Nam +
                                    '-' +
                                    Flight_Edit.ThoiGianDi.NgayDi.Thang +
                                    '-' +
                                    Flight_Edit.ThoiGianDi.NgayDi.Ngay +
                                    ' ' +
                                    Flight_Edit.ThoiGianDi.GioDi.Gio +
                                    ':' +
                                    Flight_Edit.ThoiGianDi.GioDi.Phut +
                                    ':00',
                            );

                            var ChanSau = new Date(
                                GiaTri.getTime() + 60000 * (parseInt(ThoiGianDung.value) + ThoiGianBay_Min_TS),
                            );

                            var distance = (ChanSau.getTime() - ChanTruoc.getTime()) / 60000;
                            if (parseInt(ThoiGianBay_ViPham.value) < distance) {
                                ThoiGianBay_ViPham.setAttribute('value', distance);
                            }
                            ThoiGianBay_ViPham.setAttribute('min', distance);
                            ThoiGianBay_ViPham.focus();
                            ThoiGianBay_ViPham_DeXuat.innerText = 'Yêu cầu tối thiểu: ' + distance + ' phút.';

                            ThoiGianBay_ViPham_DeXuat.classList.add('text-danger');
                        }
                        On_Off_NutLuu_Modal_ChinhSua();
                    }
                }
            }
        });
        node.querySelector('.DiemDungViPham_Item_GioDen').addEventListener('blur', (e) => {
            var index = e.target.getAttribute('index');
            const NgayDen = e.target.closest('.DiemDungViPham_Item').querySelector('.DiemDungViPham_Item_NgayDen');
            const ThoiGianDung = e.target
                .closest('.DiemDungViPham_Item')
                .querySelector('.DiemDungViPham_Item_ThoiGianDung');
            if (e.target.value != '') {
                if (NgayDen.value == '') {
                    NgayDen.focus();
                } else if (ThoiGianDung.value == '') {
                    ThoiGianDung.focus();
                }
            } else {
                if (NgayDen.value == '') {
                    NgayDen.focus();
                } else {
                    e.target.focus();
                }
            }
        });
        node.querySelector('.DiemDungViPham_Item_GioDen').addEventListener('focus', (e) => {
            var index = e.target.getAttribute('index');
            const NgayDen = e.target.closest('.DiemDungViPham_Item').querySelector('.DiemDungViPham_Item_NgayDen');
            const ThoiGianDung = e.target
                .closest('.DiemDungViPham_Item')
                .querySelector('.DiemDungViPham_Item_ThoiGianDung');
            if (e.target.value != '') {
                if (NgayDen.value == '') {
                    NgayDen.focus();
                } else if (ThoiGianDung.value == '') {
                    ThoiGianDung.focus();
                }
            } else {
                if (NgayDen.value == '') {
                    NgayDen.focus();
                } else {
                    e.target.focus();
                }
            }
        });

        // Thời gian dừng
        if (ThoiGianDung_Min_TS < item.ThoiGianDung) {
            node.querySelector('.DiemDungViPham_Item_ThoiGianDung').value = ThoiGianDung_Min_TS;
        } else node.querySelector('.DiemDungViPham_Item_ThoiGianDung').value = item.ThoiGianDung;
        node.querySelector('.DiemDungViPham_Item_ThoiGianDung').addEventListener('change', (e) => {
            var index = parseInt(e.target.getAttribute('index'));
            if (e.target.value != '') {
                if (parseInt(e.target.value) < parseInt(e.target.getAttribute('min'))) {
                    e.target.value = e.target.getAttribute('min');
                }
                e.target
                    .closest('.DiemDungViPham_Item')
                    .querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat')
                    .classList.remove('text-danger');
                const NgayDen = e.target.closest('.DiemDungViPham_Item').querySelector('.DiemDungViPham_Item_NgayDen');
                if (NgayDen.value != '') {
                    const GioDen = e.target
                        .closest('.DiemDungViPham_Item')
                        .querySelector('.DiemDungViPham_Item_GioDen');
                    if (GioDen.value != '') {
                        var lastitem = false;
                        if (Flight_Edit.SanBayTG.length == SBTG_Max_TS && index == Flight_Edit.SanBayTG.length) {
                            lastitem = true;
                        } else if (Flight_Edit.SanBayTG.length < SBTG_Max_TS && index == Flight_Edit.SanBayTG.length) {
                            lastitem = true;
                        } else if (Flight_Edit.SanBayTG.length > SBTG_Max_TS && index == SBTG_Max_TS) {
                            lastitem = true;
                        }

                        var GiaTri = new Date(NgayDen.value + ' ' + GioDen.value + ':00');

                        if (lastitem == false) {
                            var ChanTruoc_Sau = new Date(
                                GiaTri.getTime() + 60000 * (ThoiGianBay_Min_TS + parseInt(e.target.value)),
                            );
                            var GiaTri_Sau;
                            var Item_Sau = document.querySelectorAll('.DiemDungViPham_Item')[index + 1];
                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.remove('d-none');

                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').innerText =
                                'Thời gian đến tối thiểu: ' +
                                numberSmallerTen(ChanTruoc_Sau.getDate()) +
                                '/' +
                                numberSmallerTen(ChanTruoc_Sau.getMonth() + 1) +
                                '/' +
                                ChanTruoc_Sau.getFullYear() +
                                ' ' +
                                numberSmallerTen(ChanTruoc_Sau.getHours()) +
                                ':' +
                                numberSmallerTen(ChanTruoc_Sau.getMinutes());

                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayDen').setAttribute(
                                'min',
                                ChanTruoc_Sau.yyyymmdd(),
                            );

                            Item_Sau.querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat').classList.remove(
                                'd-none',
                            );

                            Item_Sau.querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat').innerText =
                                'Thời gian dừng tối thiểu: ' + numberSmallerTen(ThoiGianDung_Min_TS) + ' phút.';

                            Item_Sau.querySelector('.DiemDungViPham_Item_ThoiGianDung').setAttribute(
                                'min',
                                ThoiGianDung_Min_TS,
                            );

                            var NgayDen_Sau = Item_Sau.querySelector('.DiemDungViPham_Item_NgayDen');
                            var GioDen_Sau = Item_Sau.querySelector('.DiemDungViPham_Item_GioDen');
                            var ThoiGianDung_Sau = Item_Sau.querySelector('.DiemDungViPham_Item_ThoiGianDung');
                            if (NgayDen_Sau.value == '' || GioDen_Sau.value == '' || ThoiGianDung_Sau.value == '') {
                                NgayDen_Sau.disabled = false;
                                GioDen_Sau.disabled = false;
                                ThoiGianDung_Sau.disabled = false;
                                Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.add(
                                    'text-danger',
                                );
                                NgayDen_Sau.focus();
                                ThoiGianBay_ViPham_DeXuat.classList.add('d-none');
                                ThoiGianBay_ViPham.disabled = true;
                                On_Off_NutLuu_Modal_ChinhSua();
                                return;
                            } else {
                                GiaTri_Sau = new Date(NgayDen_Sau.value + ' ' + GioDen_Sau.value + ':00');
                            }
                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.remove(
                                'text-danger',
                            );

                            if (ChanTruoc_Sau > GiaTri_Sau) {
                                NgayDen_Sau.value = '';
                                GioDen_Sau.value = '';

                                Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.add(
                                    'text-danger',
                                );

                                var DiemDungViPham_Items = document.querySelectorAll('.DiemDungViPham_Item')[index + 1];
                                for (let i = index + 2; i < DiemDungViPham_Items.length; i++) {
                                    DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_NgayDen').value = '';
                                    DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_GioDen').value = '';
                                    DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_ThoiGianDung').value =
                                        '';

                                    DiemDungViPham_Items[i].querySelector(
                                        '.DiemDungViPham_Item_NgayDen',
                                    ).disabled = false;
                                    DiemDungViPham_Items[i].querySelector(
                                        '.DiemDungViPham_Item_GioDen',
                                    ).disabled = false;
                                    DiemDungViPham_Items[i].querySelector(
                                        '.DiemDungViPham_Item_ThoiGianDung',
                                    ).disabled = false;

                                    DiemDungViPham_Items[i]
                                        .querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat')
                                        .classList.add('d-none');
                                    DiemDungViPham_Items[i]
                                        .querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat')
                                        .classList.remove('text-danger');

                                    DiemDungViPham_Items[i]
                                        .querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat')
                                        .classList.add('d-none');
                                    DiemDungViPham_Items[i]
                                        .querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat')
                                        .classList.remove('text-danger');
                                }
                                ThoiGianBay_ViPham_DeXuat.classList.add('d-none');
                                ThoiGianBay_ViPham.disabled = true;
                                NgayDen_Sau.focus();
                                On_Off_NutLuu_Modal_ChinhSua();
                                return;
                            }

                            Item_Sau.querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.remove(
                                'text-danger',
                            );

                            ThoiGianBay_ViPham_div.classList.remove('d-none');
                            ThoiGianBay_ViPham_DeXuat.classList.remove('d-none');
                            ThoiGianBay_ViPham.disabled = false;
                        } else {
                            var NgayGioChuaFill = true;
                            var DiemDungViPham_Items = document.querySelectorAll('.DiemDungViPham_Item');
                            for (let i = 1; i < DiemDungViPham_Items.length; i++) {
                                if (
                                    DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_NgayDen').value == '' ||
                                    DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_GioDen').value == '' ||
                                    DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_ThoiGianDung').value ==
                                        ''
                                ) {
                                    NgayGioChuaFill = false;
                                    break;
                                }
                            }
                            if (NgayGioChuaFill == true) {
                                ThoiGianBay_ViPham_DeXuat.classList.remove('d-none');
                                ThoiGianBay_ViPham.disabled = false;
                            }
                            ThoiGianBay_ViPham_div.classList.remove('d-none');

                            ChanTruoc = new Date(
                                Flight_Edit.ThoiGianDi.NgayDi.Nam +
                                    '-' +
                                    Flight_Edit.ThoiGianDi.NgayDi.Thang +
                                    '-' +
                                    Flight_Edit.ThoiGianDi.NgayDi.Ngay +
                                    ' ' +
                                    Flight_Edit.ThoiGianDi.GioDi.Gio +
                                    ':' +
                                    Flight_Edit.ThoiGianDi.GioDi.Phut +
                                    ':00',
                            );

                            var ChanSau = new Date(
                                GiaTri.getTime() + 60000 * (parseInt(e.target.value) + ThoiGianBay_Min_TS),
                            );

                            var distance = (ChanSau.getTime() - ChanTruoc.getTime()) / 60000;
                            if (parseInt(ThoiGianBay_ViPham.value) < distance) {
                                ThoiGianBay_ViPham.setAttribute('value', distance);
                            }
                            ThoiGianBay_ViPham.setAttribute('min', distance);
                            ThoiGianBay_ViPham.focus();
                            ThoiGianBay_ViPham_DeXuat.innerText = 'Yêu cầu tối thiểu: ' + distance + ' phút.';

                            ThoiGianBay_ViPham_DeXuat.classList.add('text-danger');
                        }
                        On_Off_NutLuu_Modal_ChinhSua();
                    }
                }
            } else {
                e.target.value = e.target.getAttribute('min');
            }
        });
        node.querySelector('.DiemDungViPham_Item_ThoiGianDung').addEventListener('focus', (e) => {
            var index = e.target.getAttribute('index');
            const NgayDen = e.target.closest('.DiemDungViPham_Item').querySelector('.DiemDungViPham_Item_NgayDen');
            const GioDen = e.target.closest('.DiemDungViPham_Item').querySelector('.DiemDungViPham_Item_GioDen');
            e.target
                .closest('.DiemDungViPham_Item')
                .querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat')
                .classList.add('text-danger');
            if (e.target.value != '') {
                if (NgayDen.value == '') {
                    NgayDen.focus();
                } else if (GioDen.value == '') {
                    GioDen.focus();
                }
            } else {
                if (NgayDen.value == '') {
                    NgayDen.focus();
                } else {
                    e.target.focus();
                }
            }
        });
        node.querySelector('.DiemDungViPham_Item_ThoiGianDung').addEventListener('blur', (e) => {
            e.target
                .closest('.DiemDungViPham_Item')
                .querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat')
                .classList.remove('text-danger');
        });
        DiemDungViPham_Container.appendChild(node);
    });

    //--SBTG_Max
    if (Flight_Edit.SanBayTG.length > SBTG_Max_TS) {
        SBTG_Max_Check = true;
        const DiemDungViPham_Items = document.querySelectorAll('.DiemDungViPham_Item');
        for (let i = SBTG_Max_TS + 1; i < DiemDungViPham_Items.length; i++) {
            DiemDungViPham_Items[i].setAttribute('status', 'KhongSuDung');
            DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').innerText =
                'Điểm dừng sẽ bị xóa do: Số điểm dừng tối đa là ' + SBTG_Max_TS;

            DiemDungViPham_Items[i]
                .querySelector('.DiemDungViPham_Item_ThoiGianDung_DonVi')
                .classList.remove('bg-light');

            DiemDungViPham_Items[i].querySelector('.blank').classList.add('d-none');
            DiemDungViPham_Items[i]
                .querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat_div')
                .classList.remove('col-6');
            DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat_div').classList.add('col-9');

            DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.remove('d-none');

            DiemDungViPham_Items[i]
                .querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat')
                .classList.add('text-danger');

            DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat').classList.add('d-none');
        }
    }

    //--Thời gian dừng tối thiểu && Thoi gian bay toi thieu
    const DiemDungViPham_Items = document.querySelectorAll('.DiemDungViPham_Item');
    for (let i = 1; i < DiemDungViPham_Items.length; i++) {
        if (DiemDungViPham_Items[i].getAttribute('status') == 'KhongSuDung') {
            continue;
        }

        if (ThoiGianBay_Dung_Min_Check == true) {
            DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_NgayDen').value = '';
            DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_GioDen').value = '';

            if (ThoiGianDung_Min_TS < Flight_Edit.SanBayTG[i - 1].ThoiGianDung) {
                DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_ThoiGianDung').value = ThoiGianDung_Min_TS;
            } else
                DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_ThoiGianDung').value =
                    Flight_Edit.SanBayTG[i - 1].ThoiGianDung;
            continue;
        }

        var ChanTruoc;
        var GiaTri = new Date(
            Flight_Edit.SanBayTG[i - 1].ThoiGianDen.NgayDen.Nam +
                '-' +
                Flight_Edit.SanBayTG[i - 1].ThoiGianDen.NgayDen.Thang +
                '-' +
                Flight_Edit.SanBayTG[i - 1].ThoiGianDen.NgayDen.Ngay +
                ' ' +
                Flight_Edit.SanBayTG[i - 1].ThoiGianDen.GioDen.Gio +
                ':' +
                Flight_Edit.SanBayTG[i - 1].ThoiGianDen.GioDen.Phut +
                ':00',
        );
        if (i == 1) {
            ChanTruoc = new Date(
                Flight_Edit.ThoiGianDi.NgayDi.Nam +
                    '-' +
                    Flight_Edit.ThoiGianDi.NgayDi.Thang +
                    '-' +
                    Flight_Edit.ThoiGianDi.NgayDi.Ngay +
                    ' ' +
                    Flight_Edit.ThoiGianDi.GioDi.Gio +
                    ':' +
                    Flight_Edit.ThoiGianDi.GioDi.Phut +
                    ':00',
            );
            ChanTruoc = new Date(ChanTruoc.getTime() + 60000 * ThoiGianBay_Min_TS);
        } else {
            ChanTruoc = new Date(
                Flight_Edit.SanBayTG[i - 2].ThoiGianDen.NgayDen.Nam +
                    '-' +
                    Flight_Edit.SanBayTG[i - 2].ThoiGianDen.NgayDen.Thang +
                    '-' +
                    Flight_Edit.SanBayTG[i - 2].ThoiGianDen.NgayDen.Ngay +
                    ' ' +
                    Flight_Edit.SanBayTG[i - 2].ThoiGianDen.GioDen.Gio +
                    ':' +
                    Flight_Edit.SanBayTG[i - 2].ThoiGianDen.GioDen.Phut +
                    ':00',
            );
            ChanTruoc = new Date(ChanTruoc.getTime() + 60000 * (ThoiGianBay_Min_TS + ThoiGianDung_Min_TS));
        }

        if (ChanTruoc > GiaTri) {
            ThoiGianBay_Dung_Min_Check = true;
            ThongTinChuyenBay_ViPham.classList.remove('d-none');
            ThoiGianBay_ViPham_div.classList.remove('d-none');
            ThoiGianBay_ViPham_DeXuat.classList.add('d-none');
            ThoiGianBay_ViPham.disabled = true;

            DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_NgayDen').disabled = false;
            DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_GioDen').disabled = false;
            DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_ThoiGianDung').disabled = false;

            DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_NgayDen').value = '';
            DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_GioDen').value = '';

            DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').classList.remove('d-none');

            DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat').innerText =
                'Thời gian đến tối thiểu: ' +
                numberSmallerTen(ChanTruoc.getDate()) +
                '/' +
                numberSmallerTen(ChanTruoc.getMonth() + 1) +
                '/' +
                ChanTruoc.getFullYear() +
                ' ' +
                numberSmallerTen(ChanTruoc.getHours()) +
                ':' +
                numberSmallerTen(ChanTruoc.getMinutes());

            DiemDungViPham_Items[i]
                .querySelector('.DiemDungViPham_Item_NgayGioDen_DeXuat')
                .classList.add('text-danger');

            DiemDungViPham_Items[i]
                .querySelector('.DiemDungViPham_Item_NgayDen')
                .setAttribute('min', ChanTruoc.yyyymmdd());

            DiemDungViPham_Items[i]
                .querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat')
                .classList.remove('d-none');

            DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_ThoiGianDung_DeXuat').innerText =
                'Thời gian dừng tối thiểu: ' + numberSmallerTen(ThoiGianDung_Min_TS) + ' phút.';

            DiemDungViPham_Items[i]
                .querySelector('.DiemDungViPham_Item_ThoiGianDung')
                .setAttribute('min', ThoiGianDung_Min_TS);
        }
    }

    if (ThoiGianBay_Dung_Min_Check == false) {
        if (SBTG_Max_Check == false) {
            ThongTinDiemDung_ViPham.classList.add('d-none');
            DiemDungViPham_Container.classList.add('d-none');
        }

        if (Flight_Edit.ThoiGianBay < ThoiGianBay_Min_TS) {
            ThoiGianBay_ViPham_div.classList.remove('d-none');
            ThongTinChuyenBay_ViPham.classList.remove('d-none');

            ThoiGianBay_ViPham_DeXuat.classList.remove('d-none');
            ThoiGianBay_ViPham_DeXuat.innerText = 'Yêu cầu tối thiểu: ' + ThoiGianBay_Min_TS + ' phút.';
            ThoiGianBay_ViPham_DeXuat.classList.remove('text-danger');

            ThoiGianBay_ViPham.setAttribute('min', ThoiGianBay_Min_TS);
            ThoiGianBay_ViPham.disabled = false;

            ThoiGianBay_ViPham.focus();
        }
    }

    ThoiGianBay_ViPham.addEventListener('blur', (e) => {
        if (e.target.value == '') {
            e.target.value = e.target.getAttribute('min');
            On_Off_NutLuu_Modal_ChinhSua();
        } else {
            if (parseInt(e.target.value) < parseInt(e.target.getAttribute('min'))) {
                e.target.value = e.target.getAttribute('min');
                On_Off_NutLuu_Modal_ChinhSua();
            }
        }
    });

    On_Off_NutLuu_Modal_ChinhSua();
}

// Check thay đổi modal chỉnh sửa
function Check_ThayDoi_Modal_ChinhSua() {
    var check = false;

    // Trống
    if (GiaVeCoBan_Min_Check == true) {
        var GiaVeCoBan_Min_TS = Flight_Edit.ThamSos.find((item) => item.TenThamSo == 'GiaVeCoBan_Min').GiaTri;
        if (GiaVeCoBan_ViPham.value == '') {
            return check;
        } else if (parseInt(numberWithoutDot(GiaVeCoBan_ViPham.value)) < GiaVeCoBan_Min_TS) {
            return check;
        }
    }
    if (ThoiGianBay_Dung_Min_Check == true) {
        if (ThoiGianBay_ViPham.value == '') {
            return check;
        } else if (parseInt(ThoiGianBay_ViPham.value) < parseInt(ThoiGianBay_ViPham.getAttribute('min'))) {
            return check;
        }

        var DiemDungViPham_Items = document.querySelectorAll('.DiemDungViPham_Item');
        for (let i = 1; i < DiemDungViPham_Items.length; i++) {
            if (DiemDungViPham_Items[i].getAttribute('status') == 'KhongSuDung') {
                continue;
            }

            if (DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_NgayDen').value == '') {
                return check;
            }

            if (DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_GioDen').value == '') {
                return check;
            }

            if (DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_ThoiGianDung').value == '') {
                return check;
            }
        }
    }

    // Tạo gói gửi đi
    var data_send = {
        MaChuyenBay: -1,
        NgayKhoiHanh: { Ngay: -1, Thang: -1, Nam: -1 },
        GioKhoiHanh: { Gio: -1, Phut: -1 },
        ThoiGianBay: -1, // sau
        GiaVeCoBan: -1, //sau
        TrangThai: '',
        ThoiGianBayToiThieu: -1,
        ThoiGianDungToiThieu: -1,
        SBTG_Max: -1,
        GiaVeCoBan_Min: -1,
        SBTG: [], // sau
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
    data_send.MaChuyenBay = Flight_Edit.MaChuyenBay;
    data_send.NgayKhoiHanh = structuredClone(Flight_Edit.ThoiGianDi.NgayDi);
    data_send.GioKhoiHanh = structuredClone(Flight_Edit.ThoiGianDi.GioDi);
    data_send.TrangThai = 'ChuaKhoiHanh';
    data_send.ThoiGianBayToiThieu = Flight_Edit.ThamSos.find((item) => item.TenThamSo == 'ThoiGianBayToiThieu').GiaTri;
    data_send.ThoiGianDungToiThieu = Flight_Edit.ThamSos.find(
        (item) => item.TenThamSo == 'ThoiGianDungToiThieu',
    ).GiaTri;
    data_send.SBTG_Max = Flight_Edit.ThamSos.find((item) => item.TenThamSo == 'SBTG_Max').GiaTri;
    data_send.GiaVeCoBan_Min = Flight_Edit.ThamSos.find((item) => item.TenThamSo == 'GiaVeCoBan_Min').GiaTri;

    Flight_Edit.HangVe.forEach((item) => {
        data_send.HangVe.push({
            MaHangGhe: item.MaHangVe,
            TongVe: item.TongVe,
        });
    });

    // Thay đổi
    if (GiaVeCoBan_Min_Check == true && parseInt(numberWithoutDot(GiaVeCoBan_ViPham.value)) != Flight_Edit.GiaVeCoBan) {
        data_send.GiaVeCoBan = parseInt(numberWithoutDot(GiaVeCoBan_ViPham.value));
        check = true;
    } else {
        data_send.GiaVeCoBan = Flight_Edit.GiaVeCoBan;
    }

    if (ThoiGianBay_Dung_Min_Check == true) {
        if (parseInt(ThoiGianBay_ViPham.value) != Flight_Edit.ThoiGianBay) {
            data_send.ThoiGianBay = parseInt(ThoiGianBay_ViPham.value);
            check = true;
        }

        var DiemDungViPham_Items = document.querySelectorAll('.DiemDungViPham_Item');
        for (let i = 1; i < DiemDungViPham_Items.length; i++) {
            if (DiemDungViPham_Items[i].getAttribute('status') == 'KhongSuDung') {
                continue;
            }

            var NgayDen = new Date(
                DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_NgayDen').value +
                    ' ' +
                    DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_GioDen').value +
                    ':00',
            );

            var ThoiGianDung = parseInt(
                DiemDungViPham_Items[i].querySelector('.DiemDungViPham_Item_ThoiGianDung').value,
            );
            if (
                NgayDen.getDate() != Flight_Edit.SanBayTG[i - 1].ThoiGianDen.NgayDen.Ngay ||
                NgayDen.getMonth() + 1 != Flight_Edit.SanBayTG[i - 1].ThoiGianDen.NgayDen.Thang ||
                NgayDen.getFullYear() != Flight_Edit.SanBayTG[i - 1].ThoiGianDen.NgayDen.Nam ||
                NgayDen.getHours() != Flight_Edit.SanBayTG[i - 1].ThoiGianDen.GioDen.Gio ||
                NgayDen.getMinutes() != Flight_Edit.SanBayTG[i - 1].ThoiGianDen.GioDen.Phut
            ) {
                data_send.SBTG.push({
                    ThuTu: Flight_Edit.SanBayTG[i - 1].ThuTu,
                    MaSanBay: Flight_Edit.SanBayTG[i - 1].MaSBTG,
                    NgayDen: { Ngay: NgayDen.getDate(), Thang: NgayDen.getMonth() + 1, Nam: NgayDen.getFullYear() },
                    GioDen: { Gio: NgayDen.getHours(), Phut: NgayDen.getMinutes() },
                    ThoiGianDung: ThoiGianDung,
                    GhiChu: Flight_Edit.SanBayTG[i - 1].GhiChu,
                });
                check = true;
            }
        }
    } else {
        Flight_Edit.SanBayTG.forEach((item) => {
            data_send.SBTG,
                push({
                    ThuTu: item.ThuTu,
                    MaSanBay: item.MaSBTG,
                    NgayDen: structuredClone(item.ThoiGianDen.NgayDen),
                    GioDen: structuredClone(item.ThoiGianDen.GioDen),
                    ThoiGianDung: item.ThoiGianDung,
                    GhiChu: item.GhiChu,
                });
        });
        if (SBTG_Max_Check == true) {
            check = true;
            var SBTG_Max_TS = Flight_Edit.ThamSos.find((item) => item.TenThamSo == 'SBTG_Max').GiaTri;
            for (let i = 0; i < SBTG_Max_TS; i++) {
                data_send.SBTG.pop();
            }
        }
    }

    if (check == true) {
        return data_send;
    }
    return check;
}
// On_off nút lưu modal chỉnh sửa
function On_Off_NutLuu_Modal_ChinhSua() {
    if (Check_ThayDoi_Modal_ChinhSua() != false) {
        ModalStaticChinhSua_Luu.disabled = false;
    } else {
        ModalStaticChinhSua_Luu.disabled = true;
    }
}

if (ModalStaticChinhSua_Thoat) {
    ModalStaticChinhSua_Thoat.addEventListener('click', (e) => {
        SendForm_Huy();
    });
}

if (ModalStaticChinhSua_Luu) {
    ModalStaticChinhSua_Luu.addEventListener('click', (e) => {
        SendForm_Luu();
    });
}
