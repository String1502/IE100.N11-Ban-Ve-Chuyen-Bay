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

//Lấy danh sách chuyến bay từ DB
let FlightList_fromDB;
function GetFlight_fromSV() {
    openLoader('Chờ chút');
    axios({
        method: 'post',
        url: '/flight/get-all-flights',
        data: { GetFlight_fromSV: true },
    }).then((res) => {
        FlightList_fromDB = res.data;
        closeLoader();
        if (FlightList_fromDB) {
            LoadChuyenBayLenView();
            AddEventCacTieuChuanTraCuu();
            AddEventKeyUpSearch();
            console.log(FlightList_fromDB);
        }
    });
}
if (!FlightList_fromDB) GetFlight_fromSV();

function GetFilterFlight_fromSV() {
    var data_send = {
        MaChuyenBay: '',
        MaSanBayDi: '',
        MaSanBayDen: '',
        MaHangGhe: '',
        GheTrong: -1,
        NgayKhoiHanh: { Ngay: -1, Thang: -1, Nam: -1 },
        GioKhoiHanh: { Gio: -1, Phut: -1 },
        GiaVeCoBan: -1,
        TrangThai: '',
    };

    let MaChuyenBay = document.getElementById('MaChuyenBay').value;
    let MaSanBayDi = document.getElementById('SanBayDi').getAttribute('masanbay');
    let MaSanBayDen = document.getElementById('SanBayDen').getAttribute('masanbay');
    let MaHangGhe = document.getElementById('HangGhe').getAttribute('mahangghe');
    let GheTrong = parseInt(document.getElementById('GheTrong').value);
    let NgayKhoiHanh = document.getElementById('NgayKhoiHanh').value;
    let GioKhoiHanh = document.getElementById('GioKhoiHanh').value;
    let GiaVeCoBan = parseInt(numberWithoutDot(document.getElementById('GiaVeCoBan').value));
    let TrangThai = document.getElementById('TrangThai').getAttribute('GiaTri');
    let mark = false;

    // if (MaChuyenBay != '') {

    //     data_send.MaChuyenBay = MaChuyenBay;
    // }
    if (MaSanBayDi != '' && MaSanBayDi !== 'undefined') {
        data_send.MaSanBayDi = MaSanBayDi;
        mark = true;
    }
    if (MaSanBayDen != '' && MaSanBayDen !== 'undefined') {
        data_send.MaSanBayDen = MaSanBayDen;
        mark = true;
    }
    if (MaHangGhe != '' && MaHangGhe !== 'undefined') {
        data_send.MaHangGhe = MaHangGhe;
        mark = true;
    }
    if (GheTrong > 0 && GheTrong !== 'undefined') {
        data_send.GheTrong = GheTrong;
        mark = true;
    }
    if (NgayKhoiHanh != '' && NgayKhoiHanh !== 'undefined') {
        let chuoi = NgayKhoiHanh.split('-');
        data_send.NgayKhoiHanh.Ngay = parseInt(chuoi[2]);
        data_send.NgayKhoiHanh.Thang = parseInt(chuoi[1]);
        data_send.NgayKhoiHanh.Nam = parseInt(chuoi[0]);
        mark = true;
    }
    if (GioKhoiHanh != '' && GioKhoiHanh !== 'undefined') {
        let chuoi = GioKhoiHanh.split(':');
        data_send.GioKhoiHanh.Gio = parseInt(chuoi[0]);
        data_send.GioKhoiHanh.Phut = parseInt(chuoi[1]);
        mark = true;
    }
    if (GiaVeCoBan > 0 && GiaVeCoBan !== 'undefined') {
        data_send.GiaVeCoBan = GiaVeCoBan;
        mark = true;
    }
    if (TrangThai != '' && TrangThai !== 'undefined') {
        data_send.TrangThai = TrangThai;
        mark = true;
    }
    console.log(data_send);
    if (!mark) {
        GetFlight_fromSV();
    } else {
        openLoader('Chờ chút');
        axios({
            method: 'post',
            url: '/flight/filter',
            data: data_send,
        }).then((res) => {
            FlightList_fromDB = res.data;
            closeLoader();
            if (FlightList_fromDB) {
                LoadChuyenBayLenView();
                console.log(FlightList_fromDB);
            }
        });
    }
    document.getElementById('SearchChuyenBay').value = '';
}

