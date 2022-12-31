import { today, openLoader, closeLoader, showToast, numberSmallerTen } from '../start.js';
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();

window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});

axios({
    method: 'post',
    url: '/hoadon/XoaCookieMaHangVe',
}).then((res) => {});

Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-');
};

Date.prototype.display = function () {
    var dd = numberSmallerTen(this.getDate());
    var mm = numberSmallerTen(this.getMonth() + 1); // getMonth() is zero-based
    var yy = this.getFullYear();
    var hr = numberSmallerTen(this.getHours());
    var min = numberSmallerTen(this.getMinutes());

    return dd + '/' + mm + '/' + yy + ' ' + hr + ':' + min;
};

function IsNgayNotNull(Ngay) {
    if (Ngay.Ngay == -1 || Ngay.Ngay == NaN) {
        return false;
    } else if (Ngay.Thang == -1 || Ngay.Thang == NaN) {
        return false;
    } else if (Ngay.Nam == -1 || Ngay.Nam == NaN) {
        return false;
    }
    return true;
}

function IsGioNotNull(Gio) {
    if (Gio.Gio == -1 || Gio.Gio == NaN) {
        return false;
    } else if (Gio.Phut == -1 || Gio.Phut == NaN) {
        return false;
    }
    return true;
}

function CreateDateFromObject(Ngay = null, Gio = null) {
    var strNgay = '';
    var strGio = '';

    if (Ngay == null) {
        strNgay = '1700/01/01';
    } else {
        if (IsNgayNotNull(Ngay) == false) {
            strNgay = '1700/01/01';
        } else {
            var dd = numberSmallerTen(Ngay.Ngay);
            var mm = numberSmallerTen(Ngay.Thang);
            var yy = numberSmallerTen(Ngay.Nam);
            strNgay = yy + '/' + mm + '/' + dd;
        }
    }
    if (Gio == null) {
        strGio = '00:00:00';
    } else {
        if (IsGioNotNull(Gio) == false) {
            strGio = '00:00:00';
        } else {
            var hr = numberSmallerTen(Gio.Gio);
            var min = numberSmallerTen(Gio.Phut);
            strGio = hr + ':' + min + ':00';
        }
    }
    return new Date(strNgay + ' ' + strGio);
}

function CreateObjectFromDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yy = date.getFullYear();
    var hr = date.getHours();
    var min = date.getMinutes();

    return {
        Ngay: {
            Ngay: dd,
            Thang: mm,
            Nam: yy,
        },
        Gio: {
            Gio: hr,
            Phut: min,
        },
    };
}

let Package;
let SanBays;
let HangGhes;
let ThamSos;

let data_send = {
    mangChuyenBay: [
        // {
        //     NgayDi: { Nam: -1, Thang: -1, Ngay: -1 },
        //     SanBayDen: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
        //     SanBayDi: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
        // },
    ],
    bienHangGhe: { MaHangGhe: '', TenHangGhe: '' },
    mangHanhKhach: [
        // { value: 1, title: 'Người lớn' },
    ],
};

function Start() {
    Package = JSON.parse(document.getElementById('PackageJS').innerText);
    SanBays = structuredClone(Package.SanBays);
    HangGhes = structuredClone(Package.HangGhes);
    ThamSos = structuredClone(Package.ThamSos);

    KhoiTaoCacEventChung();
    KhoiTaoCacEventMotChieu_Khuhoi();
    KhoiTaoCacEventNhieuThanhPho();

    TimChuyenBay.addEventListener('click', (e) => {
        searchFlightBtn();
    });
}
if (!Package) Start();

