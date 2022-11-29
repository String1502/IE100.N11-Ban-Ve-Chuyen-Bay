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
function GetFlight_Edit() {
    openLoader('Chờ chút');
    Flight_Edit = JSON.parse(document.getElementById('Flight_EditJS').getAttribute('Flight_EditJS'));

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
    console.log(Flight_Edit.ThoiGianDi.GioDi);

    document.getElementById('ThoiGianBay').value = Flight_Edit.ThoiGianBay;

    document.getElementById('GiaVeCoBan').value = numberWithDot(Flight_Edit.GiaVeCoBan);

    Flight_Edit.SanBayTG.sort((a, b) => {
        if (a.ThuTu > b.ThuTu) return 1;
    });

    closeLoader();
}
if (!Flight_Edit) GetFlight_Edit();

function LoadSBTGLenView() {
    let SanBayTG = Flight_Edit.SanBayTG;
    for (let i = 0; i < SanBayTG.length; i++) {}
}

// Nút thêm điểm dừng
const ThemDiemDung = document.getElementById('ThemDiemDung');
if (ThemDiemDung) {
    ThemDiemDung.addEventListener('click', (e) => {
        ThemSBTG();
    });
}

function ThemSBTG() {
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

    DiemDung_Container.appendChild(node);
}

// Nút thêm hạng ghế
const ThemHangGhe = document.getElementById('ThemHangGhe');
if (ThemHangGhe) {
    ThemHangGhe.addEventListener('click', (e) => {
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

        HangGhe_Container.appendChild(node);
    });
}
