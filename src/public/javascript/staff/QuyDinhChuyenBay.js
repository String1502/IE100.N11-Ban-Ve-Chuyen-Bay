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

const ThamSo_CapNhat = document.querySelector('.ThamSo_CapNhat');
const ThamSo_Sua = document.querySelector('.ThamSo_Sua');
const ThamSo_GiaTri = document.querySelectorAll('.ThamSo_GiaTri');
let PackageThamSo;

// LoadThamSo
if (!PackageThamSo) {
    LoadThamSo();
}
function LoadThamSo() {
    axios({
        method: 'post',
        url: '/staff/LoadThamSo',
    }).then((res) => {
        PackageThamSo = res.data;
        console.log(PackageThamSo);
    });
}

window.onlyNumber = onlyNumber;
//Button_ThamSo_Sua
ThamSo_Sua.addEventListener('click', (e) => {
    for (let i = 0; i < ThamSo_GiaTri.length; i++) {
        ThamSo_GiaTri[i].disabled = false;
    }
    ThamSo_Sua.classList.add('d-none');
    ThamSo_CapNhat.classList.remove('d-none');
});

// kiểm tra thông tin trước khi cập nhật
function CheckChangeThamSo(P_ThamSo) {
    for (let i = 0; i < P_ThamSo.length; i++) {
        if (P_ThamSo[i] == '' || P_ThamSo[i] == 0 || P_ThamSo[i].length > 9) {
            showToast({
                header: 'Quy định chuyến bay',
                body: 'Giá trị phải lớn hơn 0 và ít hơn 10 chữ số',
                duration: 5000,
                type: 'warning',
            });
            for (let i = 0; i < ThamSo_GiaTri.length; i++) {
                ThamSo_GiaTri[i].value = PackageThamSo[i].GiaTri;
            }

            return false;
        }
    }
}
//Cập nhật thông tin
function CapNhat_ThamSo() {
    let P_ThamSo = [];
    for (let i = 0; i < ThamSo_GiaTri.length; i++) {
        P_ThamSo[i] = ThamSo_GiaTri[i].value;
    }
    if (CheckChangeThamSo(P_ThamSo) == false) return;

    axios({
        method: 'POST',
        url: '/staff/UpdateThamSo',
        data: P_ThamSo,
    });
    showToast({
        header: 'Quy định chuyến bay',
        body: 'Cập nhật thành công',
        duration: 5000,
        type: 'success',
    });
    // Chuyển trạng thái sang Sưa
    for (let i = 0; i < ThamSo_GiaTri.length; i++) {
        ThamSo_GiaTri[i].disabled = true;
    }
    ThamSo_Sua.classList.remove('d-none');
    ThamSo_CapNhat.classList.add('d-none');
}
// button_ThamSo_CapNhat
ThamSo_CapNhat.addEventListener('click', (e) => {
    CapNhat_ThamSo();
});