function KhoiTaoCacEventChung() {
    // nút MotChieu_KhuHoi
    MotChieu_KhuHoi.addEventListener('click', (e) => {
        if (MotChieu_KhuHoi.checked == false) return;

        // Hành khách
        const HanhKhach_div = document.getElementById('HanhKhach_div');
        HanhKhach_div.parentElement.removeChild(HanhKhach_div);
        MotChieu_HanhKhach_div.appendChild(HanhKhach_div);

        // Hạng ghế
        const HangGhe_div = document.getElementById('HangGhe_div');
        HangGhe_div.parentElement.removeChild(HangGhe_div);
        MotChieu_HangGhe_div.appendChild(HangGhe_div);

        MotChieu_KhuHoi_div.classList.remove('d-none');
        NhieuThanhPho_div.classList.add('d-none');
    });

    // nút NhieuThanhPho
    NhieuThanhPho.addEventListener('click', (e) => {
        if (NhieuThanhPho.checked == false) return;

        // Hành khách
        const HanhKhach_div = document.getElementById('HanhKhach_div');
        HanhKhach_div.parentElement.removeChild(HanhKhach_div);
        NhieuThanhPho_HanhKhach_div.appendChild(HanhKhach_div);

        // Hạng ghế
        const HangGhe_div = document.getElementById('HangGhe_div');
        HangGhe_div.parentElement.removeChild(HangGhe_div);
        NhieuThanhPho_HangGhe_div.appendChild(HangGhe_div);

        MotChieu_KhuHoi_div.classList.add('d-none');
        NhieuThanhPho_div.classList.remove('d-none');
    });

    // nút khứ hồi
    KhuHoi.addEventListener('click', (e) => {
        e.target.checked
            ? document.querySelector('.ChuyenBay_Item_NgayVe').classList.remove('d-none')
            : document.querySelector('.ChuyenBay_Item_NgayVe').classList.add('d-none');
    });

    // Hành khách
    var MangLoaiHanhKhach = structuredClone(Package.LoaiKhachHang);
    var HanhKhach_Max = ThamSos.find((temp) => temp.TenThamSo == 'HanhKhach_Max').GiaTri;
    if (MangLoaiHanhKhach) {
        // Người lớn
        var nguoilon = MangLoaiHanhKhach[2];
        document.querySelector('.Ten_NguoiLon').innerText = nguoilon.TenLoai;
        document.querySelector('.Input_NguoiLon').title = nguoilon.TenLoai;
        document.querySelector('.Tuoi_NguoiLon').innerText = '(từ ' + nguoilon.SoTuoiToiThieu + ' tuổi)';

        // Trẻ em
        var treem = MangLoaiHanhKhach[1];
        document.querySelector('.Ten_TreEm').innerText = treem.TenLoai;
        document.querySelector('.Input_TreEm').title = treem.TenLoai;
        document.querySelector('.Tuoi_TreEm').innerText =
            '(từ ' + treem.SoTuoiToiThieu + '-' + treem.SoTuoiToiDa + ' tuổi)';

        // Em bé
        var embe = MangLoaiHanhKhach[0];
        document.querySelector('.Ten_EmBe').innerText = embe.TenLoai;
        document.querySelector('.Input_EmBe').title = embe.TenLoai;
        document.querySelector('.Tuoi_EmBe').innerText = '(dưới ' + embe.SoTuoiToiDa + ' tuổi)';

        data_send.mangHanhKhach.push({ value: 1, title: nguoilon.TenLoai });
        data_send.mangHanhKhach.push({ value: 0, title: treem.TenLoai });
        data_send.mangHanhKhach.push({ value: 0, title: embe.TenLoai });

        CapNhatChuoiHanhKhach();
    }

    document.querySelector('.Input_NguoiLon').addEventListener('change', (e) => {
        var loaikhachhang = data_send.mangHanhKhach.find((temp) => temp.title == e.target.title);
        if (e.target.value == '') {
            e.target.value = loaikhachhang.value;
        } else {
            var total = GetTongHanhKhach();
            if (parseInt(e.target.value) <= loaikhachhang.value) {
                loaikhachhang.value = parseInt(e.target.value);
            } else if (parseInt(e.target.value) > loaikhachhang.value) {
                if (parseInt(e.target.value) - loaikhachhang.value + total > HanhKhach_Max) {
                    showToast({
                        header: 'Hành khách',
                        body: 'Số hành khách tối đa một lần đặt là ' + HanhKhach_Max,
                        duration: 5000,
                        type: 'warning',
                    });
                    e.target.value = loaikhachhang.value;
                } else {
                    loaikhachhang.value = parseInt(e.target.value);
                }
            }
        }
        CapNhatChuoiHanhKhach();
    });

    document.querySelector('.Input_TreEm').addEventListener('change', (e) => {
        var loaikhachhang = data_send.mangHanhKhach.find((temp) => temp.title == e.target.title);
        if (e.target.value == '') {
            e.target.value = loaikhachhang.value;
        } else {
            var total = GetTongHanhKhach();
            if (parseInt(e.target.value) <= loaikhachhang.value) {
                loaikhachhang.value = parseInt(e.target.value);
            } else if (parseInt(e.target.value) > loaikhachhang.value) {
                if (parseInt(e.target.value) - loaikhachhang.value + total > HanhKhach_Max) {
                    showToast({
                        header: 'Hành khách',
                        body: 'Số hành khách tối đa một lần đặt là ' + HanhKhach_Max,
                        duration: 5000,
                        type: 'warning',
                    });
                    e.target.value = loaikhachhang.value;
                } else {
                    loaikhachhang.value = parseInt(e.target.value);
                }
            }
        }
        CapNhatChuoiHanhKhach();
    });

    document.querySelector('.Input_EmBe').addEventListener('change', (e) => {
        var loaikhachhang = data_send.mangHanhKhach.find((temp) => temp.title == e.target.title);
        if (e.target.value == '') {
            e.target.value = loaikhachhang.value;
        } else {
            var total = GetTongHanhKhach();
            if (parseInt(e.target.value) <= loaikhachhang.value) {
                loaikhachhang.value = parseInt(e.target.value);
            } else if (parseInt(e.target.value) > loaikhachhang.value) {
                if (parseInt(e.target.value) - loaikhachhang.value + total > HanhKhach_Max) {
                    showToast({
                        header: 'Hành khách',
                        body: 'Số hành khách tối đa một lần đặt là ' + HanhKhach_Max,
                        duration: 5000,
                        type: 'warning',
                    });
                    e.target.value = loaikhachhang.value;
                } else {
                    loaikhachhang.value = parseInt(e.target.value);
                }
            }
        }
        CapNhatChuoiHanhKhach();
    });

    // Hạng ghế
    const HangGhe_lis = document.querySelectorAll('.HangGhe_li');
    for (let i = 0; i < HangGhe_lis.length; i++) {
        HangGhe_lis[i].addEventListener('click', (e) => {
            var HangGhe_li_MaHangGhe = e.target.querySelector('.HangGhe_li_MaHangGhe').innerText;
            var HangGhe_li_TenHangGhe = e.target.querySelector('.HangGhe_li_TenHangGhe').innerText;

            HangGhe.value = HangGhe_li_TenHangGhe;
            HangGhe.setAttribute('mahangghe', HangGhe_li_MaHangGhe);

            data_send.bienHangGhe.MaHangGhe = HangGhe_li_MaHangGhe;
            data_send.bienHangGhe.TenHangGhe = HangGhe_li_TenHangGhe;
        });
    }
}

