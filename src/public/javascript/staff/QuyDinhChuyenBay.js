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

// const ThemThamSo = document.getElementById('ThemThamSo');
// const FormThamSo = document.getElementById('FormThamSo');
const LuuThamSo = document.querySelectorAll('.LuuThamSo');

// Thêm tham số
// if (ThemThamSo) {
//     ThemThamSo.addEventListener('click', (e) => {
//         const cop = document.querySelector('.CopThamSo').cloneNode(true);
//         cop.classList.remove('d-none');
//         const InputThamSo = cop.querySelector('.InputThamSo');
//         const XoaRowThamSo = cop.querySelector('.XoaRowThamSo');
//         InputThamSo.value = '';
//         FormThamSo.appendChild(cop);
//         InputThamSo.addEventListener('keyup', (e) => {
//             const CopThamSo = e.target.closest('.CopThamSo');
//             CopThamSo.querySelector('.LuuThamSo').classList.remove('d-none');
//         });
//         InputThamSo.addEventListener('blur', (e) => {
//             const CopThamSo = e.target.closest('.CopThamSo');
//             setTimeout(() => {
//                 CopThamSo.querySelector('.LuuThamSo').classList.add('d-none');
//             }, 300);
//         });
//         cop.addEventListener('mouseover', (e) => {
//             const CopThamSo = e.target.closest('.CopThamSo');
//             CopThamSo.querySelector('.XoaRowThamSo').classList.remove('d-none');
//         });
//         cop.addEventListener('mouseout', (e) => {
//             const CopThamSo = e.target.closest('.CopThamSo');
//             CopThamSo.querySelector('.XoaRowThamSo').classList.add('d-none');
//         });
//         XoaRowThamSo.addEventListener('click', (e) => {
//             const CopThamSo = e.target.closest('.CopThamSo');
//             FormThamSo.removeChild(CopThamSo);
//         });
//     });
// }

// Ẩn hiện nút lưu
window.onlyNumber = onlyNumber;
window.onlykeyup = function onlykeyup(evt, e) {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|[\b]/;
    // var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
        return;
    }
    const ThamSo = e.closest('.ThamSo');

    if (ThamSo.querySelector('.InputThamSo').value == '') {
        if (!ThamSo.querySelector('.LuuThamSo').classList.contains('d-none')) {
            ThamSo.querySelector('.LuuThamSo').classList.add('d-none');
        }
    } else if (ThamSo.querySelector('.InputThamSo').value != '') {
        if (ThamSo.querySelector('.LuuThamSo').classList.contains('d-none')) {
            ThamSo.querySelector('.LuuThamSo').classList.remove('d-none');
        }
    }
};
const InputThamSos = document.querySelectorAll('.InputThamSo');
for (let i = 0; i < InputThamSos.length; i++) {
    InputThamSos[i].addEventListener('blur', (e) => {
        const ThamSo = e.target.closest('.ThamSo');
        setTimeout(() => {
            ThamSo.querySelector('.LuuThamSo').classList.add('d-none');
        }, 500);
        // const modal_LuuThamSo = new bootstrap.Modal(document.getElementById('staticBackdrop'));
        // modal_LuuThamSo.show();
    });
}

// sendForm
// function SendForm(_P_ThamSo) {
//     document.getElementById('p_ThamSo').value = JSON.stringify(_P_ThamSo);
//     var update_ThamSo_form = document.forms['update_ThamSo_form'];
//     update_ThamSo_form.action = '/staff/UpdateThamSo';
//     update_ThamSo_form.submit();
// }

// Lưu tham số
for (let i = 0; i < LuuThamSo.length; i++) {
    LuuThamSo[i].addEventListener('click', (e) => {
        let P_ThamSo = {};
        P_ThamSo.TenThamSo = e.target.closest('.ThamSo').querySelector('.TenThamSo').innerText;
        P_ThamSo.GiaTri = e.target.closest('.ThamSo').querySelector('.InputThamSo').value;
        axios({
            method: 'POST',
            url: '/staff/UpdateThamSo',
            data: P_ThamSo,
        }).then((res) => {});

        showToast({
            header: 'Quy định chuyến bay',
            body: 'Cập nhật thành công',
            duration: 5000,
            type: 'success',
        });
        // SendForm(P_ThamSo);
        // console.log(P_ThamSo);
    });
}
