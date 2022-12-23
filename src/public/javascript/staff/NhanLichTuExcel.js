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
Date.prototype.display = function () {
    var dd = numberSmallerTen(this.getDate());
    var mm = numberSmallerTen(this.getMonth() + 1); // getMonth() is zero-based
    var yy = this.getFullYear();
    var hr = numberSmallerTen(this.getHours());
    var min = numberSmallerTen(this.getMinutes());

    return dd + '/' + mm + '/' + yy + ' ' + hr + ':' + min;
};
Date.prototype.displayReverse = function () {
    var dd = numberSmallerTen(this.getDate());
    var mm = numberSmallerTen(this.getMonth() + 1); // getMonth() is zero-based
    var yy = this.getFullYear();
    var hr = numberSmallerTen(this.getHours());
    var min = numberSmallerTen(this.getMinutes());

    return hr + ':' + min + ' ' + dd + '/' + mm + '/' + yy;
};

function KhoiTaoCountDown() {
    // đếm thời gian
    setInterval(function () {
        var now = new Date();
        Timer_NgayGio.innerText = now.display() + ':' + numberSmallerTen(now.getSeconds());
    }, 1000);
}

var SB_HG = JSON.parse(document.getElementById('SB_HG').innerText);
var ChuyenBay_list = [];

function Start() {
    openLoader('Chờ chút');

    if (staff_header) {
        staff_header.parentElement.removeChild(staff_header);
    }

    KhoiTaoCountDown();
    console.log(SB_HG);

    NhapFileExcel.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            openLoader('Chờ chút');
            var formData = new FormData(document.getElementById('form-excel'));
            axios.post('/flight/addFromexcel', formData).then((res) => {
                console.log(res.data);

                ChuyenBay_list = [];
                if (res.data == 'fail') {
                } else {
                    ChuyenBay_list = res.data;
                }
                LoadChuyenBayLenView();
                On_off_NhanLich();
                closeLoader();
            });
        }
    });

    NhanLichChuyenBay.addEventListener('click', (e) => {
        Modal_Body.innerText = 'Bạn muốn nhận lịch ' + ChuyenBay_list.length + ' chuyến bay?';
        Modal_Luu.classList.remove('d-none');
        Modal_Thoat.classList.add('d-none');
        var Modal = new bootstrap.Modal(document.getElementById('Modal'), true);
        Modal.show();
    });

    ThoatThemChuyenBay.addEventListener('click', (e) => {
        if (ChuyenBay_list.length > 0) {
            Modal_Body.innerText = 'Tồn tại chuyến bay chưa nhận lịch! \nBạn thực sự muốn thoát?';
        } else {
            Modal_Body.innerText = 'Bạn muốn thoát?';
        }
        Modal_Luu.classList.add('d-none');
        Modal_Thoat.classList.remove('d-none');
        var Modal = new bootstrap.Modal(document.getElementById('Modal'), true);
        Modal.show();
    });

    Modal_Thoat.addEventListener('click', (e) => {
        SendForm_ThoatNhanLich();
    });

    Modal_Luu.addEventListener('click', (e) => {
        SendForm_NhanLichExcel();
    });

    closeLoader();
}
Start();

function LoadChuyenBayLenView() {
    const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');
    for (let i = 1; i < ChuyenBay_Items.length; i++) {
        ChuyenBay_Container.removeChild(ChuyenBay_Items[i]);
    }

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
                    LoadModal(index);
                });
            }

            ChuyenBay_Container.appendChild(node);
        }
    }
}

