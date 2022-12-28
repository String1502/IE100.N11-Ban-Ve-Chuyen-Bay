import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
} from '../start.js';

//Lấy gói đặt từ Chọn chuyến bay
let PackageBooking;
function GetPackageBooing_fromSV() {
    openLoader('Chờ chút');
    PackageBooking = JSON.parse(document.getElementById('PackageBookingJS').getAttribute('PackageBookingJS'));
    closeLoader();

    if (PackageBooking) {
        axios({
            method: 'post',
            url: '/hoadon/XoaCookieMaHangVe',
        }).then((res) => {
            formatNumber();
            Add_ChuyenBay_Item_ChiTiet_Click();
            AddTomTat_KhachHang_Item();
        });
    }
    console.log(PackageBooking);
}
if (!PackageBooking) GetPackageBooing_fromSV();

function formatNumber() {
    const ChuyenBay_Item_NgayDis = document.querySelectorAll('.ChuyenBay_Item_NgayDi');
    const ChuyenBay_Item_TenHangGhes = document.querySelectorAll('.ChuyenBay_Item_TenHangGhe');
    const ChuyenBay_Item_ThoiGianDi_GioDis = document.querySelectorAll('.ChuyenBay_Item_ThoiGianDi_GioDi');
    const ChuyenBay_Item_ThoiGianDen_GioDens = document.querySelectorAll('.ChuyenBay_Item_ThoiGianDen_GioDen');
    const ChuyenBay_Item_ThoiGianBays = document.querySelectorAll('.ChuyenBay_Item_ThoiGianBay');

    const MangChuyenBayTimKiem = PackageBooking.MangChuyenBayTimKiem;
    for (let i = 0; i < MangChuyenBayTimKiem.length; i++) {
        let ngay = new Date(
            `${MangChuyenBayTimKiem[i].NgayDi.Nam}-${MangChuyenBayTimKiem[i].NgayDi.Thang}-${MangChuyenBayTimKiem[i].NgayDi.Ngay}`,
        );
        ChuyenBay_Item_NgayDis[i].innerText =
            getThuTrongTuan(ngay) +
            `, ${MangChuyenBayTimKiem[i].NgayDi.Ngay} Thg ${MangChuyenBayTimKiem[i].NgayDi.Thang} ${MangChuyenBayTimKiem[i].NgayDi.Nam}`;
        ChuyenBay_Item_TenHangGhes[i].innerText = PackageBooking.HangGhe.TenHangGhe;

        ChuyenBay_Item_ThoiGianDi_GioDis[i].innerText =
            numberSmallerTen(MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianDi.GioDi.Gio) +
            ':' +
            numberSmallerTen(MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianDi.GioDi.Phut);
        ChuyenBay_Item_ThoiGianDen_GioDens[i].innerText =
            numberSmallerTen(MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianDen.GioDen.Gio) +
            ':' +
            numberSmallerTen(MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianDen.GioDen.Phut);
        ChuyenBay_Item_ThoiGianBays[i].innerText =
            numberSmallerTen(MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianBay.Gio) +
            'h ' +
            numberSmallerTen(MangChuyenBayTimKiem[i].ChuyenBayDaChon.ThoiGianBay.Phut) +
            'm';
    }
}

