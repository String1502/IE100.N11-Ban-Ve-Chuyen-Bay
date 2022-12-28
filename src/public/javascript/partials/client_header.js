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
    openLoader('Chờ chút');
    closeLoader();
    axios({
        method: 'post',
        url: '/ChooseHeader',
    }).then((res) => {
        if (res.data.HoTen) {
            HoTen_User.innerText = res.data.HoTen;
            TTKH.classList.remove('d-none');
            DK.classList.add('d-none');
            Ve.classList.remove('d-none');
            DN.classList.add('d-none');
            GioiThieu.classList.add('d-none');
            TrangChu.classList.remove('d-none');
        } else {
            TTKH.classList.add('d-none');
            DK.classList.remove('d-none');
            Ve.classList.add('d-none');
            DN.classList.remove('d-none');
            GioiThieu.classList.remove('d-none');
            TrangChu.classList.remove('d-none');
        }
    });
});

DangXuat.addEventListener('click', (e) => {
    openLoader('Chờ chút');
    axios({
        method: 'POST',
        url: '/logout',
    });
    var staff_form = document.forms['clientheader-form'];
    staff_form.action = '/';
    staff_form.method = 'get';
    closeLoader();
    staff_form.submit();
});
Profile.addEventListener('click', (e) => {
    var staff_form = document.forms['clientheader-form'];
    staff_form.action = '/staff/Profile';
    staff_form.submit();
});
Ve.addEventListener('click', (e) => {
    var staff_form = document.forms['clientheader-form'];
    staff_form.action = '/vecuatoi';
    staff_form.submit();
});
