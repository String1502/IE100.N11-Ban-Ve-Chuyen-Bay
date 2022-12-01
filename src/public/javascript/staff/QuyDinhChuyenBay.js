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
// khong thay doi k thong bao, co nut susa !impotant
const ThamSo_CapNhat = document.querySelector('.ThamSo--CapNhat');
const ThamSo_Huy = document.querySelector('.ThamSo--Huy');
const ThamSo_Sua = document.querySelector('.ThamSo--Sua');
const ThamSo_GiaTri = document.querySelectorAll('.ThamSo_GiaTri');
let Package;
let SanBays_P_Update = [];
let SanBays_P_Add = [];
let HangGhes_P_Update = [];
let HangGhes_P_Add = [];
// Load dữ liệu cho màn hình
if (!Package) {
    LoadInformation();
}
function LoadInformation() {
    axios({
        method: 'POST',
        url: '/staff/LoadRegulation',
    }).then((res) => {
        Package = res.data;
        console.log(Package);
        SanBays_P_Update = structuredClone(Package.SanBays);
        HangGhes_P_Update = structuredClone(Package.HangGhes);
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
    });
}
window.onlyNumber = onlyNumber;
//button ThamSo--Huy
ThamSo_Huy.addEventListener('click', (e) => {
    //trả gtr về ban đàu
    for (let i = 0; i < ThamSo_GiaTri.length; i++) {
        ThamSo_GiaTri[i].value = Package.ThamSos[i].GiaTri;
        ThamSo_GiaTri[i].disabled = true;
    }
    ThamSo_Sua.classList.remove('d-none');
    ThamSo_CapNhat.classList.add('d-none');
    ThamSo_Huy.classList.add('d-none');
});
//Button_ThamSo--Sua
ThamSo_Sua.addEventListener('click', (e) => {
    for (let i = 0; i < ThamSo_GiaTri.length; i++) {
        ThamSo_GiaTri[i].disabled = false;
    }
    ThamSo_Sua.classList.add('d-none');
    ThamSo_CapNhat.classList.remove('d-none');
    ThamSo_Huy.classList.remove('d-none');
});

// kiểm tra thông tin trước khi cập nhật
function CheckChangeThamSo(P_ThamSo) {
    let F = false;
    for (let i = 0; i < P_ThamSo.length; i++) {
        if (P_ThamSo[i] == '') {
            showToast({
                header: 'Quy định chuyến bay',
                body: 'Giá trị không được để trống',
                duration: 5000,
                type: 'warning',
            });
            for (let i = 0; i < ThamSo_GiaTri.length; i++) {
                ThamSo_GiaTri[i].value = Package.ThamSos[i].GiaTri;
            }

            return false;
        }
        if (P_ThamSo[i] == 0) {
            showToast({
                header: 'Quy định chuyến bay',
                body: 'Giá trị phải khác 0',
                duration: 5000,
                type: 'warning',
            });
            for (let i = 0; i < ThamSo_GiaTri.length; i++) {
                ThamSo_GiaTri[i].value = Package.ThamSos[i].GiaTri;
            }

            return false;
        }
        if (P_ThamSo[i].length > 9) {
            showToast({
                header: 'Quy định chuyến bay',
                body: 'Giá trị ít hơn 10 chữ số',
                duration: 5000,
                type: 'warning',
            });
            for (let i = 0; i < ThamSo_GiaTri.length; i++) {
                ThamSo_GiaTri[i].value = Package.ThamSos[i].GiaTri;
            }

            return false;
        }
        if (P_ThamSo[i] != Package.ThamSos[i].GiaTri) {
            F = true;
        }
    }
    if (F == true) {
        return true;
    } else {
        // Chuyển trạng thái sang Sưa TH: khong co sự thay đổi
        for (let i = 0; i < ThamSo_GiaTri.length; i++) {
            ThamSo_GiaTri[i].disabled = true;
        }
        ThamSo_Sua.classList.remove('d-none');
        ThamSo_CapNhat.classList.add('d-none');
        ThamSo_Huy.classList.add('d-none');
        showToast({
            header: 'Quy định chuyến bay',
            body: 'Không có sự thay đổi',
            duration: 5000,
            type: '',
        });
        return false;
    }
}
//Cập nhật thông tin
function CapNhat_ThamSo() {
    let P_ThamSo = [];
    for (let i = 0; i < ThamSo_GiaTri.length; i++) {
        P_ThamSo[i] = ThamSo_GiaTri[i].value;
    }
    if (CheckChangeThamSo(P_ThamSo) == false) return;
    //sửa thành sendform
    axios({
        method: 'POST',
        url: '/staff/UpdateThamSo',
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
    CapNhat_ThamSo();
});

// Js in SanBay

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
                url: '/staff/UpdateSanBay',
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

//js in HangGhe
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
                url: '/staff/UpdateHangGhe',
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
