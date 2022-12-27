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

//Lấy gói đặt từ Tóm tắt trước đặt
let PackageBooking;
function GetPackageBooing_fromSV() {
    openLoader('Chờ chút');
    var temp = document.getElementById('PackageBookingJS').getAttribute('PackageBookingJS');
    if (temp) {
        PackageBooking = JSON.parse(temp);
    }
    console.log(PackageBooking);
    closeLoader();
}
if (!PackageBooking) GetPackageBooing_fromSV();

// Nút thanh toán onclick
if (document.getElementById('ThanhToan')) {
    document.getElementById('ThanhToan').addEventListener('click', () => {
        return;
        let HoaDon = document.getElementById('data-hoadon');
        let data_send = HoaDon.getAttribute('data-HoaDon');
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        data_send = JSON.parse(data_send);
        data_send.NgayGioThanhToan = today;
        data_send.PackageBooking = PackageBooking;

        console.log(data_send);
        openLoader('Chờ chút');
        axios({
            method: 'post',
            url: '/hoadon/thanhtoan',
            data: data_send,
        }).then((res) => {
            console.log(res.data);
            closeLoader();
            if (res.data === 'Success') alert('Thanh toán thành công');
            else alert('thanh toán thất bại');

            // var home_form = document.forms['thanhtoan_form'];
            // home_form.action = '/';
            // home_form.submit();
        });
    });
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
        SendForm();
    });
}

// Thanh toán PayPal
if (document.getElementById('PAYPAL_payment')) {
    //

    document.getElementById('PAYPAL_payment').addEventListener('click', (e) => {
        //
    });
}

function SendForm() {
    var ThanhToanForm = document.forms['thanhtoan_form'];
    // MaHoaDonHienThi_form.value = '';
    // NoiDungThanhToan_form.value = '';
    // TongTien_form.value = '';
    ThanhToanForm.action = '/thanhtoan/VNPAY_ChuyenHuongThanhToan';
    ThanhToanForm.submit();
}