function AddEventCacTieuChuanTraCuu() {
    // Mã chuyến bay
    document.getElementById('MaChuyenBay').addEventListener('change', (e) => {
        null;
    });

    // Số ghế trống
    document.getElementById('GheTrong').addEventListener('change', (e) => {
        GetFilterFlight_fromSV();
    });

    // Ngày khởi hành
    document.getElementById('NgayKhoiHanh').addEventListener('change', (e) => {
        GetFilterFlight_fromSV();
    });

    // Giờ khởi hành
    document.getElementById('GioKhoiHanh').addEventListener('change', (e) => {
        GetFilterFlight_fromSV();
    });

    // Giá vé cơ bản
    document.getElementById('GiaVeCoBan').addEventListener('change', (e) => {
        e.target.value = numberWithDot(e.target.value);
        GetFilterFlight_fromSV();
    });
    // Giá vé cơ bản khi focus
    document.getElementById('GiaVeCoBan').addEventListener('focus', (e) => {
        e.target.value = numberWithoutDot(e.target.value);
    });
    // Giá vé cơ bản khi hết focus
    document.getElementById('GiaVeCoBan').addEventListener('blur', (e) => {
        if (e.target.value != '') e.target.value = numberWithDot(parseInt(numberWithoutDot(e.target.value)).toString());
    });

    // Trạng thái
    const TrangThai_lis = document.querySelectorAll('.TrangThai_li');
    for (let i = 0; i < TrangThai_lis.length; i++) {
        TrangThai_lis[i].addEventListener('click', (e) => {
            let hienthi = e.target.querySelector('.TrangThai_li_value').innerText;
            let giatri = e.target.querySelector('.TrangThai_li_value').getAttribute('GiaTri');
            let mauchu = e.target.querySelector('.TrangThai_li_value').getAttribute('TextColor');
            document.getElementById('TrangThai').value = hienthi;
            document.getElementById('TrangThai').setAttribute('GiaTri', giatri);
            for (let j = 0; j < TrangThai_lis.length; j++) {
                var temp = TrangThai_lis[j].querySelector('.TrangThai_li_value').getAttribute('TextColor');
                TrangThai.classList.remove(temp);
            }
            document.getElementById('TrangThai').classList.add(mauchu);

            GetFilterFlight_fromSV();
        });
    }

    // Sân bay đi
    const SanBayDi_lis = document.querySelectorAll('.SanBayDi_li');
    for (let i = 0; i < SanBayDi_lis.length; i++) {
        SanBayDi_lis[i].addEventListener('click', (e) => {
            const MaSanBayDen = document.getElementById('SanBayDen').getAttribute('masanbay');
            const MaSanBayDi = e.target.querySelector('.SanBayDi_li_MaSanBay').innerText;
            if (MaSanBayDen != '' && MaSanBayDi != '')
                if (MaSanBayDen == MaSanBayDi) {
                    showToast({
                        header: 'Sân bay đi',
                        body: 'Sân bay đi không trùng sân bay đến.',
                        duration: 5000,
                        type: 'warning',
                    });
                    return;
                }
            document.getElementById('SanBayDi').setAttribute('masanbay', MaSanBayDi);
            document.getElementById('SanBayDi').value = e.target.querySelector('.SanBayDi_li_TenSanBay').innerText;
            GetFilterFlight_fromSV();
        });
    }

    // Sân bay đến
    const SanBayDen_lis = document.querySelectorAll('.SanBayDen_li');
    for (let i = 0; i < SanBayDen_lis.length; i++) {
        SanBayDen_lis[i].addEventListener('click', (e) => {
            const MaSanBayDi = document.getElementById('SanBayDi').getAttribute('masanbay');
            const MaSanBayDen = e.target.querySelector('.SanBayDen_li_MaSanBay').innerText;
            if (MaSanBayDen != '' && MaSanBayDi != '')
                if (MaSanBayDen == MaSanBayDi) {
                    showToast({
                        header: 'Sân bay đến',
                        body: 'Sân bay đến không trùng sân bay đi.',
                        duration: 5000,
                        type: 'warning',
                    });
                    return;
                }
            document.getElementById('SanBayDen').setAttribute('masanbay', MaSanBayDen);
            document.getElementById('SanBayDen').value = e.target.querySelector('.SanBayDen_li_TenSanBay').innerText;
            GetFilterFlight_fromSV();
        });
    }

    // Nút swap
    document.getElementById('SwapSanBay').addEventListener('click', (e) => {
        let TenSanBay = document.getElementById('SanBayDi').value;
        let MaSanBay = document.getElementById('SanBayDi').getAttribute('masanbay');
        document.getElementById('SanBayDi').value = document.getElementById('SanBayDen').value;
        document
            .getElementById('SanBayDi')
            .setAttribute('masanbay', document.getElementById('SanBayDen').getAttribute('masanbay'));

        document.getElementById('SanBayDen').value = TenSanBay;
        document.getElementById('SanBayDen').setAttribute('masanbay', MaSanBay);

        GetFilterFlight_fromSV();
    });

    // Hạng ghế
    const HangGhe_lis = document.querySelectorAll('.HangGhe_li');
    for (let i = 0; i < HangGhe_lis.length; i++) {
        HangGhe_lis[i].addEventListener('click', (e) => {
            document.getElementById('HangGhe').value = e.target.querySelector('.HangGhe_li_TenHangGhe').innerText;
            document
                .getElementById('HangGhe')
                .setAttribute('mahangghe', e.target.querySelector('.HangGhe_li_MaHangGhe').innerText);
            GetFilterFlight_fromSV();
        });
    }
}

