import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
    today,
    onlyNumber,
    showToast,
} from '../start.js';
let User_MaUser = document.querySelector('.User_MaUser');
let User_MatKhau = document.querySelector('.User_MatKhau');
let User_MatKhauR = document.querySelector('.User_MatKhauR');
let User_HoTen = document.querySelector('.User_HoTen');
let User_GioiTinh = document.querySelector('.User_GioiTinh');
let User_Ngay = document.querySelector('.User_Ngay');
let User_Thang = document.querySelector('.User_Thang');
let User_Nam = document.querySelector('.User_Nam');
let User_CCCD = document.querySelector('.User_CCCD');
let User_SDT = document.querySelector('.User_SDT');
let User_Email = document.querySelector('.User_Email');
//Load Ngày tháng năm
loadNTN();
function loadNTN() {
    for (let i = 1; i <= 31; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        User_Ngay.appendChild(opt);
    }

    for (let i = 1; i <= 12; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = 'Tháng ' + i;
        User_Thang.appendChild(opt);
    }
    let today = new Date();
    let Nam = today.getFullYear() - 18;
    for (let i = Nam - 200; i <= Nam; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        User_Nam.appendChild(opt);
    }
    User_Ngay.value = 1;
    User_Thang.value = 1;
    User_Nam.value = Nam;
}
//Hàm check ngày hợp lệ
function CheckNgayThangNam(Ngay, Thang, Nam) {
    if (Thang == 4 || Thang == 6 || Thang == 9 || Thang == 11) {
        if (Ngay == 31) return 0;
    }
    if (Thang == 2) {
        if ((Nam % 4 == 0 && Nam % 100 != 0) || Nam % 400 == 0) {
            if (Ngay > 28) return 0;
        } else {
            if (Ngay > 29) return 0;
        }
    }
    return;
}
document.querySelector('.User--Them').addEventListener('click', (e) => {
    if (User_MaUser.value == '') {
        showToast({
            header: 'Thêm người dùng',
            body: 'Tên tài khoản không được để trống',
            duration: 5000,
            type: 'warning',
        });
        User_MaUser.focus();
        return;
    }
    if (User_MatKhau.value == '') {
        showToast({
            header: 'Thêm người dùng',
            body: 'Mật khẩu không được để trống',
            duration: 5000,
            type: 'warning',
        });
        User_MatKhau.focus();
        return;
    }
    if (User_MatKhauR.value != User_MatKhau.value) {
        showToast({
            header: 'Thêm người dùng',
            body: 'Mật khẩu xác nhận không trùng khớp',
            duration: 5000,
            type: 'warning',
        });
        User_MatKhauR.value = '';
        User_MatKhauR.focus();
        return;
    }
    if (User_HoTen.value == '') {
        showToast({
            header: 'Thêm người dùng',
            body: 'Họ tên không được để trống',
            duration: 5000,
            type: 'warning',
        });
        User_HoTen.focus();
        return;
    }
    if (CheckNgayThangNam(User_Ngay.value, User_Thang.value, User_Nam.value) == 0) {
        showToast({
            header: 'Thêm người dùng',
            body: 'Ngày sinh không hợp lệ',
            duration: 5000,
            type: 'warning',
        });
        User_Ngay.focus();
        return;
    }
});
