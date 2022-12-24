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
window.onlyNumber = onlyNumber;
let MaChucVu = document.querySelector('.MaChucVu').getAttribute('value');
let Users = JSON.parse(document.querySelector('.Users').getAttribute('value'));
let MaXacNhan;
let User_MaUser = document.querySelector('.User_MaUser');
let User_MaChucVu = document.querySelector('.User_MaChucVu');
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
function checkEmail(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
//Load Ngày tháng năm
loadNTN();
function loadNTN() {
    User_MaChucVu.value = MaChucVu;
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
    // kiểm tra dữ liệu vào
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
    for (let i = 0; i < Users.length; i++) {
        if (Users[i].MaUser == User_MaUser.value) {
            showToast({
                header: 'Thêm người dùng',
                body: 'Tên tài khoản đã tồn tại',
                duration: 5000,
                type: 'warning',
            });
            User_MaUser.value = '';
            User_MaUser.focus();
            return;
        }
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
    if (User_SDT.value == '') {
        showToast({
            header: 'Thêm người dùng',
            body: 'Số điện thoại không được để trống',
            duration: 5000,
            type: 'warning',
        });
        User_SDT.focus();
        return;
    }
    if (User_SDT.value.length != 10 || User_SDT.value.charAt(0) != '0') {
        showToast({
            header: 'Thêm người dùng',
            body: 'Số điện thoại không hợp lệ',
            duration: 5000,
            type: 'warning',
        });
        User_SDT.focus();
        return;
    }
    for (let i = 0; i < Users.length; i++) {
        if (Users[i].SDT == User_SDT.value) {
            showToast({
                header: 'Thêm người dùng',
                body: 'Số điện thoại đã được sử dụng',
                duration: 5000,
                type: 'warning',
            });
            User_SDT.value = '';
            User_SDT.focus();
            return;
        }
    }
    if (User_CCCD.value == '') {
        showToast({
            header: 'Thêm người dùng',
            body: 'Căn cước công dân không được để trống',
            duration: 5000,
            type: 'warning',
        });
        User_CCCD.focus();
        return;
    }
    if (User_CCCD.value.length != 12) {
        showToast({
            header: 'Thêm người dùng',
            body: 'Căn cước công dân không hợp lệ',
            duration: 5000,
            type: 'warning',
        });
        User_CCCD.focus();
        return;
    }
    for (let i = 0; i < Users.length; i++) {
        if (Users[i].CCCD == User_CCCD.value) {
            showToast({
                header: 'Thêm người dùng',
                body: 'Căn cước công dân đã được sử dụng',
                duration: 5000,
                type: 'warning',
            });
            User_CCCD.value = '';
            User_CCCD.focus();
            return;
        }
    }
    if (User_Email.value == '') {
        showToast({
            header: 'Thêm người dùng',
            body: 'Email không được để trống',
            duration: 5000,
            type: 'warning',
        });
        User_Email.focus();
        return;
    }
    if (checkEmail(User_Email.value) == false) {
        showToast({
            header: 'Thêm người dùng',
            body: 'Email không hợp lệ',
            duration: 5000,
            type: 'warning',
        });
        User_Email.value = '';
        User_Email.focus();
        return;
    }
    for (let i = 0; i < Users.length; i++) {
        if (Users[i].Email == User_Email.value) {
            showToast({
                header: 'Thêm người dùng',
                body: 'Email đã được sử dụng',
                duration: 5000,
                type: 'warning',
            });
            User_Email.value = '';
            User_Email.focus();
            return;
        }
    }
    document.getElementById('XacNhan_Email').innerText = User_Email.value;
    let input = document.getElementById('MaXacNhan_input');
    input.value = '';
    const NhacNhapCode = document.getElementById('NhacNhapCode');
    if (!NhacNhapCode.classList.contains('d-none')) NhacNhapCode.classList.add('d-none');
    if (!input.classList.contains('custom-boxshadow-focus-primary')) {
        input.classList.add('custom-boxshadow-focus-primary');
    }
    if (input.classList.contains('custom-boxshadow-focus-secondary')) {
        input.classList.remove('custom-boxshadow-focus-secondary');
    }
    document.getElementById('XacNhan').disabled = true;
    new bootstrap.Modal(document.getElementById('staticBackdrop')).show();

    axios({
        method: 'post',
        url: '/validatecode',
        data: { Email: document.getElementById('XacNhan_Email').innerText.toString() },
    }).then((res) => {
        MaXacNhan = res.data.Code;
        console.log(MaXacNhan);
        document.getElementById('XacNhan').disabled = false;
    });
});

// kiểm tra mã xác nhận
const XacNhan = document.getElementById('XacNhan');
if (XacNhan)
    XacNhan.addEventListener('click', (e) => {
        let input = document.getElementById('MaXacNhan_input');
        if (input.value == '' || input.value != MaXacNhan) {
            const NhacNhapCode = document.getElementById('NhacNhapCode');

            if (input.value == '') NhacNhapCode.innerText = 'Bạn chưa nhập mã code!';
            else NhacNhapCode.innerText = 'Mã code không đúng!';

            if (NhacNhapCode.classList.contains('d-none')) NhacNhapCode.classList.remove('d-none');
            if (input.classList.contains('custom-boxshadow-focus-primary')) {
                input.classList.remove('custom-boxshadow-focus-primary');
            }
            if (!input.classList.contains('custom-boxshadow-focus-secondary')) {
                input.classList.add('custom-boxshadow-focus-secondary');
            }
            return;
        }
        if (input.value == MaXacNhan) {
            let User_NgaySinh =
                User_Nam.value + '-' + ('0' + User_Thang.value).slice(-2) + '-' + ('0' + User_Ngay.value).slice(-2);
            let User_P = {
                MaUser: User_MaUser.value,
                MaChucVu: User_MaChucVu.value,
                MatKhau: User_MatKhau.value,
                HoTen: User_HoTen.value,
                GioiTinh: User_GioiTinh.value,
                NgaySinh: User_NgaySinh,
                CCCD: User_CCCD.value,
                SDT: User_SDT.value,
                Email: User_Email.value,
            };
            console.log(User_P);
            axios({
                method: 'POST',
                url: '/staff/phanquyen/ThemUser',
                data: User_P,
            }).then((res) => {
                alert('Tạo tài khoản thành công');
                var Form = document.forms['Form'];
                Form.action = '/login';
                Form.submit();
            });
        }
    });
{
}
