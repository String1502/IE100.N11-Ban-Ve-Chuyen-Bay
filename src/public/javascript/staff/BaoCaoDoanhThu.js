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

let Reports;

const years = document.querySelectorAll('.Nam_Item');

for (let i = 0; i < years.length; i++) {
    years[i].addEventListener('click', (e) => {
        console.log(e.target);
        const year = e.target.querySelector('div').innerText;

        document.getElementById('Nam').setAttribute('nam', year);
        document.getElementById('Nam').value = year;

        UpdateYearReport(year);
    });
}

const currentYearComboboxItem = document.querySelector('#Nam_Container');
const currentYear = currentYearComboboxItem.lastElementChild.querySelector('div').getAttribute('nam');
document.getElementById('Nam').setAttribute('nam', currentYear);
document.getElementById('Nam').value = currentYear;
UpdateYearReport(currentYear);

// const btn_load_doanh_thu = document.querySelector('#btn_load_doanh_thu');
// btn_load_doanh_thu.addEventListener('click', () => {
//     let currentYearComboboxItem = document.querySelector('#Nam_Container');
//     let currentYear = currentYearComboboxItem.lastElementChild.querySelector('div').getAttribute('nam');

//     LoadBaocaoDoanhThu(currentYear);
// });

function LoadBaocaoDoanhThu(nam) {
    console.log("I'm loading reports");
    if (nam <= 0) return;

    openLoader('Chờ chút');

    axios({
        method: 'post',
        url: '/staff/baocao/GetReports',
        data: { Nam: nam },
    }).then((res) => {
        Reports = res.data;
        closeLoader();
        if (Reports) {
            console.log(Reports);
            LoadReportsToView();
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

    // Get report of the month
    const haveData = Reports.DoanhThu.length > 0;
    let data = null;
    if (haveData) data = Reports.DoanhThu.find((doanhThu) => doanhThu.Thang == thang);

    console.log(data);

    // Get template accordion item
    let accordion_item = document.querySelector('.accordion-item').cloneNode(true);

    // Hiện ra
    accordion_item.classList.remove('d-none');

    // Set tháng
    accordion_item.setAttribute('thang', thang);

    // id khi mở
    if (haveData) {
        accordion_item.querySelector('.accordion-button').setAttribute('data-bs-target', '#item_body_thang' + thang);
        accordion_item.querySelector('.accordion-collapse').setAttribute('id', 'item_body_thang' + thang);
    }

    // nội dung header
    accordion_item.querySelector('.item_header_thang').innerText = 'Tháng ' + thang;
    accordion_item.querySelector('.item_header_sochuyenbay').innerText = haveData
        ? parseInt(data.SoChuyenBay)
        : 'Chưa có dữ liệu';
    accordion_item.querySelector('.item_header_doanhthu').innerText = haveData
        ? numberWithDot(parseInt(data.TongDoanhThu))
        : 'Chưa có dữ liệu';

    // nút xuất báo cáo
    accordion_item.querySelector('.item_header_btn').setAttribute('thang', thang);
    accordion_item.querySelector('.item_header_btn').disabled = !haveData;

    // table thuộc tháng nào?
    // Set tháng cho body
    accordion_item.querySelector('.item_body_Container').setAttribute('thang', thang);

    // Thêm vào accordion_container
    accordion_Container.appendChild(accordion_item);

    // Thêm dòng vào bảng
    if (!haveData) return;

    for (let i = 0; i < 5; i++) {
        ThemRow_Table(thang); // Thêm chuyến bay
    }
}

function LoadReportsToView() {
    for (let i = 1; i <= 12; i++) {
        KhoiTaoAccordion(i);
    }
}

function UpdateYearReport(nam) {
    console.log("I'm loading reports");
    if (nam <= 0) return;

    openLoader('Chờ chút');

    axios({
        method: 'post',
        url: '/staff/baocao/GetReports',
        data: { Nam: nam },
    }).then((res) => {
        Reports = res.data;
        closeLoader();
        if (Reports) {
            console.log(Reports);
            LoadReportsToView();
            // AddEventCacTieuChuanTraCuu();
            // AddEventKeyUpSearch();
        }
    });
}
