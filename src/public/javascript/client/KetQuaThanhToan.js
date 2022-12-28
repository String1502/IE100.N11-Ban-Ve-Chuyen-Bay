import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
    today,
    showToast,
} from '../start.js';

// refresh lại là quay về trang chủ
var evTypep = window.performance.getEntriesByType('navigation')[0].type;
if (evTypep == 'reload') {
    window.location.replace('/');
}

let KetQuaThanhToan;
function Start() {
    // Tạo hóa đơn
    openLoader('Chờ chút');
    axios({
        method: 'post',
        url: '/hoadon/XoaCookieMaHangVe',
    }).then((res) => {});
    if (document.getElementById('KetQuaThanhToan')) {
        KetQuaThanhToan = JSON.parse(document.getElementById('KetQuaThanhToan').innerText);

        if (KetQuaThanhToan.ThanhCong == true) {
            ThanhToanThanhCong.classList.remove('d-none');
            ThanhToanThatBai.classList.add('d-none');
        } else {
            ThanhToanThanhCong.classList.add('d-none');
            ThanhToanThatBai.classList.remove('d-none');
        }
    }

    EventNutQuayVeTrangChu();
    closeLoader();
}
if (!KetQuaThanhToan) Start();

function EventNutQuayVeTrangChu() {
    const QuayVeTrangChus = document.querySelectorAll('.QuayVeTrangChu');
    for (let i = 0; i < QuayVeTrangChus.length; i++) {
        QuayVeTrangChus[i].addEventListener('click', (e) => {
            var home_form = document.forms['KetQuaform'];
            home_form.method = 'GET';
            home_form.action = '/';
            home_form.submit();
        });
    }
}
