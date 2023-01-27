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
    formatVND,
    ActiveNavItem_Header,
} from '../start.js';

window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});
axios({
    method: 'post',
    url: '/hoadon/XoaCookieMaHangVe',
}).then((res) => {});
function isNumeric(value) {
    return /^\d+$/.test(value);
}
var Invoice;
function start() {
    document.getElementById('TimKiemHoaDon').addEventListener('click', async (e) => {
        var value = HoaDon_input.value;
        if (value == '') {
            showToast({ header: 'Mã hóa đơn', body: 'Mã hóa đơn còn trống!', duration: 5000, type: 'warning' });
            return;
        }
        if (value.includes('-') == false || value.split('-')[0] == '' || value.split('-')[1] == '') {
            showToast({ header: 'Mã hóa đơn', body: 'Mã hóa đơn không tồn tại!', duration: 5000, type: 'warning' });
            return;
        }
        var mahoadon = value.split('-')[0];
        if (isNumeric(mahoadon) == false) {
            showToast({ header: 'Mã hóa đơn', body: 'Mã hóa đơn không tồn tại!', duration: 5000, type: 'warning' });
            return;
        }
        mahoadon = parseInt(mahoadon);
        openLoader('Chờ chút');
        await axios({
            method: 'post',
            url: '/hoadon/TraCuuHoaDon',
            data: { MaHoaDon: mahoadon, MaHangGhe: value.split('-')[1] },
        }).then(async (res) => {
            if (res.data == false) {
                Invoice = false;
                Invoice_decor.classList.add('d-none');
                Yes_Invoice.classList.add('d-none');
                No_Invoice.classList.remove('d-none');
                return;
            }
            Invoice = structuredClone(res.data);
            var mang_ChuyenBays = [];
            for (let i = 0; i < Invoice.ChuyenBays.length; i++) {
                await axios({
                    method: 'post',
                    url: '/flight/get-flight',
                    data: {
                        MaChuyenBay: Invoice.ChuyenBays[i].MaChuyenBay,
                        MaChuyenBayHienThi: Invoice.ChuyenBays[i].MaChuyenBayHienThi,
                    },
                }).then((res) => {
                    res.data.MaChuyenBayHienThi =
                        res.data.SanBayDi.MaSanBay + '-' + res.data.SanBayDen.MaSanBay + '-' + res.data.MaChuyenBay;
                    res.data.BookingID = Invoice.MaHoaDon + '-' + res.data.MaChuyenBayHienThi;
                    res.data.VeDaDat = res.data.VeDaDat.filter((item) => item.MaHoaDon == Invoice.MaHoaDon);
                    res.data.VeDaDat.map((item) => {
                        item.MaVeHienThi = res.data.MaChuyenBayHienThi + '-' + item.MaVe;
                    });
                    mang_ChuyenBays.push(structuredClone(res.data));
                });
            }
            Invoice.ChuyenBays = structuredClone(mang_ChuyenBays);
        });
        closeLoader();
        console.log(Invoice);
        if (Invoice != false) {
            loadKetQuaTraCuu();
        }
    });
}
start();

