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

let Package;
let SanBays_P_Update = [];
let SanBays_P_Add = [];
let HangGhes_P_Update = [];
let HangGhes_P_Add = [];
let LoaiKhachHangs_P_Update = [];
let LoaiKhachHangs_P_Add = [];
let ThamSos_P_Update = [];
// Load dữ liệu cho màn hình
if (!Package) {
    LoadInformation();
}
function LoadInformation() {
    axios({
        method: 'POST',
        url: '/staff/quydinh/LoadRegulation',
    }).then((res) => {
        Package = res.data;
        ThamSos_P_Update = structuredClone(Package.ThamSos);
        SanBays_P_Update = structuredClone(Package.SanBays);
        HangGhes_P_Update = structuredClone(Package.HangGhes);
        LoaiKhachHangs_P_Update = structuredClone(Package.LoaiKhachHangs);
        let SanBays = document.querySelectorAll('.SanBay');
        for (let i = 0; i < SanBays.length; i++) {
            SanBays[i].querySelector('.SanBay_DiaChi').value = Package.SanBays[i].MaTinhThanh;
            let SanBay_TrangThai = SanBays[i].querySelector('.SanBay_TrangThai');
            if (Package.SanBays[i].TrangThai == 'HoatDong') {
                SanBay_TrangThai.value = 1;
                SanBay_TrangThai.classList.remove('text-danger');
                SanBay_TrangThai.classList.add('text-success-light');
            } else {
                SanBay_TrangThai.value = 2;
                SanBay_TrangThai.classList.remove('text-success-light');
                SanBay_TrangThai.classList.add('text-danger');
            }
        }
        let HangGhes = document.querySelectorAll('.HangGhe');
        for (let i = 0; i < HangGhes.length; i++) {
            let HangGhe_TrangThai = HangGhes[i].querySelector('.HangGhe_TrangThai');
            if (Package.HangGhes[i].TrangThai == 'ApDung') {
                HangGhe_TrangThai.classList.remove('text-danger');
                HangGhe_TrangThai.classList.add('text-success-light');
                HangGhe_TrangThai.value = 1;
            } else {
                HangGhe_TrangThai.value = 2;
                HangGhe_TrangThai.classList.remove('text-success-light');
                HangGhe_TrangThai.classList.add('text-danger');
            }
        }
        let MocHanhLys = document.querySelectorAll('.MocHanhLy');
        for (let i = 0; i < MocHanhLys.length; i++) {
            MocHanhLys[i].querySelector('.MocHanhLy_GiaTien').value = numberWithDot(
                MocHanhLys[i].querySelector('.MocHanhLy_GiaTien').value,
            );
            MocHanhLys[i].querySelector('.MocHanhLy_GiaTien').addEventListener('keyup', (e) => {
                e.target.value = formatVND(e.target.value);
            });
            MocHanhLys[i].querySelector('.MocHanhLy_GiaTien').addEventListener('blur', (e) => {
                if (e.target.value == '') e.target.value = 0;
                if (e.target.value.replace('.', '').length >= 20) {
                    showToast({
                        header: 'Thông tin mốc hành lý ',
                        body: 'Số tiền quá lớn',
                        duration: 5000,
                        type: 'warning',
                    });
                    e.target.value = 0;
                    e.target.focus();
                }
            });
            MocHanhLys[i].querySelector('.MocHanhLy_SoKgToiDa').addEventListener('blur', (e) => {
                if (e.target.value == '') e.target.value = Package.MocHanhLys[i].SoKgToiDa;
                if (e.target.value > 1000) {
                    showToast({
                        header: 'Thông tin mốc hành lý ',
                        body: 'Số kg tối đa phải nhỏ hơn 1000Kg',
                        duration: 5000,
                        type: 'warning',
                    });
                    e.target.value = Package.MocHanhLys[i].SoKgToiDa;
                    e.target.focus();
                }
            });
        }
        let temp = {};
        //1<>2
        temp = Package.ThamSos[1];
        Package.ThamSos[1] = Package.ThamSos[2];
        Package.ThamSos[2] = temp;
        //5<>0
        temp = Package.ThamSos[5];
        Package.ThamSos[5] = Package.ThamSos[0];
        Package.ThamSos[0] = temp;
        //1<>8
        temp = Package.ThamSos[1];
        Package.ThamSos[1] = Package.ThamSos[8];
        Package.ThamSos[8] = temp;
        //4<>3
        temp = Package.ThamSos[4];
        Package.ThamSos[4] = Package.ThamSos[3];
        Package.ThamSos[3] = temp;
        let ThamSos = document.querySelectorAll('.ThamSo');
        //Load thông tin bảng tham số
        for (let i = 0; i < ThamSos.length; i++) {
            if (i == 0 || i == 1 || i == 2 || i == 3) {
                let Currentday = new Date();
                let NgayHieuLuc = new Date(Package.ThamSos[i].NgayHieuLuc);
                let NgayMin = new Date(Currentday.getTime() + 2 * (24 * 60 * 60 * 1000));
                let NgayMax = new Date(Currentday.getTime() + Package.ThamSos[10].GiaTri * (24 * 60 * 60 * 1000));
                let Ngay = ThamSos[i].querySelector('.ThamSo_NgayHieuLuc');

                NgayHieuLuc =
                    NgayHieuLuc.getFullYear() +
                    '-' +
                    ('0' + (NgayHieuLuc.getMonth() + 1)).slice(-2) +
                    '-' +
                    ('0' + NgayHieuLuc.getDate()).slice(-2);
                NgayMin =
                    NgayMin.getFullYear() +
                    '-' +
                    ('0' + (NgayMin.getMonth() + 1)).slice(-2) +
                    '-' +
                    ('0' + NgayMin.getDate()).slice(-2);
                NgayMax =
                    NgayMax.getFullYear() +
                    '-' +
                    ('0' + (NgayMax.getMonth() + 1)).slice(-2) +
                    '-' +
                    ('0' + NgayMax.getDate()).slice(-2);
                Ngay.setAttribute('min', NgayMin);
                Ngay.setAttribute('max', NgayMax);
                ThamSos[i].querySelector('.ThamSo_NgayHieuLuc').value = NgayHieuLuc;
            }
            if (i == 2 || i == 4) {
                ThamSos[i].querySelector('.ThamSo_TenHienThi').innerText = Package.ThamSos[i].TenHienThi;
                ThamSos[i].querySelector('.ThamSo_GiaTri').value = formatVND(Package.ThamSos[i].GiaTri.toString());
                ThamSos[i].querySelector('.ThamSo_GiaTri').addEventListener('keyup', (e) => {
                    e.target.value = formatVND(e.target.value);
                });
            } else {
                ThamSos[i].querySelector('.ThamSo_TenHienThi').innerText = Package.ThamSos[i].TenHienThi;
                ThamSos[i].querySelector('.ThamSo_GiaTri').value = Package.ThamSos[i].GiaTri;
            }
        }
    });
}
window.onlyNumber = onlyNumber;
//
// Js in ThamSo
//
const ThamSo_CapNhat = document.querySelector('.ThamSo--CapNhat');
const ThamSo_Huy = document.querySelector('.ThamSo--Huy');
const ThamSo_Sua = document.querySelector('.ThamSo--Sua');
const ThamSo_GiaTri = document.querySelectorAll('.ThamSo_GiaTri');
const ThamSos = document.querySelectorAll('.ThamSo');
const ThamSo_NgayHieuLuc = document.querySelectorAll('.ThamSo_NgayHieuLuc');

//button ThamSo--Huy
ThamSo_Huy.addEventListener('click', (e) => {
    //trả gtr về ban đàu
    for (let i = 0; i < ThamSo_GiaTri.length; i++) {
        if (i == 0 || i == 1 || i == 3 || i == 2) {
            let NgayHieuLuc = new Date(Package.ThamSos[i].NgayHieuLuc);
            let a = NgayHieuLuc.getMonth();
            NgayHieuLuc =
                NgayHieuLuc.getFullYear() +
                '-' +
                ('0' + (NgayHieuLuc.getMonth() + 1)).slice(-2) +
                '-' +
                ('0' + NgayHieuLuc.getDate()).slice(-2);
            ThamSos[i].querySelector('.ThamSo_NgayHieuLuc').value = NgayHieuLuc;
            ThamSos[i].querySelector('.ThamSo_NgayHieuLuc').disabled = true;
        }
        if (i == 2 || i == 4) {
            ThamSo_GiaTri[i].value = formatVND(Package.ThamSos[i].GiaTri.toString());
            ThamSo_GiaTri[i].disabled = true;
        } else {
            ThamSo_GiaTri[i].value = Package.ThamSos[i].GiaTri;
            ThamSo_GiaTri[i].disabled = true;
        }
    }
    ThamSo_Sua.classList.remove('d-none');
    ThamSo_CapNhat.classList.add('d-none');
    ThamSo_Huy.classList.add('d-none');
});

//Button_ThamSo--Sua
ThamSo_Sua.addEventListener('click', (e) => {
    for (let i = 0; i < ThamSo_GiaTri.length; i++) {
        if (i == 0 || i == 1 || i == 2 || i == 3) {
            ThamSos[i].querySelector('.ThamSo_NgayHieuLuc').disabled = false;
        }
        ThamSo_GiaTri[i].disabled = false;
    }
    ThamSo_Sua.classList.add('d-none');
    ThamSo_CapNhat.classList.remove('d-none');
    ThamSo_Huy.classList.remove('d-none');
});

