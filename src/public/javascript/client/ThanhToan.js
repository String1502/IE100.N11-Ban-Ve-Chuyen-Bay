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

//Lấy gói đặt từ Tóm tắt trước đặt
let PackageBooking;
function GetPackageBooing_fromSV() {
    //#region Ngây thơ
    // openLoader('Chờ chút');
    // axios({
    //     method: 'post',
    //     url: '/payment',
    //     data: { GetPackageBooing_fromSV: true },
    // }).then((res) => {
    //     PackageBooking = res.data;
    //     closeLoader();
    // });
    //#endregion

    openLoader('Chờ chút');
    PackageBooking = JSON.parse(document.getElementById('PackageBookingJS').getAttribute('PackageBookingJS'));
    closeLoader();
}
if (!PackageBooking) GetPackageBooing_fromSV();

window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});

// Nút thanh toán onclick
document.getElementById('ThanhToan').addEventListener('click', () => {
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

        // var home_form = document.forms['home_form'];
        // home_form.action = '/';
        // home_form.submit();
    });
});
