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

//Lấy danh sách chuyến bay từ DB
let Flight_fromDB;
function GetFlight_fromSV() {
    const ChuyenBay = document.getElementById('MaChuyenBay');
    var data = { MaChuyenBay: ChuyenBay.getAttribute('machuyenbay'), MaChuyenBayHienThi: ChuyenBay.value };

    openLoader('Chờ chút');
    axios({
        method: 'post',
        url: '/flight/get-flight',
        data: data,
    }).then((res) => {
        Flight_fromDB = res.data;

        closeLoader();
        if (Flight_fromDB) {
            Flight_fromDB['MaChuyenBayHienThi'] =
                Flight_fromDB.SanBayDi.MaSanBay +
                '-' +
                Flight_fromDB.SanBayDen.MaSanBay +
                '-' +
                Flight_fromDB.MaChuyenBay;
            LoadDataLenView();
            AddModalEvent();
            console.log(Flight_fromDB);
        }
    });
}
if (!Flight_fromDB) GetFlight_fromSV();

function LoadDataLenView() {
    document.getElementById('MaChuyenBay').value =
        Flight_fromDB.SanBayDi.MaSanBay + '-' + Flight_fromDB.SanBayDen.MaSanBay + '-' + Flight_fromDB.MaChuyenBay;
    document.getElementById('SanBayDi').value = Flight_fromDB.SanBayDi.TenSanBay;
    document.getElementById('SanBayDen').value = Flight_fromDB.SanBayDen.TenSanBay;
    document.getElementById('KhoiHanh').value =
        numberSmallerTen(Flight_fromDB.ThoiGianDi.GioDi.Gio) +
        ':' +
        numberSmallerTen(Flight_fromDB.ThoiGianDi.GioDi.Phut) +
        ' ' +
        numberSmallerTen(Flight_fromDB.ThoiGianDi.NgayDi.Ngay) +
        '-' +
        numberSmallerTen(Flight_fromDB.ThoiGianDi.NgayDi.Thang) +
        '-' +
        Flight_fromDB.ThoiGianDi.NgayDi.Nam;

    document.getElementById('ThoiGianBay').value = Flight_fromDB.ThoiGianBay;
    document.getElementById('SoGheTrong').value = Flight_fromDB.GheTrong;
    document.getElementById('TrangThai').value =
        Flight_fromDB.TrangThai == 'ChuaKhoiHanh' ? 'Chưa khởi hành' : 'Đã khởi hành';
    document.getElementById('GiaVeCoBan').value = numberWithDot(Flight_fromDB.GiaVeCoBan);
    LoadSanBayTrungGian();
    LoadHangVe();
    LoadVeDaDat();
}

function LoadSanBayTrungGian() {
    const SanBayTrungGian_Container = document.getElementById('SanBayTrungGian_Container');
    const SanBayTrungGian_Items = document.querySelectorAll('.SanBayTrungGian_Item');
    if (SanBayTrungGian_Items.length > 1) {
        let num = SanBayTrungGian_Items.length;
        for (let i = num - 1; i > 0; i--) {
            SanBayTrungGian_Container.removeChild(SanBayTrungGian_Items[i]);
        }
    }

    const SBTG = Flight_fromDB.SanBayTG;
    for (let i = 0; i < SBTG.length; i++) {
        const node = SanBayTrungGian_Items[0].cloneNode(true);
        node.classList.remove('d-none');

        node.querySelector('.ThuTu').innerText = SBTG[i].ThuTu;
        node.querySelector('.TenSanBay').innerText = SBTG[i].TenSanBay;
        node.querySelector('.ThoiGianDen').innerText =
            numberSmallerTen(SBTG[i].ThoiGianDen.GioDen.Gio) +
            ':' +
            numberSmallerTen(SBTG[i].ThoiGianDen.GioDen.Phut) +
            ' ' +
            numberSmallerTen(SBTG[i].ThoiGianDen.NgayDen.Ngay) +
            '-' +
            numberSmallerTen(SBTG[i].ThoiGianDen.NgayDen.Thang) +
            '-' +
            SBTG[i].ThoiGianDen.NgayDen.Nam;
        node.querySelector('.ThoiGianDung').innerText = SBTG[i].ThoiGianDung;
        node.querySelector('.GhiChu').innerText = SBTG[i].GhiChu == null ? '' : SBTG[i].GhiChu;

        SanBayTrungGian_Container.appendChild(node);
    }
}