function Add_ChuyenBay_Item_ChiTiet_Click() {
    const ChuyenBay_Item_ChiTiets = document.querySelectorAll('.ChuyenBay_Item_ChiTiet');
    for (let i = 0; i < ChuyenBay_Item_ChiTiets.length; i++) {
        ChuyenBay_Item_ChiTiets[i].addEventListener('click', (e) => {
            const MaChuyenBay = e.target.title;
            const ChuyenBayDaChon = PackageBooking.MangChuyenBayTimKiem.find(
                (item) => item.ChuyenBayDaChon.MaChuyenBay == MaChuyenBay,
            ).ChuyenBayDaChon;
            const Modal = document.getElementById('Modal');
            Modal.querySelector('.Modal_MaChuyenBay').innerText =
                ChuyenBayDaChon.SanBayDi.MaSanBay +
                '-' +
                ChuyenBayDaChon.SanBayDen.MaSanBay +
                '-' +
                ChuyenBayDaChon.MaChuyenBay;
            Modal.querySelector('.Modal_GiaVe').innerText = numberWithDot(ChuyenBayDaChon.GiaVe);
            const Model_TrungGian_Container = document.getElementById('Model_TrungGian_Container');

            const Model_TrungGian_Items = Model_TrungGian_Container.querySelectorAll('.Model_TrungGian_Item');
            if (Model_TrungGian_Items.length > 1) {
                let num = Model_TrungGian_Items.length;
                for (let j = num - 1; j > 0; j--) {
                    Model_TrungGian_Container.removeChild(Model_TrungGian_Items[j]);
                }
            }
            const ChanBays = structuredClone(ChuyenBayDaChon.ChanBay);
            for (let j = 0; j < ChanBays.length; j++) {
                const node = Model_TrungGian_Items[0].cloneNode(true);
                node.classList.remove('d-none');
                node.querySelector('.Model_TrungGian_Item_GioDi').innerText =
                    numberSmallerTen(ChanBays[j].ThoiGianDi.GioDi.Gio) +
                    ':' +
                    numberSmallerTen(ChanBays[j].ThoiGianDi.GioDi.Phut);

                node.querySelector('.Model_TrungGian_Item_NgayDi').innerText =
                    numberSmallerTen(ChanBays[j].ThoiGianDi.NgayDi.Ngay) +
                    '-' +
                    numberSmallerTen(ChanBays[j].ThoiGianDi.NgayDi.Thang) +
                    '-' +
                    ChanBays[j].ThoiGianDi.NgayDi.Nam;

                node.querySelector('.Model_TrungGian_Item_ThoiGianBay').innerText =
                    numberSmallerTen(ChanBays[j].ThoiGianBay.Gio) +
                    'h ' +
                    numberSmallerTen(ChanBays[j].ThoiGianBay.Phut) +
                    'm';

                node.querySelector('.Model_TrungGian_Item_GioDen').innerText =
                    numberSmallerTen(ChanBays[j].ThoiGianDen.GioDen.Gio) +
                    ':' +
                    numberSmallerTen(ChanBays[j].ThoiGianDen.GioDen.Phut);

                node.querySelector('.Model_TrungGian_Item_NgayDen').innerText =
                    numberSmallerTen(ChanBays[j].ThoiGianDen.NgayDen.Ngay) +
                    '-' +
                    numberSmallerTen(ChanBays[j].ThoiGianDen.NgayDen.Thang) +
                    '-' +
                    ChanBays[j].ThoiGianDen.NgayDen.Nam;

                node.querySelector('.Model_TrungGian_Item_SanBayDi').innerText =
                    ChanBays[j].SanBayDi.MaSanBay + ' - ' + ChanBays[j].SanBayDi.TinhThanh;
                node.querySelector('.Model_TrungGian_Item_SanBayDen').innerText =
                    ChanBays[j].SanBayDen.MaSanBay + ' - ' + ChanBays[j].SanBayDen.TinhThanh;

                node.querySelector('.Model_TrungGian_Item_Divider_SanBayDen').innerText =
                    ChanBays[j].SanBayDen.TenSanBay +
                    ' (' +
                    numberSmallerTen(ChanBays[j].ThoiGianDung_SanBayDen.Gio) +
                    'h ' +
                    numberSmallerTen(ChanBays[j].ThoiGianDung_SanBayDen.Phut) +
                    'm)';
                if (j == ChanBays.length - 1)
                    node.querySelector('.Model_TrungGian_Item_Divider').classList.add('d-none');

                Model_TrungGian_Container.appendChild(node);
            }
        });
    }
}

function AddTomTat_KhachHang_Item() {
    const TomTat_HanhKhach_Container = document.getElementById('TomTat_HanhKhach_Container');
    const TomTat_HanhKhach_Items = document.querySelectorAll('.TomTat_HanhKhach_Item');
    if (TomTat_HanhKhach_Items.length > 1) {
        let num = TomTat_HanhKhach_Items.length;
        for (let i = num - 1; i > 0; i--) {
            TomTat_HanhKhach_Container.removeChild(TomTat_HanhKhach_Items[i]);
        }
    }

    const HanhKhachs = PackageBooking.HanhKhach;
    console.log(HanhKhachs);
    let GiaBanTra = 0;
    for (let i = 0; i < HanhKhachs.length; i++) {
        const node = TomTat_HanhKhach_Items[0].cloneNode(true);
        node.classList.remove('d-none');

        node.querySelector('.TomTat_HanhKhach_Item_Title').innerText = HanhKhachs[i].title;
        node.querySelector('.TomTat_HanhKhach_Item_Value').innerText = HanhKhachs[i].value;
        node.querySelector('.TomTat_HanhKhach_Item_TongTienVe').innerText = numberWithDot(HanhKhachs[i].TongTienVe);

        TomTat_HanhKhach_Container.appendChild(node);
        GiaBanTra += parseInt(HanhKhachs[i].TongTienVe);
    }

    document.getElementById('TomTat_HanhKhach_GiaBanTra').innerText = numberWithDot(GiaBanTra);
}

window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});

function SendForm(_PackageBooking) {
    document.getElementById('packagebooking').value = JSON.stringify(_PackageBooking);
    var book_flight_form = document.forms['book-flight-form'];
    book_flight_form.action = '/booking';
    book_flight_form.submit();
}

const TiepTuc = document.getElementById('TiepTuc');
if (TiepTuc) {
    TiepTuc.addEventListener('click', () => {
        SendForm(PackageBooking);
    });
}
