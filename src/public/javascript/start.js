export let today = new Date();

export function getToday() {
    let homnay = new Date();
    var dd = String(homnay.getDate()).padStart(2, '0');
    var mm = String(homnay.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = homnay.getFullYear();

    return { yyyy: yyyy, mm: mm, dd: dd };
}

export function ActiveNavItem_Header(Quyen = '') {
    // Quyen: TraCuu || NhanLich || DoanhThu || QuyDinh || PhanQuyen
    if (document.getElementById('TraCuu')) {
        document.getElementById('TraCuu').classList.remove('nav-item-active');
    }
    if (document.getElementById('NhanLich')) {
        document.getElementById('NhanLich').classList.remove('nav-item-active');
    }
    if (document.getElementById('DoanhThu')) {
        document.getElementById('DoanhThu').classList.remove('nav-item-active');
    }
    if (document.getElementById('QuyDinh')) {
        document.getElementById('QuyDinh').classList.remove('nav-item-active');
    }
    if (document.getElementById('PhanQuyen')) {
        document.getElementById('PhanQuyen').classList.remove('nav-item-active');
    }
    if (Quyen == 'TraCuu') {
        document.getElementById('TraCuu').classList.add('nav-item-active');
    } else if (Quyen == 'NhanLich') {
        document.getElementById('NhanLich').classList.add('nav-item-active');
    } else if (Quyen == 'DoanhThu') {
        document.getElementById('DoanhThu').classList.add('nav-item-active');
    } else if (Quyen == 'QuyDinh') {
        document.getElementById('QuyDinh').classList.add('nav-item-active');
    } else if (Quyen == 'PhanQuyen') {
        document.getElementById('PhanQuyen').classList.add('nav-item-active');
    } else {
        // khác
    }
}

export function numberWithDot(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function numberWithoutDot(x) {
    return x.toString().replaceAll('.', '');
}

export function numberSmallerTen(x) {
    if (parseInt(x) < 10) return '0' + x;
    return x;
}

export function openLoader(text) {
    document.getElementById('Spinner_loading_content').innerText = text;
    document.getElementById('Spinner_loading').classList.remove('d-none');
}

export function closeLoader() {
    setTimeout(() => {
        document.getElementById('Spinner_loading_content').innerText += '.';
    }, 500);
    setTimeout(() => {
        document.getElementById('Spinner_loading_content').innerText += '.';
    }, 800);
    setTimeout(() => {
        document.getElementById('Spinner_loading_content').innerText += '.';
    }, 1100);
    setTimeout(() => {
        document.getElementById('Spinner_loading').classList.add('d-none');
    }, 1400);
}

export function getThuTrongTuan(date) {
    switch (date.getDay()) {
        case 0:
            return 'CN';
        default:
            return 'T' + (date.getDay() + 1).toString();
    }
}

// Toast
export function showToast({ header = '', body = '', type = '', duration = 3000 }) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    let types = {
        success: { bg: 'bg-success', text: 'text-light' },
        info: { bg: 'bg-info', text: 'text-light' },
        warning: { bg: 'bg-warning', text: 'text-light' },
        danger: { bg: 'bg-danger', text: 'text-light' },
        '': { bg: '', text: '' },
    };
    const toast = document.createElement('div');
    toast.classList.add('toast', 'hide', 'rounded', 'border-0', 'shadow-lg');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
                    <div class="toast-header">
                        <strong class="me-auto custom-font p20-B">${header}</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body rounded-bottom border-0 custom-font p16-S ${types[type].bg} ${types[type].text}">${body}</div>
                `;
    toastContainer.appendChild(toast);

    new bootstrap.Toast(toastContainer.lastElementChild, { delay: duration }).show();
}
// Vd: showToast({header:"Dui",body:"haha",duration: 5000,type:'success/info/warning/danger/Trống'});

export function dateIsValid(date) {
    if (typeof date === 'object' && date !== null && typeof date.getTime === 'function' && !isNaN(date)) {
        return true;
    }

    return false;
}

// key press
export function onlyNumber(evt) {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
        key = window.event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]/;
    // var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

// key up cho tiền
export function formatVND(string) {
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

export function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
}
