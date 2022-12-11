function LoadGioiTinh() {
    let GioiTinh = document.querySelectorAll('.User_GioiTinh');
    for (let i = 0; i < GioiTinh.length; i++) {
        if (GioiTinh[i].innerText == '1') GioiTinh[i].innerText = 'Nam';
        else GioiTinh[i].innerText = 'Nữ';
    }
}
LoadGioiTinh();
document.querySelector('.ChucVu--Them').addEventListener('click', (e) => {
    var ThemChucVu = document.forms['Form'];
    ThemChucVu.action = '/staff/AddPosition';
    ThemChucVu.submit();
});
let ChucVus = document.querySelectorAll('.ChucVu');
for (let i = 0; i < ChucVus.length; i++) {
    ChucVus[i].querySelector('.ChucVu--Sua').addEventListener('click', (e) => {
        var Form = document.forms['Form'];
        document.getElementById('Package').value = e.target.getAttribute('index');
        Form.action = '/staff/EditPosition';
        Form.submit();
    });
}
let User_Them = document.querySelectorAll('.User--Them');
for (let i = 0; i < User_Them.length; i++) {
    User_Them[i].addEventListener('click', (e) => {
        var Form = document.forms['Form'];
        document.getElementById('Package').value = e.target.getAttribute('index');
        Form.action = '/staff/AddUser';
        Form.submit();
    });
}
let User_Sua = document.querySelectorAll('.User--Sua');
for (let i = 0; i < User_Sua.length; i++) {
    User_Sua[i].addEventListener('click', (e) => {
        var Form = document.forms['Form'];
        document.getElementById('Package').value = e.target.getAttribute('index');
        Form.action = '/staff/EditUser';
        Form.submit();
    });
}
let Search = document.querySelectorAll('.Search');
for (let i = 0; i < Search.length; i++) {
    Search[i].addEventListener('keyup', (e) => {
        let ChucVu = e.target.closest('.ChucVu');
        let t = e.target.value.toUpperCase();
        let User = ChucVu.querySelectorAll('.User');
        for (let j = 0; j < User.length; j++) {
            let MaUser = User[j].querySelector('.User_MaUser').innerText.toUpperCase();
            let HoTen = User[j].querySelector('.User_HoTen').innerText.toUpperCase();
            let NgaySinh = User[j].querySelector('.User_NgaySinh').innerText.toUpperCase();
            let CCCD = User[j].querySelector('.User_CCCD').innerText.toUpperCase();
            let GioiTinh = User[j].querySelector('.User_GioiTinh').innerText.toUpperCase();
            let SDT = User[j].querySelector('.User_SDT').innerText.toUpperCase();
            if (
                MaUser.includes(t) == false &&
                HoTen.includes(t) == false &&
                NgaySinh.includes(t) == false &&
                CCCD.includes(t) == false &&
                GioiTinh.includes(t) == false &&
                SDT.includes(t) == false
            ) {
                User[j].classList.add('d-none');
            } else User[j].classList.remove('d-none');
        }
    });
}
