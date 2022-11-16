import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
    today,
    showToast,
} from '../start.js';

window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});

//Lấy danh sách chuyến bay từ DB
let Flight_fromDB;
function GetFlight_fromSV() {
    const ChuyenBay = document.getElementById('MaChuyenBay');
    var data = { MaChuyenBay: ChuyenBay.getAttribute('machuyenbay'), MaChuyenBayHienThi: ChuyenBay.value };

    openLoader('Chờ chút');
    axios({
        method: 'post',
        url: '/flight/get-flight',
        data: data,
    }).then((res) => {
        Flight_fromDB = res.data;
        closeLoader();
        if (Flight_fromDB) {
            LoadDataLenView();
            console.log(Flight_fromDB);
        }
    });
}
if (!Flight_fromDB) GetFlight_fromSV();

function LoadDataLenView() {
    document.getElementById('MaChuyenBay').value =
        Flight_fromDB.SanBayDi.MaSanBay + '-' + Flight_fromDB.SanBayDen.MaSanBay + '-' + Flight_fromDB.MaChuyenBay;
    document.getElementById('SanBayDi').value = Flight_fromDB.SanBayDi.TenSanBay;
    document.getElementById('SanBayDen').value = Flight_fromDB.SanBayDen.TenSanBay;
    document.getElementById('KhoiHanh').value =
        numberSmallerTen(Flight_fromDB.ThoiGianDi.GioDi.Gio) +
        ':' +
        numberSmallerTen(Flight_fromDB.ThoiGianDi.GioDi.Phut) +
        ' ' +
        numberSmallerTen(Flight_fromDB.ThoiGianDi.NgayDi.Ngay) +
        '-' +
        numberSmallerTen(Flight_fromDB.ThoiGianDi.NgayDi.Thang) +
        '-' +
        Flight_fromDB.ThoiGianDi.NgayDi.Nam;

    document.getElementById('ThoiGianBay').value = Flight_fromDB.ThoiGianBay;
    document.getElementById('SoGheTrong').value = Flight_fromDB.GheTrong;
    document.getElementById('TrangThai').value =
        Flight_fromDB.TrangThai == 'ChuaKhoiHanh' ? 'Chưa khởi hành' : 'Đã khởi hành';
    document.getElementById('GiaVeCoBan').value = numberWithDot(Flight_fromDB.GiaVeCoBan);
    LoadSanBayTrungGian();
    LoadHangVe();
    LoadVeDaDat();
}

function LoadSanBayTrungGian() {
    const SanBayTrungGian_Container = document.getElementById('SanBayTrungGian_Container');
    const SanBayTrungGian_Items = document.querySelectorAll('.SanBayTrungGian_Item');
    if (SanBayTrungGian_Items.length > 1) {
        let num = SanBayTrungGian_Items.length;
        for (let i = num - 1; i > 0; i--) {
            SanBayTrungGian_Container.removeChild(SanBayTrungGian_Items[i]);
        }
    }

    const SBTG = Flight_fromDB.SanBayTG;
    for (let i = 0; i < SBTG.length; i++) {
        const node = SanBayTrungGian_Items[0].cloneNode(true);
        node.classList.remove('d-none');

        node.querySelector('.ThuTu').innerText = SBTG[i].ThuTu;
        node.querySelector('.TenSanBay').innerText = SBTG[i].TenSanBay;
        node.querySelector('.ThoiGianDen').innerText =
            numberSmallerTen(SBTG[i].ThoiGianDen.GioDen.Gio) +
            ':' +
            numberSmallerTen(SBTG[i].ThoiGianDen.GioDen.Phut) +
            ' ' +
            numberSmallerTen(SBTG[i].ThoiGianDen.NgayDen.Ngay) +
            '-' +
            numberSmallerTen(SBTG[i].ThoiGianDen.NgayDen.Thang) +
            '-' +
            SBTG[i].ThoiGianDen.NgayDen.Nam;
        node.querySelector('.ThoiGianDung').innerText = SBTG[i].ThoiGianDung;
        node.querySelector('.GhiChu').innerText = SBTG[i].GhiChu == null ? '' : SBTG[i].GhiChu;

        SanBayTrungGian_Container.appendChild(node);
    }
}

function LoadHangVe() {
    const HangVe_Container = document.getElementById('HangVe_Container');
    const HangVe_Items = document.querySelectorAll('.HangVe_Item');
    if (HangVe_Items.length > 1) {
        let num = HangVe_Items.length;
        for (let i = num - 1; i > 0; i--) {
            HangVe_Container.removeChild(HangVe_Items[i]);
        }
    }

    const HangVes = Flight_fromDB.HangVe;
    for (let i = 0; i < HangVes.length; i++) {
        const node = HangVe_Items[0].cloneNode(true);
        node.classList.remove('d-none');

        node.querySelector('.TenHangVe').innerText = HangVes[i].TenHangVe;
        node.querySelector('.GiaTien').innerText = numberWithDot(HangVes[i].GiaTien);
        node.querySelector('.GheTrong').innerText = HangVes[i].GheTrong;

        HangVe_Container.appendChild(node);
    }
}

function LoadVeDaDat() {
    const VeDaDat_Container = document.getElementById('VeDaDat_Container');
    const VeDaDat_Items = document.querySelectorAll('.VeDaDat_Item');
    if (VeDaDat_Items.length > 1) {
        let num = VeDaDat_Items.length;
        for (let i = num - 1; i > 0; i--) {
            VeDaDat_Container.removeChild(VeDaDat_Items[i]);
        }
    }

    const VeDaDats = Flight_fromDB.VeDaDat;
    for (let i = 0; i < VeDaDats.length; i++) {
        const node = VeDaDat_Items[0].cloneNode(true);
        node.classList.remove('d-none');

        node.querySelector('.MaVeHienThi').innerText = VeDaDats[i].MaVeHienThi;
        node.querySelector('.TenHanhKhach').innerText = VeDaDats[i].HanhKhach.HoTen;
        node.querySelector('.TenHangVe').innerText = VeDaDats[i].TenHangVe;
        node.querySelector('.SoKgHanhLy').innerText = '+ ' + VeDaDats[i].MocHanhLy + 'kg';
        node.querySelector('.NgayThanhToan').innerText =
            numberSmallerTen(VeDaDats[i].ThoiGianThanhToan.GioThanhToan.Gio) +
            ':' +
            numberSmallerTen(VeDaDats[i].ThoiGianThanhToan.GioThanhToan.Phut) +
            ' ' +
            numberSmallerTen(VeDaDats[i].ThoiGianThanhToan.NgayThanhToan.Ngay) +
            '-' +
            numberSmallerTen(VeDaDats[i].ThoiGianThanhToan.NgayThanhToan.Thang) +
            '-' +
            VeDaDats[i].ThoiGianThanhToan.NgayThanhToan.Nam;

        node.querySelector('.GiaVe').innerText = numberWithDot(VeDaDats[i].GiaVe);

        VeDaDat_Container.appendChild(node);
    }
}

// function SendForm(_PackageBooking) {
//     //document.getElementById('packagebooking').value = JSON.stringify(_PackageBooking);
//     var staff_form = document.forms['staff-form'];
//     staff_form.action = '/staff';
//     staff_form.submit();
// }

// const DangNhap = document.getElementById('DangNhap');

// DangNhap.addEventListener('click', (e) => {
//     SendForm('Haha');
// });
