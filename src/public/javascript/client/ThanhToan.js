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

//Lấy gói đặt từ Tóm tắt trước đặt
let PackageBooking;
let GoiHoaDon;
function GetPackageBooing_fromSV() {
    openLoader('Chờ chút');
    var temp = document.getElementById('PackageBookingJS').getAttribute('PackageBookingJS');
    if (temp) {
        PackageBooking = JSON.parse(temp);

        var MaUser = 'GUEST';
        // Lấy mã user
        axios({
            method: 'post',
            url: '/staff/LoadHeader',
        }).then((res) => {
            if (res.data.MaUser) {
                MaUser = res.data.MaUser;
            }
            PackageBooking.HoaDon.MaUser = MaUser;
            // Tạo hóa đơn
            axios({
                method: 'post',
                url: '/hoadon/createhoadon',
                data: structuredClone(PackageBooking.HoaDon),
            }).then((res) => {
                closeLoader();
                if (res.data == -1) {
                    var Modal = new bootstrap.Modal(document.getElementById('ThongBaoHetChuyenBay'), true);
                    Modal.show();
                } else {
                    GoiHoaDon = structuredClone(res.data);
                    if (GoiHoaDon) {
                        LoadDuLieuHoaDon();
                        console.log(GoiHoaDon);
                    }
                }
            });
        });
    }
    console.log(PackageBooking);
}
if (!PackageBooking) GetPackageBooing_fromSV();

function LoadDuLieuHoaDon() {
    MaHoaDonHienThi.innerText = GoiHoaDon.MaHoaDonHienThi;
    var now = new Date();
    NgayThanhToan.innerText =
        numberSmallerTen(now.getDate()) + '/' + numberSmallerTen(now.getMonth() + 1) + '/' + now.getFullYear();
    NoiDungThanhToan.innerText = GoiHoaDon.NoiDungThanhToan;
    TongTien.innerText = numberWithDot(GoiHoaDon.TongTien.toString()) + ' VND';

    MaHoaDonHienThi_form.value = GoiHoaDon.MaHoaDonHienThi;
    NoiDungThanhToan_form.value = GoiHoaDon.NoiDungThanhToan;
    TongTien_form.value = GoiHoaDon.TongTien;
}

// Thanh toán MOMO
if (document.getElementById('MOMO_payment')) {
    //

    document.getElementById('MOMO_payment').addEventListener('click', (e) => {
        //
    });
}

// Thanh toán VNPAY
if (document.getElementById('VNPAY_payment')) {
    //

    document.getElementById('VNPAY_payment').addEventListener('click', (e) => {
        var ThanhToanForm = document.forms['thanhtoan_form'];
        ThanhToanForm.action = '/thanhtoan/VNPAY_ChuyenHuongThanhToan';
        ThanhToanForm.submit();
    });
}

// Thanh toán PayPal
if (document.getElementById('PAYPAL_payment')) {
    //

    document.getElementById('PAYPAL_payment').addEventListener('click', (e) => {
        //
    });
}

// Quay về chọn chuyến bay
function SendForm() {
    document.getElementById('mangchuyenbay_formid').value = JSON.stringify(PackageBooking.MangChuyenBayTimKiem);
    document.getElementById('hangghe_formid').value = JSON.stringify(PackageBooking.HangGhe);
    document.getElementById('hanhkhach_formid').value = JSON.stringify(PackageBooking.HanhKhach);
    var search_flight_form = document.forms['search-flight-form'];
    search_flight_form.action = '/choose_flight';
    search_flight_form.submit();
}

if (ChonChuyenBayKhac) {
    ChonChuyenBayKhac.addEventListener('click', (e) => {
        SendForm();
    });
}