function LoadChuyenBayLenView() {
    const ChuyenBay_Container = document.getElementById('ChuyenBay_Container');
    const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');
    if (ChuyenBay_Items.length > 1) {
        let num = ChuyenBay_Items.length;
        for (let i = num - 1; i > 0; i--) {
            ChuyenBay_Container.removeChild(ChuyenBay_Items[i]);
        }
    }

    const ChuyenBays = FlightList_fromDB;
    for (let i = 0; i < ChuyenBays.length; i++) {
        const node = ChuyenBay_Items[0].cloneNode(true);
        node.classList.remove('d-none');
        node.setAttribute('aria-valuetext', i);

        node.querySelector('.MaChuyenBayHienThi').innerText = ChuyenBays[i].MaHienThi;
        node.querySelector('.TenSanBayDi').innerText = ChuyenBays[i].SanBayDi.TenSanBay;
        node.querySelector('.TenSanBayDen').innerText = ChuyenBays[i].SanBayDen.TenSanBay;
        node.querySelector('.KhoiHanh').innerText =
            numberSmallerTen(ChuyenBays[i].KhoiHanh.GioDi.Gio) +
            ':' +
            numberSmallerTen(ChuyenBays[i].KhoiHanh.GioDi.Phut) +
            ' ' +
            numberSmallerTen(ChuyenBays[i].KhoiHanh.NgayDi.Ngay) +
            '-' +
            numberSmallerTen(ChuyenBays[i].KhoiHanh.NgayDi.Thang) +
            '-' +
            ChuyenBays[i].KhoiHanh.NgayDi.Nam;
        node.querySelector('.GiaVeCoBan').innerText = numberWithDot(ChuyenBays[i].GiaVeCoBan);
        node.querySelector('.GheTrong').innerText = ChuyenBays[i].GheTrong;

        if (ChuyenBays[i].TrangThai == 'ChuaKhoiHanh') {
            node.querySelector('.TrangThai').innerText = 'Chưa khởi hành';
            node.querySelector('.TrangThai').classList.add('text-success-light');
        } else if (ChuyenBays[i].TrangThai == 'ViPhamQuiDinh') {
            node.querySelector('.TrangThai').innerText = 'Vi phạm qui định';
            node.querySelector('.TrangThai').classList.add('text-secondary');
        } else if (ChuyenBays[i].TrangThai == 'DaKhoiHanh') {
            node.querySelector('.TrangThai').innerText = 'Đã khởi hành';
            node.querySelector('.TrangThai').classList.add('text-success');
        } else if (ChuyenBays[i].TrangThai == 'DaHuy') {
            node.querySelector('.TrangThai').innerText = 'Đã hủy';
            node.querySelector('.TrangThai').classList.add('text-danger');
        }

        node.querySelector('.ChiTiet').addEventListener('click', (e) => {
            let index = parseInt(e.target.closest('.ChuyenBay_Item').getAttribute('aria-valuetext'));
            SendForm({
                MaChuyenBay: FlightList_fromDB[index].MaChuyenBay,
                MaChuyenBayHienThi: FlightList_fromDB[index].MaHienThi,
            });
        });

        ChuyenBay_Container.appendChild(node);
    }
}

function SendForm(Package) {
    document.getElementById('package').value = JSON.stringify(Package);
    var staff_form = document.forms['flight-detail-form'];
    staff_form.action = '/staff/flightdetail';
    staff_form.submit();
}

function AddEventKeyUpSearch() {
    document.getElementById('SearchChuyenBay').addEventListener('keyup', (e) => {
        const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');
        var search = e.target.value.toString().toUpperCase();
        for (let i = 1; i < ChuyenBay_Items.length; i++) {
            var MaChuyenBay = ChuyenBay_Items[i].querySelector('.MaChuyenBayHienThi').innerText.toUpperCase();
            if (MaChuyenBay.includes(search) || search == '') {
                if (ChuyenBay_Items[i].classList.contains('d-none')) {
                    ChuyenBay_Items[i].classList.remove('d-none');
                }
            } else {
                if (!ChuyenBay_Items[i].classList.contains('d-none')) {
                    ChuyenBay_Items[i].classList.add('d-none');
                }
            }
        }
    });
}
