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
    ActiveNavItem_Header,
} from '../start.js';

ActiveNavItem_Header('DoanhThu');
// #region Run when page load

let Reports;
let CurrentModalBills;
// let currentyear = 0;

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

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentYearComboboxItem = document.querySelector('#Nam_Container');

// const currentYear = currentYearComboboxItem.lastElementChild.querySelector('div').getAttribute('nam');
let selectedYear = currentYearComboboxItem
    .querySelector(`[nam*="${currentYear}"]`)
    .querySelector('div')
    .getAttribute('nam');
console.log(selectedYear);
if (!selectedYear) selectedYear = currentYearComboboxItem.lastElementChild.querySelector('div').getAttribute('nam');

document.getElementById('Nam').setAttribute('nam', selectedYear);
document.getElementById('Nam').value = selectedYear;

UpdateYearReport(selectedYear);

AddEventToElements();

//#endregion

//#region Utils

function AddEventToElements() {
    xuat_bao_cao_nam_button.addEventListener('click', async (e) => {
        const data = Reports.DoanhThu.map((doanhThu) => ({
            Thang: doanhThu.Thang,
            SoChuyenBay: doanhThu.SoChuyenBay,
            TongDoanhThu: doanhThu.TongDoanhThu,
        }));

        for (let i = 1; i <= 12; i++) {
            const thang = data.find((doanhThu) => doanhThu.Thang == i);
            if (!thang) {
                data.splice(i - 1, 0, {
                    Thang: i,
                    SoChuyenBay: -1,
                    TongDoanhThu: -1,
                });
            }
        }

        for (let i = 0; i < data.length; i++) {
            if (data[i].SoChuyenBay != -1 && data[i].TongDoanhThu != -1) {
                data[i].TongDoanhThuFormated = numberWithDot(data[i].TongDoanhThu) + ' VND';
                data[i].SoChuyenBayFormated = numberWithDot(data[i].SoChuyenBay);
            } else {
                data[i].TongDoanhThuFormated = 'Không có dữ liệu';
                data[i].SoChuyenBayFormated = 'Không có dữ liệu';
            }
        }

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + '/' + mm + '/' + yyyy;

        openLoader('Chờ chút');

        const year = Nam.value;

        axios({
            method: 'post',
            url: '/staff/baocao/PrintReport',
            data: {
                DoanhThu: data,
                Year: year,
                NgayXuat: today,
            },
        }).then((res) => {
            axios({
                method: 'get',
                url: `/download?year=${year}`,
            });
            closeLoader();
        });
    });
}

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
    flightData.TenSanBayDi = row.querySelector('.Item_ChiTiet').getAttribute('TenSanBayDi');
    flightData.TenSanBayDen = row.querySelector('.Item_ChiTiet').getAttribute('TenSanBayDen');
    flightData.ThoiGianBay = row.querySelector('.Item_ChiTiet').getAttribute('ThoiGianBay');

    return flightData;
}

let firstModalChart;
let secondModalChart;