function GetTongHanhKhach() {
    var total = 0;
    data_send.mangHanhKhach.forEach((element) => {
        total += element.value;
    });
    return total;
}

function CapNhatChuoiHanhKhach() {
    HanhKhach.innerText = '';
    HanhKhach.innerText = data_send.mangHanhKhach
        .map((item) => {
            return (item.value + ' ' + item.title).toString();
        })
        .join(', ');
}

function KhoiTaoCacEventMotChieu_Khuhoi() {
    // Sân bay đi
    const SanBayDi_lis = document.querySelector('.ChuyenBay_Item_SanBayDi_ul').querySelectorAll('.SanBayDi_li');
    for (let i = 0; i < SanBayDi_lis.length; i++) {
        SanBayDi_lis[i].addEventListener('click', (e) => {
            var SanBayDi_li_TenSanBay = e.target.querySelector('.SanBayDi_li_TenSanBay').innerText;
            var SanBayDi_li_MaSanBay = e.target.querySelector('.SanBayDi_li_MaSanBay').innerText;
            var SanBayDi_li_TenTinhThanh = e.target.querySelector('.SanBayDi_li_TenTinhThanh').innerText;

            var ChuyenBay_Item_SanBayDi = document.querySelector('.ChuyenBay_Item_SanBayDi');
            var ChuyenBay_Item_SanBayDen = document.querySelector('.ChuyenBay_Item_SanBayDen');

            if (ChuyenBay_Item_SanBayDen.getAttribute('masanbay') == SanBayDi_li_MaSanBay) {
                showToast({
                    header: 'Sân bay đi',
                    body: 'Yêu cầu không trùng sân bay đến',
                    duration: 5000,
                    type: 'warning',
                });
            } else {
                ChuyenBay_Item_SanBayDi.value = SanBayDi_li_TenTinhThanh;
                ChuyenBay_Item_SanBayDi.setAttribute('masanbay', SanBayDi_li_MaSanBay);
            }
        });
    }

    // Sân bay đến
    const SanBayDen_lis = document.querySelector('.ChuyenBay_Item_SanBayDen_ul').querySelectorAll('.SanBayDen_li');
    for (let i = 0; i < SanBayDen_lis.length; i++) {
        SanBayDen_lis[i].addEventListener('click', (e) => {
            var SanBayDen_li_TenSanBay = e.target.querySelector('.SanBayDen_li_TenSanBay').innerText;
            var SanBayDen_li_MaSanBay = e.target.querySelector('.SanBayDen_li_MaSanBay').innerText;
            var SanBayDen_li_TenTinhThanh = e.target.querySelector('.SanBayDen_li_TenTinhThanh').innerText;

            var ChuyenBay_Item_SanBayDi = document.querySelector('.ChuyenBay_Item_SanBayDi');
            var ChuyenBay_Item_SanBayDen = document.querySelector('.ChuyenBay_Item_SanBayDen');

            if (ChuyenBay_Item_SanBayDi.getAttribute('masanbay') == SanBayDen_li_MaSanBay) {
                showToast({
                    header: 'Sân bay đến',
                    body: 'Yêu cầu không trùng sân bay đi',
                    duration: 5000,
                    type: 'warning',
                });
            } else {
                ChuyenBay_Item_SanBayDen.value = SanBayDen_li_TenTinhThanh;
                ChuyenBay_Item_SanBayDen.setAttribute('masanbay', SanBayDen_li_MaSanBay);
            }
        });
    }

    // nút swap
    document.querySelector('.ChuyenBay_Item_SwapSanBay').addEventListener('click', (e) => {
        var ChuyenBay_Item_SanBayDi = document.querySelector('.ChuyenBay_Item_SanBayDi');
        var ChuyenBay_Item_SanBayDen = document.querySelector('.ChuyenBay_Item_SanBayDen');

        var temp_masanbay = ChuyenBay_Item_SanBayDen.getAttribute('masanbay');
        var temp_tinhthanh = ChuyenBay_Item_SanBayDen.value;

        ChuyenBay_Item_SanBayDen.setAttribute('masanbay', ChuyenBay_Item_SanBayDi.getAttribute('masanbay'));
        ChuyenBay_Item_SanBayDen.value = ChuyenBay_Item_SanBayDi.value;

        ChuyenBay_Item_SanBayDi.setAttribute('masanbay', temp_masanbay);
        ChuyenBay_Item_SanBayDi.value = temp_tinhthanh;
    });

    // Ngày đi
    var ThoiGianDatVeChamNhat = ThamSos.find((temp) => temp.TenThamSo == 'ThoiGianDatVeChamNhat').GiaTri;
    var ThoiGianKhuHoiToiThieu = ThamSos.find((temp) => temp.TenThamSo == 'ThoiGianKhuHoiToiThieu').GiaTri;
    var now = new Date();
    now = new Date(now.getTime() + ThoiGianDatVeChamNhat * 60 * 60 * 1000);
    document.querySelector('.ChuyenBay_Item_NgayDi').setAttribute('min', now.yyyymmdd());
    document.querySelector('.ChuyenBay_Item_NgayDi').addEventListener('change', (e) => {
        //
        if (e.target.value == '') {
            var now = new Date();
            now = new Date(now.getTime() + (ThoiGianDatVeChamNhat + ThoiGianKhuHoiToiThieu) * 60 * 60 * 1000);
            console.log(now);
            document.querySelector('.ChuyenBay_Item_NgayVe').setAttribute('min', now.yyyymmdd());
        } else {
            var ngaydi = new Date(e.target.value + ' 00:00:00');
            var now = new Date();
            ngaydi = new Date(ngaydi.getTime() + ThoiGianKhuHoiToiThieu * 60 * 60 * 1000);

            if (ngaydi < now) {
                ngaydi = new Date(now.getTime() + ThoiGianKhuHoiToiThieu * 60 * 60 * 1000);
            }
            document.querySelector('.ChuyenBay_Item_NgayVe').setAttribute('min', ngaydi.yyyymmdd());
        }
        if (document.querySelector('.ChuyenBay_Item_NgayVe').value != '') {
            if (
                new Date(document.querySelector('.ChuyenBay_Item_NgayVe').getAttribute('min')) >
                new Date(document.querySelector('.ChuyenBay_Item_NgayVe').value)
            ) {
                document.querySelector('.ChuyenBay_Item_NgayVe').value = '';
            }
        }
    });
}