function LoadHangVe() {
    const HangVe_Container = document.getElementById('HangVe_Container');
    const HangVe_Items = document.querySelectorAll('.HangVe_Item');
    if (HangVe_Items.length > 1) {
        let num = HangVe_Items.length;
        for (let i = num - 1; i > 0; i--) {
            HangVe_Container.removeChild(HangVe_Items[i]);
        }
    }

    const HangVes = Flight_fromDB.HangVe;
    for (let i = 0; i < HangVes.length; i++) {
        const node = HangVe_Items[0].cloneNode(true);
        node.classList.remove('d-none');

        node.querySelector('.TenHangVe').innerText = HangVes[i].TenHangVe;
        node.querySelector('.GiaTien').innerText = numberWithDot(HangVes[i].GiaTien);
        node.querySelector('.GheTrong').innerText = HangVes[i].GheTrong;

        HangVe_Container.appendChild(node);
    }
}

function LoadVeDaDat() {
    const VeDaDat_Container = document.getElementById('VeDaDat_Container');
    const VeDaDat_Items = document.querySelectorAll('.VeDaDat_Item');
    if (VeDaDat_Items.length > 1) {
        let num = VeDaDat_Items.length;
        for (let i = num - 1; i > 0; i--) {
            VeDaDat_Container.removeChild(VeDaDat_Items[i]);
        }
    }

    const VeDaDats = Flight_fromDB.VeDaDat;
    for (let i = 0; i < VeDaDats.length; i++) {
        const node = VeDaDat_Items[0].cloneNode(true);
        node.classList.remove('d-none');

        node.querySelector('.MaVeHienThi').innerText = VeDaDats[i].MaVeHienThi;
        node.querySelector('.TenHanhKhach').innerText = VeDaDats[i].HanhKhach.HoTen;
        node.querySelector('.TenHangVe').innerText = VeDaDats[i].TenHangVe;
        node.querySelector('.SoKgHanhLy').innerText = '+ ' + VeDaDats[i].MocHanhLy + 'kg';
        node.querySelector('.NgayThanhToan').innerText =
            numberSmallerTen(VeDaDats[i].ThoiGianThanhToan.GioThanhToan.Gio) +
            ':' +
            numberSmallerTen(VeDaDats[i].ThoiGianThanhToan.GioThanhToan.Phut) +
            ' ' +
            numberSmallerTen(VeDaDats[i].ThoiGianThanhToan.NgayThanhToan.Ngay) +
            '-' +
            numberSmallerTen(VeDaDats[i].ThoiGianThanhToan.NgayThanhToan.Thang) +
            '-' +
            VeDaDats[i].ThoiGianThanhToan.NgayThanhToan.Nam;

        node.querySelector('.GiaVe').innerText = numberWithDot(VeDaDats[i].GiaVe);
        node.querySelector('.LienLac_btn').setAttribute('index', i);

        node.querySelector('.LienLac_btn').addEventListener('click', (e) => {
            const index = e.target.getAttribute('index');
            const NguoiLienHe = Flight_fromDB.VeDaDat[index].NguoiLienHe;
            const HanhKhach = Flight_fromDB.VeDaDat[index].HanhKhach;

            resetModal();
            document.getElementById('NguoiLienHe_HoTen').value = NguoiLienHe.HoTen;
            document.getElementById('NguoiLienHe_SDT').value = NguoiLienHe.SDT;
            document.getElementById('NguoiLienHe_Email').value = NguoiLienHe.Email;
            document.getElementById('ChinhSua_NguoiLienHe').setAttribute('index', index);
            document.getElementById('NguoiLienHe_HoTen').setAttribute('index', index);
            document.getElementById('NguoiLienHe_SDT').setAttribute('index', index);
            document.getElementById('NguoiLienHe_Email').setAttribute('index', index);

            document.getElementById('HanhKhach_DanhXung').value = HanhKhach.GioiTinh == 0 ? 'Ông' : 'Cô';
            document.getElementById('HanhKhach_HoTen').value = HanhKhach.HoTen;
            document.getElementById('HanhKhach_NgaySinh_Ngay').value =
                'Ngày ' + numberSmallerTen(HanhKhach.NgaySinh.Ngay);
            document.getElementById('HanhKhach_NgaySinh_Thang').value =
                'Tháng ' + numberSmallerTen(HanhKhach.NgaySinh.Thang);
            document.getElementById('HanhKhach_NgaySinh_Nam').value = 'Năm ' + HanhKhach.NgaySinh.Nam;
        });

        VeDaDat_Container.appendChild(node);
    }
}

