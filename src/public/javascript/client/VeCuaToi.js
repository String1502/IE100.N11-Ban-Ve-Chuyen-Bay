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
let MChiTietHanhKhachs = document.querySelectorAll('.MChiTietHanhKhach');

for (let i = 0; i < ChiTietHanhKhachs.length; i++) {
    ChiTietHanhKhachs[i].addEventListener('click', (e) => {
        new bootstrap.Modal(MChiTietHanhKhachs[i]).show();
    });
}
let ChiTietChuyenBays = document.querySelectorAll('.ChiTietChuyenBay');
for (let i = 0; i < ChiTietChuyenBays.length; i++) {
    ChiTietChuyenBays[i].addEventListener('click', (e) => {
        let p = {};
        let MaChuyenBay = e.target.getAttribute('value');
        p.MaChuyenBay = MaChuyenBay;
        console.log(MaChuyenBay);
        axios({
            data: p,
            url: '/chitietchuyenbay',
            method: 'post',
        }).then((res) => {
            let P = res.data;
            let TrangThai = document.getElementById('TrangThai');
            let GioBay = document.getElementById('GioBay');
            let NgayBay = document.getElementById('NgayBay');
            let ThoiGianBay = document.getElementById('ThoiGianBay');
            let NgayDap = document.getElementById('NgayDap');
            let GioDap = document.getElementById('GioDap');
            let SanBayDi = document.getElementById('SanBayDi');
            let SanBayDen = document.getElementById('SanBayDen');
            let SoDiemDung = document.getElementById('SoDiemDung');
            let Cop = document.querySelectorAll('.Cop');
            let ChangBay = document.querySelector('.ChangBay');

            console.log(P);
            if (P.ChuyenBay.TrangThai == 'DaKhoiHanh') {
                TrangThai.classList.remove('text-secondary');
                TrangThai.classList.add('text-success-light');
                TrangThai.innerText = 'Đã khởi hành';
            } else {
                TrangThai.classList.add('text-secondary');
                TrangThai.classList.remove('text-success-light');
                TrangThai.innerText = 'Chưa khởi hành';
            }
            let NgayGio = new Date(new Date(P.ChuyenBay.NgayGio).getTime() - 7 * 60 * 60 * 1000);
            GioBay.innerText = ('0' + NgayGio.getHours()).slice(-2) + ':' + ('0' + NgayGio.getMinutes()).slice(-2);
            NgayBay.innerText =
                NgayGio.getDate() + '-' + ('0' + (1 + NgayGio.getMonth())).slice(-2) + '-' + NgayGio.getFullYear();

            ThoiGianBay.innerText =
                Math.floor(P.ChuyenBay.ThoiGianBay / 60) + ' giờ ' + Math.floor(P.ChuyenBay.ThoiGianBay % 60) + ' phút';
            NgayGio = new Date(NgayGio.getTime() + P.ChuyenBay.ThoiGianBay * 60 * 1000);
            NgayDap.innerText =
                NgayGio.getDate() + '-' + ('0' + (1 + NgayGio.getMonth())).slice(-2) + '-' + NgayGio.getFullYear();
            GioDap.innerText = ('0' + NgayGio.getHours()).slice(-2) + ':' + ('0' + NgayGio.getMinutes()).slice(-2);
            SanBayDi.innerText = P.ChuyenBay.MaSanBayDi + ' - ' + P.ChuyenBay.SanBayDi[0].TenTinhThanh;
            SanBayDen.innerText = P.ChuyenBay.MaSanBayDen + ' - ' + P.ChuyenBay.SanBayDen[0].TenTinhThanh;
            if (P.ChiTietChuyenBay.length == 0) {
                ChangBay.classList.add('d-none');
                return;
            }
            for (let j = 1; j < Cop.length; j++) {
                ChangBay.removeChild(Cop[j]);
            }
            SoDiemDung.innerText = P.ChiTietChuyenBay.length + ' điểm dừng';
            for (let j = 0; j < P.ChiTietChuyenBay.length - 1; j++) {
                let Copy = Cop[0].cloneNode(true);
                ChangBay.appendChild(Copy);
                ChangBay.classList.remove('d-none');
            }
            let NgayGioBay = document.querySelectorAll('.NgayGioBay');
            let SanBayCTDi = document.querySelectorAll('.SanBayCTDi');
            let NgayGioDap = document.querySelectorAll('.NgayGioDap');
            let SanBayCTDen = document.querySelectorAll('.SanBayCTDen');
            let ThoiGianChangBay = document.querySelectorAll('.ThoiGianChangBay');
            let ThoiGianDung = document.querySelectorAll('.ThoiGianDung');
            for (let j = 0; j < ThoiGianDung.length; j++) {
                ThoiGianDung[j].innerText =
                    'Dừng ở sân bay ' +
                    P.ChiTietChuyenBay[j].SBTG[0].TenSanBay +
                    ' (' +
                    P.ChiTietChuyenBay[j].ThoiGianDung +
                    ' phút)';
            }
            SanBayCTDi[0].innerText =
                P.ChuyenBay.SanBayDi[0].TenTinhThanh + ' - Sân bay ' + P.ChuyenBay.SanBayDi[0].TenSanBay;
            for (let j = 1; j < SanBayCTDi.length; j++) {
                SanBayCTDi[j].innerText =
                    P.ChiTietChuyenBay[j - 1].SBTG[0].TenTinhThanh +
                    ' - Sân bay ' +
                    P.ChiTietChuyenBay[j - 1].SBTG[0].TenSanBay;
            }
            SanBayCTDen[SanBayCTDen.length - 1].innerText =
                P.ChuyenBay.SanBayDen[0].TenTinhThanh + ' - Sân bay ' + P.ChuyenBay.SanBayDen[0].TenSanBay;
            for (let j = 0; j < SanBayCTDen.length - 1; j++) {
                SanBayCTDen[j].innerText =
                    P.ChiTietChuyenBay[j].SBTG[0].TenTinhThanh +
                    ' - Sân bay ' +
                    P.ChiTietChuyenBay[j].SBTG[0].TenSanBay;
            }
            for (let j = 0; j < NgayGioDap.length - 1; j++) {
                let NG = new Date(new Date(P.ChiTietChuyenBay[j].NgayGioDen).getTime() - 7 * 60 * 60 * 1000);
                NgayGioDap[j].innerText =
                    ('0' + NG.getHours()).slice(-2) +
                    ':' +
                    ('0' + NG.getMinutes()).slice(-2) +
                    ', ' +
                    NG.getDate() +
                    '/' +
                    ('0' + (1 + NG.getMonth())).slice(-2) +
                    '/' +
                    NG.getFullYear();
            }
            NgayGioDap[NgayGioDap.length - 1].innerText =
                GioDap.innerText + ', ' + NgayDap.innerText.replaceAll('-', '/');
            NgayGioBay[0].innerText = GioBay.innerText + ', ' + NgayBay.innerText.replaceAll('-', '/');
            let TimeDung =
                (new Date(P.ChiTietChuyenBay[0].NgayGioDen).getTime() - new Date(P.ChuyenBay.NgayGio).getTime()) /
                60000;
            ThoiGianChangBay[0].innerText = Math.floor(TimeDung / 60) + ' giờ ' + Math.floor(TimeDung % 60) + ' phút';
            for (let j = 1; j < NgayGioBay.length; j++) {
                let NG = new Date(
                    new Date(P.ChiTietChuyenBay[j - 1].NgayGioDen).getTime() -
                        7 * 60 * 60 * 1000 +
                        P.ChiTietChuyenBay[j - 1].ThoiGianDung * 60 * 1000,
                );
                NgayGioBay[j].innerText =
                    ('0' + NG.getHours()).slice(-2) +
                    ':' +
                    ('0' + NG.getMinutes()).slice(-2) +
                    ', ' +
                    NG.getDate() +
                    '/' +
                    ('0' + (1 + NG.getMonth())).slice(-2) +
                    '/' +
                    NG.getFullYear();
                if (j < NgayGioBay.length - 1) {
                    let TimeDung =
                        (-NG.getTime() + new Date(P.ChiTietChuyenBay[j].NgayGioDen).getTime() - 7 * 60 * 60 * 1000) /
                        60000;
                    ThoiGianChangBay[j].innerText =
                        Math.floor(TimeDung / 60) + ' giờ ' + Math.floor(TimeDung % 60) + ' phút';
                } else {
                    let TimeDung =
                        (-NG.getTime() +
                            new Date(P.ChuyenBay.NgayGio).getTime() -
                            7 * 60 * 60 * 1000 +
                            P.ChuyenBay.ThoiGianBay * 60 * 1000) /
                        60000;
                    ThoiGianChangBay[j].innerText =
                        Math.floor(TimeDung / 60) + ' giờ ' + Math.floor(TimeDung % 60) + ' phút';
                }
            }
            // // trả về trạng thái cũ
            // SoDiemDung.innerText = '';
            // let removeCop = document.querySelectorAll('.Cop');
            // for (let j = 0; j < removeCop.length - 1; j++) {
            //     ChangBay.removeChild(removeCop[j]);
            //     ChangBay.classList.add('d-none');
            // }
        });
        new bootstrap.Modal(document.getElementById('ChiTietChuyenBay')).show();
    });
}
let button_ac_ve = document.querySelectorAll('.button_ac_Ve');
for (let i = 0; i < button_ac_ve.length; i++) {
    let VeDong = button_ac_ve[i].parentNode.querySelectorAll('.VeDong');
    let VeMo = button_ac_ve[i].parentNode.querySelectorAll('.VeMo');
    button_ac_ve[i].addEventListener('click', (e) => {
        for (let j = 0; j < VeMo.length; j++) {
            if (VeMo[j].classList.contains('show')) {
                VeMo[j].classList.remove('show');
                VeDong[j].classList.add('collapsed');
            }
        }
    });
}
