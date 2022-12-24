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
function checkEmail(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
let Users = JSON.parse(User.getAttribute('value'));
MaUser.addEventListener('keyup', (e) => {
    if (e.target.value == '') UserTrong.classList.remove('d-none');
    else UserTrong.classList.add('d-none');
});
Email.addEventListener('keyup', (e) => {
    if (e.target.value == '') {
        EmailTrong.classList.remove('d-none');
        EmailSai.classList.add('d-none');
    } else {
        EmailTrong.classList.add('d-none');
        if (checkEmail(e.target.value) == false) EmailSai.classList.remove('d-none');
        else EmailSai.classList.add('d-none');
    }
});
TaoMatKhau.addEventListener('click', (e) => {
    let M;
    let E;
    if (UserTrong.classList.contains('d-none') == false) {
        MaUser.focus();
        return;
    }
    if (EmailTrong.classList.contains('d-none') == false || EmailSai.classList.contains('d-none') == false) {
        Email.focus();
        return;
    }
    for (let i = 0; i < Users.length; i++) {
        if (Users[i].MaUser == MaUser.value) {
            M = i;
        }
        if (Users[i].Email == Email.value) {
            E = i;
        }
    }
    if (E == undefined) {
        showToast({
            header: 'Lấy mật khẩu ',
            body: 'Tên tài khoản hoặc email không tồn tại',
            duration: 5000,
            type: 'warning',
        });
        return;
    }
    if (E != M) {
        showToast({
            header: 'Lấy mật khẩu ',
            body: 'Email xác nhận không đúng với Email đăng ký trên hệ thống!',
            duration: 5000,
            type: 'warning',
        });
        return;
    }
    if (E == M) {
        console.log(Email.value);
        axios({
            method: 'POST',
            url: '/login/validatecode',
            data: { Email: Email.value },
        }).then((res) => {
            showToast({
                header: 'Lấy mật khẩu ',
                body: 'Yêu cầu của bạn đã được xử lý, vui lòng kiểm tra lại email, cám ơn !!!',
                duration: 5000,
                type: 'success',
            });
            return;
        });
    }
});
