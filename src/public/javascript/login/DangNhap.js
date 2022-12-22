function SendForm(_PackageBooking) {
    //document.getElementById('packagebooking').value = JSON.stringify(_PackageBooking);
    var staff_form = document.forms['staff-form'];
    staff_form.action = '/staff';
    staff_form.submit();
}

const DangNhap = document.getElementById('DangNhap');

DangNhap.addEventListener('click', (e) => {
    if (TaiKhoan.value == '' || MatKhau.value == '') {
        D2.classList.remove('d-none');
        D1.classList.add('d-none');
        D3.classList.add('d-none');

        return;
    }
    var P = {};
    P.MaUser = TaiKhoan.value;
    P.MatKhau = MatKhau.value;
    axios({
        method: 'POST',
        url: '/login/check',
        data: P,
    }).then((res) => {
        if (res.data.HieuLuc == false) {
            D3.classList.remove('d-none');
            D2.classList.add('d-none');
            D1.classList.add('d-none');
            return;
        }
        if (res.data.check1 == false) {
            D1.classList.remove('d-none');
            D2.classList.add('d-none');
            D3.classList.add('d-none');
            return;
        }
        SendForm('Haha');
    });
});

window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});
