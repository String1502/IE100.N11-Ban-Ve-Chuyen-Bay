import { today } from '../start.js';
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();

let mangChuyenBay = [
    {
        id: 0,
        id_element: 'Hang2_div_0',
    },
]; // Object: { id: , id_element: "" };

let mangSanBayDi = [
    {
        id: 0,
        id_element: 'SanBayDi_div_0',
        masanbay: '',
        tensanbay: '',
        matinhthanh: '',
        tentinhthanh: '',
    },
]; // Object: { id: , id_element: "", masanbay: "", tensanbay: "", matinhthanh: "", tentinhthanh: "" };

let mangSanBayDen = [
    {
        id: 0,
        id_element: 'SanBayDen_div_0',
        masanbay: '',
        tensanbay: '',
        matinhthanh: '',
        tentinhthanh: '',
    },
]; // Object: { id: , id_element: "", masanbay: "", tensanbay: "", matinhthanh: "", tentinhthanh: "" };

let mangNgayDi = [
    {
        id: 0,
        id_element: 'NgayDi_div_0',
        ngaydi: '',
    },
]; // Object: { id: , id_element: "", ngaydi: ""}; Vd: ngaydi = "2022-11-3"
if (document.getElementById('NgayDi_div_0'))
    document
        .getElementById('NgayDi_div_0')
        .children[0].children[0].children[1].setAttribute('min', yyyy + '-' + mm + '-' + dd);

let mangHanhKhach = []; // Object: { value: , title: ""}; Vd: { value: 5 , title: "Người lớn"}

let bienHangGhe = { mahangghe: '', tenhangghe: '' };

