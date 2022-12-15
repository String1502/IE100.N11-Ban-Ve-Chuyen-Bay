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
    money_format_input,
    validateEmail,
} from '../start.js';

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