function KhoiTaoCacEventNhieuThanhPho() {
    // Lúc đầu có sẵn 2 chuyến bay
    var num = 2;
    for (let i = 0; i < num; i++) {
        HamThemChuyenBay();
    }

    // Nút them chuyến bay
    ThemChuyenBay.addEventListener('click', (e) => {
        HamThemChuyenBay();
    });
}

function HamThemChuyenBay() {
    var ThoiGianDatVeChamNhat = ThamSos.find((temp) => temp.TenThamSo == 'ThoiGianDatVeChamNhat').GiaTri;
    var ThoiGianKhuHoiToiThieu = ThamSos.find((temp) => temp.TenThamSo == 'ThoiGianKhuHoiToiThieu').GiaTri;
    var ChuyenBay_Max = ThamSos.find((temp) => temp.TenThamSo == 'ChuyenBay_Max').GiaTri;
    var index = document.querySelectorAll('.NhieuThanhPho_Item').length;
    if (document.querySelectorAll('.NhieuThanhPho_Item').length - 1 >= ChuyenBay_Max) {
        showToast({
            header: 'Bay nhiều thành phố',
            body: 'Yêu cầu tối đa ' + ChuyenBay_Max + ' chuyến bay.',
            duration: 5000,
            type: 'warning',
        });
        ThemChuyenBay.disabled = true;
        return;
    }

    const node = document.querySelector('.NhieuThanhPho_Item').cloneNode(true);
    node.classList.remove('d-none');
    node.setAttribute('index', document.querySelectorAll('.NhieuThanhPho_Item').length);

    // Sân bay đi
    var SanBayDi_lis = node.querySelectorAll('.NhieuThanhPho_SanBayDi_li');
    for (let i = 0; i < SanBayDi_lis.length; i++) {
        SanBayDi_lis[i].addEventListener('click', (e) => {
            var TenSanBay = e.target.querySelector('.NhieuThanhPho_SanBayDi_li_TenSanBay').innerText;
            var MaSanBay = e.target.querySelector('.NhieuThanhPho_SanBayDi_li_MaSanBay').innerText;
            var TenTinhThanh = e.target.querySelector('.NhieuThanhPho_SanBayDi_li_TenTinhThanh').innerText;

            var SanBayDi = node.querySelector('.NhieuThanhPho_Item_SanBayDi');
            var SanBayDen = node.querySelector('.NhieuThanhPho_Item_SanBayDen');

            if (SanBayDen.getAttribute('masanbay') == MaSanBay) {
                showToast({
                    header: 'Sân bay đi',
                    body: 'Yêu cầu không trùng sân bay đến',
                    duration: 5000,
                    type: 'warning',
                });
            } else {
                SanBayDi.value = TenTinhThanh;
                SanBayDi.setAttribute('masanbay', MaSanBay);
            }
        });
    }

    // Sân bay đến
    var SanBayDen_lis = node.querySelectorAll('.NhieuThanhPho_SanBayDen_li');
    for (let i = 0; i < SanBayDen_lis.length; i++) {
        SanBayDen_lis[i].addEventListener('click', (e) => {
            var TenSanBay = e.target.querySelector('.NhieuThanhPho_SanBayDen_li_TenSanBay').innerText;
            var MaSanBay = e.target.querySelector('.NhieuThanhPho_SanBayDen_li_MaSanBay').innerText;
            var TenTinhThanh = e.target.querySelector('.NhieuThanhPho_SanBayDen_li_TenTinhThanh').innerText;

            var SanBayDi = node.querySelector('.NhieuThanhPho_Item_SanBayDi');
            var SanBayDen = node.querySelector('.NhieuThanhPho_Item_SanBayDen');

            if (SanBayDi.getAttribute('masanbay') == MaSanBay) {
                showToast({
                    header: 'Sân bay đến',
                    body: 'Yêu cầu không trùng sân bay đi',
                    duration: 5000,
                    type: 'warning',
                });
            } else {
                SanBayDen.value = TenTinhThanh;
                SanBayDen.setAttribute('masanbay', MaSanBay);
            }
        });
    }

    // nút swap
    node.querySelector('.NhieuThanhPho_Item_SwapSanBay').addEventListener('click', (e) => {
        var SanBayDi = node.querySelector('.NhieuThanhPho_Item_SanBayDi');
        var SanBayDen = node.querySelector('.NhieuThanhPho_Item_SanBayDen');

        var msb = SanBayDen.getAttribute('masanbay');
        var tentt = SanBayDen.value;

        SanBayDen.setAttribute('masanbay', SanBayDi.getAttribute('masanbay'));
        SanBayDen.value = SanBayDi.value;

        SanBayDi.setAttribute('masanbay', msb);
        SanBayDi.value = tentt;
    });

    // nút xóa
    if (document.querySelectorAll('.NhieuThanhPho_Item').length >= 3) {
        var items = document.querySelectorAll('.NhieuThanhPho_Item');
        for (let i = 3; i < items.length; i++) {
            items[i].querySelector('.NhieuThanhPho_Item_XoaChuyenBay').parentElement.classList.add('d-none');
        }
        node.querySelector('.NhieuThanhPho_Item_XoaChuyenBay').parentElement.classList.remove('d-none');
    }
    node.querySelector('.NhieuThanhPho_Item_XoaChuyenBay').addEventListener('click', (e) => {
        // Nút xóa chuyến bay
        const ChuyenBay = e.target.closest('.NhieuThanhPho_Item');
        NhieuThanhPhoContainer.removeChild(ChuyenBay);
        const NhieuThanhPho_Items = document.querySelectorAll('.NhieuThanhPho_Item');
        if (NhieuThanhPho_Items.length > 3) {
            NhieuThanhPho_Items[NhieuThanhPho_Items.length - 1]
                .querySelector('.NhieuThanhPho_Item_XoaChuyenBay')
                .parentElement.classList.remove('d-none');
        }
        if (NhieuThanhPho_Items.length - 1 < ChuyenBay_Max) {
            ThemChuyenBay.disabled = false;
        }
    });

    // Ngày đi
    if (document.querySelectorAll('.NhieuThanhPho_Item').length <= 1) {
        var now = new Date();
        now = new Date(now.getTime() + ThoiGianDatVeChamNhat * 60 * 60 * 1000);
        node.querySelector('.NhieuThanhPho_Item_NgayDi').setAttribute('min', now.yyyymmdd());
    }

    if (index - 1 > 0) {
        var truoc = document.querySelectorAll('.NhieuThanhPho_Item_NgayDi')[index - 1];
        if (truoc.value != '') {
            var ngay = new Date(truoc.value);
            node.querySelector('.NhieuThanhPho_Item_NgayDi').setAttribute('min', ngay.yyyymmdd());
        }
    }

    node.querySelector('.NhieuThanhPho_Item_NgayDi').addEventListener('change', (e) => {
        var index = parseInt(e.target.closest('.NhieuThanhPho_Item').getAttribute('index'));
        if (e.target.value == '') {
        } else {
            var ngaythaydoi = new Date(e.target.value);

            const NgayDis = document.querySelectorAll('.NhieuThanhPho_Item_NgayDi');

            var ChanTruoc = new Date();
            // Kiểm liền trước
            if (index - 1 > 0) {
                if (NgayDis[index - 1].value == '') {
                    ChanTruoc = new Date(ChanTruoc.getTime() + ThoiGianDatVeChamNhat * 60 * 60 * 1000);
                } else {
                    ChanTruoc = new Date(NgayDis[index - 1].value);
                }
            } else {
                ChanTruoc = new Date(ChanTruoc.getTime() + ThoiGianDatVeChamNhat * 60 * 60 * 1000);
            }

            if (ChanTruoc > ngaythaydoi) {
                showToast({
                    header: 'Chuyến bay thứ ' + index,
                    body:
                        'Yêu cầu ngày đi tối thiểu: ' +
                        numberSmallerTen(ChanTruoc.getDate()) +
                        '/' +
                        numberSmallerTen(ChanTruoc.getMonth() + 1) +
                        '/' +
                        ChanTruoc.getFullYear(),
                    duration: 5000,
                    type: 'warning',
                });
                e.target.value = '';
                return;
            }

            var ChanSau = null;
            // Kiểm liền sau
            if (index + 1 < NgayDis.length) {
                if (NgayDis[index + 1].value == '') {
                    // trống
                } else {
                    ChanSau = new Date(NgayDis[index + 1].value);
                }

                NgayDis[index + 1].setAttribute('min', ngaythaydoi.yyyymmdd());
            }

            if (ChanSau != null && ChanSau < ngaythaydoi) {
                NgayDis[index + 1].value = '';
            }
        }
    });

    NhieuThanhPhoContainer.appendChild(node);
}

