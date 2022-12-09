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