function resetModal() {
    const ChinhSua_NguoiLienHe = document.getElementById('ChinhSua_NguoiLienHe');
    if (ChinhSua_NguoiLienHe.classList.contains('d-none')) {
        ChinhSua_NguoiLienHe.classList.remove('d-none');
    }
    const Huy_Luu_NguoiLienHe = document.getElementById('Huy_Luu_NguoiLienHe');
    if (!Huy_Luu_NguoiLienHe.classList.contains('d-none')) {
        Huy_Luu_NguoiLienHe.classList.add('d-none');
    }
    document.getElementById('Luu_NguoiLienHe').disabled = true;

    let mang = ['NguoiLienHe_HoTen', 'NguoiLienHe_SDT', 'NguoiLienHe_Email'];
    mang.forEach((i) => {
        const item = document.getElementById(i);
        if (!item.classList.contains('ps-0')) {
            item.classList.add('ps-0');
        }
        if (!item.classList.contains('border-0')) {
            item.classList.add('border-0');
        }
        if (!item.classList.contains('custom-boxshadow-focus-none')) {
            item.classList.add('custom-boxshadow-focus-none');
        }
        if (item.classList.contains('custom-boxshadow-focus-primary')) {
            item.classList.remove('custom-boxshadow-focus-primary');
        }
        item.readOnly = true;
    });
}

function AddModalEvent() {
    // nút chỉnh sửa
    document.getElementById('ChinhSua_NguoiLienHe').addEventListener('click', (e) => {
        const ChinhSua_NguoiLienHe = e.target;
        if (!ChinhSua_NguoiLienHe.classList.contains('d-none')) {
            ChinhSua_NguoiLienHe.classList.add('d-none');
        }
        const Huy_Luu_NguoiLienHe = document.getElementById('Huy_Luu_NguoiLienHe');
        if (Huy_Luu_NguoiLienHe.classList.contains('d-none')) {
            Huy_Luu_NguoiLienHe.classList.remove('d-none');
        }

        let mang = ['NguoiLienHe_HoTen', 'NguoiLienHe_SDT', 'NguoiLienHe_Email'];
        mang.forEach((i) => {
            const item = document.getElementById(i);
            if (item.classList.contains('ps-0')) {
                item.classList.remove('ps-0');
            }
            if (item.classList.contains('border-0')) {
                item.classList.remove('border-0');
            }
            if (item.classList.contains('custom-boxshadow-focus-none')) {
                item.classList.remove('custom-boxshadow-focus-none');
            }
            if (!item.classList.contains('custom-boxshadow-focus-primary')) {
                item.classList.add('custom-boxshadow-focus-primary');
            }
            item.readOnly = false;
        });
    });

    // họ tên
    document.getElementById('NguoiLienHe_HoTen').addEventListener('change', (e) => {
        if (e.target.value == '') {
            const index = document.getElementById('ChinhSua_NguoiLienHe').getAttribute('index');
            const NguoiLienHe = Flight_fromDB.VeDaDat[index].NguoiLienHe;
            e.target.value = NguoiLienHe.HoTen;
        }
        document.getElementById('Luu_NguoiLienHe').disabled = ChuyenTrangThaiNutLuu();
    });

    // SDT
    document.getElementById('NguoiLienHe_SDT').addEventListener('change', (e) => {
        if (e.target.value == '') {
            const index = document.getElementById('ChinhSua_NguoiLienHe').getAttribute('index');
            const NguoiLienHe = Flight_fromDB.VeDaDat[index].NguoiLienHe;
            e.target.value = NguoiLienHe.SDT;
        }
        document.getElementById('Luu_NguoiLienHe').disabled = ChuyenTrangThaiNutLuu();
    });

    // Email
    document.getElementById('NguoiLienHe_Email').addEventListener('change', (e) => {
        if (e.target.value == '') {
            const index = document.getElementById('ChinhSua_NguoiLienHe').getAttribute('index');
            const NguoiLienHe = Flight_fromDB.VeDaDat[index].NguoiLienHe;
            e.target.value = NguoiLienHe.Email;
        }
        document.getElementById('Luu_NguoiLienHe').disabled = ChuyenTrangThaiNutLuu();
    });

    // Nút lưu
    document.getElementById('Luu_NguoiLienHe').addEventListener('click', (e) => {
        const index = document.getElementById('ChinhSua_NguoiLienHe').getAttribute('index');
        const data_send = {
            MaHoaDon: Flight_fromDB.VeDaDat[index].MaHoaDon,
            NguoiLienHe: structuredClone(Flight_fromDB.VeDaDat[index].NguoiLienHe),
        };
        delete data_send.NguoiLienHe.NgayGioThanhToan;
        data_send.NguoiLienHe.HoTen = document.getElementById('NguoiLienHe_HoTen').value;
        data_send.NguoiLienHe.SDT = document.getElementById('NguoiLienHe_SDT').value;
        data_send.NguoiLienHe.Email = document.getElementById('NguoiLienHe_Email').value;
        console.log(data_send);
        axios({
            method: 'post',
            url: '/hoadon/update',
            data: data_send,
        }).then((res) => {
            console.log(res.data);
            if (res.data == true) {
                Flight_fromDB.VeDaDat[index].NguoiLienHe.HoTen = data_send.NguoiLienHe.HoTen;
                Flight_fromDB.VeDaDat[index].NguoiLienHe.SDT = data_send.NguoiLienHe.SDT;
                Flight_fromDB.VeDaDat[index].NguoiLienHe.Email = data_send.NguoiLienHe.Email;
                showToast({ header: 'Người liên hệ', body: 'Cập nhật thành công', duration: 5000, type: 'success' });
            }
            CapNhatNguoiLienHeHienTai();
        });
    });

    // Nút hủy
    document.getElementById('Huy_NguoiLienHe').addEventListener('click', (e) => {
        CapNhatNguoiLienHeHienTai();
    });
}

