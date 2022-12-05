import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
    today,
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

let Flight_Edit;
let SanBayTG;
let Mang_Update_SBTG = [];
let ThoiGianBayToiThieu = 30;
let ThoiGianDungToiThieu = 15;
let HangGhe;
function GetFlight_Edit() {
    openLoader('Chờ chút');
    Flight_Edit = JSON.parse(document.getElementById('Flight_EditJS').getAttribute('Flight_EditJS'));

    console.log(Flight_Edit);

    //Hàm chạy lần đầu để dô đây
    LoadSBTGLenView();
    LoadHGLenView();
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
    document.getElementById('NgayKhoiHanh').setAttribute('min', NgayDiString);

    document
        .getElementById('GioKhoiHanh')
        .setAttribute(
            'value',
            numberSmallerTen(Flight_Edit.ThoiGianDi.GioDi.Gio) +
                ':' +
                numberSmallerTen(Flight_Edit.ThoiGianDi.GioDi.Phut),
        );

    document.getElementById('ThoiGianBay').value = Flight_Edit.ThoiGianBay;

    document.getElementById('GiaVeCoBan').value = numberWithDot(Flight_Edit.GiaVeCoBan);

    Flight_Edit.SanBayTG.sort((a, b) => {
        if (a.ThuTu > b.ThuTu) return 1;
    });

    closeLoader();
}
if (!Flight_Edit) GetFlight_Edit();

// --------------------SBTG-----------------------
// Mới dô đưa SBTG lên view
function LoadSBTGLenView() {
    SanBayTG = structuredClone(Flight_Edit.SanBayTG);
    SanBayTG.sort((a, b) => {
        return a.ThuTu - b.ThuTu;
    });

    console.log(SanBayTG);
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

        console.log(Mang_Update_SBTG);
        var SBTG = structuredClone(SanBayTG[i]);
        ThemSBTG(SBTG);
    }
}

// Nút thêm điểm dừng
const ThemDiemDung = document.getElementById('ThemDiemDung');
if (ThemDiemDung) {
    ThemDiemDung.addEventListener('click', (e) => {
        ThemSBTG();
    });
}

// Hàm thêm SBTG
function ThemSBTG(SBTG = null) {
    const node = document.querySelector('.DiemDung_Item').cloneNode(true);
    node.classList.remove('d-none');

    // Thứ tự
    node.querySelector('.DiemDung_Item_ThuTu').value = document.querySelectorAll('.DiemDung_Item').length;
    node.setAttribute('index', document.querySelectorAll('.DiemDung_Item').length);
    node.querySelector('.DiemDung_Item_SanBayDung').setAttribute(
        'index',
        document.querySelectorAll('.DiemDung_Item').length,
    );
    node.querySelector('.DiemDung_Item_NgayDen').setAttribute(
        'index',
        document.querySelectorAll('.DiemDung_Item').length,
    );
    node.querySelector('.DiemDung_Item_GioDen').setAttribute(
        'index',
        document.querySelectorAll('.DiemDung_Item').length,
    );
    node.querySelector('.DiemDung_Item_ThoiGianDung').setAttribute(
        'index',
        document.querySelectorAll('.DiemDung_Item').length,
    );
    node.querySelector('.DiemDung_Item_GhiChu').setAttribute(
        'index',
        document.querySelectorAll('.DiemDung_Item').length,
    );
    node.querySelector('.DiemDung_Item_Xoa').setAttribute('index', document.querySelectorAll('.DiemDung_Item').length);
    node.querySelector('.DiemDung_Item_Luu').setAttribute('index', document.querySelectorAll('.DiemDung_Item').length);
    node.querySelector('.DiemDung_Item_Huy').setAttribute('index', document.querySelectorAll('.DiemDung_Item').length);

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
                    } else {
                        var thgian = Mang_Update_SBTG[parseInt(index)].GiaTri;
                        var year = thgian.getFullYear();
                        var month = thgian.getMonth() + 1;
                        var day = thgian.getDate();
                        e.target.value = year + '-' + numberSmallerTen(month) + '-' + numberSmallerTen(day);
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
                    } else {
                        var thgian = Mang_Update_SBTG[parseInt(index)].GiaTri;
                        var hour = thgian.getHours();
                        var minutes = thgian.getMinutes();
                        e.target.value = numberSmallerTen(hour) + ':' + numberSmallerTen(minutes);
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
        if (DiemDung_Items.length - 1 > 1) {
            const sublastitem = DiemDung_Items[DiemDung_Items.length - 2].querySelector('.DiemDung_Item_Xoa');
            if (sublastitem.classList.contains('d-none')) {
                sublastitem.classList.remove('d-none');
            }
        }
        document.getElementById('DiemDung_Container').removeChild(e.target.closest('.DiemDung_Item'));
    });

    if (SBTG != null) {
        node.querySelector('.DiemDung_Item_SanBayDung').setAttribute('value', SBTG.TenSanBay);
        node.querySelector('.DiemDung_Item_SanBayDung').setAttribute('masanbay', SBTG.MaSBTG);
        node.querySelector('.DiemDung_Item_NgayDen').value =
            SBTG.ThoiGianDen.NgayDen.Nam + '-' + SBTG.ThoiGianDen.NgayDen.Thang + '-' + SBTG.ThoiGianDen.NgayDen.Ngay;
        node.querySelector('.DiemDung_Item_GioDen').value =
            numberSmallerTen(SBTG.ThoiGianDen.GioDen.Gio) + ':' + numberSmallerTen(SBTG.ThoiGianDen.GioDen.Phut);
        node.querySelector('.DiemDung_Item_ThoiGianDung').value = SBTG.ThoiGianDung;
        node.querySelector('.DiemDung_Item_GhiChu').value = SBTG.GhiChu != null ? SBTG.GhiChu : '';
    }

    DiemDung_Container.appendChild(node);
}