function FillDataIntoDetailModal(flightData) {
    console.log(flightData);

    MaHienThi_Title_Modal.innerText = flightData.MaChuyenBayHienThi;
    TongVe_Right_Header_Title.innerText = flightData.TongVe;
    DoanhThu_Right_Header_Title.innerText = flightData.DoanhThu;
    VeDaBan_Right_Header_Title.innerText = flightData.VeDaBan;
    DoanhThu_Right_Header_Title.innerText = flightData.DoanhThu;
    SanBayDi_FlightDetail_Modal.innerText = flightData.TenSanBayDi;
    SanBayDen_FlightDetail_Modal.innerText = flightData.TenSanBayDen;
    KhoiHanh_FlightDetail_Modal.innerText = flightData.KhoiHanh;
    ThoiGianBay_FlightDetail_Modal.innerText = flightData.ThoiGianBay;

    // Graph
    const chiTietHangVe = JSON.parse(flightData.ChiTietHangVe);
    const veDaBans = chiTietHangVe.map((chiTiet) => chiTiet.VeDaBan);
    const tenHangVeVaSoVes = chiTietHangVe.map((chiTiet) => `${chiTiet.TenHangGhe} (Tổng: ${chiTiet.TongVe})`);
    const tenHangVes = chiTietHangVe.map((chiTiet) => chiTiet.TenHangGhe);
    const doanhThus = chiTietHangVe.map((chiTiet) => flightData.GiaVeCoBan * chiTiet.HeSo * chiTiet.VeDaBan);

    const ctx_1 = document.getElementById('chart_1');
    const ctx_2 = document.getElementById('chart_2');

    if (firstModalChart) firstModalChart.destroy();

    if (secondModalChart) secondModalChart.destroy();

    firstModalChart = new Chart(ctx_1, {
        type: 'doughnut',
        data: {
            labels: tenHangVeVaSoVes,
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

    // Hoa don
    openLoader('Chờ chút');

    axios({
        method: 'post',
        url: '/staff/baocao/GetBills',
        data: { maChuyenBay: flightData.MaChuyenBay },
    }).then((res) => {
        CurrentModalBills = res.data;
        console.log(CurrentModalBills);
        closeLoader();
        if (CurrentModalBills) {
            LoadBillsToModal();
        }
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
        closeLoader();
        if (Reports) {
            LoadReportsToView();
        }
    });
}

function ClearAllMonthAccordion() {
    let childCount = getCount(accordion_Container, false);

    while (childCount > 1) {
        const lastChild = accordion_Container.lastChild;
        accordion_Container.removeChild(lastChild);
        childCount--;
    }
}

function ClearAllBills() {
    let childCount = getCount(hoa_don_table_body, false);

    while (childCount > 1) {
        const lastChild = hoa_don_table_body.lastChild;
        hoa_don_table_body.removeChild(lastChild);
        childCount--;
    }
}

function getBillClone() {
    const billClone = hoa_don_table_body.querySelector('.hoa_don_table_item').cloneNode(true);
    return billClone;
}

function InsertNewBill(bill) {
    const clone = getBillClone();

    clone.classList.remove('d-none');
    clone.querySelector('.hoa_don_table_item_ma_hd').innerText = bill.MaHoaDonHienThi;
    clone.querySelector('.hoa_don_table_item_nguoi_thanh_toan').innerText = bill.NguoiThanhToan;
    clone.querySelector('.hoa_don_table_item_so_ve').innerText = bill.SoVe;
    clone.querySelector('.hoa_don_table_item_dat_luc').innerText = bill.NgayGioDat;
    clone.querySelector('.hoa_don_table_item_hinh_thuc').innerText = bill.HinhThucThanhToan;
    clone.querySelector('.hoa_don_table_item_tong_tien').innerText = numberWithDot(bill.TongTien) + ' VND';

    hoa_don_table_body.appendChild(clone);
}

function LoadBillsToModal() {
    ClearAllBills();

    const bills = CurrentModalBills.HoaDonList;

    console.log(bills);

    if (!bills || bills.length <= 0) return;

    for (let i = 0; i < bills.length; i++) {
        InsertNewBill(bills[i]);
    }
}

function LoadReportsToView() {
    // clear current accordion
    // Clear table
    ClearAllMonthAccordion();

    // Load year data

    tong_doanh_thu.innerText = numberWithDot(Reports.TongDoanhThu);
    const isYearPassed = new Date().getFullYear() > Reports.Nam;
    doanh_thu_nam_status.innerText = isYearPassed ? '' : '(Chưa kết thúc)';

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

    clone.querySelector('.header').classList.add('bg-disable');

    // nút xuất báo cáo
    // clone.querySelector('.item_header_btn').setAttribute('thang', thang);
    // clone.querySelector('.item_header_btn').disabled = true;

    // table thuộc tháng nào?
    // Set tháng cho body
    clone.querySelector('.item_body_Container').setAttribute('thang', thang);
}

function LoadMonthData(thang, data, clone) {
    const hasAnyFlight = data.ChuyenBay && data.ChuyenBay.length > 0;
    // Hiện ra
    clone.classList.remove('d-none');

    if (!hasAnyFlight) {
        // clone.querySelector('.item_header_btn').disabled = true;
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
    // clone.querySelector('.item_header_btn').setAttribute('thang', thang);

    // table thuộc tháng nào?
    // Set tháng cho body
    clone.querySelector('.item_body_Container').setAttribute('thang', thang);
}

function KhoiTaoAccordion(thang, data) {
    if (thang <= 0) return;

    const clone = getMonthAccordionClone();

    if (!data || data.SoChuyenBay <= 0) {
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
                GiaVeCoBan: flight.GiaVeCoBan,
                TongVe: flight.TongVe,
                VeDaBan: flight.VeDaBan,
                DoanhThu: flight.DoanhThu ? numberWithDot(flight.DoanhThu) + ' VND' : 0 + ' VND',
                TiLe: flight.TiLe,
                ChiTietHangVe: flight.ChiTietHangVe,
                TenSanBayDi: flight.TenSanBayDi,
                TenSanBayDen: flight.TenSanBayDen,
                ThoiGianBay: flight.ThoiGianBay,
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
    item.querySelector('.Item_ChiTiet').setAttribute('TenSanBayDi', values.TenSanBayDi);
    item.querySelector('.Item_ChiTiet').setAttribute('TenSanBayDen', values.TenSanBayDen);
    item.querySelector('.Item_ChiTiet').setAttribute('KhoiHanh', values.KhoiHanh);
    item.querySelector('.Item_ChiTiet').setAttribute('ThoiGianBay', values.ThoiGianBay);
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
