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

let ChucVus = JSON.parse(document.querySelector('.ChucVus').getAttribute('value'));
console.log(ChucVus);
document.querySelector('.ChucVu_Ten').addEventListener('keyup', (e) => {
    e.target.value = e.target.value.trimStart();
    e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase();
    return;
});
document.querySelector('.ChucVu--Them').addEventListener('click', (e) => {
    // kiểm tra tên chức vụ
    let ChucVu_Ten = document.querySelector('.ChucVu_Ten');

    for (let i = 0; i < ChucVus.length; i++) {
        if (ChucVu_Ten.value.trim() == ChucVus[i].TenChucVu) {
            showToast({
                header: 'Thêm nhóm người dùng',
                body: 'Tên nhóm người đã tồn tại',
                duration: 5000,
                type: 'warning',
            });
            return;
        }
    }
    if (ChucVu_Ten.value == '') {
        showToast({
            header: 'Thêm nhóm người dùng',
            body: 'Tên nhóm người dùng không được để trống',
            duration: 5000,
            type: 'warning',
        });
        return;
    }
    // tạo mã chức vụ và tên chức vụ
    let ChucVu_Ma;
    let ChucVu_P = {};
    ChucVu_P.TenChucVu = ChucVu_Ten.value;
    let flag = false;
    while (flag == false) {
        ChucVu_Ma = Math.floor(Math.random() * 100000);
        let checked = 0;
        for (let i = 0; i < ChucVus.length; i++) {
            if (ChucVus[i].MaChucVu == ChucVu_Ma) {
                checked = 1;
            }
        }
        if (checked == 0) flag = true;
    }
    ChucVu_P.MaChucVu = ChucVu_Ma;
    //thêm phân quyền cho chức vụ
    let Quyens = document.querySelectorAll('.Quyen');
    let QuyenofChucVu = [];
    let o = 0;
    for (let i = 0; i < Quyens.length; i++) {
        if (Quyens[i].checked == true) {
            QuyenofChucVu[o++] = Quyens[i].getAttribute('index');
        }
    }
    ChucVu_P.Quyens = structuredClone(QuyenofChucVu);
    console.log(ChucVu_P);
    axios({
        method: 'POST',
        url: '/staff/ThemChucVu',
        data: ChucVu_P,
    }).then((res) => {
        alert('Thêm nhóm người dùng mới thành công');
        var Form = document.forms['Form'];
        Form.action = '/staff/Authorization';
        Form.submit();
    });
});
