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

const btn_load_doanh_thu = document.querySelector('#btn_load_doanh_thu');
btn_load_doanh_thu.addEventListener('click', LoadBaocaoDoanhThu);

function LoadBaocaoDoanhThu(nam) {
    console.log("I'm loading reports");
    if (nam <= 0) return;

    openLoader('Chờ chút');

    axios({
        method: 'post',
        url: 'Chờ Trí',
        data: { GetReportByYear: nam },
    }).then((res) => {
        Reports = res.data;
        closeLoader();
        if (FlightList_fromDB) {
            // AddEventCacTieuChuanTraCuu();
            // AddEventKeyUpSearch();
        }
    });
}

function GanGiaTriChoRow(item, values) {
    item.querySelector('.Item_ChiTiet').setAttribute('MaChuyenBay', values.MaChuyenBay);
    item.querySelector('.Item_MaChuyenBayHienThi').innerText = values.MaChuyenBayHienThi;
    item.querySelector('.Item_KhoiHanh').innerText = values.KhoiHanh;
    item.querySelector('.Item_VeDaBan').innerText = values.VeDaBan;
    item.querySelector('.Item_DoanhThu').innerText = values.DoanhThu;
    item.querySelector('.Item_TiLe').innerText = values.TiLe;
}

function ThemRow_Table(thang) {
    let item_body_Containers = document.querySelectorAll('.item_body_Container');
    let container;
    for (let i = 0; i < item_body_Containers.length; i++) {
        if (item_body_Containers[i].getAttribute('thang') == thang.toString()) {
            container = item_body_Containers[i];
            break;
        }
    }

    let item_body_Item = container.querySelector('.item_body_Item').cloneNode(true);
    item_body_Item.classList.remove('d-none');

    GanGiaTriChoRow(item_body_Item, {
        MaChuyenBay: 'MCB',
        MaChuyenBayHienThi: 'Haha',
        KhoiHanh: '11:11 11/11/2022',
        VeDaBan: 10,
        DoanhThu: numberWithDot(12000000) + ' VND',
        TiLe: '20%',
    });

    container.appendChild(item_body_Item);
}

function KhoiTaoAccordion(thang) {
    if (thang <= 0) return;

    // Get template accordion item
    let accordion_item = document.querySelector('.accordion-item').cloneNode(true);

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
    // Set tháng cho body
    accordion_item.querySelector('.item_body_Container').setAttribute('thang', thang);

    // Thêm vào accordion_container
    accordion_Container.appendChild(accordion_item);

    // Thêm dòng vào bảng
    for (let i = 0; i < 5; i++) {
        ThemRow_Table(thang); // Thêm chuyến bay
    }
}

for (let i = 1; i <= 12; i++) {
    KhoiTaoAccordion(i);
}
