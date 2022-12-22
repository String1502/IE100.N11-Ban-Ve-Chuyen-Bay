import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
    today,
    showToast,
    onlyNumber,
    formatVND,
} from '../start.js';
window.onlyNumber = onlyNumber;
window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});

var ChuyenBay_list = [];

NhapFileExcel.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        openLoader('Chờ chút');
        var formData = new FormData(document.getElementById('form-excel'));
        axios.post('/flight/addFromexcel', formData).then((res) => {
            console.log(res.data);
            ChuyenBay_list = [];
            ChuyenBay_list = res.data;
            LoadChuyenBayLenView();
            closeLoader();
        });
    }
});

function LoadChuyenBayLenView() {
    if (ChuyenBay_list.length <= 0) {
        KhongCoChuyenBay.classList.remove('d-none');
        KhongCoChuyenBay.classList.add('text-danger');
    } else {
        KhongCoChuyenBay.classList.add('d-none');

        for (let i = 0; i < ChuyenBay_list.length; i++) {
            var item = ChuyenBay_list[i];

            const node = document.querySelector('.ChuyenBay_Item').cloneNode(true);
            node.classList.remove('d-none');
            node.querySelector('.STT').innerText = document.querySelectorAll('.ChuyenBay_Item').length;

            if (item.errNum > 0) {
                var err = 'Chuyến bay dòng số ' + item.RowEx + ' lỗi ở: ';

                if (item.res_err.MaSanBayDi == 1) {
                    err += '| Mã sân bay đi ';
                }
                if (item.res_err.MaSanBayDen == 1) {
                    err += '| Mã sân bay đến ';
                }
                if (item.res_err.NgayGio == 1) {
                    err += '| Ngày giờ bay ';
                }
                if (item.res_err.GiaVe_min == 1) {
                    err += '| Giá vé ';
                }
                if (item.res_err.ThoiGianBay_Min == 1) {
                    err += '| Vi phạm thời gian bay tối thiểu ';
                }
                if (item.res_err.Sbtg_max == 1) {
                    err += '| Vi phạm số SBTG tối đa ';
                }
                err += '|';

                node.querySelector('.ViPham').innerText = err;
                node.querySelector('.ViPham').classList.remove('d-none');
            } else {
                node.querySelector('.TenSanBayDi').innerText = item.MaSanBayDi;
                node.querySelector('.TenSanBayDi').classList.remove('d-none');

                node.querySelector('.TenSanBayDen').innerText = item.MaSanBayDen;
                node.querySelector('.TenSanBayDen').classList.remove('d-none');

                node.querySelector('.KhoiHanh').innerText = item.NgayGio;
                node.querySelector('.KhoiHanh').classList.remove('d-none');

                node.querySelector('.GiaVeCoBan').innerText = numberWithDot(item.GiaVeCoBan.toString());
                node.querySelector('.GiaVeCoBan').classList.remove('d-none');

                node.querySelector('.SoDiemDung').innerText = item.SBTG.length;
                node.querySelector('.SoDiemDung').classList.remove('d-none');

                node.querySelector('.HangVe').innerText = item.HangGhe.length;
                node.querySelector('.HangVe').classList.remove('d-none');

                node.querySelector('.ChiTiet').classList.remove('d-none');
                node.querySelector('.ChiTiet').setAttribute('index', i);
                node.querySelector('.ChiTiet').addEventListener('click', (e) => {
                    var index = parseInt(e.target.getAttribute('index'));
                    var chuyenbay = ChuyenBay_list[index];
                });
            }

            ChuyenBay_Container.appendChild(node);
        }
    }
}