function KiemTra_TraCuu(istoast = false) {
    var isTrong = false;
    if (MotChieu_KhuHoi.checked == true) {
        var header = '';
        var body = '';
        if (
            document.querySelector('.ChuyenBay_Item_SanBayDi').value == '' ||
            document.querySelector('.ChuyenBay_Item_SanBayDi').getAttribute('masanbay') == ''
        ) {
            header = 'Sân bay đi';
            body = 'Chưa chọn sân bay đi';
            isTrong = true;
        } else if (
            document.querySelector('.ChuyenBay_Item_SanBayDen').value == '' ||
            document.querySelector('.ChuyenBay_Item_SanBayDen').getAttribute('masanbay') == ''
        ) {
            header = 'Sân bay đến';
            body = 'Chưa chọn sân bay đến';
            isTrong = true;
        } else if (document.querySelector('.ChuyenBay_Item_NgayDi').value == '') {
            header = 'Ngày đi';
            body = 'Chưa chọn ngày đi';
            isTrong = true;
        } else if (KhuHoi.checked == true && document.querySelector('.ChuyenBay_Item_NgayVe').value == '') {
            header = 'Ngày về';
            body = 'Chưa chọn ngày về';
            isTrong = true;
        }
    } else if (NhieuThanhPho.checked == true) {
        var NhieuThanhPho_Items = document.querySelectorAll('.NhieuThanhPho_Item');
        for (let i = 1; i < NhieuThanhPho_Items.length; i++) {
            var sanbaydi = NhieuThanhPho_Items[i].querySelector('.NhieuThanhPho_Item_SanBayDi');
            var sanbayden = NhieuThanhPho_Items[i].querySelector('.NhieuThanhPho_Item_SanBayDen');
            var ngaydi = NhieuThanhPho_Items[i].querySelector('.NhieuThanhPho_Item_NgayDi');

            if (sanbaydi.value == '' || sanbaydi.getAttribute('masanbay') == '') {
                header = 'Chuyến bay thứ ' + i;
                body = 'Chưa chọn sân bay đi';
                isTrong = true;
                break;
            } else if (sanbayden.value == '' || sanbayden.getAttribute('masanbay') == '') {
                header = 'Chuyến bay thứ ' + i;
                body = 'Chưa chọn sân bay đến';
                isTrong = true;
                break;
            } else if (ngaydi.value == '') {
                header = 'Chuyến bay thứ ' + i;
                body = 'Ngày đi còn trống';
                isTrong = true;
                break;
            }
        }
    }

    if (HangGhe.value == '' || HangGhe.getAttribute('mahangghe') == '') {
        header = 'Hạng ghế';
        body = 'Chưa chọn hạng ghế';
        isTrong = true;
    }

    if (istoast == true && isTrong == true) {
        showToast({
            header: header,
            body: body,
            duration: 5000,
            type: 'warning',
        });
    }

    return isTrong;
}

