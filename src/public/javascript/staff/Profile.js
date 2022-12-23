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
let MaUser = document.querySelector('.MaUser').getAttribute('value');
let Users = JSON.parse(document.querySelector('.Users').getAttribute('value'));
let MaXacNhan;
let Email, SDT, CCCD, MatKhau;
let MatKhauMoi = '';
let User_MaUser = document.querySelector('.User_MaUser');
let User_TrangThai;
let User_MaChucVu = document.querySelector('.User_MaChucVu');
let User_MatKhau = document.querySelector('.User_MatKhau');
let User_MatKhauMoi = document.querySelector('.User_MatKhauMoi');
let User_MatKhauMoiR = document.querySelector('.User_MatKhauMoiR');
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
//Load thông tin user
load();
function load() {
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
    for (let i = 0; i < Users.length; i++) {
        if (Users[i].MaUser == MaUser) {
            User_MaUser.value = Users[i].MaUser;
            User_MaChucVu.value = Users[i].MaChucVu;
            User_HoTen.value = Users[i].HoTen;
            User_GioiTinh.value = Users[i].GioiTinh == 1 ? 1 : 2;
            let date = new Date(Users[i].NgaySinh);
            User_Ngay.value = date.getDate();
            User_Thang.value = date.getMonth() + 1;
            User_Nam.value = date.getFullYear();
            User_CCCD.value = Users[i].CCCD;
            User_SDT.value = Users[i].SDT;
            User_Email.value = Users[i].Email;
            CCCD = User_CCCD.value;
            Email = User_Email.value;
            SDT = User_SDT.value;
            User_TrangThai = Users[i].TrangThai;
            MatKhau = Users[i].MatKhau;
            break;
        }
    }
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
DoiMatKhau.addEventListener('click', (e) => {
    new bootstrap.Modal(document.getElementById('ModalDoiMatKhau')).show();
});
document.querySelector('.User--Sua').addEventListener('click', (e) => {
    // kiểm tra dữ liệu vào
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
        if (Users[i].SDT == User_SDT.value && User_SDT.value != SDT) {
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
        if (Users[i].CCCD == User_CCCD.value && User_CCCD.value != CCCD) {
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
        if (Users[i].Email == User_Email.value && User_Email.value != Email) {
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
    if (User_Email.value != Email) {
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
    } else {
        let User_NgaySinh =
            User_Nam.value + '-' + ('0' + User_Thang.value).slice(-2) + '-' + ('0' + User_Ngay.value).slice(-2);
        let User_P = {
            MaUser: User_MaUser.value,
            MaChucVu: User_MaChucVu.value,
            HoTen: User_HoTen.value,
            GioiTinh: User_GioiTinh.value,
            NgaySinh: User_NgaySinh,
            CCCD: User_CCCD.value,
            SDT: User_SDT.value,
            Email: User_Email.value,
            MatKhau: MatKhauMoi == '' ? MatKhau : MatKhauMoi,
            TrangThai: User_TrangThai.value,
        };
        console.log(User_P);
        axios({
            method: 'POST',
            url: '/staff/phanquyen/SuaUser',
            data: User_P,
        }).then((res) => {
            alert('Cập nhật thông tin tài khoản thành công');
            var Form = document.forms['Form'];
            Form.action = '/staff';
            Form.submit();
        });
    }
});
// kiểm tra mã xác nhận
const XacNhan = document.getElementById('XacNhan');
if (XacNhan) {
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
                HoTen: User_HoTen.value,
                GioiTinh: User_GioiTinh.value,
                NgaySinh: User_NgaySinh,
                CCCD: User_CCCD.value,
                SDT: User_SDT.value,
                Email: User_Email.value,
                MatKhau: MatKhauMoi == '' ? MatKhau : MatKhauMoi,
                TrangThai: User_TrangThai,
            };
            console.log(User_P);
            axios({
                method: 'POST',
                url: '/staff/phanquyen/SuaUser',
                data: User_P,
            }).then((res) => {
                alert('Cập nhật thông tin tài khoản thành công');
                var Form = document.forms['Form'];
                Form.action = '/staff';
                Form.submit();
            });
        }
    });
}
// đổi email xác nhận
if (DoiEmail_XacNhan) {
    DoiEmail_XacNhan.addEventListener('click', (e) => {
        // var myModalEl = document.getElementById('staticBackdrop');
        // var modal = bootstrap.Modal.getInstance(myModalEl);
        // modal.hide();
    });
}
// xác nhận thay đổi mật khẩu
const XacNhanMK = document.getElementById('XacNhanMK');
if (XacNhanMK) {
    XacNhanMK.addEventListener('click', (e) => {
        if (User_MatKhau.value == '') {
            Trong.classList.remove('d-none');
            TextMKCu.classList.add('d-none');
            TextMKMoi.classList.add('d-none');
            Trung.classList.add('d-none');
            User_MatKhau.focus();
            return;
        }
        if (User_MatKhauMoi.value == '') {
            Trong.classList.remove('d-none');
            TextMKCu.classList.add('d-none');
            TextMKMoi.classList.add('d-none');
            Trung.classList.add('d-none');

            User_MatKhauMoi.focus();
            return;
        }
        if (User_MatKhauMoiR.value == '') {
            Trong.classList.remove('d-none');
            TextMKCu.classList.add('d-none');
            TextMKMoi.classList.add('d-none');
            Trung.classList.add('d-none');

            User_MatKhauMoiR.focus();
            return;
        }
        if (MatKhau != User_MatKhau.value) {
            Trong.classList.add('d-none');
            TextMKCu.classList.remove('d-none');
            TextMKMoi.classList.add('d-none');
            Trung.classList.add('d-none');

            User_MatKhau.focus();
            return;
        }
        if (MatKhau == User_MatKhauMoi.value) {
            Trong.classList.add('d-none');
            TextMKCu.classList.add('d-none');
            TextMKMoi.classList.add('d-none');
            Trung.classList.remove('d-none');

            User_MatKhauMoi.focus();
            return;
        }
        if (User_MatKhauMoi.value != User_MatKhauMoiR.value) {
            Trong.classList.add('d-none');
            TextMKCu.classList.add('d-none');
            TextMKMoi.classList.remove('d-none');
            Trung.classList.add('d-none');

            User_MatKhauMoiR.focus();
            return;
        }
        MatKhauMoi = User_MatKhauMoi.value;
        var myModalEl = document.getElementById('ModalDoiMatKhau');
        var modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();
    });
}
