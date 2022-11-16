import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
    today,
    showToast,
} from '../start.js';

window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});

//Lấy danh sách chuyến bay từ DB
let FlightList_fromDB;
function GetFlight_fromSV() {
    openLoader('Chờ chút');
    axios({
        method: 'post',
        url: '/flight/get-all-flights',
        data: { GetFlight_fromSV: true },
    }).then((res) => {
        FlightList_fromDB = res.data;
        closeLoader();
        if (FlightList_fromDB) {
            LoadChuyenBayLenView();
            console.log(FlightList_fromDB);
        }
    });
}
if (!FlightList_fromDB) GetFlight_fromSV();

function LoadChuyenBayLenView() {
    const ChuyenBay_Container = document.getElementById('ChuyenBay_Container');
    const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');
    if (ChuyenBay_Items.length > 1) {
        let num = ChuyenBay_Items.length;
        for (let i = num - 1; i > 0; i--) {
            ChuyenBay_Container.removeChild(ChuyenBay_Items[i]);
        }
    }

    const ChuyenBays = FlightList_fromDB;
    for (let i = 0; i < ChuyenBays.length; i++) {
        const node = ChuyenBay_Items[0].cloneNode(true);
        node.classList.remove('d-none');
        node.setAttribute('aria-valuetext', i);

        node.querySelector('.MaChuyenBayHienThi').innerText = ChuyenBays[i].MaHienThi;
        node.querySelector('.TenSanBayDi').innerText = ChuyenBays[i].SanBayDi.TenSanBay;
        node.querySelector('.TenSanBayDen').innerText = ChuyenBays[i].SanBayDen.TenSanBay;
        node.querySelector('.KhoiHanh').innerText =
            numberSmallerTen(ChuyenBays[i].KhoiHanh.GioDi.Gio) +
            ':' +
            numberSmallerTen(ChuyenBays[i].KhoiHanh.GioDi.Phut) +
            ' ' +
            numberSmallerTen(ChuyenBays[i].KhoiHanh.NgayDi.Ngay) +
            '-' +
            numberSmallerTen(ChuyenBays[i].KhoiHanh.NgayDi.Thang) +
            '-' +
            ChuyenBays[i].KhoiHanh.NgayDi.Nam;
        node.querySelector('.DiemDung').innerText = ChuyenBays[i].SoDiemDung;
        node.querySelector('.GiaVeCoBan').innerText = numberWithDot(ChuyenBays[i].GiaVeCoBan);
        node.querySelector('.GheTrong').innerText = ChuyenBays[i].GheTrong;
        node.querySelector('.ChiTiet').addEventListener('click', (e) => {
            let index = parseInt(e.target.closest('.ChuyenBay_Item').getAttribute('aria-valuetext'));
            SendForm({
                MaChuyenBay: FlightList_fromDB[index].MaChuyenBay,
                MaChuyenBayHienThi: FlightList_fromDB[index].MaHienThi,
            });
        });

        ChuyenBay_Container.appendChild(node);
    }
}

function SendForm(Package) {
    document.getElementById('package').value = JSON.stringify(Package);
    var staff_form = document.forms['flight-detail-form'];
    staff_form.action = '/staff/flightdetail';
    staff_form.submit();
}

// const DangNhap = document.getElementById('DangNhap');

// DangNhap.addEventListener('click', (e) => {
//     SendForm('Haha');
// });
