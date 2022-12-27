import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
    getToday,
    showToast,
    onlyNumber,
    validateEmail,
} from '../start.js';
document.addEventListener('DOMContentLoaded', (e) => {
    let Quyen_package;
    axios({
        method: 'post',
        url: '/staff/LoadHeader',
    }).then((res) => {
        Quyen_package = res.data;

        if (document.getElementById('HoTen_User')) {
            document.getElementById('HoTen_User').innerText = Quyen_package.HoTen;
        }
        console.log(res.data);

        // Phân quyền
        if (Quyen_package.QuyenHT[5] == 0) {
            document.getElementById('PhanQuyen').parentElement.removeChild(document.getElementById('PhanQuyen'));
        } else if (document.getElementById('PhanQuyen')) {
            document.getElementById('PhanQuyen').classList.remove('d-none');
        }

        // Quy định
        if (document.getElementById('QuyDinh')) {
            document.getElementById('QuyDinh').classList.remove('d-none');
        }

        // Doanh thu
        if (Quyen_package.QuyenHT[3] == 0) {
            document.getElementById('DoanhThu').parentElement.removeChild(document.getElementById('DoanhThu'));
        } else if (document.getElementById('DoanhThu')) {
            document.getElementById('DoanhThu').classList.remove('d-none');
        }

        // Nhận lịch
        if (Quyen_package.QuyenHT[2] == 0) {
            document.getElementById('NhanLich').parentElement.removeChild(document.getElementById('NhanLich'));
        } else if (document.getElementById('NhanLich')) {
            document.getElementById('NhanLich').classList.remove('d-none');
        }

        // Tra cứu
        if (document.getElementById('TraCuu')) {
            document.getElementById('TraCuu').classList.remove('d-none');
        }
    });
});

if (document.getElementById('LoGo')) {
    document.getElementById('LoGo').addEventListener('click', (e) => {
        var staff_form = document.forms['staffheader-form'];
        staff_form.action = '/staff';
        staff_form.submit();
    });
}

if (document.getElementById('Profile')) {
    document.getElementById('Profile').addEventListener('click', (e) => {
        var staff_form = document.forms['staffheader-form'];
        staff_form.action = '/staff/Profile';
        staff_form.submit();
    });
}

if (document.getElementById('TraCuu')) {
    document.getElementById('TraCuu').addEventListener('click', (e) => {
        var staff_form = document.forms['staffheader-form'];
        staff_form.action = '/staff';
        staff_form.submit();
    });
}

if (document.getElementById('DoanhThu')) {
    document.getElementById('DoanhThu').addEventListener('click', (e) => {
        var staff_form = document.forms['staffheader-form'];
        staff_form.action = '/staff/baocao';
        staff_form.submit();
    });
}

if (document.getElementById('QuyDinh')) {
    document.getElementById('QuyDinh').addEventListener('click', (e) => {
        var staff_form = document.forms['staffheader-form'];
        staff_form.action = '/staff/quydinh/Regulations';
        staff_form.submit();
    });
}

if (document.getElementById('PhanQuyen')) {
    document.getElementById('PhanQuyen').addEventListener('click', (e) => {
        var staff_form = document.forms['staffheader-form'];
        staff_form.action = '/staff/phanquyen/Authorization';
        staff_form.submit();
    });
}

if (document.getElementById('NhanLich')) {
    document.getElementById('NhanLich').addEventListener('click', (e) => {
        var staff_form = document.forms['staffheader-form'];
        staff_form.action = '/staff/nhanlich';
        staff_form.submit();
    });
}

if (document.getElementById('DangXuat')) {
    document.getElementById('DangXuat').addEventListener('click', (e) => {
        axios({
            method: 'POST',
            url: '/logout',
        });
        var staff_form = document.forms['staffheader-form'];
        staff_form.action = '/';
        staff_form.method = 'get';
        staff_form.submit();
    });
}