function loadKetQuaTraCuu() {
    // Bên trái
    body_ThongTinHoaDon_MaHoaDon.innerText = Invoice.MaHoaDonHienThi;
    body_ThongTinHoaDon_HangVe.innerText = Invoice.HangVe.MaHangVe + ' - ' + Invoice.HangVe.TenHangVe;
    body_ThongTinHoaDon_HTTT.innerText = Invoice.HTTT.Ten;
    body_ThongTinHoaDon_TGTT.innerText =
        numberSmallerTen(Invoice.TGTT.Gio) +
        ':' +
        numberSmallerTen(Invoice.TGTT.Phut) +
        ' ' +
        numberSmallerTen(Invoice.TGTT.Ngay) +
        '/' +
        numberSmallerTen(Invoice.TGTT.Thang) +
        '/' +
        Invoice.TGTT.Nam;
    body_ThongTinHoaDon_GiaTien.innerText = numberWithDot(Invoice.SoTien) + ' VND';

    body_NguoiLienHe_HoTen.innerText = Invoice.LienHe.HoTen;
    body_NguoiLienHe_SDT.innerText = Invoice.LienHe.SDT;
    body_NguoiLienHe_Email.innerText = Invoice.LienHe.Email;

    var arr = ChuyenBay_Container.querySelectorAll('.ChuyenBay_Item');
    var num = arr.length;
    for (let i = num - 1; i > 0; i--) {
        ChuyenBay_Container.removeChild(arr[i]);
    }
    // Bên phải
    for (let i = 0; i < Invoice.ChuyenBays.length; i++) {
        var chuyenbay = structuredClone(Invoice.ChuyenBays[i]);
        var node = document.querySelector('.ChuyenBay_Item').cloneNode(true);
        node.classList.remove('d-none');

        // accordion
        node.querySelector('.accordion-button').setAttribute(
            'data-bs-target',
            '#body_ChuyenBay' + chuyenbay.MaChuyenBay,
        );
        node.querySelector('.accordion-collapse').setAttribute('id', 'body_ChuyenBay' + chuyenbay.MaChuyenBay);

        // header
        node.querySelector('.header_ThuTu').innerText = (i + 1).toString();
        node.querySelector('.header_MaChuyenBay').innerText = 'Số hiệu: ' + chuyenbay.MaChuyenBayHienThi;

        var trangthai = '';
        var trangthai_color = '';
        if (chuyenbay.TrangThai == 'ChuaKhoiHanh') {
            trangthai = 'Chưa khởi hành';
            trangthai_color = 'text-success-light';
        } else if (chuyenbay.TrangThai == 'DaKhoiHanh') {
            trangthai = 'Đã khởi hành';
            trangthai_color = 'text-success';
        } else if (chuyenbay.TrangThai == 'DaHuy') {
            trangthai = 'Đã hủy';
            trangthai_color = 'text-danger';
        } else if (chuyenbay.TrangThai == 'ViPhamQuyDinh') {
            trangthai = 'Chưa khởi hành';
            trangthai_color = 'text-success-light';
        }
        node.querySelector('.header_TrangThai').innerText = trangthai;
        node.querySelector('.header_TrangThai').classList.add(trangthai_color);

        node.querySelector('.ChuyenBay_Item_BookingID').innerText = chuyenbay.BookingID;

        var giave = chuyenbay.HangVe.find((item) => item.MaHangVe == Invoice.HangVe.MaHangVe).GiaTien;
        node.querySelector('.ChuyenBay_Item_GiaVe').innerText = numberWithDot(giave);

        var di = new Date(
            chuyenbay.ThoiGianDi.NgayDi.Nam +
                '-' +
                numberSmallerTen(chuyenbay.ThoiGianDi.NgayDi.Thang) +
                '-' +
                numberSmallerTen(chuyenbay.ThoiGianDi.NgayDi.Ngay) +
                ' ' +
                numberSmallerTen(chuyenbay.ThoiGianDi.GioDi.Gio) +
                ':' +
                numberSmallerTen(chuyenbay.ThoiGianDi.GioDi.Phut) +
                ':' +
                '00',
        );
        var den = new Date(di.getTime() + chuyenbay.ThoiGianBay * 60000);

        node.querySelector('.ChuyenBay_Item_GioDi').innerText =
            numberSmallerTen(di.getHours()) + ':' + numberSmallerTen(di.getMinutes());
        node.querySelector('.ChuyenBay_Item_MaSanBayDi').innerText = chuyenbay.SanBayDi.MaSanBay;
        node.querySelector('.ChuyenBay_Item_ThoiGianBay').innerText =
            numberSmallerTen(Math.floor(chuyenbay.ThoiGianBay / 60)) +
            'h ' +
            numberSmallerTen(chuyenbay.ThoiGianBay % 60) +
            'm';
        node.querySelector('.ChuyenBay_Item_SoDiemDung').innerText = chuyenbay.SanBayTG.length + ' điểm dừng';
        node.querySelector('.ChuyenBay_Item_GioDen').innerText =
            numberSmallerTen(den.getHours()) + ':' + numberSmallerTen(den.getMinutes());
        node.querySelector('.ChuyenBay_Item_MaSanBayDen').innerText = chuyenbay.SanBayDen.MaSanBay;

        node.querySelector('.ChuyenBay_Item_ChiTietChuyenBay').setAttribute('machuyenbay', chuyenbay.MaChuyenBay);
        node.querySelector('.ChuyenBay_Item_ChiTietChuyenBay').addEventListener('click', (e) => {
            loadModalChiTietChuyenBay(e.target.getAttribute('machuyenbay'));
        });

        node.querySelector('.caption_table').innerText = '*Danh sách vé của chuyến bay ' + chuyenbay.MaChuyenBayHienThi;

        for (let j = 0; j < chuyenbay.VeDaDat.length; j++) {
            var ve = structuredClone(chuyenbay.VeDaDat[j]);
            var temp = node.querySelector('.ChuyenBay_Item_Ve').cloneNode(true);
            temp.classList.remove('d-none');

            temp.querySelector('.MaVe').innerText = ve.MaVeHienThi;
            temp.querySelector('.HoTen').innerText = ve.HanhKhach.HoTen;
            temp.querySelector('.DoTuoi').innerText = ve.HanhKhach.DoTuoi;

            var hl_giatien = Invoice.DSHanhLy.find((item) => item.SoKgToiDa == ve.MocHanhLy).GiaTien;
            temp.querySelector('.KyGui').innerText = '+' + ve.MocHanhLy + ' kg (' + numberWithDot(hl_giatien) + ' VND)';

            temp.querySelector('.GiaVe').innerText = numberWithDot(ve.GiaVe) + ' VND';
            temp.querySelector('.ChiTiet').setAttribute('MaHK', ve.HanhKhach.MaHK);
            temp.querySelector('.ChiTiet').setAttribute('machuyenbay', chuyenbay.MaChuyenBay);
            temp.querySelector('.ChiTiet').addEventListener('click', (e) => {
                loadModalChiTietVe(e.target.getAttribute('machuyenbay'), e.target.getAttribute('MaHK'));
            });

            node.querySelector('.ChuyenBay_Item_Ves').appendChild(temp);
        }

        ChuyenBay_Container.appendChild(node);
    }

    Invoice_decor.classList.add('d-none');
    No_Invoice.classList.add('d-none');
    Yes_Invoice.classList.remove('d-none');
}

