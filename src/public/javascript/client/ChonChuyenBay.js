import { numberWithDot, numberWithoutDot, numberSmallerTen, openLoader, closeLoader } from '../start.js';

// #region Bộ lọc
// Add event bộ lọc điểm dừng
const BoLoc_DiemDung = document.getElementById('BoLoc_DiemDung');
if (BoLoc_DiemDung) {
    // Bay thẳng
    document.getElementById('BoLoc_DiemDung_BayThang').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
    // 1 điểm dừng
    document.getElementById('BoLoc_DiemDung_1DiemDung').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
    // 2 điểm dừng
    document.getElementById('BoLoc_DiemDung_Hon2DiemDung').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
    // thời gian dừng range
    document.getElementById('BoLoc_DiemDung_ThoiGianDung_Range').addEventListener('change', (e) => {
        document.getElementById('BoLoc_DiemDung_ThoiGianDung').innerText = numberSmallerTen(e.target.value) + ' h';
    });
}

// Add event bộ lọc thời gian bay
const BoLoc_ThoiGianBay = document.getElementById('BoLoc_ThoiGianBay');
if (BoLoc_ThoiGianBay) {
    // Cất cánh sáng sớm
    document.getElementById('BoLoc_ThoiGianBay_CatCanh_SangSom').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
    // Cất cánh sáng
    document.getElementById('BoLoc_ThoiGianBay_CatCanh_Sang').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
    // Cất cánh chiều
    document.getElementById('BoLoc_ThoiGianBay_CatCanh_Chieu').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
    // Cất cánh tối
    document.getElementById('BoLoc_ThoiGianBay_CatCanh_Toi').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });

    // Hạ cánh sáng sớm
    document.getElementById('BoLoc_ThoiGianBay_HaCanh_SangSom').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
    // Hạ cánh sáng
    document.getElementById('BoLoc_ThoiGianBay_HaCanh_Sang').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
    // Hạ cánh chiều
    document.getElementById('BoLoc_ThoiGianBay_HaCanh_Chieu').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
    // Hạ cánh tối
    document.getElementById('BoLoc_ThoiGianBay_HaCanh_Toi').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });

    // thời gian bay range
    document.getElementById('BoLoc_ThoiGianBay_ThoiGianBay_Range').addEventListener('change', (e) => {
        document.getElementById('BoLoc_ThoiGianBay_ThoiGianBay').innerText = numberSmallerTen(e.target.value) + ' h';
    });
}

// Add event bộ lọc thêm
const BoLoc_Them = document.getElementById('BoLoc_Them');
if (BoLoc_Them) {
    // giá vé range
    document.getElementById('BoLoc_ThemBoLoc_GiaVe_Range').addEventListener('change', (e) => {
        document.getElementById('BoLoc_ThemBoLoc_GiaVe').innerText = numberWithDot(e.target.value) + ' VND';
    });
}

// Add event sắp xếp
const BoLoc_SapXep = document.getElementById('BoLoc_SapXep');
if (BoLoc_SapXep) {
    // Giá thấp nhất
    document.getElementById('BoLoc_SapXep_GiaThapNhat').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
    // Cất cánh sớm nhất
    document.getElementById('BoLoc_SapXep_CatCanhSomNhat').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
    // Cất cánh muộn nhất
    document.getElementById('BoLoc_SapXep_CatCanhMuonNhat').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
    // Hạ cánh sớm nhất
    document.getElementById('BoLoc_SapXep_HaCanhSomNhat').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
    // Hạ cánh muộn nhất
    document.getElementById('BoLoc_SapXep_HaCanhMuonNhat').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
    // Thời gian bay ngắn nhất
    document.getElementById('BoLoc_SapXep_ThoiGianBayNganNhat').addEventListener('click', (e) => {
        if (!e.target.checked) return;
    });
}
// #endregion

const ThayDoiTimKiem = document.getElementById('ThayDoiTimKiem');
const TomTat_Container = document.getElementById('TomTat_Container');
const ChuyenBay_Container = document.getElementById('ChuyenBay_Container');

// Add event các chuyến bay từ DB
function addEventListener_ChuyenBay_Items() {
    const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');
    for (let i = 0; i < ChuyenBay_Items.length; i++) {
        // Sự kiện khi ấn chi tiết
        const ChuyenBay_Item_ChiTiet = ChuyenBay_Items[i].querySelector('.ChuyenBay_Item_ChiTiet');
        ChuyenBay_Item_ChiTiet.addEventListener('click', (e) => {
            const ChuyenBay_Item = e.target.closest('.ChuyenBay_Item');
            const ChuyenBay_Item_Detail = ChuyenBay_Item.querySelector('.ChuyenBay_Item_Detail');
            if (ChuyenBay_Item_Detail.classList.contains('d-none')) ChuyenBay_Item_Detail.classList.remove('d-none');
            else ChuyenBay_Item_Detail.classList.add('d-none');
        });
    }
}
addEventListener_ChuyenBay_Items();

