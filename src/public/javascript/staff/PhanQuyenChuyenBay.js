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
