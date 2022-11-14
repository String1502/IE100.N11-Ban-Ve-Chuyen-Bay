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
    openLoader('Chờ chút');
    axios({
        method: 'post',
        url: '/payment',
        data: { GetPackageBooing_fromSV: true },
    }).then((res) => {
        PackageBooking = res.data;
        closeLoader();
        console.log(PackageBooking);
    });
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
    // Trí
});
