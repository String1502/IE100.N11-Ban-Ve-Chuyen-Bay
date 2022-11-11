import { numberWithDot, numberWithoutDot, numberSmallerTen, openLoader, closeLoader } from '../start.js';

//Lấy gói đặt từ Chọn chuyến bay
let PackageBooking;
function GetPackageBooing_fromSV() {
    openLoader('Chờ chút');
    axios({
        method: 'post',
        url: '/pre-booking',
        data: { GetPackageBooing_fromSV: true },
    }).then((res) => {
        PackageBooking = res.data;
        closeLoader();
        console.log(PackageBooking);
    });
}
if (!PackageBooking) GetPackageBooing_fromSV();