let FlagGT = false;
let FlagNHL = false;
//Kiểm tra tham số sự thay đổi
for (let i = 0; i < ThamSos.length; i++) {
    ThamSo_GiaTri[i].addEventListener('blur', (e) => {
        if (e.target.value == '') {
            showToast({
                header: 'Quy định chuyến bay',
                body: Package.ThamSos[i].TenHienThi + ' không được để trống',
                duration: 5000,
                type: 'warning',
            });
            e.target.value = Package.ThamSos[i].GiaTri;
            e.target.focus();
            return;
        }
        if (e.target.value == '0') {
            showToast({
                header: 'Quy định chuyến bay',
                body: Package.ThamSos[i].TenHienThi + ' phải khác 0',
                duration: 5000,
                type: 'warning',
            });
            e.target.value = Package.ThamSos[i].GiaTri;
            e.target.focus();
            return;
        }
        if (e.target.length > 9) {
            e.target.value = Package.ThamSos[i].GiaTri;
            e.target.focus();
            return;
        }
        //giá trị thứ 10 thay đổi thì cập nhật lại ngày hiển thị
        if (e.target.value != Package.ThamSos[i].GiaTri) {
            ThamSos_P_Update[i].ID_Update = 1;
            FlagGT = true;
            ThamSos_P_Update[i].GiaTri = e.target.value;
        }
    });
    ThamSo_NgayHieuLuc[i].addEventListener('change', (e) => {
        if (e.target.value == '') {
            showToast({
                header: 'Quy định chuyến bay',
                body: 'Ngày hiệu lực của' + Package.ThamSos[i].TenHienThi + ' không được để trống',
                duration: 5000,
                type: 'warning',
            });
            let NgayHieuLuc = new Date(Package.ThamSos[i].NgayHieuLuc);
            NgayHieuLuc =
                NgayHieuLuc.getFullYear() +
                '-' +
                ('0' + (NgayHieuLuc.getMonth() + 1)).slice(-2) +
                '-' +
                ('0' + NgayHieuLuc.getDate()).slice(-2);
            e.target.value = NgayHieuLuc;
            e.target.focus();
            return;
        }
        ThamSos_P_Update[i].ID_Update = 1;
        FlagNHL = true;
        ThamSos_P_Update[i].NgayHieuLuc = e.target.value;
    });
}

//Cập nhật thông tin
function CapNhat_ThamSo() {
    let P_ThamSo = [];
    for (let i = 0; i < ThamSo_GiaTri.length; i++) {
        P_ThamSo[i] = ThamSo_GiaTri[i].value;
    }
    if (CheckChangeGiaTriThamSo(P_ThamSo) == false) return;
    let temp = P_ThamSo[0];
    P_ThamSo[0] = P_ThamSo[4];
    P_ThamSo[4] = temp;
    temp = P_ThamSo[1];
    P_ThamSo[1] = P_ThamSo[6];
    P_ThamSo[6] = temp;
    //sửa thành sendform
    axios({
        method: 'POST',
        url: '/staff/quydinh/UpdateThamSo',
        data: P_ThamSo,
    }).then((res) => {
        Package.ThamSos = structuredClone(res.data);
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
        ThamSo_Huy.classList.add('d-none');
    });
}

// button_ThamSo_CapNhat
ThamSo_CapNhat.addEventListener('click', (e) => {
    if (FlagGT == false && FlagNHL == false) {
        showToast({
            header: 'Quy định chuyến bay',
            body: 'Không có sự thay đổi',
            duration: 5000,
            type: '',
        });
        for (let i = 0; i < ThamSo_GiaTri.length; i++) {
            ThamSo_GiaTri[i].disabled = true;
            if (i == 0 || i == 1 || i == 2 || i == 3) {
                ThamSo_NgayHieuLuc[i].disabled = true;
            }
        }
        ThamSo_Sua.classList.remove('d-none');
        ThamSo_CapNhat.classList.add('d-none');
        ThamSo_Huy.classList.add('d-none');
        return;
    }
});

//
// Js in SanBay
//

//nút sửa sân bay
let SanBays = document.querySelectorAll('.SanBay');
document.querySelector('.SanBay--Sua').addEventListener('click', (e) => {
    for (let i = 0; i < SanBays.length; i++) {
        SanBays[i].querySelector('.SanBay_Ten').disabled = false;
        SanBays[i].querySelector('.SanBay_DiaChi').disabled = false;
        SanBays[i].querySelector('.SanBay_TrangThai').disabled = false;
    }
    e.target.classList.add('d-none');
    document.querySelector('.SanBay--Them').classList.remove('d-none');
    document.querySelector('.SanBay--CapNhat').classList.remove('d-none');
    document.querySelector('.SanBay--Huy').classList.remove('d-none');
});

//nút hủy cập nhật sân bay
document.querySelector('.SanBay--Huy').addEventListener('click', (e) => {
    const SanBays_New = document.querySelectorAll('.SanBay_New');
    for (let i = 0; i < SanBays_New.length; i++) {
        document.querySelector('.SanBay_Card').removeChild(SanBays_New[i]);
    }
    for (let i = 0; i < SanBays_P_Update.length; i++) {
        if (SanBays_P_Update[i].ID_Update == 1) {
            SanBays[i].querySelector('.SanBay_Ma').value = Package.SanBays[i].MaSanBay;
            SanBays[i].querySelector('.SanBay_Ten').value = Package.SanBays[i].TenSanBay;
            SanBays[i].querySelector('.SanBay_DiaChi').value = Package.SanBays[i].MaTinhThanh;
            let SanBay_TrangThai = SanBays[i].querySelector('.SanBay_TrangThai');
            if (Package.SanBays[i].TrangThai == 'HoatDong') {
                SanBay_TrangThai.value = 1;
                SanBay_TrangThai.classList.remove('text-danger');
                SanBay_TrangThai.classList.add('text-success-light');
            } else {
                SanBay_TrangThai.value = 2;
                SanBay_TrangThai.classList.add('text-danger');
                SanBay_TrangThai.classList.remove('text-success-light');
            }
        }
    }
    SanBays_P_Update = structuredClone(Package.SanBays);
    F_SanBay_Updated = false;
    for (let i = 0; i < SanBays.length; i++) {
        SanBays[i].querySelector('.SanBay_Ten').disabled = true;
        SanBays[i].querySelector('.SanBay_Ma').disabled = true;
        SanBays[i].querySelector('.SanBay_DiaChi').disabled = true;
        SanBays[i].querySelector('.SanBay_TrangThai').disabled = true;
    }
    document.querySelector('.SanBay--Them').classList.add('d-none');
    document.querySelector('.SanBay--CapNhat').classList.add('d-none');
    e.target.classList.add('d-none');
    document.querySelector('.SanBay--Sua').classList.remove('d-none');
});

//Nút thêm sân bay
document.querySelector('.SanBay--Them').addEventListener('click', (e) => {
    const SanBay = document.querySelector('.SanBay_Cop').cloneNode(true);
    SanBay.classList.remove('d-none');
    SanBay.classList.remove('SanBay_Cop');
    SanBay.classList.add('SanBay_New');
    document.querySelector('.SanBay_Card').appendChild(SanBay);
    SanBay.querySelector('.SanBay_Ma').focus();
    //Nút xóa sân bay
    SanBay.querySelector('.SanBay_Cop--Xoa').addEventListener('click', (e) => {
        document.querySelector('.SanBay_Card').removeChild(e.target.closest('.SanBay_New'));
    });
    SanBay.querySelector('.SanBay_Ten').addEventListener('keyup', (e) => {
        let p = e.target.selectionStart;
        e.target.value = toUpperCaseString(e.target.value);
        e.target.setSelectionRange(p, p);
    });
    SanBay.querySelector('.SanBay_TrangThai').addEventListener('change', (e) => {
        if (e.target.selectedIndex == 0) {
            e.target.classList.remove('text-danger');
            e.target.classList.add('text-success-light');
        } else {
            e.target.classList.remove('text-success-light');
            e.target.classList.add('text-danger');
        }
    });
});

//Nút tìm kiếm
document.querySelector('.SanBay_input--Search').addEventListener('keyup', (e) => {
    let search = document.querySelector('.SanBay_input--Search').value.toString().toUpperCase();
    if (search === 'HOẠT ĐỘNG') {
        for (let i = 0; i < SanBays.length; i++) {
            if (SanBays[i].querySelector('.SanBay_TrangThai').value == 2) {
                SanBays[i].classList.add('d-none');
            }
        }
    } else {
        for (let i = 0; i < SanBays.length; i++) {
            let SanBay_Ma = SanBays[i].querySelector('.SanBay_Ma').value.toString().toUpperCase();
            let SanBay_Ten = SanBays[i].querySelector('.SanBay_Ten').value.toString().toUpperCase();
            let valueTinhThanh = SanBays[i].querySelector('.SanBay_DiaChi').options.selectedIndex;
            let valueTrangThai = SanBays[i].querySelector('.SanBay_TrangThai').options.selectedIndex;

            let SanBay_DiaChi = SanBays[i].querySelector('.SanBay_DiaChi').options[valueTinhThanh].text.toUpperCase();
            let SanBay_TrangThai = SanBays[i]
                .querySelector('.SanBay_TrangThai')
                .options[valueTrangThai].text.toUpperCase();
            if (
                SanBay_Ma.includes(search) == false &&
                SanBay_Ten.includes(search) == false &&
                SanBay_DiaChi.includes(search) == false &&
                SanBay_TrangThai.includes(search) == false
            ) {
                SanBays[i].classList.add('d-none');
            } else SanBays[i].classList.remove('d-none');
        }
    }
});

