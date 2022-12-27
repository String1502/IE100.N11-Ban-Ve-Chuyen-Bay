let KetQuaThanhToan;
function Start() {
    //
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
}
if (!KetQuaThanhToan) Start();
