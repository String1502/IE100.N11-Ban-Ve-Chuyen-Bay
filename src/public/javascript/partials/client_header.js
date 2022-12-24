document.addEventListener('DOMContentLoaded', (e) => {
    axios({
        method: 'post',
        url: '/ChooseHeader',
    }).then((res) => {
        let HT = document.querySelector('.HT');
        if (res.data.HoTen) {
            HT.innerText = res.data.HoTen;
            DK.classList.add('d-none');
            GioiThieu.classList.add('d-none');
            DN.classList.add('d-none');
            TTKH.classList.remove('d-none');
            Ve.classList.remove('d-none');
        } else {
            TTKH.classList.add('d-none');
            GioiThieu.classList.remove('d-none');
            DN.classList.remove('d-none');
            Ve.classList.add('d-none');
            DK.classList.remove('d-none');
        }
    });
});
DangXuat.addEventListener('click', (e) => {
    axios({
        method: 'POST',
        url: '/logout',
    });
    var staff_form = document.forms['clientheader-form'];
    staff_form.action = '/';
    staff_form.method = 'get';
    staff_form.submit();
});
Profile.addEventListener('click', (e) => {
    //document.getElementById('packagebooking').value = JSON.stringify(_PackageBooking);
    var staff_form = document.forms['clientheader-form'];
    staff_form.action = '/staff/Profile';
    staff_form.submit();
});
Ve.addEventListener('click', (e) => {
    var staff_form = document.forms['clientheader-form'];
    staff_form.action = '/vecuatoi';
    staff_form.method = 'get';
    staff_form.submit();
});
