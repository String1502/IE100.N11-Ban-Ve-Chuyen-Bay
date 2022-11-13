import { today, openLoader, closeLoader, showToast } from '../start.js';
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();

window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});

// Mảng các sân bay
const SanBayDi_lis = document.querySelectorAll('.SanBayDi_li');
let mangSanBay = [];
for (let i = 0; i < SanBayDi_lis.length; i++) {
    // Khởi tạo mảng sân bay
    let MaSanBay = SanBayDi_lis[i].querySelector('.SanBayDi_li_MaSanBay').innerText;
    let TenSanBay = SanBayDi_lis[i].querySelector('.SanBayDi_li_TenSanBay').innerText;
    let TinhThanh = SanBayDi_lis[i].querySelector('.SanBayDi_li_TenTinhThanh').innerText;
    mangSanBay.push({ MaSanBay: MaSanBay, TenSanBay: TenSanBay, TinhThanh: TinhThanh });
}

// Hàm thêm eventListener cho chọn sân bay li và nút swap
function XuLyThemChuyenBay() {
    // Chọn item sân bay
    const SanBayDi_lis = document.querySelectorAll('.SanBayDi_li');
    const SanBayDen_lis = document.querySelectorAll('.SanBayDen_li');
    for (let i = 0; i < SanBayDi_lis.length; i++) {
        // Sự kiện click cho sân bay đi list item
        SanBayDi_lis[i].addEventListener('click', (e) => {
            const ChuyenBay = e.target.closest('.ChuyenBay_Item');
            const SanBayDi_MaSanBay = e.target.querySelector('.SanBayDi_li_MaSanBay').innerText;
            const SanBayDi = ChuyenBay.querySelector('.SanBayDi');
            const SanBayDen = ChuyenBay.querySelector('.SanBayDen');

            const TinhThanh = e.target.querySelector('.SanBayDi_li_TenTinhThanh');
            if (SanBayDi_MaSanBay === SanBayDen.title) {
                showToast({
                    header: 'Sân bay đi không hợp lệ!',
                    body: 'Sân bay đi phải khác sân bay đến',
                    duration: 5000,
                    type: 'warning',
                });
                return;
            }
            SanBayDi.title = SanBayDi_MaSanBay;
            SanBayDi.value = TinhThanh.innerText;
        });

        // Sự kiện click cho sân bay đến list item
        SanBayDen_lis[i].addEventListener('click', (e) => {
            const ChuyenBay = e.target.closest('.ChuyenBay_Item');
            const SanBayDen_MaSanBay = e.target.querySelector('.SanBayDen_li_MaSanBay').innerText;
            const SanBayDen = ChuyenBay.querySelector('.SanBayDen');
            const TinhThanh = e.target.querySelector('.SanBayDen_li_TenTinhThanh');
            const SanBayDi = ChuyenBay.querySelector('.SanBayDi');

            if (SanBayDen_MaSanBay == SanBayDi.title) {
                showToast({
                    header: 'Sân bay đến không hợp lệ!',
                    body: 'Sân bay đến phải khác sân bay đi',
                    duration: 5000,
                    type: 'warning',
                });
                return;
            }
            SanBayDen.title = SanBayDen_MaSanBay;
            SanBayDen.value = TinhThanh.innerText;
        });
    }

    // Nút swap sân bay
    const SwapSanBays = document.querySelectorAll('.SwapSanBay');
    for (let i = 0; i < SwapSanBays.length; i++) {
        SwapSanBays[i].addEventListener('click', (e) => {
            const ChuyenBay = e.target.closest('.ChuyenBay_Item');
            const SanBayDen = ChuyenBay.querySelector('.SanBayDen');
            const SanBayDi = ChuyenBay.querySelector('.SanBayDi');
            let temp = SanBayDen.value;
            SanBayDen.value = SanBayDi.value;
            SanBayDi.value = temp;
            let ma_temp = SanBayDen.title;
            SanBayDen.title = SanBayDi.title;
            SanBayDi.title = ma_temp;
        });
    }
}
XuLyThemChuyenBay();

// Set start date cho ngày đi
const NgayDis = document.querySelectorAll('.NgayDi');
for (let i = 0; i < NgayDis.length; i++) {
    NgayDis[i].setAttribute('min', yyyy + '-' + mm + '-' + dd);
}

// Khứ hồi
const KhuHoi = document.getElementById('KhuHoi');
const NgayVe = document.getElementById('NgayVe');
if (KhuHoi)
    KhuHoi.addEventListener('click', (e) => {
        e.target.checked ? NgayVe.classList.remove('d-none') : NgayVe.classList.add('d-none');
    });
if (NgayVe) NgayVe.setAttribute('min', yyyy + '-' + mm + '-' + dd);

