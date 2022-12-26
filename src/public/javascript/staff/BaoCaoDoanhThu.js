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

function GetFlightDataFromElement(row) {
    let flightData = {};

    flightData.MaChuyenBay = row.querySelector('.Item_ChiTiet').getAttribute('MaChuyenBay');
    flightData.MaChuyenBayHienThi = row.querySelector('.Item_MaChuyenBayHienThi').innerText;
    flightData.KhoiHanh = row.querySelector('.Item_KhoiHanh').innerText;
    flightData.TongVe = row.querySelector('.Item_TongVe').innerText;
    flightData.VeDaBan = row.querySelector('.Item_VeDaBan').innerText;
    flightData.DoanhThu = row.querySelector('.Item_DoanhThu').innerText;
    flightData.TiLe = row.querySelector('.Item_TiLe').innerText;
    flightData.ChiTietHangVe = row.querySelector('.Item_ChiTiet').getAttribute('ChiTietHangVe');
    flightData.GiaVeCoBan = row.querySelector('.Item_ChiTiet').getAttribute('GiaVeCoBan');

    return flightData;
}

let firstModalChart;
let secondModalChart;

function FillDataIntoDetailModal(flightData) {
    MaHienThi_Title_Modal.innerText = flightData.MaChuyenBayHienThi;
    TongVe_Modal.innerText = flightData.VeDaBan;
    DoanhThu_Ve_Modal.innerText = flightData.DoanhThu;
    VeDaBan_Right_Header_Title.innerText = flightData.VeDaBan;
    DoanhThu_Right_Header_Title.innerText = flightData.DoanhThu;

    console.log(flightData);

    // Graph
    const chiTietHangVe = JSON.parse(flightData.ChiTietHangVe);
    const tenHangVes = chiTietHangVe.map((chiTiet) => chiTiet.TenHangGhe);
    const veDaBans = chiTietHangVe.map((chiTiet) => chiTiet.VeDaBan);
    const doanhThus = chiTietHangVe.map((chiTiet) => flightData.GiaVeCoBan * chiTiet.HeSo * chiTiet.VeDaBan);

    const ctx_1 = document.getElementById('chart_1');
    const ctx_2 = document.getElementById('chart_2');

    if (firstModalChart) firstModalChart.destroy();

    if (secondModalChart) secondModalChart.destroy();

    firstModalChart = new Chart(ctx_1, {
        type: 'doughnut',
        data: {
            labels: tenHangVes,
            datasets: [
                {
                    label: 'Vé đã bán',
                    data: veDaBans,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    fullSize: true,
                    text: 'Vé đã bán',
                    color: '#04bfa',
                    position: 'bottom',
                    align: 'center',
                },
            },
        },
    });

    secondModalChart = new Chart(ctx_2, {
        type: 'doughnut',
        data: {
            labels: tenHangVes,
            datasets: [
                {
                    label: 'Doanh thu',
                    data: doanhThus,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Doanh thu',
                    fullSize: true,
                    color: '#04bfa',
                    position: 'bottom',
                    align: 'center',
                },
            },
        },
    });
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
    const hasAnyFlight = data.ChuyenBay && data.ChuyenBay.length > 0;
    // Hiện ra
    clone.classList.remove('d-none');

    if (!hasAnyFlight) {
        clone.querySelector('.item_header_btn').disabled = true;
        clone.querySelector('.table').classList.add('d-none');
        clone.querySelector('.no_flight_identifier').classList.remove('d-none');
        clone.querySelector('.table_rapper').style.height = '50px';
    }

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

        console.log(flights);

        flights.forEach((flight) =>
            InsertNewRow(thang, {
                MaChuyenBay: flight.MaChuyenBay,
                MaChuyenBayHienThi: flight.MaHienThi,
                KhoiHanh: flight.NgayGio,
                GiaVeCoBan: flight.GiaVeCoBan,
                TongVe: flight.TongVe,
                VeDaBan: flight.VeDaBan,
                DoanhThu: numberWithDot(flight.DoanhThu) + ' VND',
                TiLe: flight.TiLe,
                ChiTietHangVe: flight.ChiTietHangVe,
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

    detailButton.addEventListener('click', (e) => {
        // Get data
        // Get the flight row
        const row = e.target.closest('.item_body_Item');

        // Get data from it
        const flightData = GetFlightDataFromElement(row);

        // Fill data in detail modal
        FillDataIntoDetailModal(flightData);
    });

    container.appendChild(item_body_Item);
}

function GanGiaTriChoRow(item, values) {
    item.querySelector('.Item_ChiTiet').setAttribute('MaChuyenBay', values.MaChuyenBay);
    item.querySelector('.Item_MaChuyenBayHienThi').innerText = values.MaChuyenBayHienThi;
    item.querySelector('.Item_KhoiHanh').innerText = values.KhoiHanh;
    item.querySelector('.Item_TongVe').innerText = values.TongVe;
    item.querySelector('.Item_VeDaBan').innerText = values.VeDaBan;
    item.querySelector('.Item_DoanhThu').innerText = values.DoanhThu;
    item.querySelector('.Item_TiLe').innerText = values.TiLe;
    item.querySelector('.Item_ChiTiet').setAttribute('ChiTietHangVe', JSON.stringify(values.ChiTietHangVe));
    item.querySelector('.Item_ChiTiet').setAttribute('GiaVeCoBan', values.GiaVeCoBan);
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