function ChuyenTrangThaiNutLuu() {
    const index = document.getElementById('ChinhSua_NguoiLienHe').getAttribute('index');
    const NguoiLienHe = Flight_fromDB.VeDaDat[index].NguoiLienHe;

    const HoTen = document.getElementById('NguoiLienHe_HoTen');
    const SDT = document.getElementById('NguoiLienHe_SDT');
    const Email = document.getElementById('NguoiLienHe_Email');

    if (HoTen.value != NguoiLienHe.HoTen) return false;

    if (SDT.value != NguoiLienHe.SDT) return false;

    if (Email.value != NguoiLienHe.Email) return false;

    return true;
}

function CapNhatNguoiLienHeHienTai() {
    const index = document.getElementById('ChinhSua_NguoiLienHe').getAttribute('index');
    const NguoiLienHe = Flight_fromDB.VeDaDat[index].NguoiLienHe;

    resetModal();
    document.getElementById('NguoiLienHe_HoTen').value = NguoiLienHe.HoTen;
    document.getElementById('NguoiLienHe_SDT').value = NguoiLienHe.SDT;
    document.getElementById('NguoiLienHe_Email').value = NguoiLienHe.Email;
    document.getElementById('ChinhSua_NguoiLienHe').setAttribute('index', index);
    document.getElementById('NguoiLienHe_HoTen').setAttribute('index', index);
    document.getElementById('NguoiLienHe_SDT').setAttribute('index', index);
    document.getElementById('NguoiLienHe_Email').setAttribute('index', index);
}

document.getElementById('XacNhan_btn').addEventListener('click', (e) => {
    const _Flight_fromDB = structuredClone(Flight_fromDB);
    delete _Flight_fromDB.GheTrong;
    delete _Flight_fromDB.VeDaDat;
    SendForm(_Flight_fromDB);
});

function SendForm(_Flight_fromDB) {
    document.getElementById('Flight_Edit').value = JSON.stringify(_Flight_fromDB);
    var staff_form = document.forms['staff-form'];
    staff_form.action = '/staff/flightdetail/editdetail';
    staff_form.submit();
}
