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

let ChiTietHanhKhachs = document.querySelectorAll('.ChiTietHanhKhach');
for (let i = 0; i < ChiTietHanhKhachs.length; i++) {
    ChiTietHanhKhachs[i].addEventListener('click', (e) => {
        new bootstrap.Modal(document.getElementById('ChiTietHangKhach')).show();
    });
}
let ChiTietChuyenBays = document.querySelectorAll('.ChiTietChuyenBay');
for (let i = 0; i < ChiTietChuyenBays.length; i++) {
    ChiTietChuyenBays[i].addEventListener('click', (e) => {
        new bootstrap.Modal(document.getElementById('ChiTietChuyenBay')).show();
    });
}
