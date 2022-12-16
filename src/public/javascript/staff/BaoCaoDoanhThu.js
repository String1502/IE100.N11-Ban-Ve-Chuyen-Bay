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
    money_format_input,
    validateEmail,
    dateIsValid,
} from '../start.js';

function KhoiTaoAccordion(thang) {
    var accordion_item = document.querySelector('.accordion-item').cloneNode(true);

    // Hiện ra
    accordion_item.classList.remove('d-none');

    // Set tháng
    accordion_item.setAttribute('thang', thang);

    // id khi mở
    accordion_item.querySelector('.accordion-button').setAttribute('data-bs-target', '#item_body_thang' + thang);
    accordion_item.querySelector('.accordion-collapse').setAttribute('id', 'item_body_thang' + thang);

    // nội dung header
    accordion_item.querySelector('.item_header_thang').innerText = 'Tháng ' + thang;
    accordion_item.querySelector('.item_header_sochuyenbay').innerText = 123;
    accordion_item.querySelector('.item_header_doanhthu').innerText = numberWithDot(12000000);

    // nút xuất báo cáo
    accordion_item.querySelector('.item_header_btn').setAttribute('thang', thang);

    // table thuộc tháng nào?
    accordion_item.querySelector('.item_body_Container').setAttribute('thang', thang);

    // Thêm vào accordion_container
    accordion_Container.appendChild(accordion_item);

    // Thêm dòng vào bảng
    for (let i = 0; i < 5; i++) {
        ThemRow_Table(thang);
    }
}

function ThemRow_Table(thang) {
    console.log(thang);
    var item_body_Containers = document.querySelectorAll('.item_body_Container');
    var container;
    for (let i = 0; i < item_body_Containers.length; i++) {
        if (item_body_Containers[i].getAttribute('thang') == thang.toString()) {
            container = item_body_Containers[i];
            break;
        }
    }

    var item_body_Item = container.querySelector('.item_body_Item').cloneNode(true);
    item_body_Item.classList.remove('d-none');

    item_body_Item.querySelector('.Item_MaChuyenBayHienThi').innerText = 'Haha';
    item_body_Item.querySelector('.Item_KhoiHanh').innerText = '11:11 11/11/2022';
    item_body_Item.querySelector('.Item_VeDaBan').innerText = 10;
    item_body_Item.querySelector('.Item_DoanhThu').innerText = numberWithDot(12000000) + ' VND';
    item_body_Item.querySelector('.Item_TiLe').innerText = '20%';

    item_body_Item.querySelector('.Item_ChiTiet').setAttribute('MaChuyenBay', 'Haha');

    container.appendChild(item_body_Item);
}

for (let i = 1; i <= 12; i++) {
    KhoiTaoAccordion(i);
}
