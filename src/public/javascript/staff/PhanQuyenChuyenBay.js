document.querySelector('.ChucVu--Them').addEventListener('click', (e) => {
    var ThemChucVu = document.forms['Form'];
    ThemChucVu.action = '/staff/AddPosition';
    ThemChucVu.submit();
});
document.querySelector('.ChucVu--Sua').addEventListener('click', (e) => {
    var ThemChucVu = document.forms['Form'];
    ThemChucVu.action = '/staff/EditPosition';
    ThemChucVu.submit();
});