let F_SanBay_Updated = false; // biến kiểm tra cập nhật của sân bay
// kiểm tra sự thay đổi
for (let i = 0; i < SanBays.length; i++) {
    SanBays[i].querySelector('.SanBay_TrangThai').addEventListener('change', (e) => {
        if (e.target.selectedIndex == 0) {
            e.target.classList.remove('text-danger');
            e.target.classList.add('text-success-light');
            SanBays_P_Update[i].ID_Update = 1;
            SanBays_P_Update[i].TrangThai = 'HoatDong';
            F_SanBay_Updated = true;
        } else {
            e.target.classList.remove('text-success-light');
            e.target.classList.add('text-danger');
            SanBays_P_Update[i].ID_Update = 1;
            SanBays_P_Update[i].TrangThai = 'NgungHoatDong';
            F_SanBay_Updated = true;
        }
    });
    SanBays[i].querySelector('.SanBay_Ten').addEventListener('blur', (e) => {
        if (e.target.value == '') {
            showToast({
                header: 'Sân bay có mã: ' + Package.SanBays[i].MaSanBay,
                body: 'Tên sân bay không được để trống',
                duration: 5000,
                type: 'warning',
            });
            e.target.value = Package.SanBays[i].TenSanBay;
            e.target.focus();
            return;
        }
        if (e.target.value != Package.SanBays[i].TenSanBay) {
            SanBays_P_Update[i].ID_Update = 1;
            SanBays_P_Update[i].TenSanBay = e.target.value;
            F_SanBay_Updated = true;
        }
    });
    SanBays[i].querySelector('.SanBay_DiaChi').addEventListener('blur', (e) => {
        if (e.target.value != Package.SanBays[i].MaTinhThanh) {
            SanBays_P_Update[i].ID_Update = 1;
            SanBays_P_Update[i].MaTinhThanh = e.target.value;
            F_SanBay_Updated = true;
        }
    });
}
//Cập nhật Sân bay
// Viết hoa chữ cái đầu
for (let i = 0; i < SanBays.length; i++) {
    SanBays[i].querySelector('.SanBay_Ten').addEventListener('keyup', (e) => {
        let p = e.target.selectionStart;
        e.target.value = toUpperCaseString(e.target.value);
        e.target.setSelectionRange(p, p);
    });
}
function toUpperCaseString(string) {
    string = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    for (let j = 1; j < string.length; j++) {
        if (string.charAt(j - 1) === ' ') {
            string = string.slice(0, j - 1) + ' ' + string.charAt(j).toUpperCase() + string.slice(j + 1).toLowerCase();
        }
    }
    return string;
}

//Load sân bay
function LoadSanBay() {
    let SanBays = document.querySelectorAll('.SanBay');
    for (let i = 0; i < SanBays.length; i++) {
        SanBays[i].querySelector('.SanBay_Ten').value = Package.SanBays[i].TenSanBay;
        SanBays[i].querySelector('.SanBay_Ma').value = Package.SanBays[i].MaSanBay;
        SanBays[i].querySelector('.SanBay_DiaChi').value = Package.SanBays[i].MaTinhThanh;
        let SanBay_TrangThai = SanBays[i].querySelector('.SanBay_TrangThai');
        if (Package.SanBays[i].TrangThai == 'HoatDong') {
            SanBay_TrangThai.value = 1;
            SanBay_TrangThai.classList.remove('text-danger');
            SanBay_TrangThai.classList.add('text-success-light');
        } else {
            SanBay_TrangThai.value = 2;
            SanBay_TrangThai.classList.add('text-danger');
            SanBay_TrangThai.classList.remove('text-success-light');
        }
    }
}

document.querySelector('.SanBay--CapNhat').addEventListener('click', (e) => {
    SanBays_P_Add = [];
    let SoSanBayUPdate = 0;
    const SanBays_New = document.querySelectorAll('.SanBay_New');
    // kiểm tra thông tin vào
    for (let i = 0; i < SanBays_New.length; i++) {
        // kiểm tra mã sân bay ( không trống)
        if (SanBays_New[i].querySelector('.SanBay_Ma').value == '') {
            showToast({
                header: 'Thêm sân bay mới',
                body: 'Mã sân bay không được để trống',
                duration: 5000,
                type: 'warning',
            });
            SanBays_New[i].querySelector('.SanBay_Ma').focus();
            return;
        }
        // kiểm tra mã sân bay ( không trùng)
        for (let j = 0; j < Package.SanBays.length; j++) {
            if (SanBays_New[i].querySelector('.SanBay_Ma').value == Package.SanBays[j].MaSanBay) {
                showToast({
                    header: 'Thêm sân bay mới',
                    body: 'Mã sân bay ' + Package.SanBays[j].MaSanBay + ' đã tồn tại',
                    duration: 5000,
                    type: 'warning',
                });
                SanBays_New[i].querySelector('.SanBay_Ma').value = '';
                SanBays_New[i].querySelector('.SanBay_Ma').focus();
                return;
            }
        }
        // kiểm tra tên sân bay ( không trống)
        if (SanBays_New[i].querySelector('.SanBay_Ten').value == '') {
            showToast({
                header: 'Thêm sân bay mới',
                body: 'Tên sân bay không được để trống',
                duration: 5000,
                type: 'warning',
            });
            SanBays_New[i].querySelector('.SanBay_Ten').focus();
            return;
        }
        // kiểm tra địa chỉ ( không trống)
        if (SanBays_New[i].querySelector('.SanBay_DiaChi').value == '') {
            showToast({
                header: 'Thêm sân bay mới',
                body: 'Địa chỉ không được để trống',
                duration: 5000,
                type: 'warning',
            });
            SanBays_New[i].querySelector('.SanBay_DiaChi').focus();
            return;
        }
        // Add thông tin sân bay mới vô gói Package
        SanBays_P_Add.push({
            MaSanBay: SanBays_New[i].querySelector('.SanBay_Ma').value,
            TenSanBay: SanBays_New[i].querySelector('.SanBay_Ten').value,
            MaTinhThanh: SanBays_New[i].querySelector('.SanBay_DiaChi').value,
            TrangThai: SanBays_New[i].querySelector('.SanBay_TrangThai').value == 1 ? 'HoatDong' : 'NgungHoatDong',
        });
    }
    //Đếm sân bay thay đổi
    for (let i = 0; i < SanBays_P_Update.length; i++) {
        if (SanBays_P_Update[i].ID_Update == 1) SoSanBayUPdate++;
    }
    if (F_SanBay_Updated == true || SanBays_New.length > 0) {
        if (F_SanBay_Updated == true || SanBays_New.length > 0) {
            let SanBays_P = {};
            SanBays_P.SanBays_P_Update = structuredClone(SanBays_P_Update);
            SanBays_P.SanBays_P_Add = structuredClone(SanBays_P_Add);
            console.log(SanBays_P);
            // chuyển trạng thái sang sửa
            SanBays[0].querySelector('.SanBay_Ten').focus();
            for (let i = 0; i < SanBays_New.length; i++) {
                SanBays_New[i].querySelector('.SanBay_Ma').disabled = true;
                SanBays_New[i].querySelector('.SanBay_Ten').disabled = true;
                SanBays_New[i].querySelector('.SanBay_DiaChi').disabled = true;
                SanBays_New[i].querySelector('.SanBay_TrangThai').disabled = true;
                SanBays_New[i].querySelector('.SanBay_Cop--Xoa').classList.add('d-none');
                SanBays_New[i].classList.remove('SanBay_New');
                SanBays_New[i].classList.add('SanBay');
            }
            SanBays = document.querySelectorAll('.SanBay');
            for (let i = 0; i < SanBays.length; i++) {
                SanBays[i].querySelector('.SanBay_Ten').disabled = true;
                SanBays[i].querySelector('.SanBay_Ma').disabled = true;
                SanBays[i].querySelector('.SanBay_DiaChi').disabled = true;
                SanBays[i].querySelector('.SanBay_TrangThai').disabled = true;
            }
            document.querySelector('.SanBay--Them').classList.add('d-none');
            document.querySelector('.SanBay--Huy').classList.add('d-none');
            e.target.classList.add('d-none');
            document.querySelector('.SanBay--Sua').classList.remove('d-none');
            axios({
                method: 'POST',
                url: '/staff/quydinh/UpdateSanBay',
                data: SanBays_P,
            }).then((res) => {
                Package.SanBays = res.data;
                LoadSanBay();
                //    hiển thị thông báo cập nhật thành công
                document.querySelector('.SanBay--CapNhat').focus();
                if (F_SanBay_Updated == true) {
                    showToast({
                        header: 'Thông tin sân bay',
                        body: 'Đã cập nhật thành công ' + SoSanBayUPdate + ' sân bay',
                        duration: 5000,
                        type: 'success',
                    });
                }
                if (SanBays_New.length > 0) {
                    showToast({
                        header: 'Thông tin sân bay',
                        body: 'Đã thêm thành công ' + SanBays_New.length + ' sân bay',
                        duration: 5000,
                        type: 'success',
                    });
                }
                SanBays_P_Update = structuredClone(Package.SanBays);
                F_SanBay_Updated = false;
            });
        }
    } else {
        for (let i = 0; i < SanBays.length; i++) {
            SanBays[i].querySelector('.SanBay_Ten').disabled = true;
            SanBays[i].querySelector('.SanBay_Ma').disabled = true;
            SanBays[i].querySelector('.SanBay_DiaChi').disabled = true;
            SanBays[i].querySelector('.SanBay_TrangThai').disabled = true;
        }
        document.querySelector('.SanBay--Them').classList.add('d-none');
        document.querySelector('.SanBay--Huy').classList.add('d-none');
        e.target.classList.add('d-none');
        document.querySelector('.SanBay--Sua').classList.remove('d-none');
        showToast({
            header: 'Thông tin sân bay',
            body: 'Không có sự thay đổi',
            duration: 5000,
            type: '',
        });
    }
});

//
//js in HangGhe
//