// Hành khách
const hanhkhach_inputnumber_items = document.querySelectorAll('.hanhkhach_inputnumber_item');
const HanhKhach = document.getElementById('HanhKhach');
let mangHanhKhach = []; // Object: { value: , title: ""}; Vd: { value: 5 , title: "Người lớn"}
for (let i = 0; i < hanhkhach_inputnumber_items.length; i++) {
    mangHanhKhach.push({ value: hanhkhach_inputnumber_items[i].value, title: hanhkhach_inputnumber_items[i].title });
    hanhkhach_inputnumber_items[i].addEventListener('change', (e) => {
        let sum = 0;
        let limit = parseInt(document.getElementById('HanhKhach_Max').innerText.toString());
        let mangtemp = structuredClone(mangHanhKhach);
        mangHanhKhach.map((item) => {
            if (item.title == e.target.title) {
                item.value = e.target.value;
            }
        });
        mangHanhKhach.forEach((item) => (sum += parseInt(item.value)));
        if (limit < sum) {
            e.target.value--;
            showToast({
                header: 'Hành khách',
                body: 'Tổng số hành khách không vượt quá ' + limit + '.',
                duration: 5000,
                type: 'warning',
            });
            mangHanhKhach = mangtemp;
        } else {
            HanhKhach.innerText = mangHanhKhach
                .map((item) => {
                    return (item.value + ' ' + item.title).toString();
                })
                .join(', ');
        }
    });
}
if (mangHanhKhach.length > 0)
    HanhKhach.innerText = mangHanhKhach
        .map((i) => {
            return (i.value + ' ' + i.title).toString();
        })
        .join(', ');

// Hạng ghế
const HangGhe = document.getElementById('HangGhe');
const HangGhe_lis = document.querySelectorAll('.HangGhe_li');
let mangHangGhe = [];
for (let i = 0; i < HangGhe_lis.length; i++) {
    //Khởi tạo mảng hạng ghế
    let MaHangGhe = HangGhe_lis[i].querySelector('.HangGhe_li_MaHangGhe').innerText;
    let TenHangGhe = HangGhe_lis[i].querySelector('.HangGhe_li_TenHangGhe').innerText;
    mangHangGhe.push({ MaHangGhe: MaHangGhe, TenHangGhe: TenHangGhe });

    // Sự kiện click cho hạng ghế list item
    HangGhe_lis[i].addEventListener('click', (e) => {
        HangGhe.value = e.target.querySelector('.HangGhe_li_TenHangGhe').innerText;
    });
}

// Nhiều thành phố
const NhieuThanhPho = document.getElementById('NhieuThanhPho');
const MotChieu_KhuHoi = document.getElementById('MotChieu_KhuHoi');
const ThemChuyenBay_div = document.getElementById('ThemChuyenBay_div');

const Hang2_div = document.getElementById('Hang2_div');
const HanhKhach_div = document.getElementById('HanhKhach_div');

const Hang3_div = document.getElementById('Hang3_div');
const NgayVe_div = document.getElementById('NgayVe_div');
const Blank_div = document.getElementById('Trong_div');

if (NhieuThanhPho)
    NhieuThanhPho.addEventListener('click', (e) => {
        if (!NhieuThanhPho.checked) return;

        // Dời ngày đi lên hàng 2, Hành khách xuống hàng 3
        Hang2_div.querySelector('.ChuyenBay_Item').removeChild(HanhKhach_div);
        HanhKhach_div.classList.remove('col-md-5');
        HanhKhach_div.classList.add('col-md-7');

        const NgayDi_div = Hang3_div.querySelector('.NgayDi_div');
        Hang3_div.removeChild(NgayDi_div);
        Hang3_div.removeChild(Blank_div);
        Hang3_div.removeChild(NgayVe_div);
        NgayDi_div.classList.remove('col-md-3');
        NgayDi_div.classList.add('col-md-5');

        Hang3_div.insertBefore(HanhKhach_div, Hang3_div.children[0]);
        Hang2_div.querySelector('.ChuyenBay_Item').appendChild(NgayDi_div);

        const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');
        // Thêm ChuyenBay_Item
        if (ChuyenBay_Items.length < 2) {
            const node = ChuyenBay_Items[0].cloneNode(true);
            node.querySelector('.SanBayDi').value = '';
            node.querySelector('.SanBayDen').value = '';
            node.querySelector('.NgayDi').value = '';
            Hang2_div.appendChild(node);
            XuLyThemChuyenBay();
        } else {
            for (let i = 1; i < ChuyenBay_Items.length; i++) {
                ChuyenBay_Items[i].classList.remove('d-none');
            }
        }

        // Hiện nút thêm chuyến bay
        ThemChuyenBay_div.classList.remove('d-none');
    });