// Hàm check TG SBTG
function Check_ThGianDen_SBTG(index, date_change) {
    if (date_change == null) return false;

    var i = index;
    var ChanTruoc =
        i == 0
            ? null
            : new Date(
                  Mang_Update_SBTG[i - 1].GiaTri.getTime() +
                      60000 * (Mang_Update_SBTG[i - 1].TGBayToiThieu + Mang_Update_SBTG[i - 1].ThoiGianDung),
              );

    var GiaTri = date_change;

    var ChanSau =
        i == Mang_Update_SBTG.length - 1
            ? new Date(
                  Mang_Update_SBTG[0].GiaTri.getTime() -
                      60000 *
                          (Mang_Update_SBTG[i].TGBayToiThieu +
                              Mang_Update_SBTG[i].ThoiGianDung -
                              Flight_Edit.ThoiGianBay),
              )
            : new Date(
                  Mang_Update_SBTG[i + 1].GiaTri.getTime() -
                      60000 * (Mang_Update_SBTG[i].TGBayToiThieu + Mang_Update_SBTG[i].ThoiGianDung),
              );

    if (i == 0) {
        if (GiaTri > ChanSau) {
            showToast({
                header: 'Thời gian khởi hành',
                body:
                    'Yêu cầu nhỏ hơn hoặc bằng <br>' +
                    numberSmallerTen(ChanSau.getHours()) +
                    ':' +
                    numberSmallerTen(ChanSau.getMinutes()) +
                    ' ' +
                    numberSmallerTen(ChanSau.getDate()) +
                    '/' +
                    numberSmallerTen(ChanSau.getMonth() + 1) +
                    '/' +
                    ChanSau.getFullYear(),
                duration: 5000,
                type: 'danger',
            });
            return false;
        }
        return true;
    } else if (i < Mang_Update_SBTG.length - 1) {
        if (ChanSau.getTime() == ChanTruoc.getTime()) {
            showToast({
                header: 'Điểm dừng thứ ' + i,
                body: 'Do ràng buộc không thể thay đổi thời gian đến.',
                duration: 5000,
                type: 'danger',
            });
            return false;
        }
        if (ChanTruoc > GiaTri) {
            showToast({
                header: 'Điểm dừng thứ ' + i,
                body:
                    'Yêu cầu thời điểm dừng lớn hơn hoặc bằng <br>' +
                    numberSmallerTen(ChanTruoc.getHours()) +
                    ':' +
                    numberSmallerTen(ChanTruoc.getMinutes()) +
                    ' ' +
                    numberSmallerTen(ChanTruoc.getDate()) +
                    '/' +
                    numberSmallerTen(ChanTruoc.getMonth() + 1) +
                    '/' +
                    ChanTruoc.getFullYear(),
                duration: 5000,
                type: 'danger',
            });

            return false;
        }
        if (GiaTri > ChanSau) {
            showToast({
                header: 'Điểm dừng thứ ' + i,
                body:
                    'Yêu cầu thời điểm dừng nhỏ hơn hoặc bằng <br>' +
                    numberSmallerTen(ChanSau.getHours()) +
                    ':' +
                    numberSmallerTen(ChanSau.getMinutes()) +
                    ' ' +
                    numberSmallerTen(ChanSau.getDate()) +
                    '/' +
                    numberSmallerTen(ChanSau.getMonth() + 1) +
                    '/' +
                    ChanSau.getFullYear(),
                duration: 5000,
                type: 'danger',
            });
            return false;
        }
        return true;
    } else {
        if (ChanSau.getTime() == ChanTruoc.getTime()) {
            showToast({
                header: 'Điểm dừng thứ ' + i,
                body: 'Do ràng buộc không thể thay đổi thời gian đến.',
                duration: 5000,
                type: 'danger',
            });
            return false;
        }
        if (ChanTruoc > GiaTri) {
            showToast({
                header: 'Điểm dừng thứ ' + i,
                body:
                    'Yêu cầu thời điểm dừng lớn hơn hoặc bằng <br>' +
                    numberSmallerTen(ChanTruoc.getHours()) +
                    ':' +
                    numberSmallerTen(ChanTruoc.getMinutes()) +
                    ' ' +
                    numberSmallerTen(ChanTruoc.getDate()) +
                    '/' +
                    numberSmallerTen(ChanTruoc.getMonth() + 1) +
                    '/' +
                    ChanTruoc.getFullYear(),
                duration: 5000,
                type: 'danger',
            });
            return false;
        }
        if (GiaTri > ChanSau) {
            showToast({
                header: 'Điểm dừng thứ ' + i,
                body:
                    'Yêu cầu thời điểm dừng nhỏ hơn hoặc bằng <br>' +
                    numberSmallerTen(ChanSau.getHours()) +
                    ':' +
                    numberSmallerTen(ChanSau.getMinutes()) +
                    ' ' +
                    numberSmallerTen(ChanSau.getDate()) +
                    '/' +
                    numberSmallerTen(ChanSau.getMonth() + 1) +
                    '/' +
                    ChanSau.getFullYear(),
                duration: 5000,
                type: 'danger',
            });
            return false;
        }
        return true;
    }
}

function Check_ThGianDung_SBTG(index, thgiandung_change) {
    if (thgiandung_change < ThoiGianDungToiThieu) {
        showToast({
            header: 'Điểm dừng thứ ' + index,
            body: 'Thời gian dừng tối thiểu là 15 phút',
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
            ? new Date(Mang_Update_SBTG[0].GiaTri.getTime() + 60000 * Flight_Edit.ThoiGianBay)
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
