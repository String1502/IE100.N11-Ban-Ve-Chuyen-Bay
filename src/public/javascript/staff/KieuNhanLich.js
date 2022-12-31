import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
    getToday,
    showToast,
    onlyNumber,
    validateEmail,
    ActiveNavItem_Header,
} from '../start.js';

ActiveNavItem_Header('NhanLich');
openLoader('Chờ chút');
closeLoader();

window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});

if (ThuCong) {
    ThuCong.addEventListener('click', (e) => {
        var staff_form = document.forms['NhanLich-form'];
        staff_form.action = '/staff/nhanlich/thucong';
        staff_form.submit();
    });
}

if (FromExcel) {
    FromExcel.addEventListener('click', (e) => {
        var staff_form = document.forms['NhanLich-form'];
        staff_form.action = '/staff/nhanlich/fromexcel';
        staff_form.submit();
    });
}