function LoadModal(index) {
    var chuyenbay = ChuyenBay_list[index];

    // Sân bay đi đến
    SanBayDi.value = SB_HG.SanBays.find((temp) => temp.MaSanBay == chuyenbay.MaSanBayDi).TenSanBay;
    SanBayDen.value = SB_HG.SanBays.find((temp) => temp.MaSanBay == chuyenbay.MaSanBayDen).TenSanBay;

    // Khởi hành
    KhoiHanh.value = chuyenbay.NgayGio;

    // Thời gian bay
    ThoiGianBay.value = chuyenbay.ThoiGianBay;

    // Giá vé cơ bản
    var giave = chuyenbay.GiaVeCoBan;
    GiaVeCoBan.value = numberWithDot(giave.toString());

    // SBTG
    var SanBayTrungGian_Items = document.querySelectorAll('.SanBayTrungGian_Item');
    for (let i = 1; i < SanBayTrungGian_Items.length; i++) {
        SanBayTrungGian_Container.removeChild(SanBayTrungGian_Items[i]);
    }

    for (let i = 0; i < chuyenbay.SBTG.length; i++) {
        const node = document.querySelector('.SanBayTrungGian_Item').cloneNode(true);
        node.classList.remove('d-none');

        // Thứ tự
        node.querySelector('.ThuTu').innerText = chuyenbay.SBTG[i].ThuTu;
        // Tên sân bay
        node.querySelector('.TenSanBay').innerText = SB_HG.SanBays.find(
            (temp) => temp.MaSanBay == chuyenbay.SBTG[i].MaSanBay,
        ).TenSanBay;
        // Thời gian đến
        var ngayden = new Date(chuyenbay.SBTG[i].NgayGioDen.toString());
        node.querySelector('.ThoiGianDen').innerText = ngayden.displayReverse();
        // Thời gian dừng
        node.querySelector('.ThoiGianDung').innerText = chuyenbay.SBTG[i].ThoiGianDung;
        // Ghi chú
        node.querySelector('.GhiChu').innerText = chuyenbay.SBTG[i].GhiChu == null ? '' : chuyenbay.SBTG[i].GhiChu;

        SanBayTrungGian_Container.appendChild(node);
    }

    // Hạng ghế

    var HangVe_Items = document.querySelectorAll('.HangVe_Item');
    for (let i = 1; i < HangVe_Items.length; i++) {
        HangVe_Container.removeChild(HangVe_Items[i]);
    }

    for (let i = 0; i < chuyenbay.HangGhe.length; i++) {
        const node = document.querySelector('.HangVe_Item').cloneNode(true);
        node.classList.remove('d-none');

        var hanghe = SB_HG.HangGhes.find((temp) => temp.MaHangGhe == chuyenbay.HangGhe[i].MaHangGhe);

        // Tên hạng vé
        node.querySelector('.TenHangVe').innerText = hanghe.TenHangGhe;
        // Giá tiền
        node.querySelector('.GiaTien').innerText = numberWithDot(giave * parseFloat(hanghe.HeSo));
        // Ghế trống
        node.querySelector('.SoGhe').innerText = chuyenbay.HangGhe[i].TongVe;
        HangVe_Container.appendChild(node);
    }
}

function On_off_NhanLich() {
    var block = false;
    if (ChuyenBay_list.length <= 0) {
        block = true;
    } else {
        ChuyenBay_list.forEach((item) => {
            if (item.errNum > 0) {
                block = true;
            }
        });
    }

    NhanLichChuyenBay.disabled = block;
}

// Gửi gói lưu
function SendForm_NhanLichExcel() {
    // Trí
    return;
    openLoader('Chờ chút');
    console.log(data_send);
    //return;
    axios({
        method: 'post',
        url: '/flight/update',
        data: data_send,
    }).then((res) => {
        var body = '';
        var type = '';
        if (res.data == true) {
            body = 'Thành công';
            type = 'success';
        } else if (res.data == false) {
            body = 'Thất bại';
            type = 'danger';
        }
        showToast({
            header: 'Cập nhật chuyến bay',
            body: body,
            duration: 5000,
            type: type,
        });
        openLoader(body);
        closeLoader();
        setTimeout(() => {
            SendForm_ThoatNhanLich();
        }, 1500);
    });
}

// Hủy quay về nhận lịch
function SendForm_ThoatNhanLich() {
    var staff_form = document.forms['NhanLich-form'];
    staff_form.action = '/staff/nhanlich';
    staff_form.submit();
}
