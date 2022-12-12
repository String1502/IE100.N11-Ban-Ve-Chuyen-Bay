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

let ChucVu = JSON.parse(document.querySelector('.ChucVu').getAttribute('value'));
console.log(ChucVu);
let ChucVus = JSON.parse(document.querySelector('.ChucVus').getAttribute('value'));
let Quyens = document.querySelectorAll('.Quyen');
document.querySelector('.ChucVu_Ten').value = ChucVu.TenChucVu;
for (let i = 0; i < Quyens.length; i++) {
    if (ChucVu.Quyens[Quyens[i].getAttribute('index')] != 1) {
        Quyens[i].checked = false;
    }
}
document.querySelector('.ChucVu_Ten').addEventListener('keyup', (e) => {
    e.target.value = e.target.value.trimStart();
    e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase();
    return;
});
document.querySelector('.ChucVu--CapNhat').addEventListener('click', (e) => {
    // kiểm tra tên chức vụ
    // kiểm tra k thay đổi thì return
    let Quyen = document.querySelectorAll('.Quyen');

    let F = true;
    for (let i = 0; i < Quyen.length; i++) {
        if (Quyen[i].checked == true && ChucVu.Quyens[Quyen[i].getAttribute('index')] != 1) F = false;
        if (Quyen[i].checked == false && ChucVu.Quyens[Quyen[i].getAttribute('index')] == 1) F = false;
    }
    let ChucVu_Ten = document.querySelector('.ChucVu_Ten');
    if (F == true && ChucVu_Ten.value.trim() == ChucVu.TenChucVu) {
        showToast({
            header: 'Cập nhật nhóm người dùng',
            body: 'Không có sự thay đổi',
            duration: 5000,
            type: '',
        });
        return;
    }
    //kiểm tra tên chức vụ

    if (ChucVu_Ten.value.trim() != ChucVu.TenChucVu) {
        for (let i = 0; i < ChucVus.length; i++) {
            if (ChucVu_Ten.value.trim() == ChucVus[i].TenChucVu) {
                showToast({
                    header: 'Cập nhật nhóm người dùng',
                    body: 'Tên nhóm người đã tồn tại',
                    duration: 5000,
                    type: 'warning',
                });
                return;
            }
        }
    }
    if (ChucVu_Ten.value == '') {
        showToast({
            header: 'Cập nhật nhóm người dùng',
            body: 'Tên nhóm người dùng không được để trống',
            duration: 5000,
            type: 'warning',
        });
        return;
    }
    let ChucVu_P = {};
    ChucVu_P.TenChucVu = ChucVu_Ten.value;
    ChucVu_P.MaChucVu = ChucVu.MaChucVu;
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
        url: '/staff/SuaChucVu',
        data: ChucVu_P,
    }).then((res) => {
        alert('Cập nhật thành công');
        var Form = document.forms['Form'];
        Form.action = '/staff/Authorization';
        Form.submit();
    });
});