let HangGhes = document.querySelectorAll('.HangGhe');
// Nút sửa hạng ghế
document.querySelector('.HangGhe--Sua').addEventListener('click', (e) => {
    for (let i = 0; i < HangGhes.length; i++) {
        HangGhes[i].querySelector('.HangGhe_Ten').disabled = false;
        HangGhes[i].querySelector('.HangGhe_HeSo').disabled = false;
        HangGhes[i].querySelector('.HangGhe_TrangThai').disabled = false;
    }
    e.target.classList.add('d-none');
    document.querySelector('.HangGhe--Them').classList.remove('d-none');
    document.querySelector('.HangGhe--CapNhat').classList.remove('d-none');
    document.querySelector('.HangGhe--Huy').classList.remove('d-none');
});

// Nút thêm hạng ghế
document.querySelector('.HangGhe--Them').addEventListener('click', (e) => {
    const HangGhe = document.querySelector('.HangGhe_Cop').cloneNode(true);
    HangGhe.classList.remove('d-none');
    HangGhe.classList.remove('HangGhe_Cop');
    HangGhe.classList.add('HangGhe_New');
    document.querySelector('.HangGhe_Card').appendChild(HangGhe);
    HangGhe.querySelector('.HangGhe_Ma').focus();
    //Nút xóa HangGhe
    HangGhe.querySelector('.HangGhe_Cop--Xoa').addEventListener('click', (e) => {
        document.querySelector('.HangGhe_Card').removeChild(e.target.closest('.HangGhe_New'));
    });
    HangGhe.querySelector('.HangGhe_Ten').addEventListener('keyup', (e) => {
        let p = e.target.selectionStart;
        e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase();
        e.target.setSelectionRange(p, p);
    });
    HangGhe.querySelector('.HangGhe_Ma').addEventListener('keyup', (e) => {
        let p = e.target.selectionStart;
        e.target.value = toUpperCaseString(e.target.value);
        e.target.setSelectionRange(p, p);
    });
    HangGhe.querySelector('.HangGhe_TrangThai').addEventListener('change', (e) => {
        if (e.target.selectedIndex === 0) {
            e.target.classList.remove('text-danger');
            e.target.classList.add('text-success-light');
        } else {
            e.target.classList.remove('text-success-light');
            e.target.classList.add('text-danger');
        }
    });
    HangGhe.querySelector('.HangGhe_HeSo').addEventListener('blur', (e) => {
        e.target.value = parseFloat(e.target.value).toFixed(2);
        if (parseFloat(e.target.value) > 99.99) {
            e.target.value = 99.99;
        }
    });
});

// Nút tìm kiếm hạng ghế
document.querySelector('.HangGhe_input--Search').addEventListener('keyup', (e) => {
    let search = document.querySelector('.HangGhe_input--Search').value.toString().toUpperCase();
    if (search === 'ÁP DỤNG') {
        for (let i = 0; i < HangGhes.length; i++) {
            if (HangGhes[i].querySelector('.HangGhe_TrangThai').value == 2) {
                HangGhes[i].classList.add('d-none');
            }
        }
    } else {
        for (let i = 0; i < HangGhes.length; i++) {
            let HangGhe_Ma = HangGhes[i].querySelector('.HangGhe_Ma').value.toString().toUpperCase();
            let HangGhe_Ten = HangGhes[i].querySelector('.HangGhe_Ten').value.toString().toUpperCase();
            let valueTrangThai = HangGhes[i].querySelector('.HangGhe_TrangThai').options.selectedIndex;

            let HangGhe_HeSo = HangGhes[i].querySelector('.HangGhe_HeSo').value.toString().toUpperCase();
            let HangGhe_TrangThai = HangGhes[i]
                .querySelector('.HangGhe_TrangThai')
                .options[valueTrangThai].text.toUpperCase();
            if (
                HangGhe_Ma.includes(search) == false &&
                HangGhe_Ten.includes(search) == false &&
                HangGhe_HeSo.includes(search) == false &&
                HangGhe_TrangThai.includes(search) == false
            ) {
                HangGhes[i].classList.add('d-none');
            } else HangGhes[i].classList.remove('d-none');
        }
    }
});

// kiểm tra sự thay đổi
let F_HangGhe_Updated = false;
for (let i = 0; i < HangGhes.length; i++) {
    HangGhes[i].querySelector('.HangGhe_TrangThai').addEventListener('change', (e) => {
        if (e.target.selectedIndex === 0) {
            e.target.classList.remove('text-danger');
            e.target.classList.add('text-success-light');
            HangGhes_P_Update[i].ID_Update = 1;
            HangGhes_P_Update[i].TrangThai = 'ApDung';
            F_HangGhe_Updated = true;
        } else {
            e.target.classList.remove('text-success-light');
            e.target.classList.add('text-danger');
            HangGhes_P_Update[i].ID_Update = 1;
            HangGhes_P_Update[i].TrangThai = 'NgungApDung';
            F_HangGhe_Updated = true;
        }
    });
    HangGhes[i].querySelector('.HangGhe_Ten').addEventListener('blur', (e) => {
        if (e.target.value == '') {
            showToast({
                header: 'Hạng ghế có mã: ' + Package.HangGhes[i].MaHangGhe,
                body: 'Tên hạng ghế không được để trống',
                duration: 5000,
                type: 'warning',
            });
            e.target.value = Package.HangGhes[i].TenHangGhe;
            e.target.focus();
            return;
        }
        if (e.target.value != Package.HangGhes[i].TenHangGhe) {
            HangGhes_P_Update[i].ID_Update = 1;
            HangGhes_P_Update[i].TenHangGhe = e.target.value;
            F_HangGhe_Updated = true;
        }
    });
    HangGhes[i].querySelector('.HangGhe_HeSo').addEventListener('blur', (e) => {
        if (e.target.value == '') {
            showToast({
                header: 'Hạng ghế có mã: ' + Package.HangGhes[i].MaHangGhe,
                body: 'Hệ số không được để trống',
                duration: 5000,
                type: 'warning',
            });
            e.target.value = Package.HangGhes[i].HeSo;
            e.target.focus();
            return;
        }
        if (parseFloat(e.target.value) == 0) {
            showToast({
                header: 'Hạng ghế có mã: ' + Package.HangGhes[i].MaHangGhe,
                body: 'Hệ số phải khác 0',
                duration: 5000,
                type: 'warning',
            });
            e.target.value = Package.HangGhes[i].HeSo;
            e.target.focus();
            return;
        }
        if (parseFloat(e.target.value) > 99.99) {
            e.target.value = 99.99;
        } else {
            if (e.target.value == parseFloat(parseFloat(e.target.value).toFixed(2))) {
                e.target.value = parseFloat(e.target.value).toFixed(2);
            } else {
                e.target.value = parseFloat(e.target.value).toFixed(2);
            }
        }
        if (e.target.value != Package.HangGhes[i].HeSo) {
            HangGhes_P_Update[i].ID_Update = 1;
            HangGhes_P_Update[i].HeSo = e.target.value;
            F_HangGhe_Updated = true;
        }
    });
}

// Nút hủy cập nhật hạng ghế
document.querySelector('.HangGhe--Huy').addEventListener('click', (e) => {
    const HangGhes_New = document.querySelectorAll('.HangGhe_New');
    for (let i = 0; i < HangGhes_New.length; i++) {
        document.querySelector('.HangGhe_Card').removeChild(HangGhes_New[i]);
    }
    for (let i = 0; i < HangGhes_P_Update.length; i++) {
        if (HangGhes_P_Update[i].ID_Update == 1) {
            HangGhes[i].querySelector('.HangGhe_Ma').value = Package.HangGhes[i].MaHangGhe;
            HangGhes[i].querySelector('.HangGhe_Ten').value = Package.HangGhes[i].TenHangGhe;
            HangGhes[i].querySelector('.HangGhe_HeSo').value = Package.HangGhes[i].HeSo;
            let HangGhe_TrangThai = HangGhes[i].querySelector('.HangGhe_TrangThai');
            if (Package.HangGhes[i].TrangThai == 'ApDung') {
                HangGhe_TrangThai.value = 1;
                HangGhe_TrangThai.classList.remove('text-danger');
                HangGhe_TrangThai.classList.add('text-success-light');
            } else {
                HangGhe_TrangThai.value = 2;
                HangGhe_TrangThai.classList.add('text-danger');
                HangGhe_TrangThai.classList.remove('text-success-light');
            }
        }
    }
    HangGhes_P_Update = structuredClone(Package.HangGhes);
    F_HangGhe_Updated = false;
    for (let i = 0; i < HangGhes.length; i++) {
        HangGhes[i].querySelector('.HangGhe_Ten').disabled = true;
        HangGhes[i].querySelector('.HangGhe_Ma').disabled = true;
        HangGhes[i].querySelector('.HangGhe_HeSo').disabled = true;
        HangGhes[i].querySelector('.HangGhe_TrangThai').disabled = true;
    }
    document.querySelector('.HangGhe--Them').classList.add('d-none');
    document.querySelector('.HangGhe--CapNhat').classList.add('d-none');
    e.target.classList.add('d-none');
    document.querySelector('.HangGhe--Sua').classList.remove('d-none');
});

//Load hạng ghế
function LoadHangGhe() {
    let HangGhes = document.querySelectorAll('.HangGhe');
    for (let i = 0; i < HangGhes.length; i++) {
        HangGhes[i].querySelector('.HangGhe_Ten').value = Package.HangGhes[i].TenHangGhe;
        HangGhes[i].querySelector('.HangGhe_Ma').value = Package.HangGhes[i].MaHangGhe;
        HangGhes[i].querySelector('.HangGhe_HeSo').value = Package.HangGhes[i].HeSo;
        let HangGhe_TrangThai = HangGhes[i].querySelector('.HangGhe_TrangThai');
        if (Package.HangGhes[i].TrangThai == 'ApDung') {
            HangGhe_TrangThai.value = 1;
            HangGhe_TrangThai.classList.remove('text-danger');
            HangGhe_TrangThai.classList.add('text-success-light');
        } else {
            HangGhe_TrangThai.value = 2;
            HangGhe_TrangThai.classList.add('text-danger');
            HangGhe_TrangThai.classList.remove('text-success-light');
        }
    }
}