//Lấy các tiêu chuẩn tra cứu từ Tra cứu chuyến bay
let PackageBooking;
// PackageBooking = {
//     MangChuyenBayTimKiem: MangChuyenBayTimKiem,
//     HangGhe: HangGhe,
//     HanhKhach: HanhKhach,
//     HanhLy: HanhLy,
// };
function GetPackageBooing_fromSV() {
    openLoader('Chờ chút');
    axios({
        method: 'post',
        url: '/choose_flight',
        data: { GetPackageBooing_fromSV: true },
    }).then((res) => {
        PackageBooking = res.data;
        closeLoader();
        console.log(PackageBooking);
    });
}
if (!PackageBooking) GetPackageBooing_fromSV();

// Lấy chuyến bay từ DB dựa vào 1 chuyến bay tra cứu
let ChuyenBay_Items_fromDB;
function LayChuyenBay_fromDB(SanBayDi, SanBayDen, NgayDi) {
    var data_send = {
        mahangghe: PackageBooking.HangGhe.MaHangGhe,
        hanhkhach: PackageBooking.HanhKhach,
        ngaydi: NgayDi.Nam + '-' + NgayDi.Thang + '-' + NgayDi.Ngay,
        masanbaydi: SanBayDi.MaSanBay.toString(),
        masanbayden: SanBayDen.MaSanBay.toString(),
    };
    openLoader('Chờ chút');
    axios({
        method: 'post',
        url: '/flight/fullsearch',
        data: data_send,
    }).then((res) => {
        ChuyenBay_Items_fromDB = res.data;
        closeLoader();
    });
}

// Xóa các chuyến bay đang hiển thị
function XoaChuyenBay_Items() {
    const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');
    if (ChuyenBay_Items.length > 1) {
        let num = ChuyenBay_Items.length;
        for (let i = num - 1; i > 0; i++) {
            ChuyenBay_Container.removeChild(ChuyenBay_Items[i]);
        }
    }
}

// Đưa các chuyến bay từ DB lên view
function GanThongTinCoBan(ChuyenBay_Item, i) {
    ChuyenBay_Item.querySelector('.ChuyenBay_Item_MaChuyenBay').innerText = ChuyenBay_Items_fromDB[i].MaChuyenBay;
    ChuyenBay_Item.querySelector('.ChuyenBay_Item_GioDi').innerText =
        numberSmallerTen(ChuyenBay_Items_fromDB[i].ThoiGianDi.GioDi.Gio) +
        ':' +
        numberSmallerTen(ChuyenBay_Items_fromDB[i].ThoiGianDi.GioDi.Phut);
    ChuyenBay_Item.querySelector('.ChuyenBay_Item_MaSanBayDi').innerText = ChuyenBay_Items_fromDB[i].SanBayDi.MaSanBay;
    ChuyenBay_Item.querySelector('.ChuyenBay_Item_ThoiGianBay').innerText =
        numberSmallerTen(ChuyenBay_Items_fromDB[i].ThoiGianBay.Gio) +
        'h ' +
        numberSmallerTen(ChuyenBay_Items_fromDB[i].ThoiGianBay.Phut) +
        'm';
    ChuyenBay_Item.querySelector('.ChuyenBay_Item_SoDiemDung').innerText = ChuyenBay_Items_fromDB[i].SoDiemDung;
    ChuyenBay_Item.querySelector('.ChuyenBay_Item_GioDen').innerText =
        numberSmallerTen(ChuyenBay_Items_fromDB[i].ThoiGianDen.GioDen.Gio) +
        ':' +
        numberSmallerTen(ChuyenBay_Items_fromDB[i].ThoiGianDen.GioDen.Phut);
    ChuyenBay_Item.querySelector('.ChuyenBay_Item_MaSanBayDen').innerText =
        ChuyenBay_Items_fromDB[i].SanBayDen.MaSanBay;
    ChuyenBay_Item.querySelector('.ChuyenBay_Item_GiaVe').innerText = numberWithDot(ChuyenBay_Items_fromDB[i].GiaVe);

    ChuyenBay_Item.querySelector('.ChuyenBay_Item_Detail_MaChuyenBay').innerText =
        ChuyenBay_Items_fromDB[i].MaChuyenBay;
    ChuyenBay_Item.querySelector('.ChuyenBay_Item_Detail_GiaVe ').innerText = numberWithDot(
        ChuyenBay_Items_fromDB[i].GiaVe,
    );
}