function SendForm(mangchuyenbay, hangghe, hanhkhach) {
    document.getElementById('mangchuyenbay_formid').value = mangchuyenbay;
    document.getElementById('hangghe_formid').value = hangghe;
    document.getElementById('hanhkhach_formid').value = hanhkhach;
    var search_flight_form = document.forms['search-flight-form'];
    search_flight_form.action = '/choose_flight';
    search_flight_form.submit();
}

function searchFlightBtn() {
    if (KiemTra_TraCuu(true)) return;

    data_send.mangChuyenBay = [];
    if (MotChieu_KhuHoi.checked == true) {
        var sanbaydi = SanBays.find(
            (temp) => temp.MaSanBay == document.querySelector('.ChuyenBay_Item_SanBayDi').getAttribute('masanbay'),
        );

        var sanbayden = SanBays.find(
            (temp) => temp.MaSanBay == document.querySelector('.ChuyenBay_Item_SanBayDen').getAttribute('masanbay'),
        );

        var ngaydi = new Date(document.querySelector('.ChuyenBay_Item_NgayDi').value + ' 00:00:00');

        data_send.mangChuyenBay.push({
            NgayDi: structuredClone(CreateObjectFromDate(ngaydi).Ngay),
            SanBayDen: {
                MaSanBay: sanbayden.MaSanBay,
                TenSanBay: sanbayden.TenSanBay,
                TinhThanh: sanbayden.TenTinhThanh,
            },
            SanBayDi: { MaSanBay: sanbaydi.MaSanBay, TenSanBay: sanbaydi.TenSanBay, TinhThanh: sanbaydi.TenTinhThanh },
        });

        if (KhuHoi.checked == true) {
            var ngayve = new Date(document.querySelector('.ChuyenBay_Item_NgayVe').value + ' 00:00:00');

            data_send.mangChuyenBay.push({
                NgayDi: structuredClone(CreateObjectFromDate(ngayve).Ngay),
                SanBayDen: {
                    MaSanBay: sanbaydi.MaSanBay,
                    TenSanBay: sanbaydi.TenSanBay,
                    TinhThanh: sanbaydi.TenTinhThanh,
                },
                SanBayDi: {
                    MaSanBay: sanbayden.MaSanBay,
                    TenSanBay: sanbayden.TenSanBay,
                    TinhThanh: sanbayden.TenTinhThanh,
                },
            });
        }
    } else if (NhieuThanhPho.checked == true) {
        var NhieuThanhPho_Items = document.querySelectorAll('.NhieuThanhPho_Item');
        for (let i = 1; i < NhieuThanhPho_Items.length; i++) {
            var sanbaydi = SanBays.find(
                (temp) =>
                    temp.MaSanBay ==
                    NhieuThanhPho_Items[i].querySelector('.NhieuThanhPho_Item_SanBayDi').getAttribute('masanbay'),
            );
            var sanbayden = SanBays.find(
                (temp) =>
                    temp.MaSanBay ==
                    NhieuThanhPho_Items[i].querySelector('.NhieuThanhPho_Item_SanBayDen').getAttribute('masanbay'),
            );
            var ngaydi = new Date(
                NhieuThanhPho_Items[i].querySelector('.NhieuThanhPho_Item_NgayDi').value + ' 00:00:00',
            );

            data_send.mangChuyenBay.push({
                NgayDi: structuredClone(CreateObjectFromDate(ngaydi).Ngay),
                SanBayDen: {
                    MaSanBay: sanbayden.MaSanBay,
                    TenSanBay: sanbayden.TenSanBay,
                    TinhThanh: sanbayden.TenTinhThanh,
                },
                SanBayDi: {
                    MaSanBay: sanbaydi.MaSanBay,
                    TenSanBay: sanbaydi.TenSanBay,
                    TinhThanh: sanbaydi.TenTinhThanh,
                },
            });
        }
    }

    data_send.bienHangGhe.MaHangGhe = HangGhe.getAttribute('mahangghe');
    data_send.bienHangGhe.TenHangGhe = HangGhe.value;
    SendForm(
        JSON.stringify(data_send.mangChuyenBay),
        JSON.stringify(data_send.bienHangGhe),
        JSON.stringify(data_send.mangHanhKhach),
    );
}