// Cập nhật hạng ghế
document.querySelector('.HangGhe--CapNhat').addEventListener('click', (e) => {
    HangGhes_P_Add = [];
    let SoHangGheUPdate = 0;
    const HangGhes_New = document.querySelectorAll('.HangGhe_New');
    // kiểm tra thông tin vào
    for (let i = 0; i < HangGhes_New.length; i++) {
        // kiểm tra mã hạng ghế ( không trống)
        if (HangGhes_New[i].querySelector('.HangGhe_Ma').value == '') {
            showToast({
                header: 'Thêm hạng ghế mới',
                body: 'Mã hạng ghế không được để trống',
                duration: 5000,
                type: 'warning',
            });
            HangGhes_New[i].querySelector('.HangGhe_Ma').focus();
            return;
        }
        // kiểm tra mã hạng ghế ( không trùng)
        for (let j = 0; j < Package.HangGhes.length; j++) {
            if (HangGhes_New[i].querySelector('.HangGhe_Ma').value == Package.HangGhes[j].MaHangGhe) {
                showToast({
                    header: 'Thêm hạng ghế mới',
                    body: 'Mã hạng ghế ' + Package.HangGhes[j].MaHangGhe + ' đã tồn tại',
                    duration: 5000,
                    type: 'warning',
                });
                HangGhes_New[i].querySelector('.HangGhe_Ma').value = '';
                HangGhes_New[i].querySelector('.HangGhe_Ma').focus();
                return;
            }
        }
        // kiểm tra tên hạng ghế ( không trống)
        if (HangGhes_New[i].querySelector('.HangGhe_Ten').value == '') {
            showToast({
                header: 'Thêm hạng ghế mới',
                body: 'Tên hạng ghế không được để trống',
                duration: 5000,
                type: 'warning',
            });
            HangGhes_New[i].querySelector('.HangGhe_Ten').focus();
            return;
        }
        // kiểm tra Hệ số ( không trống, khac 0)
        if (HangGhes_New[i].querySelector('.HangGhe_HeSo').value == '') {
            showToast({
                header: 'Thêm hạng ghế mới',
                body: 'Hệ số không được để trống',
                duration: 5000,
                type: 'warning',
            });
            HangGhes_New[i].querySelector('.HangGhe_HeSo').focus();
            return;
        }
        if (parseFloat(HangGhes_New[i].querySelector('.HangGhe_HeSo').value) == 0) {
            showToast({
                header: 'Thêm hạng ghế mới',
                body: 'Hệ số phải khác 0',
                duration: 5000,
                type: 'warning',
            });
            HangGhes_New[i].querySelector('.HangGhe_HeSo').value = '';
            HangGhes_New[i].querySelector('.HangGhe_HeSo').focus();
            return;
        }
        // Add thông tin hạng ghế mới vô gói Package
        HangGhes_P_Add.push({
            MaHangGhe: HangGhes_New[i].querySelector('.HangGhe_Ma').value,
            TenHangGhe: HangGhes_New[i].querySelector('.HangGhe_Ten').value,
            HeSo: HangGhes_New[i].querySelector('.HangGhe_HeSo').value,
            TrangThai: HangGhes_New[i].querySelector('.HangGhe_TrangThai').value == 1 ? 'ApDung' : 'NgungApDung',
        });
    }
    //Đếm hạng ghế thay đổi
    for (let i = 0; i < HangGhes_P_Update.length; i++) {
        if (HangGhes_P_Update[i].ID_Update == 1) SoHangGheUPdate++;
    }
    if (F_HangGhe_Updated == true || HangGhes_New.length > 0) {
        if (F_HangGhe_Updated == true || HangGhes_New.length > 0) {
            let HangGhes_P = {};
            HangGhes_P.HangGhes_P_Update = structuredClone(HangGhes_P_Update);
            HangGhes_P.HangGhes_P_Add = structuredClone(HangGhes_P_Add);
            console.log(HangGhes_P);
            // chuyển trạng thái sang sửa
            HangGhes[0].querySelector('.HangGhe_Ten').focus();
            for (let i = 0; i < HangGhes_New.length; i++) {
                HangGhes_New[i].querySelector('.HangGhe_Ma').disabled = true;
                HangGhes_New[i].querySelector('.HangGhe_Ten').disabled = true;
                HangGhes_New[i].querySelector('.HangGhe_HeSo').disabled = true;
                HangGhes_New[i].querySelector('.HangGhe_TrangThai').disabled = true;
                HangGhes_New[i].querySelector('.HangGhe_Cop--Xoa').classList.add('d-none');
                HangGhes_New[i].classList.remove('HangGhe_New');
                HangGhes_New[i].classList.add('HangGhe');
            }
            HangGhes = document.querySelectorAll('.HangGhe');
            for (let i = 0; i < HangGhes.length; i++) {
                HangGhes[i].querySelector('.HangGhe_Ten').disabled = true;
                HangGhes[i].querySelector('.HangGhe_Ma').disabled = true;
                HangGhes[i].querySelector('.HangGhe_HeSo').disabled = true;
                HangGhes[i].querySelector('.HangGhe_TrangThai').disabled = true;
            }
            document.querySelector('.HangGhe--Them').classList.add('d-none');
            document.querySelector('.HangGhe--Huy').classList.add('d-none');
            e.target.classList.add('d-none');
            document.querySelector('.HangGhe--Sua').classList.remove('d-none');
            axios({
                method: 'POST',
                url: '/staff/quydinh/UpdateHangGhe',
                data: HangGhes_P,
            }).then((res) => {
                Package.HangGhes = res.data;
                LoadHangGhe();
                //    hiển thị thông báo cập nhật thành công
                document.querySelector('.HangGhe--CapNhat').focus();
                if (F_HangGhe_Updated == true) {
                    showToast({
                        header: 'Thông tin hạng ghế',
                        body: 'Đã cập nhật thành công ' + SoHangGheUPdate + ' hạng ghế',
                        duration: 5000,
                        type: 'success',
                    });
                }
                if (HangGhes_New.length > 0) {
                    showToast({
                        header: 'Thông tin hạng ghế',
                        body: 'Đã thêm thành công ' + HangGhes_New.length + ' hạng ghế',
                        duration: 5000,
                        type: 'success',
                    });
                }
                HangGhes_P_Update = structuredClone(Package.HangGhes);
                F_HangGhe_Updated = false;
            });
        }
    } else {
        for (let i = 0; i < HangGhes.length; i++) {
            HangGhes[i].querySelector('.HangGhe_Ten').disabled = true;
            HangGhes[i].querySelector('.HangGhe_Ma').disabled = true;
            HangGhes[i].querySelector('.HangGhe_HeSo').disabled = true;
            HangGhes[i].querySelector('.HangGhe_TrangThai').disabled = true;
        }
        document.querySelector('.HangGhe--Them').classList.add('d-none');
        document.querySelector('.HangGhe--Huy').classList.add('d-none');
        e.target.classList.add('d-none');
        document.querySelector('.HangGhe--Sua').classList.remove('d-none');
        showToast({
            header: 'Thông tin hạng ghế',
            body: 'Không có sự thay đổi',
            duration: 5000,
            type: '',
        });
    }
});

//
// Js in LoaiKhachHang
//

let LoaiKhachHangs = document.querySelectorAll('.LoaiKhachHang');
// Nút sửa loại khách hàng
document.querySelector('.LoaiKhachHang--Sua').addEventListener('click', (e) => {
    for (let i = 0; i < LoaiKhachHangs.length; i++) {
        LoaiKhachHangs[i].querySelector('.LoaiKhachHang_Ten').disabled = false;
        LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').disabled = false;
        LoaiKhachHangs[i].querySelector('.LoaiKhachHang_HeSo').disabled = false;
    }
    e.target.classList.add('d-none');
    document.querySelector('.LoaiKhachHang--Them').classList.remove('d-none');
    document.querySelector('.LoaiKhachHang--CapNhat').classList.remove('d-none');
    document.querySelector('.LoaiKhachHang--Huy').classList.remove('d-none');
});

// Nút thêm loại khách hàng
document.querySelector('.LoaiKhachHang--Them').addEventListener('click', (e) => {
    const LoaiKhachHang = document.querySelector('.LoaiKhachHang_Cop').cloneNode(true);
    LoaiKhachHang.classList.remove('d-none');
    LoaiKhachHang.classList.remove('LoaiKhachHang_Cop');
    LoaiKhachHang.classList.add('LoaiKhachHang_New');
    document.querySelector('.LoaiKhachHang--Them').classList.add('d-none');
    LoaiKhachHang.querySelector('.LoaiKhachHang_SoTuoiToiThieu').value =
        LoaiKhachHangs[LoaiKhachHangs.length - 1].querySelector('.LoaiKhachHang_SoTuoiToiDa').value;
    document.querySelector('.LoaiKhachHang_Card').appendChild(LoaiKhachHang);
    LoaiKhachHang.querySelector('.LoaiKhachHang_Ten').focus();
    //Nút xóa LoaiKhachHang
    LoaiKhachHang.querySelector('.LoaiKhachHang_Cop--Xoa').addEventListener('click', (e) => {
        document.querySelector('.LoaiKhachHang_Card').removeChild(e.target.closest('.LoaiKhachHang_New'));
        document.querySelector('.LoaiKhachHang--Them').classList.remove('d-none');
    });
    LoaiKhachHang.querySelector('.LoaiKhachHang_Ten').addEventListener('keyup', (e) => {
        let p = e.target.selectionStart;
        e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase();
        e.target.setSelectionRange(p, p);
    });
    LoaiKhachHang.querySelector('.LoaiKhachHang_HeSo').addEventListener('blur', (e) => {
        e.target.value = parseFloat(e.target.value).toFixed(2);
        if (parseFloat(e.target.value) > 99.99) {
            e.target.value = 99.99;
        }
    });
    LoaiKhachHang.querySelector('.LoaiKhachHang_SoTuoiToiDa').addEventListener('blur', (e) => {
        if (parseInt(e.target.value) > 200) e.target.value = 200;
    });
});

