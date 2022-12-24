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
    dateIsValid,
} from '../start.js';

// #region Run when page load

let Reports;
let currentyear = 0;

const years = document.querySelectorAll('.Nam_Item');

for (let i = 0; i < years.length; i++) {
    years[i].addEventListener('click', (e) => {
        // Get year in combobox item
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

//#endregion

//#region Utils

function getCount(parent, getChildrensChildren) {
    var relevantChildren = 0;
    var children = parent.childNodes.length;
    for (var i = 0; i < children; i++) {
        if (parent.childNodes[i].nodeType != 3) {
            if (getChildrensChildren) relevantChildren += getCount(parent.childNodes[i], true);
            relevantChildren++;
        }
    }
    return relevantChildren;
}

//#endregion

//#region Functions

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
        console.log(Reports);
        closeLoader();
        if (Reports) {
            LoadReportsToView();
            // AddEventCacTieuChuanTraCuu();
            // AddEventKeyUpSearch();
        }
    });
}

function ClearAllMonthAccordion() {
    let childCount = getCount(accordion_Container, false);

    console.log(childCount);

    while (childCount > 1) {
        const lastChild = accordion_Container.lastChild;
        console.log(accordion_Container.lastChild);
        accordion_Container.removeChild(lastChild);
        childCount--;
    }
}

function LoadReportsToView() {
    // clear current accordion
    // Clear table
    ClearAllMonthAccordion();

    // Load year data

    tong_doanh_thu.innerText = numberWithDot(Reports.TongDoanhThu);
    doanh_thu_nam_status.innerText = Reports.DoanhThu.length == 12 ? '' : '(Chưa kết thúc)';

    for (let month = 1; month <= 12; month++) {
        const monthData = Reports.DoanhThu.find((doanhThu) => doanhThu.Thang == month);
        KhoiTaoAccordion(month, monthData);
    }
}

function getMonthAccordionClone() {
    const accordion_item = document.querySelector('.accordion-item').cloneNode(true);
    return accordion_item;
}

function LoadEmptyMonth(thang, clone) {
    // Hiện ra
    clone.classList.remove('d-none');

    // Set tháng
    clone.setAttribute('thang', thang);

    // nội dung header
    clone.querySelector('.item_header_thang').innerText = 'Tháng ' + thang;
    clone.querySelector('.item_header_sochuyenbay').innerText = 'Không có dữ liệu';
    clone.querySelector('.item_header_doanhthu').innerText = 'Không có dữ liệu';

    // nút xuất báo cáo
    clone.querySelector('.item_header_btn').setAttribute('thang', thang);
    clone.querySelector('.item_header_btn').disabled = true;

    // table thuộc tháng nào?
    // Set tháng cho body
    clone.querySelector('.item_body_Container').setAttribute('thang', thang);
}

function LoadMonthData(thang, data, clone) {
    // Hiện ra
    clone.classList.remove('d-none');

    // Set tháng
    clone.setAttribute('thang', thang);

    // id khi mở
    clone.querySelector('.accordion-button').setAttribute('data-bs-target', '#item_body_thang' + thang);
    clone.querySelector('.accordion-collapse').setAttribute('id', 'item_body_thang' + thang);

    // nội dung header
    clone.querySelector('.item_header_thang').innerText = 'Tháng ' + thang;
    clone.querySelector('.item_header_sochuyenbay').innerText = parseInt(data.SoChuyenBay);
    clone.querySelector('.item_header_doanhthu').innerText = numberWithDot(parseInt(data.TongDoanhThu));

    // nút xuất báo cáo
    clone.querySelector('.item_header_btn').setAttribute('thang', thang);

    // table thuộc tháng nào?
    // Set tháng cho body
    clone.querySelector('.item_body_Container').setAttribute('thang', thang);
}

function KhoiTaoAccordion(thang, data) {
    if (thang <= 0) return;

    const clone = getMonthAccordionClone();

    if (!data) {
        LoadEmptyMonth(thang, clone);
    } else {
        LoadMonthData(thang, data, clone);
    }

    accordion_Container.appendChild(clone);

    // // get Flight data
    if (data) {
        const flights = data.ChuyenBay;

        flights.forEach((flight) =>
            InsertNewRow(thang, {
                MaChuyenBay: flight.MaChuyenBay,
                MaChuyenBayHienThi: flight.MaHienThi,
                KhoiHanh: flight.NgayGio,
                VeDaBan: flight.TongVe,
                DoanhThu: numberWithDot(flight.DoanhThu) + ' VND',
                TiLe: flight.TiLe,
            }),
        );
    }

    // for (let i = 0; i < 3; i++)
    //     InsertNewRow(thang, {
    //         MaChuyenBay: 'MCB',
    //         MaChuyenBayHienThi: 'Haha',
    //         KhoiHanh: '11:11 11/11/2022',
    //         VeDaBan: 10,
    //         DoanhThu: numberWithDot(12000000) + ' VND',
    //         TiLe: '20%',
    //     });

    return;
}

function InsertNewRow(thang, data) {
    let item_body_Containers = document.querySelectorAll('.item_body_container');
    let container;

    for (let i = 0; i < item_body_Containers.length; i++) {
        if (item_body_Containers[i].getAttribute('thang') == thang.toString()) {
            container = item_body_Containers[i];
            break;
        }
    }

    let item_body_Item = container.querySelector('.item_body_Item').cloneNode(true);
    item_body_Item.classList.remove('d-none');

    GanGiaTriChoRow(item_body_Item, data);

    const detailButton = item_body_Item.querySelector('.Item_ChiTiet');

    container.appendChild(item_body_Item);
}

function GanGiaTriChoRow(item, values) {
    item.querySelector('.Item_ChiTiet').setAttribute('MaChuyenBay', values.MaChuyenBay);
    item.querySelector('.Item_MaChuyenBayHienThi').innerText = values.MaChuyenBayHienThi;
    item.querySelector('.Item_KhoiHanh').innerText = values.KhoiHanh;
    item.querySelector('.Item_VeDaBan').innerText = values.VeDaBan;
    item.querySelector('.Item_DoanhThu').innerText = values.DoanhThu;
    item.querySelector('.Item_TiLe').innerText = values.TiLe;
}

//#endregion

//#region Trash but maybe usable

// const btn_load_doanh_thu = document.querySelector('#btn_load_doanh_thu');

// btn_load_doanh_thu.addEventListener('click', () => {
//     let currentYearComboboxItem = document.querySelector('#Nam_Container');
//     let currentYear = currentYearComboboxItem.lastElementChild.querySelector('div').getAttribute('nam');

//     LoadBaocaoDoanhThu(currentYear);
// });

// function LoadBaocaoDoanhThu(nam) {
//     console.log("I'm loading reports");
//     if (nam <= 0) return;

//     openLoader('Chờ chút');

//     axios({
//         method: 'post',
//         url: '/staff/baocao/GetReports',
//         data: { Nam: nam },
//     }).then((res) => {
//         Reports = res.data;
//         closeLoader();
//         if (Reports) {
//             LoadReportsToView();
//             // AddEventCacTieuChuanTraCuu();
//             // AddEventKeyUpSearch();
//         }
//     });
// }

//#endregion