function loadModalChiTietChuyenBay(machuyenbay) {
    var chuyenbay = structuredClone(Invoice.ChuyenBays.find((item) => item.MaChuyenBay == machuyenbay));
    var di = new Date(
        chuyenbay.ThoiGianDi.NgayDi.Nam +
            '-' +
            numberSmallerTen(chuyenbay.ThoiGianDi.NgayDi.Thang) +
            '-' +
            numberSmallerTen(chuyenbay.ThoiGianDi.NgayDi.Ngay) +
            ' ' +
            numberSmallerTen(chuyenbay.ThoiGianDi.GioDi.Gio) +
            ':' +
            numberSmallerTen(chuyenbay.ThoiGianDi.GioDi.Phut) +
            ':' +
            '00',
    );
    var den = new Date(di.getTime() + chuyenbay.ThoiGianBay * 60000);
    SanBayDi.value = chuyenbay.SanBayDi.TenSanBay;
    SanBayDen.value = chuyenbay.SanBayDen.TenSanBay;
    KhoiHanh.value =
        numberSmallerTen(di.getHours()) +
        ':' +
        numberSmallerTen(di.getMinutes()) +
        ' ' +
        numberSmallerTen(di.getDate()) +
        '/' +
        numberSmallerTen(di.getMonth() + 1) +
        '/' +
        di.getFullYear();
    ThoiGianBay.value = chuyenbay.ThoiGianBay;
    DuKienDen.value =
        numberSmallerTen(den.getHours()) +
        ':' +
        numberSmallerTen(den.getMinutes()) +
        ' ' +
        numberSmallerTen(den.getDate()) +
        '/' +
        numberSmallerTen(den.getMonth() + 1) +
        '/' +
        den.getFullYear();

    var arr = SanBayTrungGian_Container.querySelectorAll('.SanBayTrungGian_Item');
    var num = arr.length;
    for (let i = num - 1; i > 0; i--) {
        SanBayTrungGian_Container.removeChild(arr[i]);
    }

    if (chuyenbay.SanBayTG.length < 1) {
        Khong_SBTG.classList.remove('d-none');
    } else {
        Khong_SBTG.classList.add('d-none');

        for (let i = 0; i < chuyenbay.SanBayTG.length; i++) {
            var sbtg = structuredClone(chuyenbay.SanBayTG[i]);
            var node = SanBayTrungGian_Container.querySelector('.SanBayTrungGian_Item').cloneNode(true);
            node.classList.remove('d-none');
            node.querySelector('.ThuTu').innerText = sbtg.ThuTu;
            node.querySelector('.TenSanBay').innerText = sbtg.TenSanBay;
            node.querySelector('.ThoiGianDen').innerText =
                numberSmallerTen(sbtg.ThoiGianDen.GioDen.Gio) +
                ':' +
                numberSmallerTen(sbtg.ThoiGianDen.GioDen.Phut) +
                ' ' +
                numberSmallerTen(sbtg.ThoiGianDen.NgayDen.Ngay) +
                '/' +
                numberSmallerTen(sbtg.ThoiGianDen.NgayDen.Thang) +
                '/' +
                sbtg.ThoiGianDen.NgayDen.Nam;
            node.querySelector('.ThoiGianDung').innerText = sbtg.ThoiGianDung;

            node.querySelector('.GhiChu').innerText = sbtg.GhiChu == null ? '' : sbtg.GhiChu;

            SanBayTrungGian_Container.appendChild(node);
        }
    }

    var arr = HangVe_Container.querySelectorAll('.HangVe_Item');
    var num = arr.length;
    for (let i = num - 1; i > 0; i--) {
        HangVe_Container.removeChild(arr[i]);
    }
    for (let i = 0; i < chuyenbay.HangVe.length; i++) {
        var hangve = structuredClone(chuyenbay.HangVe[i]);
        var node = HangVe_Container.querySelector('.HangVe_Item').cloneNode(true);
        node.classList.remove('d-none');
        node.querySelector('.MaHangVe').innerText = hangve.MaHangVe;
        node.querySelector('.TenHangVe').innerText = hangve.TenHangVe;
        node.querySelector('.GiaTien').innerText = numberWithDot(hangve.GiaTien);
        node.querySelector('.TongVe').innerText = ' /' + hangve.TongVe;
        node.querySelector('.GheTrong').innerText = hangve.GheTrong;
        var color_GheTrong = '';
        if (hangve.GheTrong >= 20) {
            color_GheTrong = 'text-success-light';
        } else if (hangve.GheTrong > 5) {
            color_GheTrong = 'text-secondary';
        } else if (hangve.GheTrong >= 0) {
            color_GheTrong = 'text-danger';
        }
        node.querySelector('.GheTrong').classList.add(color_GheTrong);

        HangVe_Container.appendChild(node);
    }
}

function loadModalChiTietVe(machuyenbay, maHK) {
    var chuyenbay = structuredClone(Invoice.ChuyenBays.find((item) => item.MaChuyenBay == machuyenbay));
    var HK = structuredClone(chuyenbay.VeDaDat.find((item) => item.HanhKhach.MaHK == maHK)).HanhKhach;
    HanhKhach_DanhXung.value = HK.GioiTinh == 0 ? 'Ông' : 'Bà';
    HanhKhach_HoTen.value = HK.HoTen;
    HanhKhach_NgaySinh_Ngay.value = 'Ngày ' + numberSmallerTen(HK.NgaySinh.Ngay);
    HanhKhach_NgaySinh_Thang.value = 'Tháng ' + HK.NgaySinh.Thang;
    HanhKhach_NgaySinh_Nam.value = 'Năm ' + HK.NgaySinh.Nam;
}
