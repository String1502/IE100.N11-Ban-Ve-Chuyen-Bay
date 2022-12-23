function SendForm(_PackageBooking) {
    //document.getElementById('packagebooking').value = JSON.stringify(_PackageBooking);
    var staff_form = document.forms['staff-form'];
    staff_form.action = '/staff';
    staff_form.submit();
}

const DangNhap = document.getElementById('DangNhap');
const DangNhapKH = document.getElementById('DangNhapKH');
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
    P.KH = false;
    axios({
        method: 'POST',
        url: '/login/check',
        data: P,
    }).then((res) => {
        if (res.data.check1 == false || res.data.KH == true) {
            D1.classList.remove('d-none');
            D2.classList.add('d-none');
            D3.classList.add('d-none');
            return;
        }
        if (res.data.HieuLuc == false) {
            D3.classList.remove('d-none');
            D2.classList.add('d-none');
            D1.classList.add('d-none');
            return;
        }
        SendForm('Haha');
    });
});
DangNhapKH.addEventListener('click', (e) => {
    if (TaiKhoanKH.value == '' || MatKhauKH.value == '') {
        D2KH.classList.remove('d-none');
        D1KH.classList.add('d-none');
        D3KH.classList.add('d-none');

        return;
    }
    var P = {};
    P.MaUser = TaiKhoanKH.value;
    P.MatKhau = MatKhauKH.value;
    P.KH = true;
    axios({
        method: 'POST',
        url: '/login/check',
        data: P,
    }).then((res) => {
        if (res.data.check1 == false || res.data.KH == false) {
            D1KH.classList.remove('d-none');
            D2KH.classList.add('d-none');
            D3KH.classList.add('d-none');
            return;
        }
        if (res.data.HieuLuc == false) {
            D3KH.classList.remove('d-none');
            D2KH.classList.add('d-none');
            D1KH.classList.add('d-none');
            return;
        }
        var staff_form = document.forms['staff-form'];
        staff_form.method = 'get';
        staff_form.action = '/';
        staff_form.submit();
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