// Nút tìm kiếm loại khách hàng
document.querySelector('.LoaiKhachHang_input--Search').addEventListener('keyup', (e) => {
    let search = document.querySelector('.LoaiKhachHang_input--Search').value.toString().toUpperCase();
    for (let i = 0; i < LoaiKhachHangs.length; i++) {
        let LoaiKhachHang_Ten = LoaiKhachHangs[i].querySelector('.LoaiKhachHang_Ten').value.toString().toUpperCase();
        let LoaiKhachHang_SoTuoiToiDa = LoaiKhachHangs[i]
            .querySelector('.LoaiKhachHang_SoTuoiToiDa')
            .value.toString()
            .toUpperCase();
        let LoaiKhachHang_SoTuoiToiThieu = LoaiKhachHangs[i]
            .querySelector('.LoaiKhachHang_SoTuoiToiThieu')
            .value.toString()
            .toUpperCase();
        let LoaiKhachHang_HeSo = LoaiKhachHangs[i].querySelector('.LoaiKhachHang_HeSo').value.toString().toUpperCase();
        if (
            LoaiKhachHang_Ten.includes(search) == false &&
            LoaiKhachHang_SoTuoiToiDa.includes(search) == false &&
            LoaiKhachHang_SoTuoiToiThieu.includes(search) == false &&
            LoaiKhachHang_HeSo.includes(search) == false
        ) {
            LoaiKhachHangs[i].classList.add('d-none');
        } else LoaiKhachHangs[i].classList.remove('d-none');
    }
});

// Kiểm tra sự thay đổi
let F_LoaiKhachHang_Updated = false;
for (let i = 0; i < LoaiKhachHangs.length; i++) {
    LoaiKhachHangs[i].querySelector('.LoaiKhachHang_Ten').addEventListener('blur', (e) => {
        if (e.target.value == '') {
            showToast({
                header: 'Thông tin loại khách hàng',
                body: 'Tên loại khách hàng không được để trống',
                duration: 5000,
                type: 'warning',
            });
            e.target.value = Package.LoaiKhachHangs[i].TenLoaiKhachHang;
            e.target.focus();
            return;
        }
        if (e.target.value != Package.LoaiKhachHangs[i].TenLoaiKhachHang) {
            LoaiKhachHangs_P_Update[i].ID_Update = 1;
            LoaiKhachHangs_P_Update[i].TenLoaiKhachHang = e.target.value;
            F_LoaiKhachHang_Updated = true;
        }
    });
    //cập nhật số tuổi tuối thiệu của hàng dưới
    LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').addEventListener('keyup', (e) => {
        if (i == LoaiKhachHangs.length - 1) {
            if (document.querySelector('.LoaiKhachHang_New')) {
                document.querySelector('.LoaiKhachHang_New').querySelector('.LoaiKhachHang_SoTuoiToiThieu').value =
                    e.target.value;
            }
        } else {
            LoaiKhachHangs[i + 1].querySelector('.LoaiKhachHang_SoTuoiToiThieu').value = e.target.value;
        }
    });
    //
    LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').addEventListener('blur', (e) => {
        if (e.target.value == '') {
            showToast({
                header: 'Thông tin loại khách hàng',
                body: 'Số tuổi tối đa không được để trống',
                duration: 5000,
                type: 'warning',
            });
            e.target.value = Package.LoaiKhachHangs[i].SoTuoiToiDa;
            if (i == LoaiKhachHangs.length - 1) {
                if (document.querySelector('.LoaiKhachHang_New')) {
                    document.querySelector('.LoaiKhachHang_New').querySelector('.LoaiKhachHang_SoTuoiToiThieu').value =
                        e.target.value;
                }
            } else {
                LoaiKhachHangs[i + 1].querySelector('.LoaiKhachHang_SoTuoiToiThieu').value = e.target.value;
            }
            e.target.focus();
            return;
        }
        if (e.target.value == 0) {
            showToast({
                header: 'Thông tin loại khách hàng',
                body: 'Số tuổi tối đa phải khác 0',
                duration: 5000,
                type: 'warning',
            });
            e.target.value = Package.LoaiKhachHangs[i].SoTuoiToiDa;
            if (i == LoaiKhachHangs.length - 1) {
                if (document.querySelector('.LoaiKhachHang_New')) {
                    document.querySelector('.LoaiKhachHang_New').querySelector('.LoaiKhachHang_SoTuoiToiThieu').value =
                        e.target.value;
                }
            } else {
                LoaiKhachHangs[i + 1].querySelector('.LoaiKhachHang_SoTuoiToiThieu').value = e.target.value;
            }
            e.target.focus();
            return;
        }
        if (parseInt(e.target.value) > 200) {
            e.target.value = 200;
            if (i == LoaiKhachHangs.length - 1) {
                if (document.querySelector('.LoaiKhachHang_New')) {
                    document
                        .querySelector('.LoaiKhachHang_New')
                        .querySelector('.LoaiKhachHang_SoTuoiToiThieu').value = 200;
                }
            } else {
                LoaiKhachHangs[i + 1].querySelector('.LoaiKhachHang_SoTuoiToiThieu').value = 200;
            }
        }
        if (e.target.value != Package.LoaiKhachHangs[i].SoTuoiToiDa) {
            LoaiKhachHangs_P_Update[i].ID_Update = 1;
            LoaiKhachHangs_P_Update[i + 1].ID_Update = 1;
            LoaiKhachHangs_P_Update[i].SoTuoiToiDa = e.target.value;
            LoaiKhachHangs_P_Update[i + 1].SoTuoiToiThieu = e.target.value;
            F_LoaiKhachHang_Updated = true;
        }
    });
    LoaiKhachHangs[i].querySelector('.LoaiKhachHang_HeSo').addEventListener('blur', (e) => {
        if (e.target.value == '') {
            showToast({
                header: 'Thông tin loại khách hàng',
                body: 'Hệ số không được để trống',
                duration: 5000,
                type: 'warning',
            });
            e.target.value = Package.LoaiKhachHangs[i].HeSo;
            e.target.focus();
            return;
        }
        if (parseFloat(e.target.value) == 0) {
            showToast({
                header: 'Thông tin loại khách hàng',
                body: 'Hệ số phải khác 0',
                duration: 5000,
                type: 'warning',
            });
            e.target.value = Package.LoaiKhachHangs[i].HeSo;
            e.target.focus();
            return;
        }
        if (parseFloat(e.target.value) > 99.99) {
            e.target.value = 99.99;
        } else {
            if (e.target.value == parseFloat(parseFloat(e.target.value).toFixed(2))) {
                e.target.value = parseFloat(e.target.value).toFixed(2);
            } else {
                e.target.value = parseFloat(e.target.value).toFixed(2);
            }
        }
        if (e.target.value != Package.LoaiKhachHangs[i].HeSo) {
            LoaiKhachHangs_P_Update[i].ID_Update = 1;
            LoaiKhachHangs_P_Update[i].HeSo = e.target.value;
            F_LoaiKhachHang_Updated = true;
        }
    });
}

// Nút hủy cập nhật loại khách hàng
document.querySelector('.LoaiKhachHang--Huy').addEventListener('click', (e) => {
    if (document.querySelector('.LoaiKhachHang_New'))
        document.querySelector('.LoaiKhachHang_Card').removeChild(document.querySelector('.LoaiKhachHang_New'));
    for (let i = 0; i < LoaiKhachHangs_P_Update.length; i++) {
        if (LoaiKhachHangs_P_Update[i].ID_Update == 1) {
            LoaiKhachHangs[i].querySelector('.LoaiKhachHang_Ten').value = Package.LoaiKhachHangs[i].TenLoaiKhachHang;
            LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').value = Package.LoaiKhachHangs[i].SoTuoiToiDa;
            LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiThieu').value =
                Package.LoaiKhachHangs[i].SoTuoiToiThieu;
            LoaiKhachHangs[i].querySelector('.LoaiKhachHang_HeSo').value = Package.LoaiKhachHangs[i].HeSo;
        }
    }
    LoaiKhachHangs_P_Update = structuredClone(Package.LoaiKhachHangs);
    F_LoaiKhachHang_Updated = false;
    for (let i = 0; i < LoaiKhachHangs.length; i++) {
        LoaiKhachHangs[i].querySelector('.LoaiKhachHang_Ten').disabled = true;
        LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').disabled = true;
        LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiThieu').disabled = true;
        LoaiKhachHangs[i].querySelector('.LoaiKhachHang_HeSo').disabled = true;
    }
    document.querySelector('.LoaiKhachHang--Them').classList.add('d-none');
    document.querySelector('.LoaiKhachHang--CapNhat').classList.add('d-none');
    e.target.classList.add('d-none');
    document.querySelector('.LoaiKhachHang--Sua').classList.remove('d-none');
});

