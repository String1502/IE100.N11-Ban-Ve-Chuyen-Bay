import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
} from '../start.js';

//Lấy gói đặt từ Tóm tắt trước đặt
let PackageBooking;
function GetPackageBooing_fromSV() {
    openLoader('Chờ chút');
    axios({
        method: 'post',
        url: '/booking',
        data: { GetPackageBooing_fromSV: true },
    }).then((res) => {
        PackageBooking = res.data;
        closeLoader();
        console.log(PackageBooking);
    });
}
if (!PackageBooking) GetPackageBooing_fromSV();
