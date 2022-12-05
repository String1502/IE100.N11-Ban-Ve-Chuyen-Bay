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

// Mới dô đưa SBTG lên view
function LoadSBTGLenView() {
    SanBayTG = structuredClone(Flight_Edit.SanBayTG);
    SanBayTG.sort((a, b) => {
        return a.ThuTu - b.ThuTu;
    });

    console.log(SanBayTG);
    for (let i = 0; i < SanBayTG.length; i++) {
        var SBTG = structuredClone(SanBayTG[i]);
        ThemSBTG(SBTG);
    }
}
function Check_SBTG_isAscending() {
    var NgayDen = Check_NgayDen_isAscending();
    if (NgayDen != true) {
        var header = '';
        var body = '';
        if (NgayDen == -1) {
            header = 'Ngày khởi hành';
            body = 'Ngày khởi hành nhỏ hơn tất cả ngày đến!';
        } else {
            header = 'SBTG thứ ' + NgayDen;
            body = 'Ngày đến lớn hơn ngày đến liền trước và nhỏ hơn ngày đến liền sau!';
        }

        showToast({
            header: header,
            body: body,
            duration: 5000,
            type: 'danger',
        });

        const DiemDung_Item_NgayDens = document.querySelectorAll('.DiemDung_Item_NgayDen');
        for (let i = 0; i < DiemDung_Item_NgayDens.length; i++) {
            var ThuTu = DiemDung_Item_NgayDens[i].getAttribute('index');
            if (parseInt(ThuTu) == NgayDen) {
                DiemDung_Item_NgayDens[i].focus();
                break;
            }
        }
        return;
    }
}
function Check_NgayDen_isAscending() {
    var arr = [];

    if (NgayKhoiHanh.value != '') {
        var chuoi = NgayKhoiHanh.value.split('-');

        arr.push({
            ThoiGianDen: {
                NgayDen: { Nam: parseInt(chuoi[0]), Thang: parseInt(chuoi[1]), Ngay: parseInt(chuoi[2]) },
                GioDen: { Gio: -1, Phut: -1 },
            },
            ThoiGianDung: -1,
            ThuTu: -1,
        });
    }
    var DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
    for (let i = 0; i < DiemDung_Items.length; i++) {
        var DiemDung_Item_NgayDen = DiemDung_Items[i].querySelector('.DiemDung_Item_NgayDen');
        if (DiemDung_Item_NgayDen.value != '') {
            var chuoi = DiemDung_Item_NgayDen.value.split('-');

            arr.push({
                ThoiGianDen: {
                    NgayDen: { Nam: parseInt(chuoi[0]), Thang: parseInt(chuoi[1]), Ngay: parseInt(chuoi[2]) },
                    GioDen: { Gio: -1, Phut: -1 },
                },
                ThoiGianDung: -1,
                ThuTu: parseInt(DiemDung_Items[i].querySelector('.DiemDung_Item_ThuTu').value),
            });
        }
    }

    arr.sort((a, b) => {
        return a.ThuTu - b.ThuTu;
    });

    for (let i = 1; i < arr.length; i++) {
        var a = new Date(
            arr[i].ThoiGianDen.NgayDen.Nam,
            arr[i].ThoiGianDen.NgayDen.Thang,
            arr[i].ThoiGianDen.NgayDen.Ngay,
        );
        var b = new Date(
            arr[i - 1].ThoiGianDen.NgayDen.Nam,
            arr[i - 1].ThoiGianDen.NgayDen.Thang,
            arr[i - 1].ThoiGianDen.NgayDen.Ngay,
        );
        if (a <= b) {
            console.log(arr[i - 1]);
            return arr[i - 1].ThuTu;
        }
    }
    return true;
}

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

// Nút thêm điểm dừng
const ThemDiemDung = document.getElementById('ThemDiemDung');
if (ThemDiemDung) {
    ThemDiemDung.addEventListener('click', (e) => {
        ThemSBTG();
    });
}

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

    // Ngày giờ đến
    node.querySelector('.DiemDung_Item_NgayDen').addEventListener('change', (e) => {
        if (e.target.value != '') {
            Check_SBTG_isAscending();
        }
    });
    node.querySelector('.DiemDung_Item_GioDen').addEventListener('change', (e) => {
        //
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