// Toast
function showToast({ header = '', body = '', type = '', duration = 3000 }) {
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

// Chọn item sân bay
window.sanbay_items_onclick = function sanbay_items_onclick(thisNode, di_den, sanbay) {
    const sanbay_div = thisNode.parentNode.parentNode.parentNode;
    let _id = -1;
    let same = false;
    if (di_den == 'di') {
        _id = mangSanBayDi.find((i) => i.id_element == sanbay_div.id).id;
        if (sanbay.masanbay == mangSanBayDen[_id].masanbay) same = true;
    } else {
        _id = mangSanBayDen.find((i) => i.id_element == sanbay_div.id).id;
        if (sanbay.masanbay == mangSanBayDi[_id].masanbay) same = true;
    }
    if (same) {
        let word1 = di_den == 'di' ? 'đi' : 'đến';
        let word2 = di_den == 'di' ? 'đến.' : 'đi.';
        showToast({
            header: 'Sân bay ' + word1 + ' không hợp lệ!',
            body: 'Sân bay ' + word1 + ' phải khác sân bay ' + word2,
            duration: 5000,
            type: 'warning',
        });
        return;
    }
    const item = di_den == 'di' ? mangSanBayDi[_id] : mangSanBayDen[_id];
    item.masanbay = sanbay.masanbay;
    item.tensanbay = sanbay.tensanbay;
    item.matinhthanh = sanbay.matinhthanh;
    item.tentinhthanh = sanbay.tentinhthanh;

    sanbay_div.children[1].children[1].setAttribute('value', item.tentinhthanh);
};
// Nút swap sân bay
window.swap_sanbay_onclick = function swap_sanbay_onclick(thisNode) {
    const chuyenbay = mangChuyenBay.find((i) => i.id_element == thisNode.parentNode.parentNode.id);
    if (!chuyenbay) return;
    let _id = chuyenbay.id;
    let sanbayden = Object.assign({}, mangSanBayDen[_id]);

    mangSanBayDen[_id].masanbay = mangSanBayDi[_id].masanbay;
    mangSanBayDen[_id].tensanbay = mangSanBayDi[_id].tensanbay;
    mangSanBayDen[_id].matinhthanh = mangSanBayDi[_id].matinhthanh;
    mangSanBayDen[_id].tentinhthanh = mangSanBayDi[_id].tentinhthanh;
    mangSanBayDi[_id].masanbay = sanbayden.masanbay;
    mangSanBayDi[_id].tensanbay = sanbayden.tensanbay;
    mangSanBayDi[_id].matinhthanh = sanbayden.matinhthanh;
    mangSanBayDi[_id].tentinhthanh = sanbayden.tentinhthanh;
    document
        .getElementById('SanBayDi_div_' + _id)
        .children[1].children[1].setAttribute('value', mangSanBayDi[_id].tentinhthanh);
    document
        .getElementById('SanBayDen_div_' + _id)
        .children[1].children[1].setAttribute('value', mangSanBayDen[_id].tentinhthanh);
};

// Chọn ngày đi
window.ngaydi_onchange = function ngaydi_onchange(e) {
    const NgayDi_div = e.parentNode.parentNode.parentNode;
    let _id = mangNgayDi.find((i) => i.id_element == NgayDi_div.id).id;
    mangNgayDi[_id].ngaydi = e.value.toString();
};

// Hành khách
const hanhkhach_inputnumber_items = document.querySelectorAll('.hanhkhach_inputnumber_item');
const HanhKhach = document.getElementById('HanhKhach');
for (let i = 0; i < hanhkhach_inputnumber_items.length; i++) {
    mangHanhKhach.push({ value: hanhkhach_inputnumber_items[i].value, title: hanhkhach_inputnumber_items[i].title });
    hanhkhach_inputnumber_items[i].addEventListener('change', (e) => {
        let sum = 0;
        let limit = parseInt(document.getElementById('HanhKhach_div').title.toString());
        let mangtemp = structuredClone(mangHanhKhach);
        mangHanhKhach.map((item) => {
            if (item.title == e.target.title) {
                item.value = e.target.value;
            }
        });
        mangHanhKhach.forEach((item) => (sum += parseInt(item.value)));
        if (limit < sum) {
            e.target.value--;
            showToast({
                header: 'Hành khách',
                body: 'Tổng số hành khách không vượt quá ' + limit + '.',
                duration: 5000,
                type: 'warning',
            });
            mangHanhKhach = mangtemp;
        } else {
            HanhKhach.innerText = mangHanhKhach
                .map((item) => {
                    return (item.value + ' ' + item.title).toString();
                })
                .join(', ');
        }
    });
}
HanhKhach.innerText = mangHanhKhach
    .map((i) => {
        return (i.value + ' ' + i.title).toString();
    })
    .join(', ');

// Khứ hồi
const KhuHoi = document.getElementById('KhuHoi');
const NgayVe = document.getElementById('NgayVe');
window.khuhoi_onclick = function khuhoi_onclick() {
    KhuHoi.checked ? NgayVe.classList.remove('d-none') : NgayVe.classList.add('d-none');
};

// Hạng ghế
const HangGhe = document.getElementById('HangGhe');
window.hangghe_items_onclick = function hangghe_items_onclick(hangghe) {
    bienHangGhe.mahangghe = hangghe.mahangghe;
    bienHangGhe.tenhangghe = hangghe.tenhangghe;
    HangGhe.setAttribute('value', bienHangGhe.tenhangghe);
};

// Nhiều thành phố
const NhieuThanhPho = document.getElementById('NhieuThanhPho');
const MotChieu_KhuHoi = document.getElementById('MotChieu_KhuHoi');
const ThemChuyenBay_div = document.getElementById('ThemChuyenBay_div');
const Body = document.getElementById('Body');
const Hang2_div_0 = document.getElementById('Hang2_div_0');
const Hang3_div = document.getElementById('Hang3_div');
const NgayDi_div_0 = document.getElementById('NgayDi_div_0');
const NgayVe_div = document.getElementById('NgayVe_div');
const Blank_div = document.getElementById('Trong_div');
const HanhKhach_div = document.getElementById('HanhKhach_div');
window.nhieuthanhpho_onclick = function nhieuthanhpho_onclick() {
    if (!NhieuThanhPho.checked) return;
    Hang2_div_0.removeChild(HanhKhach_div);
    HanhKhach_div.classList.remove('col-md-5');
    HanhKhach_div.classList.add('col-md-7');
    Hang3_div.removeChild(NgayDi_div_0);
    Hang3_div.removeChild(Blank_div);
    Hang3_div.removeChild(NgayVe_div);
    NgayDi_div_0.classList.remove('col-md-3');
    NgayDi_div_0.classList.add('col-md-5');

    Hang3_div.insertBefore(HanhKhach_div, Hang3_div.children[0]);
    Hang2_div_0.appendChild(NgayDi_div_0);

    if (mangChuyenBay.length < 2) {
        let _id = mangChuyenBay[mangChuyenBay.length - 1].id + 1;

        mangChuyenBay.push({ id: _id, id_element: 'Hang2_div_' + _id.toString(), ngaydi: '' });
        mangSanBayDi.push({
            id: _id,
            id_element: 'SanBayDi_div_' + _id.toString(),
            masanbay: '',
            tensanbay: '',
            matinhthanh: '',
            tentinhthanh: '',
        });
        mangSanBayDen.push({
            id: _id,
            id_element: 'SanBayDen_div_' + _id.toString(),
            masanbay: '',
            tensanbay: '',
            matinhthanh: '',
            tentinhthanh: '',
        });
        mangNgayDi.push({ id: _id, id_element: 'NgayDi_div_' + _id.toString(), ngaydi: '' });
        const node = Hang2_div_0.cloneNode(true);
        node.id = 'Hang2_div_' + _id.toString();
        node.children[0].id = 'SanBayDi_div_' + _id.toString();
        node.children[2].id = 'SanBayDen_div_' + _id.toString();
        node.children[3].id = 'NgayDi_div_' + _id.toString();
        node.children[3].children[0].children[0].children[1].setAttribute('min', yyyy + '-' + mm + '-' + dd);
        node.children[0].children[1].children[1].value = '';
        node.children[2].children[1].children[1].value = '';
        node.children[3].children[0].children[0].children[1].value = '';

        Body.insertBefore(node, ThemChuyenBay_div);
    } else {
        for (let i = 1; i < mangChuyenBay.length; i++) {
            const node = Hang2_div_0.cloneNode(true);
            node.id = 'Hang2_div_' + i.toString();
            node.children[0].id = 'SanBayDi_div_' + i.toString();
            node.children[2].id = 'SanBayDen_div_' + i.toString();
            node.children[3].id = 'NgayDi_div_' + i.toString();
            node.children[3].children[0].children[0].children[1].setAttribute('min', yyyy + '-' + mm + '-' + dd);
            node.children[0].children[1].children[1].value = mangSanBayDi[i].tentinhthanh;
            node.children[2].children[1].children[1].value = mangSanBayDen[i].tentinhthanh;
            node.children[3].children[0].children[0].children[1].value = mangNgayDi[i].ngaydi;

            Body.insertBefore(node, ThemChuyenBay_div);
        }
        if (mangChuyenBay.length > 2)
            document
                .getElementById('Hang2_div_' + (mangChuyenBay.length - 1).toString())
                .children[3].children[0].children[1].classList.remove('d-none');
    }
    ThemChuyenBay_div.classList.remove('d-none');
};
window.motchieukhuhoi_onclick = function motchieukhuhoi_onclick() {
    if (!MotChieu_KhuHoi.checked) return;
    Hang3_div.removeChild(HanhKhach_div);
    HanhKhach_div.classList.remove('col-md-7');
    HanhKhach_div.classList.add('col-md-5');
    NgayDi_div_0.classList.remove('col-md-5');
    NgayDi_div_0.classList.add('col-md-3');
    Hang2_div_0.insertBefore(HanhKhach_div, null);
    Hang3_div.insertBefore(NgayVe_div, Hang3_div.children[0]);
    Hang3_div.insertBefore(Blank_div, Hang3_div.children[0]);
    Hang3_div.insertBefore(NgayDi_div_0, Hang3_div.children[0]);
    let sochuyenbay = mangChuyenBay.length;
    for (let i = sochuyenbay; i > 1; i--) {
        let node = document.getElementById(mangChuyenBay[i - 1].id_element);
        Body.removeChild(node);
    }
    ThemChuyenBay_div.classList.add('d-none');
};
window.themchuyenbay_onclick = function themchuyenbay_onclick() {
    let _id = mangChuyenBay[mangChuyenBay.length - 1].id + 1;

    mangChuyenBay.push({ id: _id, id_element: 'Hang2_div_' + _id.toString() });
    mangSanBayDi.push({
        id: _id,
        id_element: 'SanBayDi_div_' + _id.toString(),
        masanbay: '',
        tensanbay: '',
        matinhthanh: '',
        tentinhthanh: '',
    });
    mangSanBayDen.push({
        id: _id,
        id_element: 'SanBayDen_div_' + _id.toString(),
        masanbay: '',
        tensanbay: '',
        matinhthanh: '',
        tentinhthanh: '',
    });
    mangNgayDi.push({ id: _id, id_element: 'NgayDi_div_' + _id.toString(), ngaydi: '' });
    const node = document.getElementById('Hang2_div_0').cloneNode(true);
    node.id = 'Hang2_div_' + _id.toString();
    node.children[0].id = 'SanBayDi_div_' + _id.toString();
    node.children[2].id = 'SanBayDen_div_' + _id.toString();
    node.children[3].id = 'NgayDi_div_' + _id.toString();
    node.children[3].children[0].children[0].children[1].setAttribute('min', yyyy + '-' + mm + '-' + dd);
    node.children[0].children[1].children[1].value = '';
    node.children[2].children[1].children[1].value = '';
    node.children[3].children[0].children[0].children[1].value = '';

    Body.insertBefore(node, ThemChuyenBay_div);

    if (mangChuyenBay.length > 2) {
        document
            .getElementById('Hang2_div_' + (_id - 1).toString())
            .children[3].children[0].children[1].classList.add('d-none');
        document
            .getElementById('Hang2_div_' + _id.toString())
            .children[3].children[0].children[1].classList.remove('d-none');
    }
};
window.xoachuyenbay_onclick = function xoachuyenbay_onclick(e) {
    const NgayDi_div = e.parentNode.parentNode.parentNode;
    let _id = mangNgayDi.find((i) => i.id_element == NgayDi_div.id).id;
    mangChuyenBay.splice(_id, 1);
    mangSanBayDi.splice(_id, 1);
    mangSanBayDen.splice(_id, 1);
    mangNgayDi.splice(_id, 1);
    Body.removeChild(document.getElementById('Hang2_div_' + _id.toString()));
    if (mangChuyenBay.length > 2) {
        document
            .getElementById('Hang2_div_' + (_id - 1).toString())
            .children[3].children[0].children[1].classList.remove('d-none');
    }
};
