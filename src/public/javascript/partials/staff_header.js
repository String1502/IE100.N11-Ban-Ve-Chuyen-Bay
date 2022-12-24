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
} from '../start.js';
document.addEventListener('DOMContentLoaded', (e) => {
    let P;
    let HoTen = document.querySelector('.HoTen');
    axios({
        method: 'post',
        url: '/staff/LoadHeader',
    }).then((res) => {
        P = res.data;
        HoTen.innerText = P.HoTen;
        if (P.QuyenHT[2] == 0) {
            ListQ.removeChild(Q2);
        } else NhanLich.classList.remove('d-none');
        if (P.QuyenHT[3] == 0) {
            ListQ.removeChild(Q3);
        } else DoanhThu.classList.remove('d-none');
        if (P.QuyenHT[5] == 0) {
            ListQ.removeChild(Q5);
        } else PhanQuyen.classList.remove('d-none');
    });
    P;
});
LoGo.addEventListener('click', (e) => {
    //document.getElementById('packagebooking').value = JSON.stringify(_PackageBooking);
    var staff_form = document.forms['staffheader-form'];
    staff_form.action = '/staff';
    staff_form.submit();
});
Profile.addEventListener('click', (e) => {
    //document.getElementById('packagebooking').value = JSON.stringify(_PackageBooking);
    var staff_form = document.forms['staffheader-form'];
    staff_form.action = '/staff/Profile';
    staff_form.submit();
});

TraCuu.addEventListener('click', (e) => {
    //document.getElementById('packagebooking').value = JSON.stringify(_PackageBooking);
    var staff_form = document.forms['staffheader-form'];
    staff_form.action = '/staff';
    staff_form.submit();
});

QuyDinh.addEventListener('click', (e) => {
    //document.getElementById('packagebooking').value = JSON.stringify(_PackageBooking);
    var staff_form = document.forms['staffheader-form'];
    staff_form.action = '/staff/quydinh/Regulations';
    staff_form.submit();
});

PhanQuyen.addEventListener('click', (e) => {
    //document.getElementById('packagebooking').value = JSON.stringify(_PackageBooking);
    var staff_form = document.forms['staffheader-form'];
    staff_form.action = '/staff/phanquyen/Authorization';
    staff_form.submit();
});

NhanLich.addEventListener('click', (e) => {
    var staff_form = document.forms['staffheader-form'];
    staff_form.action = '/staff/nhanlich';
    staff_form.submit();
});

DangXuat.addEventListener('click', (e) => {
    axios({
        method: 'POST',
        url: '/logout',
    });
    var staff_form = document.forms['staffheader-form'];
    staff_form.action = '/';
    staff_form.method = 'get';
    staff_form.submit();
});