function HienThiChuyenBay_fromDB(SanBayDi, SanBayDen, NgayDi) {
    // Lấy chuyến bay từ DB
    LayChuyenBay_fromDB(SanBayDi, SanBayDen, NgayDi);

    openLoader('Tìm kiếm');
    const ChuyenBay_Items = document.querySelectorAll('.ChuyenBay_Item');
    if (ChuyenBay_Items.length > 1) XoaChuyenBay_Items();

    for (let i = 0; i < ChuyenBay_Items_fromDB.length; i++) {
        const ChuyenBay_Item = ChuyenBay_Items[0].cloneNode(true);
        ChuyenBay_Item.classList.remove('d-none');

        GanThongTinCoBan(ChuyenBay_Item, i);
        const ChanBays = ChuyenBay_Items_fromDB[i].ChanBay;
        const ChuyenBay_Item_Detail_TrungGian_Container = ChuyenBay_Item.querySelector(
            '.ChuyenBay_Item_Detail_TrungGian_Container',
        );

        const ChuyenBay_Item_Detail_TrungGian_Items = ChuyenBay_Item_Detail_TrungGian_Container.querySelectorAll(
            '.ChuyenBay_Item_Detail_TrungGian_Item',
        );

        if (ChuyenBay_Item_Detail_TrungGian_Items.length > 1) {
            let num = ChuyenBay_Item_Detail_TrungGian_Items.length;
            for (let j = num - 1; j > 0; j++) {
                ChuyenBay_Item_Detail_TrungGian_Container.removeChild(ChuyenBay_Item_Detail_TrungGian_Items[j]);
            }
        }

        for (let j = 0; j < ChanBays.length; j++) {
            const ChuyenBay_Item_Detail_TrungGian_Item = ChuyenBay_Item_Detail_TrungGian_Items[0].cloneNode(true);
            ChuyenBay_Item_Detail_TrungGian_Item.classList.remove('d-none');

            ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                '.ChuyenBay_Item_Detail_TrungGian_Item_GioDi',
            ).innerText =
                numberSmallerTen(ChanBays[j].ThoiGianDi.GioDi.Gio) +
                ':' +
                numberSmallerTen(ChanBays[j].ThoiGianDi.GioDi.Phut);

            ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                '.ChuyenBay_Item_Detail_TrungGian_Item_NgayDi',
            ).innerText =
                numberSmallerTen(ChanBays[j].ThoiGianDi.NgayDi.Ngay) +
                '-' +
                numberSmallerTen(ChanBays[j].ThoiGianDi.NgayDi.Thang) +
                '-' +
                numberSmallerTen(ChanBays[j].ThoiGianDi.NgayDi.Nam);

            ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                '.ChuyenBay_Item_Detail_TrungGian_Item_ThoiGianBay',
            ).innerText =
                numberSmallerTen(ChanBays[j].ThoiGianBay.Gio) +
                'h ' +
                numberSmallerTen(ChanBays[j].ThoiGianBay.Phut) +
                'm';

            ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                '.ChuyenBay_Item_Detail_TrungGian_Item_NgayDen',
            ).innerText =
                numberSmallerTen(ChanBays[j].ThoiGianDen.NgayDen.Ngay) +
                '-' +
                numberSmallerTen(ChanBays[j].ThoiGianDen.NgayDen.Thang) +
                '-' +
                numberSmallerTen(ChanBays[j].ThoiGianDen.NgayDen.Nam);

            ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                '.ChuyenBay_Item_Detail_TrungGian_Item_GioDen',
            ).innerText =
                numberSmallerTen(ChanBays[j].ThoiGianDen.GioDen.Gio) +
                ':' +
                numberSmallerTen(ChanBays[j].ThoiGianDen.GioDen.Phut);

            ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                '.ChuyenBay_Item_Detail_TrungGian_Item_SanBayDi',
            ).innerText = ChanBays[j].SanBayDi.MaSanBay + ' - ' + ChanBays[j].SanBayDi.TinhThanh;

            ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                '.ChuyenBay_Item_Detail_TrungGian_Item_SanBayDen',
            ).innerText = ChanBays[j].SanBayDen.MaSanBay + ' - ' + ChanBays[j].SanBayDen.TinhThanh;

            ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                '.ChuyenBay_Item_Detail_TrungGian_Item_Divider_Content',
            ).innerText = `Dừng ở sân bay ${ChanBays[j].SanBayDen.TenSanBay} (${numberSmallerTen(
                ChanBays[j].ThoiGianDung_SanBayDen.Gio,
            )}h ${numberSmallerTen(ChanBays[j].ThoiGianDung_SanBayDen.Phut)}m)`;

            if (j == ChanBays.length - 1)
                ChuyenBay_Item_Detail_TrungGian_Item.querySelector(
                    '.ChuyenBay_Item_Detail_TrungGian_Item_Divider',
                ).classList.add('d-none');

            ChuyenBay_Item_Detail_TrungGian_Container.appendChild(ChuyenBay_Item_Detail_TrungGian_Item);
        }

        ChuyenBay_Container.appendChild(ChuyenBay_Item);
    }

    closeLoader();
}