//Nút cập nhật loại khách hàng
document.querySelector('.LoaiKhachHang--CapNhat').addEventListener('click', (e) => {
    console.log(LoaiKhachHangs_P_Update);
    LoaiKhachHangs_P_Add = [];
    let SoLoaiKhachHangUPdate = 0;
    const LoaiKhachHangs_New = document.querySelectorAll('.LoaiKhachHang_New');
    // kiểm tra thông tin vào
    for (let i = 0; i < LoaiKhachHangs_New.length; i++) {
        // kiểm tra tên loại khách hàng ( không trùng)
        for (let j = 0; j < Package.LoaiKhachHangs.length; j++) {
            if (
                LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_Ten').value ==
                Package.LoaiKhachHangs[j].TenLoaiKhachHang
            ) {
                showToast({
                    header: 'Thêm loại khách hàng mới',
                    body: 'Tên loại khách hàng "' + Package.LoaiKhachHangs[j].TenLoaiKhachHang + '" đã tồn tại',
                    duration: 5000,
                    type: 'warning',
                });
                LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_Ten').value = '';
                LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_Ten').focus();
                return;
            }
        }
        // kiểm tra tên loại khách hàng ( không trống)
        if (LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_Ten').value == '') {
            showToast({
                header: 'Thêm loại khách hàng mới',
                body: 'Tên loại khách hàng không được để trống',
                duration: 5000,
                type: 'warning',
            });
            LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_Ten').focus();
            return;
        }
        //Kiểm tra SoTuoiToiDa
        if (LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').value == '') {
            showToast({
                header: 'Thêm loại khách hàng mới',
                body: 'Số tuổi tối đa không được để trống',
                duration: 5000,
                type: 'warning',
            });
            LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').focus();
            return;
        }
        if (LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').value == 0) {
            showToast({
                header: 'Thêm loại khách hàng mới',
                body: 'Số tuổi tối đa phải khác 0',
                duration: 5000,
                type: 'warning',
            });
            LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').focus();
            return;
        }
        // kiểm tra Hệ số ( không trống, khac 0)
        if (LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_HeSo').value == '') {
            showToast({
                header: 'Thêm loại khách hàng mới',
                body: 'Hệ số không được để trống',
                duration: 5000,
                type: 'warning',
            });
            LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_HeSo').focus();
            return;
        }
        if (parseFloat(LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_HeSo').value) == 0) {
            showToast({
                header: 'Thêm loại khách hàng mới',
                body: 'Hệ số phải khác 0',
                duration: 5000,
                type: 'warning',
            });
            LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_HeSo').value = '';
            LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_HeSo').focus();
            return;
        }
        // Add thông tin loại khách hàng mới vô gói Package
        LoaiKhachHangs_P_Add.push({
            TenLoaiKhachHang: LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_Ten').value,
            SoTuoiToiThieu: LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_SoTuoiToiThieu').value,
            SoTuoiToiDa: LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').value,
            HeSo: LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_HeSo').value,
        });
    }
    //Kiểm tra logic của số tuổi tối thiểu và tối đa
    for (let i = 0; i < LoaiKhachHangs.length; i++) {
        let SoTuoiToiDa = LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').value;
        let SoTuoiToiThieu = LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiThieu').value;
        if (parseInt(SoTuoiToiThieu) > parseInt(SoTuoiToiDa)) {
            showToast({
                header: 'Thông tin loại khách hàng',
                body:
                    'Số tuổi tối đa của "' +
                    LoaiKhachHangs[i].querySelector('.LoaiKhachHang_Ten').value +
                    '" không được nhỏ hơn số tuổi tối thiểu',
                duration: 5000,
                type: 'warning',
            });
            LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').value = '';
            LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').focus();
            return;
        }
    }
    if (LoaiKhachHangs_New.length > 0) {
        if (
            LoaiKhachHangs_New[0].querySelector('.LoaiKhachHang_SoTuoiToiDa').value <
            LoaiKhachHangs_New[0].querySelector('.LoaiKhachHang_SoTuoiToiThieu').value
        ) {
            showToast({
                header: 'Thông tin loại khách hàng',
                body:
                    'Số tuổi tối đa của "' +
                    LoaiKhachHangs_New[0].querySelector('.LoaiKhachHang_Ten').value +
                    '" không được nhỏ hơn số tuổi tối thiểu',
                duration: 5000,
                type: 'warning',
            });
            LoaiKhachHangs_New[0].querySelector('.LoaiKhachHang_SoTuoiToiDa').value = '';
            LoaiKhachHangs_New[0].querySelector('.LoaiKhachHang_SoTuoiToiDa').focus();
            return;
        }
    }
    //Đếm loại khách hàng thay đổi
    for (let i = 0; i < LoaiKhachHangs_P_Update.length; i++) {
        if (LoaiKhachHangs_P_Update[i].ID_Update == 1) SoLoaiKhachHangUPdate++;
    }
    if (F_LoaiKhachHang_Updated == true || LoaiKhachHangs_New.length > 0) {
        if (F_LoaiKhachHang_Updated == true || LoaiKhachHangs_New.length > 0) {
            let LoaiKhachHangs_P = {};
            LoaiKhachHangs_P.LoaiKhachHangs_P_Update = structuredClone(LoaiKhachHangs_P_Update);
            LoaiKhachHangs_P.LoaiKhachHangs_P_Add = structuredClone(LoaiKhachHangs_P_Add);
            console.log(LoaiKhachHangs_P);
            // chuyển trạng thái sang sửa
            LoaiKhachHangs[0].querySelector('.LoaiKhachHang_Ten').focus();
            for (let i = 0; i < LoaiKhachHangs_New.length; i++) {
                LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_Ten').disabled = true;
                LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_SoTuoiToiThieu').disabled = true;
                LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').disabled = true;
                LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_HeSo').disabled = true;
                LoaiKhachHangs_New[i].querySelector('.LoaiKhachHang_Cop--Xoa').classList.add('d-none');
                LoaiKhachHangs_New[i].classList.remove('LoaiKhachHang_New');
                LoaiKhachHangs_New[i].classList.add('LoaiKhachHang');
            }
            LoaiKhachHangs = document.querySelectorAll('.LoaiKhachHang');
            for (let i = 0; i < LoaiKhachHangs.length; i++) {
                LoaiKhachHangs[i].querySelector('.LoaiKhachHang_Ten').disabled = true;
                LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiThieu').disabled = true;
                LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').disabled = true;
                LoaiKhachHangs[i].querySelector('.LoaiKhachHang_HeSo').disabled = true;
            }
            document.querySelector('.LoaiKhachHang--Them').classList.add('d-none');
            document.querySelector('.LoaiKhachHang--Huy').classList.add('d-none');
            e.target.classList.add('d-none');
            document.querySelector('.LoaiKhachHang--Sua').classList.remove('d-none');
            axios({
                method: 'POST',
                url: '/staff/quydinh/UpdateLoaiKhachHang',
                data: LoaiKhachHangs_P,
            }).then((res) => {
                Package.LoaiKhachHangs = res.data;
                // LoadLoaiKhachHang();
                //    hiển thị thông báo cập nhật thành công
                document.querySelector('.LoaiKhachHang--CapNhat').focus();
                if (F_LoaiKhachHang_Updated == true) {
                    showToast({
                        header: 'Thông tin loại khách hàng',
                        body: 'Đã cập nhật thành công ' + SoLoaiKhachHangUPdate + ' loại khách hàng',
                        duration: 5000,
                        type: 'success',
                    });
                }
                if (LoaiKhachHangs_New.length > 0) {
                    showToast({
                        header: 'Thông tin loại khách hàng',
                        body:
                            'Đã thêm thành công loại khách hàng "' +
                            LoaiKhachHangs_New[0].querySelector('.LoaiKhachHang_Ten').value +
                            '"',
                        duration: 5000,
                        type: 'success',
                    });
                }
                LoaiKhachHangs_P_Update = structuredClone(Package.LoaiKhachHangs);
                F_LoaiKhachHang_Updated = false;
            });
        }
    } else {
        for (let i = 0; i < LoaiKhachHangs.length; i++) {
            LoaiKhachHangs[i].querySelector('.LoaiKhachHang_Ten').disabled = true;
            LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiThieu').disabled = true;
            LoaiKhachHangs[i].querySelector('.LoaiKhachHang_SoTuoiToiDa').disabled = true;
            LoaiKhachHangs[i].querySelector('.LoaiKhachHang_HeSo').disabled = true;
        }
        document.querySelector('.LoaiKhachHang--Them').classList.add('d-none');
        document.querySelector('.LoaiKhachHang--Huy').classList.add('d-none');
        e.target.classList.add('d-none');
        document.querySelector('.LoaiKhachHang--Sua').classList.remove('d-none');
        showToast({
            header: 'Thông tin loại khách hàng',
            body: 'Không có sự thay đổi',
            duration: 5000,
            type: '',
        });
    }
});

//
//Js in Mochanhly
//
// hàm format tien vnd
function formatVND(string) {
    if (string.charAt(0) == '0' && string.length > 1) {
        string = string.replace('0', '');
    }
    string = string.replaceAll('.', '');
    let part = [];
    let i = 0;
    if (string.length > 3) {
        while (string.length > 3) {
            part[i++] = '.' + string.slice(string.length - 3, string.length);
            string = string.slice(0, string.length - 3);
        }
        for (let j = i - 1; j >= 0; j--) {
            string = string + part[j];
        }
    }
    return string;
}
let MocHanhLys = document.querySelectorAll('.MochanhLy');
// Nút sửa mốc hành lý
document.querySelector('.MocHanhLy--Sua').addEventListener('click', (e) => {
    for (let i = 0; i < MocHanhLys.length; i++) {
        MocHanhLys[i].querySelector('.MocHanhLy_GiaTien').disabled = false;
        MocHanhLys[i].querySelector('.MocHanhLy_SoKgToiDa').disabled = false;
    }
    e.target.classList.add('d-none');
    document.querySelector('.MocHanhLy--Them').classList.remove('d-none');
    document.querySelector('.MocHanhLy--CapNhat').classList.remove('d-none');
    document.querySelector('.MocHanhLy--Huy').classList.remove('d-none');
});
// Nút thêm mốc hành lý
document.querySelector('.MocHanhLy--Them').addEventListener('click', (e) => {
    const MocHanhLy = document.querySelector('.MocHanhLy_Cop').cloneNode(true);
    MocHanhLy.classList.remove('d-none');
    MocHanhLy.classList.remove('MocHanhLy_Cop');
    MocHanhLy.classList.add('MocHanhLy_New');
    document.querySelector('.MocHanhLy_Card').appendChild(MocHanhLy);
    MocHanhLy.querySelector('.MocHanhLy_SoKgToiDa').focus();
    MocHanhLy.querySelector('.MocHanhLy_GiaTien').value = 0;
    MocHanhLy.querySelector('.MocHanhLy_GiaTien').addEventListener('keyup', (e) => {
        e.target.value = formatVND(e.target.value);
    });
    MocHanhLy.querySelector('.MocHanhLy_GiaTien').addEventListener('blur', (e) => {
        if (e.target.value == '') e.target.value = 0;
        if (e.target.value.replace('.', '').length >= 20) {
            showToast({
                header: 'Thông tin mốc hành lý ',
                body: 'Số tiền quá lớn',
                duration: 5000,
                type: 'warning',
            });
            e.target.value = 0;
            e.target.focus();
        }
    });
    MocHanhLy.querySelector('.MocHanhLy_SoKgToiDa').addEventListener('blur', (e) => {
        if (e.target.value > 1000) {
            showToast({
                header: 'Thông tin mốc hành lý ',
                body: 'Số kg tối đa phải nhỏ hơn 1000Kg',
                duration: 5000,
                type: 'warning',
            });
            e.target.value = '';
            e.target.focus();
        }
    });
    //Nút xóa MocHanhLy
    MocHanhLy.querySelector('.MocHanhLy_Cop--Xoa').addEventListener('click', (e) => {
        document.querySelector('.MocHanhLy_Card').removeChild(e.target.closest('.MocHanhLy_New'));
    });
});
// Nút hủy cập nhật
document.querySelector('.MocHanhLy--Huy').addEventListener('click', (e) => {
    //trả gtr về ban đàu
    for (let i = 0; i < MocHanhLys.length; i++) {
        MocHanhLys[i].querySelector('.MocHanhLy_SoKgToiDa').value = Package.MocHanhLys[i].SoKgToiDa;
        MocHanhLys[i].querySelector('.MocHanhLy_GiaTien').value = Package.MocHanhLys[i].GiaTien;
        MocHanhLys[i].querySelector('.MocHanhLy_SoKgToiDa').disabled = true;
        MocHanhLys[i].querySelector('.MocHanhLy_GiaTien').disabled = true;
    }
    e.target.classList.add('d-none');
    document.querySelector('.MocHanhLy--Sua').classList.remove('d-none');
    document.querySelector('.MocHanhLy--Them').classList.add('d-none');
    document.querySelector('.MocHanhLy--CapNhat').classList.add('d-none');
});
// Nút cập nhật móc hành lý
document.querySelector('.MocHanhLy--CapNhat').addEventListener('click', (e) => {
    let MocHanhLys_P_Add = [];
    let MocHanhLys_P_Update = structuredClone(Package.MocHanhLys);
    let Flag = 0;
    // kiểm tra số kg tối da phải lon hơn sokgtoida ben tren
    for (let i = 1; i < MocHanhLys.length; i++) {
        let MocHanhLyTren = MocHanhLys[i - 1].querySelector('.MocHanhLy_SoKgToiDa').value;
        let MocHanhLyDuoi = MocHanhLys[i].querySelector('.MocHanhLy_SoKgToiDa').value;
        let GiaTien = MocHanhLys[i].querySelector('.MocHanhLy_GiaTien').value.replaceAll('.', '');
        if (parseInt(MocHanhLyDuoi) <= parseInt(MocHanhLyTren)) {
            showToast({
                header: 'Thông tin mốc hành lý',
                body: 'Số kg tối đa phải theo thứ tự tăng dần',
                duration: 5000,
                type: 'warning',
            });
            MocHanhLys[i].querySelector('.MocHanhLy_SoKgToiDa').value = Package.MocHanhLys[i].SoKgToiDa;
            MocHanhLys[i].querySelector('.MocHanhLy_SoKgToiDa').focus();
            return;
        }
        if (MocHanhLyDuoi != Package.MocHanhLys[i].SoKgToiDa || GiaTien != Package.MocHanhLys[i].GiaTien) {
            MocHanhLys_P_Update[i].ID_Update = 1;
            MocHanhLys_P_Update[i].SoKgToiDa = MocHanhLyDuoi;
            MocHanhLys_P_Update[i].GiaTien = GiaTien;
            Flag++;
        }
    }
    //nếu có them moi
    const MocHanhLys_New = document.querySelectorAll('.MocHanhLy_New');
    if (MocHanhLys_New.length > 0) {
        for (let i = 0; i < MocHanhLys_New.length; i++) {
            // kiểm tra so kg toi da không trống
            if (MocHanhLys_New[i].querySelector('.MocHanhLy_SoKgToiDa').value == '') {
                showToast({
                    header: 'Thêm mốc hành lý mới',
                    body: 'Số kg tối đa không được để trống',
                    duration: 5000,
                    type: 'warning',
                });
                MocHanhLys_New[i].querySelector('.MocHanhLy_SoKgToiDa').focus();
                return;
            }
            // kiểm tra số kg tối da phải lon hơn sokgtoida ben tren
            if (i > 0) {
                let MocHanhLyTren = MocHanhLys_New[i - 1].querySelector('.MocHanhLy_SoKgToiDa').value;
                let MocHanhLyDuoi = MocHanhLys_New[i].querySelector('.MocHanhLy_SoKgToiDa').value;
                if (parseInt(MocHanhLyDuoi) <= parseInt(MocHanhLyTren)) {
                    showToast({
                        header: 'Thêm mốc hành lý mới',
                        body: 'Số kg tối đa phải theo thứ tự tăng dần',
                        duration: 5000,
                        type: 'warning',
                    });
                    MocHanhLys_New[i].querySelector('.MocHanhLy_SoKgToiDa').value = 0;
                    MocHanhLys_New[i].querySelector('.MocHanhLy_SoKgToiDa').focus();
                    return;
                }
            } else {
                if (
                    parseInt(MocHanhLys_New[0].querySelector('.MocHanhLy_SoKgToiDa').value) <=
                    parseInt(MocHanhLys[MocHanhLys.length - 1].querySelector('.MocHanhLy_SoKgToiDa').value)
                ) {
                    showToast({
                        header: 'Thêm mốc hành lý mới',
                        body: 'Số kg tối đa phải theo thứ tự tăng dần',
                        duration: 5000,
                        type: 'warning',
                    });
                    MocHanhLys_New[0].querySelector('.MocHanhLy_SoKgToiDa').value = 0;
                    MocHanhLys_New[0].querySelector('.MocHanhLy_SoKgToiDa').focus();
                    return;
                }
            }
            MocHanhLys_P_Add.push({
                SoKgToiDa: MocHanhLys_New[i].querySelector('.MocHanhLy_SoKgToiDa').value,
                GiaTien: MocHanhLys_New[i].querySelector('.MocHanhLy_GiaTien').value.replace('.', ''),
            });
        }
    }
    if (MocHanhLys_New.length == 0 && Flag == 0) {
        showToast({
            header: 'Thông tin mốc hành lý',
            body: 'Không có sự thay đổi',
            duration: 5000,
            type: '',
        });
    } else {
        let MocHanhLys_P = {};
        MocHanhLys_P.MocHanhLys_P_Update = structuredClone(MocHanhLys_P_Update);
        MocHanhLys_P.MocHanhLys_P_Add = structuredClone(MocHanhLys_P_Add);
        console.log(MocHanhLys_P);
        // chuyển trạng thái sang sửa
        MocHanhLys[0].querySelector('.MocHanhLy_SoKgToiDa').focus();
        for (let i = 0; i < MocHanhLys_New.length; i++) {
            MocHanhLys_New[i].querySelector('.MocHanhLy_SoKgToiDa').disabled = true;
            MocHanhLys_New[i].querySelector('.MocHanhLy_GiaTien').disabled = true;
            MocHanhLys_New[i].classList.remove('MocHanhLy_New');
            MocHanhLys_New[i].classList.add('MocHanhLy');
            MocHanhLys_New[i].querySelector('.MocHanhLy_Cop--Xoa').classList.add('d-none');
        }
        MocHanhLys = document.querySelectorAll('.MocHanhLy');
        for (let i = 0; i < MocHanhLys.length; i++) {
            MocHanhLys[i].querySelector('.MocHanhLy_SoKgToiDa').disabled = true;
            MocHanhLys[i].querySelector('.MocHanhLy_GiaTien').disabled = true;
        }
        document.querySelector('.MocHanhLy--Them').classList.add('d-none');
        document.querySelector('.MocHanhLy--Huy').classList.add('d-none');
        e.target.classList.add('d-none');
        document.querySelector('.MocHanhLy--Sua').classList.remove('d-none');
        axios({
            method: 'POST',
            url: '/staff/quydinh/UpdateMocHanhLy',
            data: MocHanhLys_P,
        }).then((res) => {
            Package.MocHanhLys = res.data;
            document.querySelector('.MocHanhLy--CapNhat').focus();
            if (Flag > 0) {
                showToast({
                    header: 'Thông tin mốc hành lý',
                    body: 'Đã cập nhật thành công ' + Flag + ' mốc hành lý',
                    duration: 5000,
                    type: 'success',
                });
            }
            if (MocHanhLys_New.length > 0) {
                showToast({
                    header: 'Thông tin mốc hành lý',
                    body: 'Đã thêm thành công ' + MocHanhLys_New.length + ' mốc hành lý ',
                    duration: 5000,
                    type: 'success',
                });
            }
        });
    }
});
