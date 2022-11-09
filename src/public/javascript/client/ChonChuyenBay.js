import { numberWithDot, numberWithoutDot, numberSmallerTen } from '../start.js';

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

// #region getElementById các Element duy nhất
const ThayDoiTimKiem = document.getElementById('ThayDoiTimKiem');
const TomTat_Container = document.getElementById('TomTat_Container');
const ChuyenBay_Container = document.getElementById('ChuyenBay_Container');
// #endregion

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
function GetPackageBooing_fromSV() {
    axios({
        method: 'post',
        url: '/choose_flight',
        data: { GetPackageBooing_fromSV: true },
    }).then((res) => {
        //document.getElementById('Temp').innerText = JSON.stringify(res.data);
        console.log(res.data);
    });
}
GetPackageBooing_fromSV();

// Lấy chuyến bay từ DB dựa vào 1 chuyến bay tra cứu
function LayChuyenBay_fromDB() {
    var data_send = {
        mahangghe: 'Eco',
        hanhkhach: [
            { value: 5, title: 'Người lớn' },
            { value: 1, title: 'Trẻ em' },
            { value: 1, title: 'Em bé' },
        ],
        ngaydi: '2022-11-11',
        masanbaydi: 'BMV',
        masanbayden: 'PQC',
    };
    axios({
        method: 'post',
        url: '/flight/fullsearch',
        data: data_send,
    }).then((res) => {
        console.log(res.data);
    });
}
