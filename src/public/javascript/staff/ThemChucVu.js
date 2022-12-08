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

document.querySelector('.ChucVu--Them').addEventListener('click', (e) => {
    if (document.querySelector('.ChucVu_Ten').value == '') {
        showToast({
            header: 'Thêm nhóm người dùng',
            body: 'Tên nhóm người dùng không được để trống',
            duration: 5000,
            type: 'warning',
        });
        return;
    }
    var Form = document.forms['Form'];
    Form.action = '/staff/ThemChucVu';
    Form.submit();
});