if (MotChieu_KhuHoi)
    MotChieu_KhuHoi.addEventListener('click', (e) => {
        if (!MotChieu_KhuHoi.checked) return;

        // Dời ngày đi xuống hàng 3, Hành khách lên hàng 2
        Hang3_div.removeChild(HanhKhach_div);
        HanhKhach_div.classList.remove('col-md-7');
        HanhKhach_div.classList.add('col-md-5');

        const NgayDi_div = Hang2_div.querySelector('.ChuyenBay_Item').querySelector('.NgayDi_div');
        Hang2_div.querySelector('.ChuyenBay_Item').removeChild(NgayDi_div);
        NgayDi_div.classList.remove('col-md-5');
        NgayDi_div.classList.add('col-md-3');

        Hang2_div.querySelector('.ChuyenBay_Item').appendChild(HanhKhach_div);

        Hang3_div.insertBefore(NgayVe_div, Hang3_div.children[0]);
        Hang3_div.insertBefore(Blank_div, Hang3_div.children[0]);
        Hang3_div.insertBefore(NgayDi_div, Hang3_div.children[0]);

        const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');
        // Ẩn các chuyến bay trừ chuyến đầu tiên
        for (let i = 1; i < ChuyenBay_Items.length; i++) {
            ChuyenBay_Items[i].classList.add('d-none');
        }

        // Ẩn nút thêm chuyến bay
        ThemChuyenBay_div.classList.add('d-none');
    });

// Nút thêm chuyến bay
const ThemChuyenBay = document.getElementById('ThemChuyenBay');
if (ThemChuyenBay)
    ThemChuyenBay.addEventListener('click', (e) => {
        let limit = parseInt(document.getElementById('ChuyenBay_Max').innerText.toString());
        if (document.querySelectorAll('.ChuyenBay_Item').length >= limit) {
            showToast({
                header: 'Giới hạn chuyến bay',
                body: 'Số chuyến bay trong một lần đặt không vượt quá ' + limit + '.',
                duration: 5000,
                type: 'warning',
            });
            return;
        }

        const node = document.querySelector('.ChuyenBay_Item').cloneNode(true);
        node.querySelector('.SanBayDi').value = '';
        node.querySelector('.SanBayDen').value = '';
        node.querySelector('.NgayDi').value = '';

        Hang2_div.appendChild(node);
        XuLyThemChuyenBay();
        const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');
        if (ChuyenBay_Items.length > 2) {
            ChuyenBay_Items[ChuyenBay_Items.length - 1].querySelector('.XoaChuyenBay_div').classList.remove('d-none');
            if (ChuyenBay_Items.length > 3)
                ChuyenBay_Items[ChuyenBay_Items.length - 2].querySelector('.XoaChuyenBay_div').classList.add('d-none');
        }
    });

// Nút xóa chuyến bay
const XoaChuyenBays = document.querySelectorAll('.XoaChuyenBay');
for (let i = 0; i < XoaChuyenBays.length; i++) {
    XoaChuyenBays[i].addEventListener(
        'click',
        (window.xoa = function xoa(e) {
            console.log(e);
            const ChuyenBay = e.closest('.ChuyenBay_Item');
            Hang2_div.removeChild(ChuyenBay);
            const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');
            if (ChuyenBay_Items.length > 2) {
                ChuyenBay_Items[ChuyenBay_Items.length - 1]
                    .querySelector('.XoaChuyenBay_div')
                    .classList.remove('d-none');
            }
        }),
    );
}

function KiemTra_TraCuu() {
    const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');

    if (ChuyenBay_Items.length < 1) return false;

    let num_ChuyenBay = MotChieu_KhuHoi.checked ? 1 : ChuyenBay_Items.length;
    let header_toast = '';
    let body_toast = '';
    for (let i = 0; i < num_ChuyenBay; i++) {
        header_toast = num_ChuyenBay == 1 ? 'Chuyến bay' : 'Chuyến bay ' + (i + 1).toString();
        let SanBayDi = ChuyenBay_Items[i].querySelector('.SanBayDi').value;
        let SanBayDen = ChuyenBay_Items[i].querySelector('.SanBayDen').value;
        let NgayDi = MotChieu_KhuHoi.checked
            ? Hang3_div.querySelector('.NgayDi').value
            : ChuyenBay_Items[i].querySelector('.NgayDi').value;

        if (SanBayDi === '') {
            body_toast = 'Sân bay đi đang trống!';
            showToast({ header: header_toast, body: body_toast, type: 'warning', duration: 3000 });
            return false;
        }
        if (SanBayDen === '') {
            body_toast = 'Sân bay đến đang trống!';
            showToast({ header: header_toast, body: body_toast, type: 'warning', duration: 3000 });
            return false;
        }
        if (NgayDi === '') {
            body_toast = 'Ngày đi đang trống!';
            showToast({ header: header_toast, body: body_toast, type: 'warning', duration: 3000 });
            return false;
        }
    }
    if (num_ChuyenBay == 1 && KhuHoi.checked && NgayVe.value === '') {
        header_toast = 'Khứ hồi';
        body_toast = 'Ngày về đang trống!';
        showToast({ header: header_toast, body: body_toast, type: 'warning', duration: 3000 });
        return false;
    }

    if (HangGhe.value === '') {
        header_toast = 'Hạng ghế';
        body_toast = 'Hạng ghế đang trống!';
        showToast({ header: header_toast, body: body_toast, type: 'warning', duration: 3000 });
        return false;
    }

    return true;
}

