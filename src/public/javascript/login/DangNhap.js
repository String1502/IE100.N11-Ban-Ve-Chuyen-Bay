function SendForm(_PackageBooking) {
    //document.getElementById('packagebooking').value = JSON.stringify(_PackageBooking);
    var staff_form = document.forms['staff-form'];
    staff_form.action = '/staff';
    staff_form.submit();
}

const DangNhap = document.getElementById('DangNhap');

DangNhap.addEventListener('click', (e) => {
    SendForm('Haha');
});

window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});
