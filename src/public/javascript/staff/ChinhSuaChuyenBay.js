import {
    numberWithDot,
    numberWithoutDot,
    numberSmallerTen,
    openLoader,
    closeLoader,
    getThuTrongTuan,
    today,
    showToast,
    onlyNumber,
} from '../start.js';

window.onlyNumber = onlyNumber;

window.addEventListener('pageshow', function (event) {
    var historyTraversal =
        event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});

// Nút thêm điểm dừng
const ThemDiemDung = document.getElementById('ThemDiemDung');
if (ThemDiemDung) {
    ThemDiemDung.addEventListener('click', (e) => {
        const node = document.querySelector('.DiemDung_Item').cloneNode(true);
        node.classList.remove('d-none');

        // Thứ tự
        node.querySelector('.DiemDung_Item_ThuTu').value = document.querySelectorAll('.DiemDung_Item').length;

        // Sân bay đến
        const SanBayDung_ul = node.querySelector('.DiemDung_Item_SanBayDung_ul');
        const DiemDung_Item_SanBayDung_lis = SanBayDung_ul.querySelectorAll('.DiemDung_Item_SanBayDung_li');
        if (DiemDung_Item_SanBayDung_lis.length > 1) {
            let num = DiemDung_Item_SanBayDung_lis.length;
            for (let i = num - 1; i > 0; i--) {
                SanBayDung_ul.removeChild(DiemDung_Item_SanBayDung_lis[i]);
            }
        }

        // Nút xóa
        const DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
        if (DiemDung_Items.length > 1) {
            const lastitem = DiemDung_Items[DiemDung_Items.length - 1].querySelector('.DiemDung_Item_Xoa');
            if (!lastitem.classList.contains('d-none')) {
                lastitem.classList.add('d-none');
            }
        }
        const NutXoa = node.querySelector('.DiemDung_Item_Xoa');
        if (NutXoa.classList.contains('d-none')) {
            NutXoa.classList.remove('d-none');
        }
        NutXoa.addEventListener('click', (e) => {
            const DiemDung_Items = document.querySelectorAll('.DiemDung_Item');
            if (DiemDung_Items.length - 1 > 1) {
                const sublastitem = DiemDung_Items[DiemDung_Items.length - 2].querySelector('.DiemDung_Item_Xoa');
                if (sublastitem.classList.contains('d-none')) {
                    sublastitem.classList.remove('d-none');
                }
            }
            document.getElementById('DiemDung_Container').removeChild(e.target.closest('.DiemDung_Item'));
        });

        DiemDung_Container.appendChild(node);
    });
}

// Nút thêm hạng ghế
const ThemHangGhe = document.getElementById('ThemHangGhe');
if (ThemHangGhe) {
    ThemHangGhe.addEventListener('click', (e) => {
        const node = document.querySelector('.HangGhe_Item').cloneNode(true);
        node.classList.remove('d-none');

        // Nút xóa
        const HangGhe_Items = document.querySelectorAll('.HangGhe_Item');
        if (HangGhe_Items.length > 1) {
            const lastitem = HangGhe_Items[HangGhe_Items.length - 1].querySelector('.HangGhe_Item_Xoa');
            if (!lastitem.classList.contains('d-none')) {
                lastitem.classList.add('d-none');
            }
        }
        const NutXoa = node.querySelector('.HangGhe_Item_Xoa');
        if (NutXoa.classList.contains('d-none')) {
            NutXoa.classList.remove('d-none');
        }
        NutXoa.addEventListener('click', (e) => {
            const HangGhe_Items = document.querySelectorAll('.HangGhe_Item');
            if (HangGhe_Items.length - 1 > 1) {
                const sublastitem = HangGhe_Items[HangGhe_Items.length - 2].querySelector('.HangGhe_Item_Xoa');
                if (sublastitem.classList.contains('d-none')) {
                    sublastitem.classList.remove('d-none');
                }
            }
            document.getElementById('HangGhe_Container').removeChild(e.target.closest('.HangGhe_Item'));
        });

        HangGhe_Container.appendChild(node);
    });
}