function SendForm(mangchuyenbay, hangghe, hanhkhach) {
    document.getElementById('mangchuyenbay_formid').value = mangchuyenbay;
    document.getElementById('hangghe_formid').value = hangghe;
    document.getElementById('hanhkhach_formid').value = hanhkhach;
    var search_flight_form = document.forms['search-flight-form'];
    ///NOTE: Lần đầu tiên gọi thì gọi form này để điều hướng trang web do axios chỉ trả về data ko có điều hướng
    search_flight_form.action = '/choose_flight';
    search_flight_form.submit();
}

document.addEventListener('DOMContentLoaded', function () {
    window.searchFlightBtn_onclick = function searchFlightBtn() {
        if (!KiemTra_TraCuu()) return;

        const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');

        let soluongChuyenBay = MotChieu_KhuHoi.checked ? (KhuHoi.checked ? 2 : 1) : ChuyenBay_Items.length;
        let mangChuyenBay = [];

        let MaSanBayDi;
        let SanBayDi;
        let MaSanBayDen;
        let SanBayDen;

        let ngaythangnam;
        let NgayBay;
        if (MotChieu_KhuHoi.checked && KhuHoi.checked) {
            MaSanBayDi = ChuyenBay_Items[0].querySelector('.SanBayDi').title;
            SanBayDi = mangSanBay.find((item) => item.MaSanBay == MaSanBayDi);

            MaSanBayDen = ChuyenBay_Items[0].querySelector('.SanBayDen').title;
            SanBayDen = mangSanBay.find((item) => item.MaSanBay == MaSanBayDen);

            ngaythangnam = (
                MotChieu_KhuHoi.checked
                    ? Hang3_div.querySelector('.NgayDi').value
                    : ChuyenBay_Items[0].querySelector('.NgayDi').value
            ).split('-');
            NgayBay = { Nam: ngaythangnam[0], Thang: ngaythangnam[1], Ngay: ngaythangnam[2] };

            mangChuyenBay.push({ SanBayDi: SanBayDi, SanBayDen: SanBayDen, NgayDi: NgayBay });

            // Chuyến khứ hồi
            MaSanBayDi = ChuyenBay_Items[0].querySelector('.SanBayDen').title;
            SanBayDi = mangSanBay.find((item) => item.MaSanBay == MaSanBayDi);

            MaSanBayDen = ChuyenBay_Items[0].querySelector('.SanBayDi').title;
            SanBayDen = mangSanBay.find((item) => item.MaSanBay == MaSanBayDen);

            ngaythangnam = document.getElementById('NgayVe').value.split('-');
            NgayBay = { Nam: ngaythangnam[0], Thang: ngaythangnam[1], Ngay: ngaythangnam[2] };

            mangChuyenBay.push({ SanBayDi: SanBayDi, SanBayDen: SanBayDen, NgayDi: NgayBay });
        } else {
            for (let i = 0; i < soluongChuyenBay; i++) {
                MaSanBayDi = ChuyenBay_Items[i].querySelector('.SanBayDi').title;
                SanBayDi = mangSanBay.find((item) => item.MaSanBay == MaSanBayDi);

                MaSanBayDen = ChuyenBay_Items[i].querySelector('.SanBayDen').title;
                SanBayDen = mangSanBay.find((item) => item.MaSanBay == MaSanBayDen);

                ngaythangnam = (
                    MotChieu_KhuHoi.checked
                        ? Hang3_div.querySelector('.NgayDi').value
                        : ChuyenBay_Items[i].querySelector('.NgayDi').value
                ).split('-');
                NgayBay = { Nam: ngaythangnam[0], Thang: ngaythangnam[1], Ngay: ngaythangnam[2] };

                mangChuyenBay.push({ SanBayDi: SanBayDi, SanBayDen: SanBayDen, NgayDi: NgayBay });
            }
        }

        let bienHangGhe = mangHangGhe.find((item) => item.TenHangGhe == HangGhe.value);

        SendForm(JSON.stringify(mangChuyenBay), JSON.stringify(bienHangGhe), JSON.stringify(mangHanhKhach));
    };
});
